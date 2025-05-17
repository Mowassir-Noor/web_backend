import mongoose from 'mongoose';


const skillSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  name: String,
});

const Skill = mongoose.model("Skill", skillSchema);
export default Skill;
