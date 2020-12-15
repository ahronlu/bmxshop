import { body, validationResult } from "express-validator";

const userValidationRules = () => {
  return [
    body("email", "Please include a valid email").isEmail(),
    body(
      "password",
      "Please include a password with at least 6 chars"
    ).isLength({
      min: 6,
    }),
  ];
};

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  const extractedErrors = [];
  errors.array().map((err) => extractedErrors.push({ [err.param]: err.msg }));

  return res.status(422).json({
    errors: extractedErrors,
  });
};

export { userValidationRules, validate };
