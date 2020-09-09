// imports
var express = require("express");
var app = express();
var cors = require("cors");
var mongoose = require("mongoose");
var bodyparser = require("body-parser");
var bcrypt = require("bcrypt");
var User = require("./user-model");
var randomstring = require("randomstring");
var port = 3000;

const mailer = require("./mailer");

// variables
const saltRounds = 10;

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: false }));
app.use(cors());

mongoose.connect("mongodb://localhost:27017/registrationForm", {
  useNewUrlParser: true,
});
var conn = mongoose.connection;

conn.on("connected", () => {
  console.log("MongoDB connected");
});

conn.on("error", (err) => {
  if (err) console.log(err);
});

///

//// api call functions
app.post("/adduser", (req, res) => {
  const { username, email, password, mobile } = req.body;
  const hash = bcrypt.hashSync(password, saltRounds);
  // generate screte token
  const secreteToken = randomstring.generate();
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

  userObj.save((err) => {
    if (err) {
      return res.send("error");
    } else {
      // compose mail
      const html = `
        Hi there, 
        <br/>
        Thank you for registering!
        <br/>
        <br/>
        Please verify you email by typing following token:
        <br/>
        Token : <b>${secreteToken}</b>
        <br/>
        On the following page:
        <a href="http://localhost:4200/verify>verify</a>
        <br/>
        <br/>
        Have a nice day!
  `;

      //send mail
      mailer.sendEmail("admin@cowork.com", email, "Verification mail", html);
    }

    res.json(userObj);
  });
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;

  User.findOne({ email: email }, async (err, user) => {
    if (err) {
      return res.send("error");
    }

    if (user) {
      if (!user.active) {
        return res.send(user);
      }
      const match = await bcrypt.compare(password, user.password);
      if (match) {
        return res.send(user);
      } else {
        return res.send("invalid user");
      }
    }
    return res.send("Invalid credentials");
  });
});

app.post("/verify", (req, res) => {
  try {
    const token = req.body.token;
    User.findOne({ secreteToken: token }, (err, result) => {
      if (result) {
        result.active = true;
        result.secreteToken = "";

        result.save((error) => {
          if (error) {
            console.log(error);
            return res.send("not updated");
          }
          return res.send(result);
        });
      }
    });
  } catch (e) {
    console.log("error");
  }
});

app.listen(port, () => {
  console.log("Server started running on port :" + port);
});
