import dotenv from "dotenv";
import express, { Request, Response } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import router from "./routes";
import { connectDB, sequelize } from "./config/database";
dotenv.config();
import cookieParser from "cookie-parser";
const app = express();
const PORT = process.env.PORT;

app.use(cookieParser());
app.use(express.json());
app.use(cors({
    origin: ["http://localhost:5173", "https://master-o-quizz-front.vercel.app"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(helmet());
app.use(express.urlencoded({ extended: true }));


app.get('/health', (req: Request, res: Response) => {
    try {
        res.status(200).send({
            status: "OK",
            message: "TalentSync application is operational.",
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
        });
    } catch (error) {
        res.status(503).send({
            status: "ERROR",
            message: "TalentSync application is not operational.",
            error: error || "Unknown error",
        });
    }
});

app.use('/api', router)
const start = async () => {
    await connectDB();
    await sequelize.sync({ alter: true });
    console.log("ok1");
};

start();
app.listen(PORT, () => {
    console.log(`Server On Port-${PORT}`);
});