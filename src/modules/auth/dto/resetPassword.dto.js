import BaseDto from "../../../common/dto/base.dto";

class resetPasswordDto extends BaseDto{
    static schema = Joi.object({
        newPassword: Joi.string().trim().message("Passsword must contains at least 8 letters").min(8).required()
    })
}

export default resetPasswordDto