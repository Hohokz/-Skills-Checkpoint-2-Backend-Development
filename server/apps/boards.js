import { Router } from "express";
import { pool } from "../utils/db.js"

const postRouter = Router();

postRouter.get("/", async (req, res) => {

    const category = req.query.catagory || "";
    const keywords = req.query.keywords || "";

    let query = "";
    let values = [];

    if (category && keywords) {
        query =

        values = [keywords, category];

    } else if (keywords) {
        query =

        values = [keywords];


    } else if (category) {
        query =

        values = [category];


    } else {
        query =

 }

    const results = await pool.query(query, values)

    return res.json({
        data: results.rows
    });
});

postRouter.get("/:questionsId", async (req, res) => {
    const questionId = req.params.questionsId;
    const results = await pool.query
        ( [questionId]);

    return res.json({
        data: results.rows[0],
    });

});

postRouter.post("/", async (req, res) => {
    const newPost = {
        ...req.body,
        created_at: new Date(),
        updated_at: new Date(),
    };

    await pool.query([])

    return res.json({
        message: "new question complete",
    });

});

postRouter.put("/:questionsId", async (req, res) => {
    const questionId = req.params.questionsId;

    const updatedPost = {
        ...req.body,
        updated_at: new Date(),
    };

    console.log(questionId)

    await pool.query([]);

    return res.json({
        message: "edit question complete",

    });
});

postRouter.delete("/:questionsId", async (req, res) => {
    const questionId = req.params.questionsId;

    await pool.query(`delete from posts where posts.post_id=$1`, [questionId])

    return res.json({
        message: "question is gone",
    });
});

export default postRouter;