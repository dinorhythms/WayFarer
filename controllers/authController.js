import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

import userModel from '../models/userModel';

class authController {

    constructor(){
        dotenv.config();
    }

    static async signUp(req,res){
        const { email, first_name, last_name, password } = req.body;
        if(!email || !first_name || !last_name || !password ){
            return res.status(400).json({status:'error', data: "All fields are required"})
        }

        //check if user exists
        const user = await userModel.getUserByEmail(email);
        if(user) return res.status(400).json({status:'error', data: "User exist already"})
        
        // hash password before registration
        bcrypt.genSalt(10, async (err, salt)=>{
            await bcrypt.hash(password, salt, async (err,hash)=>{
                if(err) throw err;
                const newPassword = hash
                
                //register user
                const newUser = await userModel.signUp({email, first_name, last_name, newPassword});
                // create Token
                jwt.sign(
                    { id: newUser.id },
                    process.env.TOKEN_SECRET,
                    { expiresIn: 3600 },
                    (err, token) => {
                        if(err) throw err;
                        res.status(200).json({
                            status: 'success',
                            data: {
                                user_id: newUser.id,
                                is_admin: newUser.is_admin,
                                token: token,
                                email: newUser.email,
                                first_name: newUser.first_name,
                                last_name: newUser.last_name
                            }
                        })
                    }
                )
            })
        })

    }

    static async signIn(req,res){
        const { email, password } = req.body;
        if(!email || !password ){
            return res.status(400).json({status:'error', data: "All fields are required"})
        }

        //check if user exists
        const user = await userModel.getUserByEmail(email);
        if(!user) return res.status(400).json({status:'error', data: "User does not exist"})
        
        //validate the password
        bcrypt.compare(password, user.password)
            .then(isMatch => {
                if(!isMatch) return res.status(400).json({status:'error', data: "Invalid Credentials"})
                
                jwt.sign(
                    { id: user.id },
                    process.env.TOKEN_SECRET,
                    { expiresIn: 3600 },
                    (err, token) => {
                        if(err) throw err;
                        res.status(200).json({
                            status: 'success',
                            data: {
                                user_id: user.id,
                                is_admin: user.is_admin,
                                token: token,
                                email: user.email,
                                first_name: user.first_name,
                                last_name: user.last_name
                            }
                        })
                    }
                )

            })

    }

    static async user(req,res){
        const userId = req.user.id;

        //check get user by id
        const user = await userModel.getUserById(userId);
        if(user) return res.status(200).json({status:'success', data: {
            id: user.id,
            email: user.email,
            first_name: user.first_name,
            last_name: user.last_name,
            is_admin: user.is_admin
        }})
    }
}

export default authController;