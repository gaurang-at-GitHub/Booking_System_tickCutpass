import Joi from "joi"
import BaseDto from "../../../common/dto/base.dto"


class RegisterDto extends BaseDto{
    static schema = Joi.object({
          name: Joi.string().trim().min(2).max(50).required(),
          email: Joi.string().email().lowercase().required(),
          password: Joi.string().message("Password must contains 8 chars minimum").min(8).required(),
          phone: Joi.string().trim().required(),
          role: Joi.string().valid("Customer", "Seller").default("Customer")
    })
}

export default RegisterDto