import { upsertStreamUser } from "../config/stream.js";
import User from "../model/user.model.js";
import jwt from "jsonwebtoken";

async function signup(req, res) {
  const { name, email, password } = req.body;
  try {
    if (!email || !password || !name) {
      return res.status(400).json({ message: "all fields are required" });
    }
    if (password.length < 8) {
      return res
        .status(400)
        .json({ message: "password must be at leat 8 Charactres" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "email alreday exists" });
    }

    const idx = Math.floor(Math.random() * 100) + 1;
    const randomAvatar = `https://avatar.iran.liara.run/public/${idx}`;

    const user = await User.create({
      name,
      email,
      password,
      profilePic: randomAvatar,
    });

    try {
      await upsertStreamUser({
        id: user._id.toString(),
        name: user.name,
        image: user.profilePic || "",
      });
      console.log(`Stream User is Created: ${user.name}`);
    } catch (error) {
      console.log("Error in creating stream user: ", error);
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SCERET_KEY, {
      expiresIn: "7d",
    });

    res.cookie("jwt", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      secure: process.env.NODE_ENV === "production",
    });

    res.status(201).json({ success: true, user });
  } catch (error) {
    console.log("Error in signUp controller: ", error);
    res.status(500).json({ message: "Internal Sever Error" });
  }
}

async function login(req, res) {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid Email or Password" });
    }
    const ispasswordMatched = await user.matchPassword(password);

    if (!ispasswordMatched) {
      return res.status(400).json({ message: "Invalid Email or Password" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SCERET_KEY, {
      expiresIn: "7d",
    });

    res.cookie("jwt", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      secure: process.env.NODE_ENV === "production",
    });

    console.log("JWT cookie set for login. Environment:", process.env.NODE_ENV);
    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ message: "Internal server Error" });
  }
}
async function logout(req, res) {
  res.clearCookie("jwt", {
    httpOnly: true,
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    secure: process.env.NODE_ENV === "production",
  });
  res.status(200).json({ success: true, message: "Logout Successfully" });
}

async function onboard(req, res) {
  // console.log(req.user);
  try {
    const userId = req.user._id;

    const { name, bio, nativeLanguage, learningLanguage, location } = req.body;

    if (!name || !bio || !nativeLanguage || !learningLanguage || !location) {
      res.status(400).json({
        message: "All filds are required",
        missingFields: [
          !name && "name",
          !bio && "bio",
          !nativeLanguage && "nativeLanguage",
          !learningLanguage && "learningLanguage",
          !location && "location",
        ].filter(Boolean),
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        ...req.body,
        isOnboarded: true,
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found!" });
    }

    // Updating the user Info IN Stream

    try {
      await upsertStreamUser({
        id: updatedUser._id.toString(),
        name: updatedUser.name,
        image: updatedUser.profilePic || "",
      });
      console.log(
        `straem user updated after onboarding for ${updatedUser.name}`
      );
    } catch (error) {
      console.log(`Error in onboading stream`);
    }

    res.status(200).json({ success: true, user: updatedUser });
  } catch (error) {
    console.log("onboardng Error: ", error);
    res.status(500).json({ message: "Internal server Error" });
  }
}

export { signup, login, logout, onboard };
