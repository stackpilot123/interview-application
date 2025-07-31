import jwt from "jsonwebtoken";

const generateToken = (user) =>{
    const {email, id, role} = user;
    return jwt.sign({email,id, role},process.env.JWT_KEY);
}
export default generateToken;
