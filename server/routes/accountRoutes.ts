import {Router} from "express";
import { addAccount, disconnectAccount, getAccounts  } from "../controllers/accountController.js";
import {protect}  from "../middlewares/authMiddleware.js";

const accountRouter = Router();

accountRouter.get("/" ,protect, getAccounts);
accountRouter.post("/" , protect, addAccount);
accountRouter.delete("/:id" , protect, disconnectAccount);

export default accountRouter;