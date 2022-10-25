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
            `select * from questions

            inner join answers on 
            answers.question_id = questions.question_id

            inner join users on 
            users.user_id = questions.question_id

            inner join profiles on 
            profiles.user_id = users.user_id

            inner join questions_catagories on 
            questions_catagories.question_id = questions.question_id
        
            inner join catagorys on 
            catagorys.catagory_id = questions_catagories.catagory_id

            inner join pictures on
            pictures.user_id = users.user_id

            inner join videos on
            videos.user_id = users.user_id
        
            where catagorys.name ilike $1 and title ilike $2 or keyword ilike $2
            group by videos.video_id, pictures.picture_id,
            catagorys.catagory_id,questions.question_id,
            answers.answers_id, users.user_id,profiles.profile_id,
            questions_catagories.questions_catagories_id`,
            values = [category, keywords]

    } else if (keywords) {
        query =
            `select * from questions

            inner join answers on 
            answers.question_id = questions.question_id

            inner join users on 
            users.user_id = questions.question_id

            inner join profiles on 
            profiles.user_id = users.user_id

            inner join questions_catagories on 
            questions_catagories.question_id = questions.question_id
        
            inner join catagorys on 
            catagorys.catagory_id = questions_catagories.catagory_id

            inner join pictures on
            pictures.user_id = users.user_id

            inner join videos on
            videos.user_id = users.user_id

            where title ilike $1
            
            group by videos.video_id, pictures.picture_id,
            catagorys.catagory_id,questions.question_id,
            answers.answers_id, users.user_id,profiles.profile_id,
            questions_catagories.questions_catagories_id`, values = [keywords];

    } else if (category) {
        query =
            `select * from questions

            inner join answers on 
            answers.question_id = questions.question_id

            inner join users on 
            users.user_id = questions.question_id

            inner join profiles on 
            profiles.user_id = users.user_id

            inner join questions_catagories on 
            questions_catagories.question_id = questions.question_id
        
            inner join catagorys on 
            catagorys.catagory_id = questions_catagories.catagory_id

            inner join pictures on
            pictures.user_id = users.user_id

            inner join videos on
            videos.user_id = users.user_id

            where catagorys.name ilike $1 group by questions.title
            
            group by videos.video_id, pictures.picture_id,
            catagorys.catagory_id,questions.question_id,
            answers.answers_id, users.user_id,profiles.profile_id,
            questions_catagories.questions_catagories_id`,
            values = [category];

    } else {
        query =
            `select * from questions`;
    }

    const results = await pool.query(query, values)

    return res.json({
        data: results.rows
    });
});

postRouter.get("/:questionsId", async (req, res) => {
    const questionId = req.params.questionsId;
    const results = await pool.query
        (`select * from questions
         where questions.question_id = $1`, [questionId]);

    return res.json({
        data: results.rows[0],
    });

});

postRouter.get("/category", async (req, res) => {

    const category = req.query.catagory || "";

    const results = await pool.query
        (`select * from questions

            inner join answers on 
            answers.question_id = questions.question_id

            inner join users on 
            users.user_id = questions.question_id

            inner join profiles on 
            profiles.user_id = users.user_id

            inner join questions_catagories on 
            questions_catagories.question_id = questions.question_id
        
            inner join catagorys on 
            catagorys.catagory_id = questions_catagories.catagory_id

            inner join pictures on
            pictures.user_id = users.user_id

            inner join videos on
            videos.user_id = users.user_id

            inner join approvesDisapproves on 
            approvesDisapproves.question_id = questions.question_id 

            inner join answers on 
            answers.question_id = questions.question_id
        
            where catagorys.name = $1  

            group by videos.video_id, pictures.picture_id,
            catagorys.catagory_id,questions.question_id,
            answers.answers_id, users.user_id,profiles.profile_id,
            questions_catagories.questions_catagories_id

    `, [category]);

    return res.json({
        data: results.rows,
    });


})

postRouter.post("/", async (req, res) => {
    const newPost = {
        ...req.body,
        created_at: new Date(),
        updated_at: new Date(),
    };


    await pool.query(`
    insert into questions

    (title, content, user_id, picture_id, video_id, 
    keyword)

    values ($1, $2, $3, $4, $5, $6 )`
        , [
            newPost.title,
            newPost.content,
            newPost.user_id,
            newPost.picture_id,
            newPost.video_id,
            newPost.keyword,

        ]);

    return res.json({
        message: "new question complete",
    });

});

postRouter.put("/:Id", async (req, res) => {


    const updatedPost = {
        ...req.body,
        updated_at: new Date(),
    };

    const questionId = req.params.questionsId;

    console.log(questionId)

    await pool.query(`

    update questions set title=$1, content=$2
    where question_id=$3`,

        [
            updatedPost.title,
            updatedPost.content,
            questionId]
    );

    return res.json({
        message: "edit question complete",

    });
});

postRouter.delete("/:id", async (req, res) => {
    const questionId = req.params.id;

    await pool.query(`delete from questions where question_id=$1`, [questionId])

    return res.json({
        message: "question is gone",
    });
});

export default postRouter;