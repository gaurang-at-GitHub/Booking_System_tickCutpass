import { Router } from "express";
import validate from "../../common/middleware/validate.middleware";
import RegisterDto from "./dto/register.dto";
import LoginDto from "./dto/login.dto";


const router = Router()

router.get('/')
router.post('/register', validate(RegisterDto), controller.register)
router.post('/login', validate(LoginDto), controller.login)


export default router