const User = require("../models/User");
const OTP = require("../models/Otp");
const bcrypt = require("bcrypt");
const otpGenerator = require("otp-generator");
const Profile = require("../models/Profile");
const jwt = require("jsonwebtoken");

exports.signup = async (req, res) => {
  try {
    const { name, email, password, confirmPassword, otp } = req.body;

    // 1. Validate required fields
    if (!name || !email || !password || !confirmPassword || !otp) {
      return res.status(403).json({
        success: false,
        message: "All fields are required",
      });
    }

    // 2. Validate passwords match
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Password and Confirm Password do not match",
      });
    }

    // 3. Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    // 4. Get most recent OTP for the email
    const recentOtp = await OTP.findOne({ email }).sort({ createdAt: -1 });

    // 5. Validate OTP presence and match
    if (!recentOtp || String(recentOtp.otp) !== String(otp)) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired OTP",
      });
    }

    // 6. Optional: check OTP expiry (10 minutes)
    const maxAge = 10 * 60 * 1000; // 10 min in ms
    const timeDiff = Date.now() - new Date(recentOtp.createdAt).getTime();
    if (timeDiff > maxAge) {
      return res.status(400).json({
        success: false,
        message: "OTP has expired",
      });
    }

    // 7. Create default profile
    const defaultProfile = {
      class: "Not specified",
      schoolOrCollege: "Not specified",
      board: "CBSE",
      interests: [],
      bio: "Hi! I am new to the platform and excited to start learning.",
      location: "",
      socialLinks: {
        github: "",
        linkedin: "",
        twitter: "",
      },
    };

    const profileResponse = await Profile.create(defaultProfile);

    // 8. Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 9. Generate profile picture
    const profilePic = `https://api.dicebear.com/5.x/initials/svg?seed=${encodeURIComponent(name)}`;

    // 10. Create user
    const userPayload = {
      name,
      email,
      password: hashedPassword,
      profilePic,
      profile: profileResponse._id,
    };

    const newUser = await User.create(userPayload);

    // 11. Update profile with user ID
    profileResponse.user = newUser._id;
    await profileResponse.save();

    // 12. Generate JWT token
    const tokenPayload = { email: newUser.email, userId: newUser._id };
    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, {
      expiresIn: "2h",
    });

    newUser.token = token;
    await newUser.save();

    // 13. Remove sensitive fields
    newUser.password = undefined;

    // 14. Set cookie
    res.cookie("jwt", token, {
      expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });

    // 15. Send response
    return res.status(200).json({
      success: true,
      message: "Signup successful",
      token,
      data: newUser,
    });
  } catch (error) {
    console.error("Signup error:", error);
    return res.status(500).json({
      success: false,
      message: "Error occurred in the signup controller",
    });
  }
};

exports.login = async (req, res) => {
   try {
      const { email, password } = req.body;

      if (!email || !password) {
         return res.status(400).json({
         success: false,
         message: "All fields are required",
         });
      }

      const user = await User.findOne({ email }).populate("profile").exec();
      if (!user) {
         return res.status(400).json({
         success: false,
         message: "User not found",
         });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
         return res.status(401).json({
         success: false,
         message: "Incorrect password",
         });
      }

      const payload = {
         email: user.email,
         userId: user._id,
      };

      const token = jwt.sign(payload, process.env.JWT_SECRET, {
         expiresIn: "2h",
      });

      user.token = token;
      await user.save();

      user.password = undefined;

      res.cookie("jwt", token, {
         expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
         httpOnly: true,
         secure: false,
         sameSite: "lax",
      });

      return res.status(200).json({
         success: true,
         message: "Login successful",
         token,
         data: user,
      });
   } catch (error) {
      console.log(error);
      return res.status(500).json({
         success: false,
         message: "Error occurred in the login controller",
      });
   }
};

exports.sendOtp = async (req, res) => {
   try {
      const { email } = req.body;
   

      const user = await User.findOne({ email });
      if (user) {
         return res.status(401).json({
         success: false,
         message: "User already registered",
         });
      }

      let otp = otpGenerator.generate(6, {
         upperCaseAlphabets: false,
         lowerCaseAlphabets: false,
         specialChars: false,
      });

      let existingOtp = await OTP.findOne({ otp });
      while (existingOtp) {
         otp = otpGenerator.generate(6, {
         upperCaseAlphabets: false,
         lowerCaseAlphabets: false,
         specialChars: false,
         });
         existingOtp = await OTP.findOne({ otp });
      }

      const response = await OTP.create({ email, otp });

      return res.status(200).json({
         success: true,
         message: "OTP sent successfully",
         data:response
      });
   } catch (e) {
      console.log(e);
      return res.status(500).json({
         success: false,
         message: "Error while sending OTP",
      });
   }
};

exports.logout = (req, res) => {
   try {
      res.cookie("jwt", "", { maxAge: 0 });
      return res
         .status(200)
         .json({ success: true, message: "Logged out successfully" });
   } catch (error) {
      console.log("Error in logout controller", error.message);
      return res
         .status(500)
         .json({ success: false, message: "Internal Server Error" });
   }
};


exports.checkAuth = (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Not authenticated",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User authenticated",
      data: req.user,
    });
  } catch (error) {
    console.log("Error in checkAuth controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
