
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

const register = async({name, email, password, phone, role})=>{
    const existing = await Pool.query(
        "SELECT * FROM users WHERE email = $1",
        [email]
    )
    if(existing.rows.length > 0){
        throw new Error("User with the Email already Exists")
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const {rawToken, hashedToken} = generateVerificationToken()
    const result = await Pool.query(
        "INSERT INTO users(name, email, hashedPassword, phone, role, hashedVerificationToken, isVerified, hashedResetToken) VALUES ($1, $2, $3, $4, $5, $6, $6, $7, $8) RETURNING *",
        [name, email, hashedPassword, phone, role, hashedToken, false, null]
    );
    const newUser = result.rows[0]
   
    await sendVerificationEmail(newUser.email, rawToken);

    delete newUser.hashedPassword
    delete newUser.hashedResetToken
    return newUser
}

const verifyEmail = async(token) => {
    //Receive the click of mail from the client, and covert the received rawToken into hashedToken & compare it with the saved hashedToken
    //if matches, remove the hashedVerificationToken & do isVerified as True or 1.
    // if does not matches, throw error('Verification failed'), isVerified field remains false
    const hashedTokenFromEmail = crypto.createHash("sha256").update(token).digest('hex')
    const result = await Pool.query(
        "SELECT * FROM users WHERE hashedVerificationToken = $1",
        [hashedTokenFromEmail]
    )
    if(result.rows.length === 0){
        throw new Error("Verification Failed")
    }
    const userToVerify = result.rows[0]
    const updateResult = await Pool.query(
        "UPDATE users SET isVerified = $1, hashedVerificationToken = $2 WHERE id =$3 RETURNING *",
        [true, null, userToVerify.id]
    )
    const verifiedUser = updateResult.rows[0]
    delete verifiedUser.hashedPassword
    return verifiedUser;
}

const login = async({email, password})=>{
    const existing = await Pool.query(
        "SELECT * FROM users WHERE email = $1",
        [email]
    )
    if(existing.rows.length === 0){
        throw new Error("User with the Email does not  Exists")
    }
    const verified = await Pool.query(
        "SELECT * FROM users WHERE we need to check if user isVerified is TRUE",
        [isVerified]
    )
    if(verified.rows.length = 0){
        const {rawToken, hashedToken} = generateVerificationToken()
        //Send the raw token to the Customer's email address
        // save the hashedToken into the Database.
        // When user clicks on mail,  the token that came, we convert it into hash & compare it with saved one in DB
        // if same we route him to the '/home' endpoint, and delete the hashedVerificationToken & make isVerified to True.
        // if not throw new Error('Verification did not match') & isVerified field remains false.
    }
    //If already verified then:-
    // Parallely generate Access Token & Refresh Token, send the Access Token and the refreshToken to Client while saving Refresh Token in DB.
    // Route the User to the '/home' endpoint where he will be having list of movies to book from
}

const refresh = async(token)=>{
    if(!token) throw new Error('Refresh Token Missing')
    const verify = verifyRefreshToken(token)
    // if verify does not matches the refreshToken saved in DB, throw new Error("Invalid Refresh Token")
    // if matches, generate Access Token and a New Refresh Token.
    // send back new AccessToken along with new RefreshToken while saving the new hashedRefreshToken in DB.
}

const logout = async(token)=>{
    // will receive both access & raw Refresh Token, Out of which I will take apply jwt.verify over refresh Token & compare it to the refreshtokens saved in our DB.
    // If hashed refresh Token does not matches, throw error user not found.
    // If hashed refresh Token matches, remove the hashed refresh token from the DB.
}

const forgotPassword = async(email) =>{
    const existing = await Pool.query(
        "SELECT * FROM users WHERE email = $1",
        [email]
    )
    if(existing.rows.length = 0) throw new Error("If this email exists, a reset link has been sent to the email")
    if(existing.rows.length > 0){
        const {rawResetToken, hashedResetToken} = generateResetToken()
        //save the hashedResetToken in the DB with time to live.
        //send the mail to client with endpoint in the URL that is sent in mail: '/reset-password?rawResetToken'
        //upon click by user, we first convert the raw into hashed and check with the hashedResetToken in DB.
        //if same then prompt the frontend to show form fields for new password
        //after frontend checks, again check for token cuz of Time to live, if expires throw error token expired try again
        //if hashedResetToken did not expire, take the password that came & hash it using bcrypt.hash and save the new password, also deleting the hashedResetToken from the DB.
    }
}



