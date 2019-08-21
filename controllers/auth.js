const User = require("../models/user");
const { errorHandler } = require("../helpers/dbErrorHandler");
const jwt = require("jsonwebtoken"); // to generate signed token
const expressJwt = require("express-jwt"); // for authorization check
const JWT_SECRET = "kdfjdkjf43323";

exports.signup = (req, res) => {
  console.log("req.body", req.body);
  const user = new User(req.body);
  user.save((err, user) => {
    if (err) {
      return res.status(400).json({
        err: errorHandler(err)
      });
    }
    user.salt = undefined;
    user.hashed_password = undefined;
    res.json({
      user
    });
  });
};

exports.signin = (req, res) => {
  // find the user based on email
  const { email, password } = req.body;
  User.findOne(
    {
      email
    },
    (err, user) => {
      if (err || !user) {
        return json.status(400).json({
          error: "User with email does not exist. Please signup"
        });
      }
      // if user is found make sure the email and password match
      // create authenticate method in user model
      if (!user.authenticate(password)) {
        return res.status(401).json({
          error: "Email and password do not match"
        });
      }

      // generate a signed token with user id and secret
      const token = jwt.sign({ _id: user._id }, JWT_SECRET);

      // persist the token as 't' in cookie with expiry date
      res.cookie("t", token, { expire: new Date() + 9999 });
      const { _id, name, email, role } = user;
      return res.json({ token, user: { _id, email, name, role } });
    }
  );
};

exports.signout = (req, res) => {
  res.clearCookie("t");
  res.json({ message: "Signout succesfull" });
};

exports.requireSignIn = expressJwt({
  secret: JWT_SECRET,
  userProperty: "auth"
});
