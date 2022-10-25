import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import postRouter from "./apps/boards.js";

async function init() {
    const app = express();
    const port = 4000;

    app.use(cors());
    app.use(bodyParser.json());
    app.use("/quetions", postRouter);

    app.get("/", (req, res) => {
        res.send("Hello World!");
    });

    app.get("*", (req, res) => {
        res.status(404).send("Not found");
    });

    app.listen(port, () => {
        console.log(`Server is listening on ${port}`);
    });
}

init();