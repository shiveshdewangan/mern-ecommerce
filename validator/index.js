const { check, validationResult } = require("express-validator");

exports.userSignupValidator = (req, res, next) => {
  check("name")
    .not()
    .isEmpty()
    .withMessage("Name must have more than 5 characters");

  check("password")
    .not()
    .isEmpty()
    .withMessage("Password must contain atleast 6 characters")
    .isLength({ min: 6 });

  check("email", "Email must be between 3 to 32 characters")
    .matches(/.+\@.+\..+/)
    .withMessage("Email must contain @")
    .isLength({
      min: 4,
      max: 32
    });

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  //   if (errors) {
  //     const firstError = errors.map(error => error.message)[0];
  //     return res.status(400).json({ error: firstError });
  //   }

  next();
};
