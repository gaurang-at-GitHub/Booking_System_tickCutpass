import { verifyAccessToken } from "../../common/utils/jwt.utils.js";
import { Pool } from 'pg'; 

const authenticate = async(req, res, next) => {
  try {
  let token
  if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
   token = req.headers.authorization.split(" ")[1]
  }
  if (!token) {
    throw new Error("Not Authenticated: No token provided");
    }
  const decoded = verifyAccessToken(token)
  const existing = await Pool.query(
    "SELECT * FROM users WHERE id =$1",
    [decoded.userId]
  )
  if(existing.rows.length === 0){
    throw new Error("User does not exist")
  }
  const user = existing.rows[0]
  req.user = {
    id: user.id,
    role: user.role,
    name: user.name,
    email: user.email,
  }
  next()
  } catch (error) {
    res.status(401).json({error : error.message})
  }
    
}




const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ 
          error: "You do not have permission to perform this action" 
      });
    }
    next();
  };
};
export { authenticate, authorize };
