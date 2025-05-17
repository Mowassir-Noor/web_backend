import { Router } from "express";

const userRouter = Router();

// for admin
userRouter.get("/users", (req, res) => {
    res.send({ title: "users" });
});

userRouter.get("/users/:id", (req, res) => {
    const userId = req.params.id;
    res.send({ title: "user", id: userId });
});

userRouter.put("/users/:id", (req, res) => {
    const userId = req.params.id;
    res.send({ title: "update user", id: userId });
});
userRouter.delete("/users/:id", (req, res) => {
    const userId = req.params.id;
    res.send({ title: "delete user", id: userId });
});

// POST    /api/users/:id/experience    → Add experience
// PUT     /api/users/:id/experience/:expId → Update experience
// DELETE  /api/users/:id/experience/:expId → Remove experience

// POST    /api/users/:id/education     → Add education
// POST    /api/users/:id/skill         → Add skill


userRouter.post("/users/:id/experience", (req, res) => {
    const userId = req.params.id;
    res.send({ title: "add experience", id: userId });
});

userRouter.put("/users/:id/experience/:expId", (req, res) => {
    const userId = req.params.id;
    const expId = req.params.expId;
    res.send({ title: "update experience", id: userId, expId });
});

userRouter.delete("/users/:id/experience/:expId", (req, res) => {
    const userId = req.params.id;
    const expId = req.params.expId;
    res.send({ title: "delete experience", id: userId, expId });
});

userRouter.post("/users/:id/education", (req, res) => {
    const userId = req.params.id;
    res.send({ title: "add education", id: userId });
});
userRouter.post("/users/:id/skill", (req, res) => {
    const userId = req.params.id;
    res.send({ title: "add skill", id: userId });
});
userRouter.get("/users/:id/experience", (req, res) => {
    const userId = req.params.id;
    res.send({ title: "get experience", id: userId });
});



export default userRouter;