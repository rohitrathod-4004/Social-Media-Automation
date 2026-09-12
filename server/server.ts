import "dotenv/config";
import express , { Request, Response } from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import authRouter from "./routes/authRoute.js";
import accountRouter from "./routes/accountRoutes.js";
import socialAuthRouter from "./routes/socialAuthRoutes.js";
import postRouter from "./routes/postRoute.js";

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.get('/' , (_req:Request, res : Response) => {
    res.send('Server is live !');
})

app.use("/api/auth", authRouter);
app.use("/api/oauth", socialAuthRouter);
app.use("/api/accounts", accountRouter);
app.use("/api/posts", postRouter);  

app.use

//Global error handler
app.use((err: any, _req: Request, res: Response, _next: any) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

const InitalizeConnection = async()=>{
    try{
        await connectDB();
        console.log('Database connected successfully');

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    }
    catch(err : any){
        console.error(err);
        process.exit(1);
    }
}

InitalizeConnection();