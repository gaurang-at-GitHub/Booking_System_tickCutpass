import { Router } from "express";
import validate from "../../common/middleware/validate.middleware";
import RegisterDto from "./dto/register.dto";
import LoginDto from "./dto/login.dto";
import * as controller from './auth.controller.js';
import { authenticate } from "./auth.middleware.js";
import forgotPasswordDto from "./dto/forgotPassword.dto.js"; 
import resetPasswordDto from "./dto/resetPassword.dto.js";
import changePasswordDto from "./dto/changePassword.dto.js";

const router = Router()

router.post('/register', validate(RegisterDto), controller.register)
router.post('/login', validate(LoginDto), controller.login)
router.post('/logout', controller.logout)

router.post('/verify-email', controller.verifyEmail) 

router.post('/forgot-password', validate(forgotPasswordDto), controller.forgotPassword)
router.post('/reset-password', validate(resetPasswordDto), controller.resetPassword)
router.post('/change-password', authenticate, validate(changePasswordDto), controller.changePassword)

router.post('/refresh', controller.refresh) 


export default router