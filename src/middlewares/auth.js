import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import userModel from '../models/userModel';

dotenv.config()

function userRouteAuth(req, res, next) {

    let { token } = req.headers;
    if(req.headers.authorization && !token) token = req.headers.authorization.split(' ')[1];
    if(req.body.token && !token) token = req.body.token;

    //check for token
    if (!token){
        res.status(401).json({ status: 'error', error: "No token, authorization denied" });
    } else {
        try {
            //verify token
            const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
            //Add user from payload
            req.user = decoded;
            next();
        } catch (error) {
            if (errors.name === 'TokenExpiredError') {
                return res.status(409).json({
                  status: 'error',
                  error: 'Token Expired, please login',
                });
            }
            res.status(401).json({ status: 'error', error: "Invalid token, authorization denied" });

        }
    }
}

export async function adminRouteAuth(req, res, next) {
  
    let { token } = req.headers;
    if(req.headers.authorization && !token) token = req.headers.authorization.split(' ')[1];
    if(req.body.token && !token) token = req.body.token;

    // check for token
    if (!token){
         res.status(401).json({ status: 'error', error: "No token, authorization denied" });
    } else {
        try {
            //verify token
            const decoded = jwt.verify(token, process.env.TOKEN_SECRET);

            //check if user is an admin
            const user = await userModel.getUserById(decoded.id);
            if(!user.is_admin) throw error;

            //Add user from payload
            req.user = decoded;
            next();
        } catch (error) {
            if (errors.name === 'TokenExpiredError') {
                return res.status(409).json({
                  status: 'error',
                  error: 'Token Expired, please login',
                });
            }
            res.status(401).json({ status: 'error', error: "Invalid token, authorization denied for route" });
        }
    }

}

export default userRouteAuth;
