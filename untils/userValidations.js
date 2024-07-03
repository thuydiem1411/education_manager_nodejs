const Joi = require('@hapi/joi');

const account = Joi.string().email({ minDomainSegments: 2}).min(8).max(30).required().messages({
  'string.email': `Not a Valid E-mail, valid emails are of the form name@domain.tld `,
  'string.empty': `E-mail cannot be an empty field`,
  'string.min': `E-mail should have a minimum length of {#limit}`,
  'string.max': `E-mail should have a maximum length of {#limit}`,

});

const password = Joi.string().min(6).max(16).pattern(/^[a-zA-Z0-9]/).required().messages({
  'string.pattern.base': `Password can only contain upper case and lower case characters and numbers`,
  'string.empty': `Password cannot be an empty field`,
  'string.min': `Password should have a minimum length of {#limit}`,
  'string.max': `Password should have a maximum length of {#limit}`,

})
exports.loginSchema = Joi.object({ account, password});