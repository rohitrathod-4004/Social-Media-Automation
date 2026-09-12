import { Request, Response } from 'express';
import { AuthRequest } from '../middlewares/authMiddleware.js';
import { Post } from '../models/Post.js';
import zernio from '../config/zernio.js';
import { GoogleGenAI } from "@google/genai";
import axios from 'axios';
import { Generation } from '../models/Generation.js';
import { cloudinary } from '../config/cloudinary.js';


//Helper to poll Leonardo.ai
const pollLeonardoJob = async (generationId: string, apiKey: string): Promise<string> => {
    const maxRetries = 20;
    const delay = 5000;
    for (let i = 0; i < maxRetries; i++) {
        let generation;
        try {
            const response = await axios.get(`https://cloud.leonardo.ai/api/rest/v1/generations/${generationId}`, {
                headers: { accept: "application/json", authorization: `Bearer ${apiKey}` }
            });
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
export const generatePost = async(req: AuthRequest, res: Response): Promise<void> => {
    const { prompt, tone, generateImage } = req.body;

    const apiKey = process.env.GEMINI_API_KEY;
    if(!apiKey) {
        res.status(400).json({ message: "Gemini API key is missing. Please add it to your server/.env file." })
        return;
    }

    const ai = new GoogleGenAI({ apiKey });

    //Generate Text
        const textResponse = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Generate a social media post based on this prompt: "${prompt}". Tone: ${tone}.
            Include relevant hashtags.
            Format the response as JSON with "content" and "imagePrompt" fields.
            The "imagePrompt" should be highly descriptive prompt for an image generator that complements the post.`
        });

        let content = "";
        let imagePrompt = prompt;

        try{
            const rawText = textResponse.text || "";
            const jsonMatch = rawText.match(/\{[\s\S]*\}/)
            const data = jsonMatch ? JSON.parse(jsonMatch[0]) : { content: rawText, imagePrompt: prompt };
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
                                prompt_enhance: "OFF"
                            }
                        },
                        {
                            headers: {
                                accept: "application/json",
                                authorization: `Bearer ${leonardoKey}`,
                                "content-type": "application/json",
                            }
                        }
                    );
                    const generationId = leoResponse.data.generate.generationId;
                    const tempUrl = await pollLeonardoJob(generationId, leonardoKey)

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
            tone
        })

        res.json(generation);
}

//Get Generations
//GET /api/posts/generations
export const getGenerations = async(req: AuthRequest, res: Response): Promise<void> => {
    try{
        const generations = await Generation.find({
            user : req.user._id
        }).sort({createdAt: -1});

        res.json(generations);
    }
    catch(err:any){
        res.status(500).json({message: err?.message || "Failed to fetch generations"});
    }
}

//Get posts
//GET /api/posts

export const getPosts = async(req: AuthRequest, res: Response): Promise<void> => {
    try{
        const posts = await Post.find({user: req.user._id}).sort({createdAt: -1});
        res.json(posts);
    }
    catch(err:any){
        res.status(500).json({message: err?.message || "Failed to fetch posts"});
    }
}

//Schedule posts
//POST /api/posts
export const schedulePosts = async(req: AuthRequest, res: Response): Promise<void> => {
    try{
        const { content, platforms, scheduledFor, status } = req.body;

        //Parse platforms if it comes as a stringified array from formData
        let parsedPlatforms: string[] = [];
        if (typeof (platforms) === 'string') {
            try{
                parsedPlatforms = JSON.parse(platforms);
            }
            catch(err:any){
                parsedPlatforms = platforms.split(',');
            }
        }

        let mediaUrl: string | undefined = req.body.mediaUrl;
        let mediaType: "image" | "video" | undefined = req.body.mediaType;

        if(req.file){
            const result = await new Promise<any>((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream({ resource_type: "auto", folder: "social-scheduler" } , (error, result) => {
                    if (error) reject(error);
                    else resolve(result)
                });
                stream.end(req.file!.buffer);
            });

            mediaUrl = result.secure_url;
            mediaType = result.resource_type === "image" ? "image" : "video";  
        }

        const post = await Post.create({
            user: req.user._id,
            content,
            platforms: parsedPlatforms as any,
            mediaUrl,
            mediaType,
            scheduledFor,
            status
        })
        res.status(201).json(post);

    }catch(err:any){
        res.status(500).json({ message: err?.message || "Server error" });
}
}