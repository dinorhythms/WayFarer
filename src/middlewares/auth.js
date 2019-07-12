import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import userModel from '../models/userModel';

dotenv.config()

function userRouteAuth(req, res, next) {
    const token = req.header('x-access-token');

    //check for token
    if (!token){
        res.status(401).json({ status: 'error', data: "No token, authorization denied" });
    } else {
        try {
            //verify token
            const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
            //Add user from payload
            req.user = decoded;
            next();
        } catch (error) {
            res.status(401).json({ status: 'error', data: "Invalid token, authorization denied" });
        }
    }
}

export async function adminRouteAuth(req, res, next) {

    const token = req.header('x-access-token');

    // check for token
    if (!token){
         res.status(401).json({ status: 'error', data: "No token, authorization denied" });
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
            res.status(401).json({ status: 'error', data: "Invalid token, authorization denied for route" });
        }
    }

}

export default userRouteAuth;