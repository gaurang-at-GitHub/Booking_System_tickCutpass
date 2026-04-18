
import crypto from 'crypto'
import {
    generateAccessToken,
    verifyAccessToken,
    generateRefreshToken,
    verifyRefreshToken,
    generateVerificationToken,
    generateResetToken
} from "../../common/utils/jwt.utils";

import { sendVerificationEmail } from "../../common/utils/email";
import { Pool } from 'pg';

const register = async ({ name, email, password, phone, role }) => {
    const existing = await Pool.query(
        "SELECT * FROM users WHERE email = $1",
        [email]
    )
    if (existing.rows.length > 0) {
        throw new Error("User with the Email already Exists")
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const { rawToken, hashedToken } = generateVerificationToken()
    const result = await Pool.query(
        "INSERT INTO users(name, email, hashedPassword, phone, role, hashedVerificationToken,refreshToken, isVerified, hashedResetToken) VALUES ($1, $2, $3, $4, $5, $6, $6, $7, $8) RETURNING *",
        [name, email, hashedPassword, phone, role, hashedToken, null, false, null]
    );
    const newUser = result.rows[0]

    await sendVerificationEmail(newUser.email, rawToken);

    delete newUser.hashedPassword
    delete newUser.hashedVerificationToken
    delete newUser.refreshToken
    delete newUser.hashedResetToken
    return newUser
}

const verifyEmail = async (token) => {
    //Receive the click of mail from the client, and covert the received rawToken into hashedToken & compare it with the saved hashedToken
    //if matches, remove the hashedVerificationToken & do isVerified as True or 1.
    // if does not matches, throw error('Verification failed'), isVerified field remains false
    if (!token) {
        throw new Error("Token not found")
    }
    const hashedTokenFromEmail = crypto.createHash("sha256").update(token).digest('hex')
    const result = await Pool.query(
        "SELECT * FROM users WHERE hashedVerificationToken = $1",
        [hashedTokenFromEmail]
    )
    if (result.rows.length === 0) {
        throw new Error("Verification Failed")
    }
    const userToVerify = result.rows[0]
    const updateResult = await Pool.query(
        "UPDATE users SET isVerified = $1, hashedVerificationToken = $2 WHERE id =$3 RETURNING *",
        [true, null, userToVerify.id]
    )
    const verifiedUser = updateResult.rows[0]
    delete verifiedUser.hashedPassword
    delete verifiedUser.hashedVerificationToken
    delete verifiedUser.hashedResetToken
    delete verifiedUser.refreshToken
    return verifiedUser;
}

const login = async ({ email, password }) => {
    const existing = await Pool.query(
        "SELECT * FROM users WHERE email = $1",
        [email]
    )
    if (existing.rows.length === 0) {
        throw new Error("User does not  Exists")
    }
    const user = existing.rows[0]
    const isPasswordCorrect = await bcrypt.compare(password, user.hashedPassword)
    if (!isPasswordCorrect) {
        throw new Error("User Does not Exists")
    }
    if (!user.isVerified) {
        const { rawToken, hashedToken } = generateVerificationToken()
        await Pool.query(
            "UPDATE users SET hashedVerificationToken = $1 WHERE id = $2",
            [hashedToken, user.id]
        )
        await sendVerificationEmail(email, rawToken)
        throw new Error("Please verify your email. A new link has been sent.")
    }
    const accessToken = generateAccessToken({userId : user.id})
    const refreshToken = generateRefreshToken({userId : user.id})
    await Pool.query(
        "UPDATE users SET refreshToken = $1 WHERE id =$2",
        [refreshToken, user.id]
    )
    delete user.hashedPassword
    delete user.hashedVerificationToken
    delete user.hashedResetToken
    delete user.refreshToken
    return{
        user,
        accessToken,
        refreshToken
    }
}

const refresh = async (token) => {
    // if verify does not matches the refreshToken saved in DB, throw new Error("Invalid Refresh Token")
    // if matches, generate Access Token and a New Refresh Token.
    // send back new AccessToken along with new RefreshToken while saving the new hashedRefreshToken in DB.
    if (!token) throw new Error('Refresh Token Missing')
    const verify = verifyRefreshToken(token)
    const toVerify = await Pool.query(
        "SELECT * FROM users WHERE refreshToken = $1",
        [token]
    )
    if (toVerify.rows.length === 0) {
        throw new Error("Refresh Token did not match")
    }
    const user = toVerify.rows[0]
    const accessToken = generateAccessToken({userId : user.id})
    const refreshToken = generateRefreshToken({userId : user.id})
    await Pool.query(
            "UPDATE users SET refreshToken = $1 WHERE id = $2",
            [refreshToken, user.id]
        )
    delete user.hashedPassword
    delete user.hashedVerificationToken
    delete user.hashedResetToken
    delete user.refreshToken
    return{
        user,
        accessToken,
        refreshToken
    }
}

const logout = async (token) => {
    // will receive both access & raw Refresh Token, Out of which I will apply jwt.verify over refresh Token & compare it to the refreshtokens saved in our DB.
    // If hashed refresh Token does not matches, throw error user not found.
    // If hashed refresh Token matches, remove the hashed refresh token from the DB.
    if(!token){
        throw new Error("Token missing")
    }
    const verifyingRefreshToken = verifyRefreshToken(token)
    const existing = await Pool.query(
        "SELECT * FROM users WHERE refreshToken = $1",
        [token]
    )
    if(existing.rows.length === 0){
    throw new Error("Verification Failed")
    }
    const user = existing.rows[0]
    await Pool.query(
        "UPDATE users SET refreshToken = $1 WHERE id = $2",
        [null, user.id]
    )
}

const forgotPassword = async (email) => {
    const existing = await Pool.query(
        "SELECT * FROM users WHERE email = $1",
        [email]
    )
    if (existing.rows.length === 0){ return ; }
    const user = existing.rows[0]
    if (existing.rows.length > 0) {
        const { rawResetToken, hashedResetToken } = generateResetToken()
        //save the hashedResetToken in the DB with time to live.
      await Pool.query(
            "UPDATE users SET hashedResetToken = $1 WHERE id =$2",
            [hashedResetToken, user.id]
        )
        //send the mail to client with endpoint in the URL that is sent in mail: '/reset-password?rawResetToken'
        await sendResetMail(email, rawResetToken)
    }
}

const resetPassword = async (rawResetToken, newPassword)=>{
     //upon click by user, we first convert the raw into hashed and check with the hashedResetToken in DB.
       const hashingTokenReceived = await crypto.createHasg("sha256").update(rawResetToken).digest('hex')
       const checking = await Pool.query(
            "SELECT * FROM users WHERE hashedResetToken - $1",
            [hashingTokenReceived]
        )
        if(checking.rows.length === 0){
            throw new Error("Token did not match")
        }
        const userToUpdate = checking.rows[0]
         //if same then prompt the frontend to show form fields for new password
        //after frontend checks, again check for token cuz of Time to live, if expires throw error token expired try again
        const hashingNewPassword = await bcrypt.hash(newPassword, 10)
        await Pool.query(
            "UPDATE users SET hashedPassword = $1, hashedResetToken = null WHERE id = $3",
            [hashingNewPassword, null, userToUpdate.id]
        )
        //if hashedResetToken did not expire, take the password that came & hash it using bcrypt.hash and save the new password, also deleting the hashedResetToken from the DB.
}

const changePassword = async (userId, { currentPassword, newPassword }) => {
    const existing = await Pool.query(
        "SELECT * FROM users WHERE id = $1",
        [userId]
    )
    if (existing.rows.length === 0) {
        throw new Error("User not found")
    }  
    const user = existing.rows[0]
    const isPasswordCorrect = await bcrypt.compare(currentPassword, user.hashedPassword)
    if (!isPasswordCorrect) {
        throw new Error("Incorrect current password")
    }
    const hashedNewPassword = await bcrypt.hash(newPassword, 10)
    await Pool.query(
        "UPDATE users SET hashedPassword = $1 WHERE id = $2",
        [hashedNewPassword, userId]
    )
}
