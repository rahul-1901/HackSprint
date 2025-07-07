import Joi from 'joi'

const signupValidation = (req, res, next) => {
    const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(6).max(25).required(),
        name: Joi.string().min(3).max(30).required()
    })

    const {error} = schema.validate(req.body)

    if(error){
        return res.status(400)
        .json({message: "Bad request", error})
    }

    next()
}

const loginValidation = (req, res, next) => {
    const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(6).max(25).required(),
    })

    const {error} = schema.validate(req.body)

    if(error){
        return res.status(400)
        .json({message: "Bad request", error})
    }

    next()

}

export {signupValidation, loginValidation}