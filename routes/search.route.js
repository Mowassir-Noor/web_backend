import { Router } from "express";

const searchRouter = Router();  

// GET     /api/search/users?q=keyword       → Search users
// GET     /api/search/jobs?q=developer      → Search jobs

searchRouter.get("/search/users", (req, res) => {
    const keyword = req.query.q;
    res.send({ title: "search users", keyword });
});
searchRouter.get("/search/jobs", (req, res) => {
    const keyword = req.query.q;
    res.send({ title: "search jobs", keyword });
});

export default searchRouter;