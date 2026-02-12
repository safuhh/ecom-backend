const Joi = require("joi");

exports.checkoutSchema = Joi.object({
  products: Joi.array()
    .items(
      Joi.object({
        productId: Joi.string().required(),
        quantity: Joi.number().integer().min(1).required(),
      })
    )
    .min(1)
    .required(),

  address: Joi.object({
    fullName: Joi.string().min(3).required(),
    phone: Joi.string()
      .pattern(/^[0-9]{10}$/)
      .required(),
    street: Joi.string().min(3).required(),
    city: Joi.string().min(2).required(),
    state: Joi.string().min(2).required(),
    pincode: Joi.string()
      .pattern(/^[0-9]{6}$/)
      .required(),
  }).required(),
});
