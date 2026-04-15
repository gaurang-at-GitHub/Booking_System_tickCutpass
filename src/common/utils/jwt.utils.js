import jwt from 'jsonwebtoken'
import crypto from 'crypto'

const generateAccessToken = (payload) =>{
      return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET,{
        expiresIn : process.env.ACCESS_TOKEN_EXPIRY || "15m"
      })
}

const verifyAccessToken = (token) =>{
    return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
}

const generateRefreshToken = (payload) => {
    return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn : process.env.REFRESH_TOKEN_EXPIRY || "7d"
    })
}

const verifyRefreshToken = (token) => {
  return jwt.verify(token, process.env.REFRESH_TOKEN_SECRET)
}

const generateVerificationToken = () => {
    const rawToken = crypto.randomBytes(32).toString('hex')
    const hashedToken = crypto.createHash('sha256').update(rawToken).digest('hex')
    return { rawToken, hashedToken}
}

const generateResetToken = () => {
    const rawToken = crypto.randomBytes(32).toString('hex')
    const hashedToken = crypto.createHash("sha256").update(rawToken).digest("hex")
    return {rawResetToken, hashedResetToken}
}


export{
    generateAccessToken,
    verifyAccessToken,
    generateRefreshToken,
    verifyRefreshToken,
    generateVerificationToken,
    generateResetToken,
}
