import "./setup";
import express, { json } from "express";
import cors from "cors";
import router from "./routes/index";

const app = express();

app.use(cors(), json());
app.use(router);

const PORT = Number(process.env.PORT) | 5000;

app.listen(PORT, () => console.log(`Server is runnig on port ${PORT}`));
