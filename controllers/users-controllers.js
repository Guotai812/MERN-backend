const { validationResult } = require("express-validator");
const User = require("../models/user");

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

  const createddUser = new User({
    name,
    email,
    password,
    image: req.file.path,
    places: [],
  });

  try {
    await createddUser.save();
  } catch (error) {
    return next(new HttpError("Signing up failed", 500));
  }

  res.status(201).json({ user: createddUser.toObject({ getters: true }) });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  let identifiedUser;
  try {
    identifiedUser = await User.findOne({ email: email });
  } catch (error) {
    return next(new HttpError("Failed to find this user!", 500));
  }

  if (!identifiedUser || identifiedUser.password !== password) {
    return next(
      new HttpError(
        "Could not identify user, credentials seem to be wrong.",
        401
      )
    );
  }

  res.json({
    message: "Logged in!",
    user: identifiedUser.toObject({ getters: true }),
  });
};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
