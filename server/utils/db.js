import * as pg from "pg";
const { Pool } = pg.default;

const pool = new Pool({
    connectionString: "postgresql://postgres:postgres@localhost:5432/Back End Design [Skill Checkpoint]",
});

export { pool };