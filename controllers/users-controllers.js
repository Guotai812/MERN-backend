require("dotenv").config();
const { validationResult } = require("express-validator");
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const HttpError = require("../models/http-error");

const getUsers = async (req, res, next) => {
  let users;
  try {
    users = await User.find({}, "-password");
  } catch (error) {
    return next(new HttpError("Could not get users", 500));
  }
  if (users.length === 0) {
    return next(new HttpError("No users", 404));
  }
  res
    .status(200)
    .json({ users: users.map((user) => user.toObject({ getters: true })) });
};

const signup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }
  const { name, email, password } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (error) {
    return next(new HttpError("Signing up failed", 500));
  }
  if (existingUser) {
    return next(
      new HttpError("User exists already, please login instead", 422)
    );
  }

  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (error) {
    return next(new HttpError("Could not create users", 500));
  }

  const createddUser = new User({
    name,
    email,
    password: hashedPassword,
    image: req.file.path,
    places: [],
  });

  try {
    await createddUser.save();
  } catch (error) {
    return next(new HttpError("Signing up failed", 500));
  }

  let token;
  try {
    token = jwt.sign(
      { userId: createddUser.id, email: createddUser.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
  } catch (error) {
    return next(new HttpError("Signing up failed", 500));
  }

  res
    .status(201)
    .json({ userId: createddUser.id, email: createddUser.email, token: token });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  let identifiedUser;
  try {
    identifiedUser = await User.findOne({ email: email });
  } catch (error) {
    return next(new HttpError("Failed to find this user!", 500));
  }

  let isValidPassword = false;

  try {
    isValidPassword = await bcrypt.compare(password, identifiedUser.password);
  } catch (error) {
    return next(
      new HttpError(
        "Could not identify user, credentials seem to be wrong.",
        500
      )
    );
  }

  if (!isValidPassword) {
    return next(
      new HttpError(
        "Could not identify user, credentials seem to be wrong.",
        401
      )
    );
  }

  let token;
  try {
    token = jwt.sign(
      { userId: identifiedUser.id, email: identifiedUser.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
  } catch (error) {
    return next(new HttpError("Login failed", 500));
  }

  res.json({
    userId: identifiedUser.id,
    email: identifiedUser.email,
    token: token,
  });
};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
