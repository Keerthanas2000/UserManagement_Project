const User = require("../model/user");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
  try {
    let { Email, Password, Username } = req.body;
    console.log("Received Body:", req.body);

    const existinguser = await User.findOne({
      $or: [{ Email: Email }, { Username: Username }],
    });

    if (!existinguser) {
      const salt = await bcrypt.genSalt(10);
      Password = await bcrypt.hash(Password, salt);

      let newUser = new User({ Email, Password, Username });

      await newUser.save();

      const payload = {
        id: newUser._id,
      };

      // Sign token
      jwt.sign(
        payload,
        process.env.JWT_Key,
        { expiresIn: "1h" },
        (err, token) => {
          if (err) {
            throw err;
          } else {
            res
              .status(201)
              .json({ message: "User Registered successfully", token: token });
          }
        }
      );
    } else {
      if (existinguser.Email == Email) {
        return res
          .status(400)
          .json({ message: "User Email already exists!!!", Email });
      }
      if (existinguser.Username == Username) {
        return res
          .status(400)
          .json({ message: "Username already exists!!!", Username });
      }
    }
  } catch (error) {
    console.error("Error in Registration:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const profile = async (req, res) => {
  console.log("Profile", req.user);
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  try {
    if (!emailRegex.test(req.body.Email)) {
      return res.status(400).json({ message: "Invalid Email format" });
    } else {
      console.log("Received Email:", req.body.Email);

      const userData = await User.findOne({ Email: req.body.Email });

      if (!userData) {
        return res.status(404).json({ message: "User not found" });
      }

      res.status(200).json(userData);
    }
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const login = async (req, res) => {
  try {
    let { Email, Password, Username } = req.body;

    if (!Email && !Username) {
      return res.status(400).json({ message: "Email or Username required" });
    }
    if (!Password) {
      return res.status(400).json({ message: "Password is Required" });
    }

    // Find user by Email or Username
    const userData = await User.findOne({
      $or: [{ Email: Email }, { Username: Username }],
    });

    if (!userData) {
      return res.status(404).json({ message: "User not found" });
    }

    // Compare password
    const isPasswordValid = await bcrypt.compare(Password, userData.Password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // Create JWT Payload
    const payload = {
      id: userData._id,
    };

    // Sign token
    const token = jwt.sign(payload, process.env.JWT_Key, { expiresIn: "1h" });

    // Send response with token
    return res.status(200).json({
      message: "Login successful",
      token: token,
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const transaction = async (req, res) => {
  res.status(200).send("This is Transaction page");
};

const wishlist = async (req, res) => {
  res.status(200).send("This is wishlist page");
};
module.exports = { login, register, profile, wishlist, transaction };
