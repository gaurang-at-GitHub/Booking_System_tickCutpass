import BaseDto from "../../../common/dto/base.dto";

class changePasswordDto extends BaseDto{
    static schema = Joi.object({
        currentPassword: Joi.string().trim().required(),
        newPassword: Joi.string().message("Password must contains atleast 8 letters").min(8).required()
    })
}

export default changePasswordDto