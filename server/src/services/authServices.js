import bcrypt from "bcryptjs";
import User from "../models/userModel.js";
import { generateToken } from "../utils/jwt.js";
// import transporter from "../utils/nodemailer.js"
// import randomized from "randomized"
export const registerService = async (name, email, password) => {
  // Check if email already exists
  const existingUser = await User.findOne({
    where: {
      email,
    },
  });

  if (existingUser) {
    throw new Error("Email already exists.");
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);



  // const otp = randomized(10000, 99999)
  // const otpExpiredAt = new Date(Date.now() + 10 * 60 * 1000),

  // Create user
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    // otp: otp.toString,
    // otpExpiredAt,
    // isVerified: false,
  });
  // const mailOption = {
  //   from: process.env.EMAIL,
  //   to: email,
  //   subject: "OTP verification code",
  //   text: `Your OTP is ${otp}`
  // },
  // try {
  //   await transporter.sendMail(mailOption);
  //   console.log("OTP email sent successfully");
  // } catch (err) {
  //   console.log("Email sending error:", err);
  // }
  return user;
};
// Login User
export const loginService = async (email, password) => {

  // Find user
  const user = await User.findOne({
    where: { email },
  });

  if (!user) {
    throw new Error("Invalid email or password.");
  }

  // Compare password
  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error("Invalid email or password.");
  }

  // Generate JWT
  const token = generateToken(user.id);

  return {
    user,
    token,
  };
};


// Verify User
export const verifyService = async (userId) => {

  // Find user by MySQL primary key
  const user = await User.findByPk(userId);

  if (!user) {
    throw new Error("User not found.");
  }

  return user;
};


// Logout
export const logoutService = () => {
  return true;
};

// export const verifyOtpService = async (email, otp) => {
//   const user = await User.findOne({
//     where: [
//       email,
//     ]
//   })
//   if (!user) {
//     throw new Error("User Not Found")
//   }
//   if (user.isVerified) {
//     throw new Error("User already Verified")
//   }
//   if (!user.otp || !user.otpExpiredAt) {
//     throw new Error("OTP not found")
//   }
//   if (new Date() > new Date(user.otpExpiredAt)) {
//     throw new Error("OTP has expired")
//   }
//   if (user.otp != otp.toString) {
//     throw new Error("Invalid OTP")
//   }
//   await user.update({
//     isVerified: true,
//     otp: null,
//     otpExpiresAt: null,
//   })
//   return {
//     message: "Email verified successfully.",
//   };
// }