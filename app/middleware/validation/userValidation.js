const Joi = require("joi");

const signupSchema = Joi.object({
    FirstName: Joi.string().required(),
    LastName: Joi.string().required(),
    Email: Joi.string().email().required(),
    Password: Joi.string().min(6).required(),
    isLawyer: Joi.boolean().default(false),
    FeePerCase: Joi.number().optional().when('isLawyer', {
        is: true,
        then: Joi.required(),
        otherwise: Joi.optional().allow('', null)
    }),
    Expertise: Joi.string().optional().when('isLawyer', {
        is: true,
        then: Joi.required(),
        otherwise: Joi.optional().allow('', null)
    }),
    ContactNumber: Joi.string().optional().when('isLawyer', {
        is: true,
        then: Joi.required(),
        otherwise: Joi.optional().allow('', null)
    }),
    State: Joi.string().optional().when('isLawyer', {
        is: true,
        then: Joi.required(),
        otherwise: Joi.optional().allow('', null)
    }),
});

const loginSchema = Joi.object({
    Email: Joi.string().email().required(),
    Password: Joi.string().required(),
});

const updateUserSchema = Joi.object({
    FirstName: Joi.string(),
    LastName: Joi.string(),
    Email: Joi.string().email(),
});

module.exports = {
    signupSchema,
    loginSchema,
    updateUserSchema,
};
