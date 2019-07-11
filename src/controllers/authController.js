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

}

export default authController;