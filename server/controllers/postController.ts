import { Request, Response } from "express";
import { AuthRequest } from "../middlewares/authMiddleware.js";
import { Post } from "../models/Post.js";
import { Account } from "../models/Account.js";
import zernio from "../config/zernio.js";
import { GoogleGenAI } from "@google/genai";
import axios from "axios";
import { Generation } from "../models/Generation.js";
import { cloudinary } from "../config/cloudinary.js";

//Helper to poll Leonardo.ai
const pollLeonardoJob = async (
    generationId: string,
    apiKey: string,
): Promise<string> => {
    const maxRetries = 20;
    const delay = 5000;
    for (let i = 0; i < maxRetries; i++) {
        let generation;
        try {
            const response = await axios.get(
                `https://cloud.leonardo.ai/api/rest/v1/generations/${generationId}`,
                {
                    headers: {
                        accept: "application/json",
                        authorization: `Bearer ${apiKey}`,
                    },
                },
            );
            generation = response.data.generations_by_pk;
        } catch (err: any) {
            console.error("Polling error:", err?.response?.data || err.message);
            await new Promise((resolve) => setTimeout(resolve, delay));
            continue;
        }

        if (generation.status === "COMPLETE") {
            if (generation.generated_images?.length > 0) {
                return generation.generated_images[0].url;
            }
            throw new Error("Generation complete but no images found.");
        }
        if (generation.status === "FAILED") {
            throw new Error("Leonardo.ai generation failed.");
        }

        await new Promise((resolve) => setTimeout(resolve, delay));
    }
    throw new Error("Leonardo.ai generation timeout.");
};

//Generate post
//POST /api/posts/generate
export const generatePost = async (
    req: AuthRequest,
    res: Response,
): Promise<void> => {
    const { prompt, tone, generateImage } = req.body;

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        res
            .status(400)
            .json({
                message:
                    "Gemini API key is missing. Please add it to your server/.env file.",
            });
        return;
    }

    const ai = new GoogleGenAI({ apiKey });

    //Generate Text
    const textResponse = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: `Generate a social media post based on this prompt: "${prompt}". Tone: ${tone}.
            Include relevant hashtags.
            Format the response as JSON with "content" and "imagePrompt" fields.
            The "imagePrompt" should be highly descriptive prompt for an image generator that complements the post.`,
    });

    let content = "";
    let imagePrompt = prompt;

    try {
        const rawText = textResponse.text || "";
        const jsonMatch = rawText.match(/\{[\s\S]*\}/);
        const data = jsonMatch
            ? JSON.parse(jsonMatch[0])
            : { content: rawText, imagePrompt: prompt };
        content = data.content;
        imagePrompt = data.imagePrompt;
    } catch (e) {
        content = textResponse.text || "";
    }

    let mediaUrl = "";

    if (generateImage) {
        try {
            const leonardoKey = process.env.LEONARDO_API_KEY;
            if (leonardoKey) {
                // Use Leonardo.ai for image generation
                const leoResponse = await axios.post(
                    "https://cloud.leonardo.ai/api/rest/v2/generations",
                    {
                        public: false,
                        model: "gpt-image-2",
                        parameters: {
                            quality: "LOW",
                            prompt: imagePrompt,
                            quantity: 1,
                            width: 1024,
                            height: 1024,
                            prompt_enhance: "OFF",
                        },
                    },
                    {
                        headers: {
                            accept: "application/json",
                            authorization: `Bearer ${leonardoKey}`,
                            "content-type": "application/json",
                        },
                    },
                );
                const generationId = leoResponse.data.generate.generationId;
                const tempUrl = await pollLeonardoJob(generationId, leonardoKey);

                //Upload to Cloudinary for persistence
                const uploadResult = await cloudinary.uploader.upload(tempUrl, {
                    folder: "ai-generations",
                });
                mediaUrl = uploadResult.secure_url;
            }
        } catch (err: any) {
            console.error("Image generation failed:", err);
        }
    }

    const generation = await Generation.create({
        user: req.user._id,
        prompt,
        content,
        mediaUrl,
        mediaType: mediaUrl ? "image" : undefined,
        tone,
    });

    res.json(generation);
};

//Get Generations
//GET /api/posts/generations
export const getGenerations = async (
    req: AuthRequest,
    res: Response,
): Promise<void> => {
    try {
        const generations = await Generation.find({
            user: req.user._id,
        }).sort({ createdAt: -1 });

        const generationIds = generations.map((generation) => generation._id);
        const relatedPosts = await Post.find({
            user: req.user._id,
            generation: { $in: generationIds },
        }).select("generation status");

        const statusByGeneration = new Map(
            relatedPosts.map((post) => [String(post.generation), post.status]),
        );

        res.json(
            generations.map((generation) => ({
                ...generation.toObject(),
                status: statusByGeneration.get(String(generation._id)) ?? "draft",
            })),
        );
    } catch (err: any) {
        res
            .status(500)
            .json({ message: err?.message || "Failed to fetch generations" });
    }
};

