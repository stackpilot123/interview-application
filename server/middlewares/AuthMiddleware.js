import jwt from "jsonwebtoken";
import debug from "debug";

const log = debug("development:middlewares");

export const isLoggedIn = (req, res, next) => {
    try {
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).send("You are not authenticated ");
        }

        jwt.verify(token, process.env.JWT_KEY, async (err, data) => {
            if (err) return res.status(403).send("Invalid token");
            req.id = data.id;
            req.role = data.role;
            next();
        });


    } catch (err) {
        log("error in isLoggedIn ", err.message);
        return res.status(500).send("Internal server error ");
    }

}

export const requiredRole = (role) => (req, res, next) => {
    try{
        if(req.role !== role ){
            return res.status(401).send("you are not authorized ");
        }
        next();
    } catch(err){
        log("error is required role middleware: ",err.message);
        return res.status(500).send("Internal server error ");
    }
}