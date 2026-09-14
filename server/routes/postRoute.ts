import {Router} from 'express';
import { protect } from '../middlewares/authMiddleware.js';
import { getPosts, generatePost, getGenerations , schedulePosts , updateScheduledPost } from '../controllers/postController.js';
import { upload } from '../config/multer.js';



const postRouter = Router();

postRouter.get('/', protect, getPosts);
postRouter.get('/generations', protect, getGenerations);
postRouter.post('/', protect, upload.single("media"), schedulePosts);
postRouter.post('/generate', protect, generatePost);
postRouter.patch("/:id", protect, upload.single("media"), updateScheduledPost );

export default postRouter;