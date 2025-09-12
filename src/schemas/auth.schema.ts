import Joi from "joi";

export const createAdminSchema = Joi.object({
  username: Joi.string().min(3).max(30).required(),
  password: Joi.string().min(6).required(),
  email: Joi.string().email().required(),
  name: Joi.string().allow("", null),
});

export const updateAdminSchema = Joi.object({
  username: Joi.string().min(3).max(30).optional(),
  password: Joi.string().min(6).optional(),
  email: Joi.string().email().optional(),
  name: Joi.string().allow("", null).optional(),
});

export const idParamsSchema = Joi.object({
  id: Joi.string().pattern(/^\d+$/).required(), // params.id ,asih string
});
