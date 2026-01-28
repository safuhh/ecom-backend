const joi = require("joi");
exports.registerschema = joi.object({
  email: joi.string().email().required().messages({
    "string.email": "Invalid email format",
    "any.required": "Email is required",
  }),
  password: joi.string().min(5).max(30).required().messages({
    "string.min": "Password must be at least 6 characters",
    "any.required": "Password is required",
  }),
});