//Get posts
//GET /api/posts

export const getPosts = async (
    req: AuthRequest,
    res: Response,
): Promise<void> => {
    try {
        const posts = await Post.find({ user: req.user._id }).sort({
            createdAt: -1,
        });
        res.json(posts);
    } catch (err: any) {
        res.status(500).json({ message: err?.message || "Failed to fetch posts" });
    }
};

//Schedule posts
//POST /api/posts
export const schedulePosts = async (
    req: AuthRequest,
    res: Response,
): Promise<void> => {
    try {
        const { content, platforms, scheduledFor, status, generation } = req.body;

        if (generation) {
            const existingPost = await Post.findOne({
                user: req.user._id,
                generation,
                status: { $in: ["scheduled", "published"] },
            }).select("status");

            if (existingPost) {
                res.status(409).json({
                    message: `This generation has already been ${existingPost.status}.`,
                });
                return;
            }
        }

        const supportedPlatforms = [
            "twitter",
            "linkedin",
            "facebook",
            "instagram",
            "facebook_page",
            "linkedin_page",
            "instagram_business",
        ] as const;

        type SupportedPlatform = (typeof supportedPlatforms)[number];

        let parsedPlatforms: string[] = [];

        // Scheduler sends a JSON string.
        // AI Composer sends an array.
        if (Array.isArray(platforms)) {
            parsedPlatforms = platforms;
        } else if (typeof platforms === "string") {
            try {
                parsedPlatforms = JSON.parse(platforms);
            } catch {
                parsedPlatforms = platforms.split(",");
            }
        }

        if (parsedPlatforms.length === 0) {
            res.status(400).json({
                message: "Please select at least one platform.",
            });
            return;
        }

        // Reject platform names that are not allowed by Account/Post schemas.
        const invalidPlatforms = parsedPlatforms.filter(
            (platform) => !supportedPlatforms.includes(platform as SupportedPlatform),
        );

        if (invalidPlatforms.length > 0) {
            res.status(400).json({
                message: `Unsupported platform(s): ${invalidPlatforms.join(", ")}.`,
            });
            return;
        }

        const accountPlatforms = parsedPlatforms as SupportedPlatform[];

        const connectedAccounts = await Account.find({
            user: req.user._id,
            platform: { $in: accountPlatforms },
            status: "connected",
        }).select("platform");

        const connectedPlatforms = new Set<string>(
            connectedAccounts.map((account) => account.platform),
        );

        const missingPlatforms = parsedPlatforms.filter(
            (platform) => !connectedPlatforms.has(platform),
        );

        if (missingPlatforms.length > 0) {
            res.status(400).json({
                message: `Connect the required social account(s) before scheduling: ${missingPlatforms.join(", ")}.`,
                missingPlatforms,
            });
            return;
        }

        let mediaUrl: string | undefined = req.body.mediaUrl;
        let mediaType: "image" | "video" | undefined = req.body.mediaType;

        // Detect manually uploaded media before Cloudinary upload.
        if (req.file) {
            if (req.file.mimetype.startsWith("image/")) {
                mediaType = "image";
            } else if (req.file.mimetype.startsWith("video/")) {
                mediaType = "video";
            }
        }

        // Instagram requires an image.
        if (parsedPlatforms.includes("instagram")) {
            if (!req.file && !mediaUrl) {
                res.status(400).json({
                    message:
                        "Instagram requires an image for this post. Please upload an image before scheduling.",
                });
                return;
            }

            if (mediaType !== "image") {
                res.status(400).json({
                    message:
                        "Instagram image posts require an image. Please upload an image instead.",
                });
                return;
            }
        }

        // Reuse the existing Cloudinary upload flow.
        if (req.file) {
            const result = await new Promise<any>((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    {
                        resource_type: "auto",
                        folder: "social-scheduler",
                    },
                    (error, result) => {
                        if (error) {
                            reject(error);
                        } else {
                            resolve(result);
                        }
                    },
                );

                stream.end(req.file!.buffer);
            });

            mediaUrl = result.secure_url;
        }

        const post = await Post.create({
            user: req.user._id,
            generation: generation || undefined,
            content,
            platforms: accountPlatforms,
            mediaUrl,
            mediaType,
            scheduledFor,
            status,
        });

        res.status(201).json(post);
    } catch (err: any) {
        res.status(500).json({
            message: err?.message || "Server error",
        });
    }
};
