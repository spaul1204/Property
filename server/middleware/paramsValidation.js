
const Joi = require('joi')
const ExpressError = require('../utils/ExpressError')

const validateProperty = (req,res,next) =>{
    const propertySchema = Joi.object({
        imageFile : Joi.array().items(Joi.string()),
        property : Joi.string().required(),
        address : Joi.string().required(),
        locality : Joi.string().required(),
        price : Joi.number().required().min(1),
        carpetArea : Joi.number().required().min(1),
        description : Joi.string().required()
    })

    const { error } = propertySchema.validate(req.body)
    if(error){
        const msg = error.details.map(el => el.message).join(',')
        return next(new ExpressError(msg,400))
    }
    next()
}

module.exports = { validateProperty }