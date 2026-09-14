import cron from "node-cron";
import { Post } from "../models/Post.js";
import { Account } from "../models/Account.js";
import zernio from "../config/zernio.js";
import { ActivityLog } from "../models/ActivityLog.js";


export const initScheduler = ()=>{
    cron.schedule("* * * * *", async () => {
  const now = new Date();

  const postsToPublish = await Post.find({
    status: "scheduled",
    scheduledFor: { $lte: now },
  });

  for (const post of postsToPublish) {
    try {
      const accounts = await Account.find({
        user: post.user,
        platform: { $in: post.platforms },
        status: "connected",
        zernioAccountId: { $exists: true },
      });

      if (accounts.length === 0) {
        throw new Error("No connected Zernio accounts found.");
      }

      const zernioPlatforms = accounts.map((account) => ({
        platform: account.platform as any,
        accountId: account.zernioAccountId!,
      }));

      const payload = {
        content: post.content,
        publishNow: true,
        ...(post.mediaUrl
          ? {
              mediaItems: [
                {
                  type: post.mediaType || "image",
                  url: post.mediaUrl,
                },
              ],
            }
          : {}),
        platforms: zernioPlatforms,
      };

      console.log(
        `Publishing post ${post._id} to Zernio with media: ${
          post.mediaUrl || "none"
        }`
      );

      const response = await zernio.posts.createPost({
        body: payload,
      });

      const publishedPost =
        (response.data as any)?.post || response.data;

      if (!publishedPost) {
        throw new Error("Failed to get post object from Zernio response.");
      }

      console.log(
        `Zernio post created: ${publishedPost._id || publishedPost.id}`
      );

      post.status = "published";
      post.failureReason = undefined;
      post.failedAt = undefined;

      await post.save();

      await ActivityLog.create({
        user: post.user,
        actionType: "POST_PUBLISHED",
        description: `Published post to ${accounts
          .map((account) => account.platform)
          .join(", ")}`,
        relatedPost: post._id,
      });
    } catch (error: any) {
      const failureReason =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        "Failed to publish post.";

      console.error(
        `Publishing failed for post ${post._id}:`,
        failureReason
      );

      post.status = "failed";
      post.failureReason = failureReason;
      post.failedAt = new Date();
      post.retryCount = (post.retryCount || 0) + 1;

      await post.save();

      await ActivityLog.create({
        user: post.user,
        actionType: "POST_FAILED",
        description: `Failed to publish post: ${failureReason}`,
        relatedPost: post._id,
      });
    }
  }

  if (postsToPublish.length > 0) {
    console.log(
      `Evaluated ${postsToPublish.length} posts at ${now.toISOString()}`
    );
  }
})
};
