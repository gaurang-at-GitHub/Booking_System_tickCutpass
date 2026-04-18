import { json } from "express";
import * as authService from "./auth.service.js"


const register = async (req, res) => {
    try {
        const newUser = await authService.register(req.body); 
        
        res.status(201).json({ 
            message: "Registration successful", 
            userData: newUser 
        }); 
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const login = async(req, res)=>{
    try {
       const loginData = await authService.login(req.body)
        res.status(200).json({
            message : "Logged In Successfully",
            data : loginData
        })
    } catch (error) {
        res.status(400).json({
            error : error.message
        })
    }
}

const logout = async(req, res) => {
    try {
        const { refreshToken} = req.body
        await authService.logout(refreshToken)
        res.status(204).send()
    } catch (error) {
        res.status(400).json({
            error : error.message
        })
    }
}

const forgotPassword = async(req, res) => {
      try {
        const { email } = req.body
        await authService.forgotPassword(email)
        res.status(200).json({
            message : "Forgot request successful"
        })
      } catch (error) {
          res.status(400).json({
            error : error.message
          })
      }
}

const changePassword = async(req, res) =>{
  try {
    const userId = req.user.id
    await authService.changePassword(userId, req.body)
    res.status(200).json({
        message : "Password updation is success"
    })
  } catch (error) {
    res.status(400).json({
        error: error.message
    })
  }
}

const resetPassword = async(req, res) => {
    try {
        const { rawResetToken, newPassword }  = req.body
        await authService.resetPassword(rawResetToken, newPassword)
        res.status(204).send()
    } catch (error) {
        res.status(400).json({
            error : error.message
        })
    }
}


export { register, login, logout, forgotPassword, changePassword, resetPassword };