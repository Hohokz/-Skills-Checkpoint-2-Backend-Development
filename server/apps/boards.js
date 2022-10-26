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

            `select *
         from posts
         inner join comments on comments.post_id=posts.post_id
         inner join categories on categories.category_id =posts.post_id
         inner join posts_vote on posts_vote.post_id=posts.post_id
         inner join comments_vote on comments_vote.comment_id=comments.comment_id
         where posts.title ilke $1 and categories.category_name ilke $2 `;

        values = [keywords, category];

    } else if (keywords) {

        query =

            `select *
         from posts
         inner join comments on comments.post_id=posts.post_id
         inner join categories on categories.category_id =posts.post_id
         inner join posts_vote on posts_vote.post_id=posts.post_id
         inner join comments_vote on comments_vote.comment_id=comments.comment_id
         where posts.title ilke $1`;

        values = [keywords];


    } else if (category) {
        query =

            `select *
         from posts
         inner join comments on comments.post_id=posts.post_id
         inner join categories on categories.category_id =posts.post_id
         inner join posts_vote on posts_vote.post_id=posts.post_id
         inner join comments_vote on comments_vote.comment_id=comments.comment_id
         where categories.category_name ilke $1 `;

        values = [category];


    } else {
        query =

            `select *
         from posts
         inner join comments on comments.post_id=posts.post_id
         inner join categories on categories.category_id =posts.post_id
         inner join posts_vote on posts_vote.post_id=posts.post_id
         inner join comments_vote on comments_vote.comment_id=comments.comment_id`;

    }

    const results = await pool.query(query, values)

    return res.json({
        data: results.rows
    });
});

postRouter.get("/:questionsId", async (req, res) => {
    const questionId = req.params.questionsId;
    const results = await pool.query
        (`select * from posts
         inner join comments on comments.post_id=posts.post_id
         inner join categories on categories.category_id =posts.post_id
         inner join posts_vote on posts_vote.post_id=posts.post_id
         inner join comments_vote on comments_vote.comment_id=comments.comment_id
         where posts.post_id = $1`, [questionId]);

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

    await pool.query(
        `insert into posts
        (user_id, title, content, category_id, created_at, updated_at, attach_url)
        values 
        ($1,$2,$3,$4,$5,$6,$7)
        `, [
        newPost.user_id,
        newPost.title,
        newPost.content,
        newPost.category_id,
        newPost.created_at,
        newPost.updated_at,
        newPost.attach_url
    ])

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

    await pool.query(
        `
        update posts set title=$1, content=$2
        where post_id=$3`,
        [
            updatedPost.title,
            updatedPost.content,
            questionId]
    );

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

postRouter.post("/:questionsId/vote", async (req, res) => {
    const questionId = req.params.questionsId;
    const newPost = { ...req.body };

    await pool.query(
        `insert into vote_posts
        (type, post_id)
        values 
        ($1,$2)
        `, [newPost.type, questionId])

    return res.json({
        message: "your vote approve",
    });
})

postRouter.post("/:questionsId/comment/vote", async (req, res) => {
    const questionId = req.params.questionsId;
    const newPost = { ...req.body };

    await pool.query(
        `insert into comments_vote
        (type, comments_id)
        values 
        ($1,$2)
        `, [newPost.type, questionId])

    return res.json({
        message: "your vote approve",
    });
})

export default postRouter;