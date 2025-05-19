import { Router } from "express";
import { addEducation, deleteEducation, getEducation, updateEducation } from "../controller/education.controller.js";
import { addSkill, deleteSkill, getSkills,updateSkill } from "../controller/skill.controller.js";
// import { get } from "mongoose";
import { addExperience,  deleteExperience,  getExperienceById,  getExperienceByUserId,  getExperiences, updateExperience } from "../controller/experience.controller.js";
import {upload} from "../config/cloudinary.js";
import { uploadResume } from "../controller/resume.controller.js";

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


// for user
userRouter.post("/users/resume",upload.single("resume"),uploadResume )

// POST    /api/users/:id/experience    → Add experience
// PUT     /api/users/:id/experience/:expId → Update experience
// DELETE  /api/users/:id/experience/:expId → Remove experience

// POST    /api/users/:id/education     → Add education
// POST    /api/users/:id/skill         → Add skill

// Experience related routes
userRouter.get("/users/experience/info", getExperiences);
userRouter.get("/users/experience/:id", getExperienceById)
userRouter.post("/users/experience",addExperience) ;

userRouter.patch("/users/experience/:id", updateExperience);

userRouter.delete("/users/experience/:id",deleteExperience);
// this endpoint will return all experience of a user
userRouter.get("/users/experience/all/:id", getExperienceByUserId);


// Education related routes
// /users/education → Get all education route was not working 
// /users/education/info → Get all education info works well
userRouter.get("/users/education/info",getEducation);
userRouter.post("/users/education", addEducation);
userRouter.put("/users/education/:id", updateEducation);
userRouter.delete("/users/education/:id", deleteEducation);



// skill related routes
userRouter.get("/users/skill/info", getSkills); 
userRouter.post("/users/skill",addSkill);
userRouter.patch("/users/skill/:id",updateSkill);
userRouter.delete("/users/skill/:id", deleteSkill)

export default userRouter;