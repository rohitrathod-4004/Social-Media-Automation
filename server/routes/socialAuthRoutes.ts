import {Router} from "express";
import {generateOauthUrl, syncAccounts} from "../controllers/socialAuthController.js";
import {protect} from "../middlewares/authMiddleware.js";

const socialAuthRouter = Router();

socialAuthRouter.get("/:platform/url", protect, generateOauthUrl);
socialAuthRouter.get('/sync', protect, syncAccounts);

export default socialAuthRouter;