import User from "../models/User.js"
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

// controller for get all users

export const getAllUsers = async (req, res) => {
    try {
        const result = await User.find();
        if (!result || result.length < 1) {
            return res.status(404).json({ success: false, message: "users not found" });
        }
        // Remove password from the response
       const { password: userPassword, ...userWithoutPassword } = result.toObject();

        res.status(200).json({ success: true, users: userWithoutPassword })
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: "server error occured" });
    }
}


// controller for getting single user 

export const getsingleUser = async (req, res) => {

    if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).json({ success: false, message: "invalid user" });
    }

    const id = req.params.id;
    try {
        const result = await User.findById(id);
        if (!result) {
            return res.status(404).json({ success: false, message: "user not found" });
        }
        // Remove password from the response
       const { password: userPassword, ...userWithoutPassword } = result.toObject();

        res.status(200).json({ success: true, user: userWithoutPassword })
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: "server error occured" });
    }
}


// controller for user signup

export const signUp = async (req, res) => {

    const { email, userName, password, avatar } = req.body;

    if (!userName) {
        return res.status(400).json({ success: false, message: "username is required" });
    }
    if (!email) {
        return res.status(400).json({ success: false, message: "email is required" });
    }
    if (!password) {
        return res.status(400).json({ success: false, message: "password is required" });
    }

    try {
        const isMatch = await User.findOne({ email });
        if (isMatch) {
            return res.status(400).json({ success: false, message: "user already exists! please login" });
        }

        const hashPass = await bcrypt.hash(password, 10);
        const result = await User.create({ userName, email, password: hashPass, avatar });

        // Remove password from the response
       const { password: userPassword, ...userWithoutPassword } = result.toObject();

        res.status(201).json({ success: true, message: "signUp success", user: userWithoutPassword });
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: err.message || "server error occured" });
    }
}

export const logIn = async (req, res) => {
    if (!req.body.email) {
        return res.status(400).json({ success: false, message: "email is required" });
    }
    if (!req.body.password) {
        return res.status(400).json({ success: false, message: "password is required" });
    }

    const { email, password } = req.body;

    try {
        const result = await User.findOne({ email });
        if (!result) {
            return res.status(404).json({ success: false, message: "user not found" });
        }

        // Await the password comparison
        const passMatch = await bcrypt.compare(password, result.password);

        if (!passMatch) {
            return res.status(403).json({ success: false, message: "invalid password" });
        }

        const jwtToken = jwt.sign({ email, userId: result._id }, process.env.JWT_SECRET, { expiresIn: "10d" });

        // Remove password from the response
        const { password: userPassword, ...userWithoutPassword } = result.toObject();

        return res.status(200).json({ success: true, message: "login success", user: userWithoutPassword, jwtToken });

    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: "server error occurred", error: err.message });
    }
};
