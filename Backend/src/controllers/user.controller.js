import { UserModel } from "../models/user.model.js";
import httpStatus from "http-status";
import bcrypt, { hash } from "bcrypt";
import crypto from "crypto";
import { MeetingModel } from "../models/meeting.model.js";

const register = async (req, res) => {
  const { name, username, password } = req.body;

  try {
    const existingUser = await UserModel.findOne({ username });
    if (existingUser) {
      return res.status(httpStatus.FOUND)
        .json({ message: "USER ALREADY EXISTS" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new UserModel({ name, username, password: hashedPassword });
    await newUser.save();
    return res
      .status(httpStatus.CREATED)
      .json({ message: "USER REGISTERED SUCCESSFULLY" });
  } catch (error) {
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

const login = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res
      .status(httpStatus.BAD_REQUEST)
      .json({ message: "USERNAME AND PASSWORD REQUIRED" });
  }
  try {
    const existingUser = await UserModel.findOne({ username });
    if (!existingUser) {
      return res
        .status(httpStatus.NOT_FOUND)
        .json({ message: "USER NOT FOUND" });
    }
    const matchPassword = await bcrypt.compare(password, existingUser.password);

    if (!matchPassword) {
      return res
        .status(httpStatus.UNAUTHORIZED)
        .json({ message: "INVALID CREDENTIALS" });
    }
    const token = crypto.randomBytes(20).toString("hex");
    existingUser.token = token;
    await existingUser.save();
    return res
      .status(httpStatus.OK)
      .json({ message: "LOGIN SUCCESSFUL", user: existingUser, token });
  } catch (error) {
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

const getUserHistory=async(req,res)=>{
  const {token}=req.query;
  try {
        const user=await UserModel.findOne({token:token})
        const meetings= await MeetingModel.find({user_id:user.username})
        return res.status(httpStatus.OK).json({meetings})
  } catch (error) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({message:error.message} )
  }
}

const addToHistory=async(req,res)=>{
  const {token,meeting_code}=req.body;
  try {
        const user=await UserModel.findOne({token:token})
     const newMeeting=new MeetingModel({user_id:user.username, meetingCode:meeting_code})
      await newMeeting.save();
        return res.status(httpStatus.OK).json({message:"ADDED TO HISTORY"})
  } catch (error) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({message:error.message} )
  }
}

export { register, login, getUserHistory, addToHistory };