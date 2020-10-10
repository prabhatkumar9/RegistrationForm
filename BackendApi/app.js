// imports
const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyparser = require("body-parser");
const bcrypt = require("bcrypt");
const randomstring = require("randomstring");
const port = 5000;
const nodemailer = require("nodemailer");
require("dotenv").config();

const server = http.createServer(app);
const io = require("socket.io").listen(server);

const User = require("./user-model");

// variables
const saltRounds = 10;

// middleware
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: false }));
app.use(cors());

// db connection
mongoose.connect("mongodb://localhost:27017/registrationForm", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
var conn = mongoose.connection;

conn.on("connected", () => {
  console.log("MongoDB connected");
});

conn.on("error", (err) => {
  if (err) console.log(err);
});
///

app.use(express.static(__dirname + "/RegistrationForm"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/RegistrationForm/index.html");
});

//// api call functions
app.post("/adduser", async (req, res) => {
  let isMailed = false;
  const { username, email, password, mobile } = req.body;
  const hash = bcrypt.hashSync(password, saltRounds);
  // generate screte token
  const secreteToken = await randomstring.generate();
  // account flag default set active as false
  const isActive = false;
  var userObj = new User({
    username: username,
    email: email,
    password: hash,
    mobile: mobile,
    secreteToken: secreteToken,
    active: isActive,
  });

  await userObj.save((err) => {
    if (err) {
      return res.send({
        message: "Registration unsuccessful.. try again !",
        success: false,
      });
    } else {
      // SEND MAIL
      isMailed = composeAndSendMail(email, secreteToken);
    }

    if (!isMailed) {
      return res.json({
        message: "Registration unsuccessful! Try Agian",
        success: false,
      });
    }

    return res.json({
      message: "Registration successful... Verify your mail !",
      success: true,
    });
  });
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  await User.findOne({ email: email }, async (err, user) => {
    if (err) {
      return res.json({
        message: "Invalid user's credentials",
        success: false,
      });
    }

    if (user) {
      if (!user.active) {
        return res.json({
          message: "Please verify your email first...!",
          success: false,
        });
      } else {
        const match = await bcrypt.compare(password, user.password);
        if (match) {
          io.on("connection", (socket) => {
            console.log("socket connection established.");
            socket.on("clientMessage", (data) => {});
          });
          return res.json({ message: "User logged in !", success: true });
        } else {
          return res.json({
            message: "Invalid user's credentials",
            success: false,
          });
        }
      }
    }
    return res.json({ message: "Invalid user's credentials", success: false });
  });
});

app.post("/verify", async (req, res) => {
  try {
    const token = req.body.token;
    await User.findOne({ secreteToken: token }, (err, result) => {
      if (result) {
        result.active = true;
        result.secreteToken = "";

        result.save((error) => {
          if (error) {
            console.log(error);
            return res.json({
              message: "Email verification failed.!",
              success: false,
            });
          }
          return res.json({ message: "Email verified..", success: true });
        });
      }
    });
  } catch (e) {
    console.log("error");
  }
});

//MAIL COMPOSER AND SENDER
async function composeAndSendMail(receiver, token) {
  // TRANSPORTER
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.Email,
      pass: process.env.Password,
    },
  });

  //COMPOSE MAIL
  let mailOptions = {
    from: "thefullstackdev",
    to: receiver,
    subject: "Account verification",
    html: `Copy the below token string and paste it in verify tab.!
    <br />
    ${token}
    `,
  };

  //SEND EMAIL FOR VERIFICATION
  await transporter.sendMail(mailOptions, (err, data) => {
    if (err) {
      console.log("error in sending mail..!", err);
      return false;
    }
    console.log("mail successfuly sent..");
    return true;
  });
}

server.listen(port, () => {
  console.log("Server started running on port :" + port);
});
