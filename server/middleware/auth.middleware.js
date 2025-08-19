import jwt from "jsonwebtoken";
import User from "../model/user.model.js";

export const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    if (!token) {
      return res
        .status(401)
        .json({ messge: "Unauthorized - No token provided" });
    }
    const decode = jwt.verify(token, process.env.JWT_SCERET_KEY);
    if (!decode) {
      return res.status(401).json({ message: "Unauthorized - invalid token" });
    }
    const user = await User.findById(decode.userId).select("-password");
    if (!user) {
      return res.status(401).json({ message: "Unauthorized - User Not Found" });
    }
    req.user = user;
    next();
  } catch (error) {
    console.log("Error in proteced Route: ",error)
    res.status(500).json({message: "Internal Server Error"});
  }
};
