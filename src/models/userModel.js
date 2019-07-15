import { Pool, Client } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

let pool = new Pool({ connectionString:process.env.DB_URL });

if(process.env.NODE_ENV === 'test'){
    pool = new Pool({ connectionString:process.env.TEST_DB_URL });
}

class userModel {

    static async getUserByEmail(email){

        try {
            const query = `SELECT id, first_name, last_name, email, password, is_admin FROM users WHERE email = '${email}'`;
            const result = await pool.query(query)
            if(result.rowCount > 0){
                return result.rows[0]
            }
        } catch (error) {
            throw error;
        }
        
    }

    static async getUserById(userId){

        try {
            const query = `SELECT id, first_name, last_name, email, password, is_admin FROM users WHERE id = '${userId}'`;
            const result = await pool.query(query)
            if(result.rowCount > 0){
                return result.rows[0]
            }
        } catch (error) {
            throw error;
        }
        
    }

    static async signUp(userData){

        try {
            const { email, first_name, last_name, newPassword, is_admin=false } = userData;
            const query = `INSERT INTO users (email, first_name, last_name, password, is_admin ) VALUES ($1, $2, $3, $4, $5) RETURNING id, email, first_name, last_name, is_admin`;

            const result = await pool.query(query, [email, first_name, last_name, newPassword, is_admin])
            if(result.rowCount > 0){
                return result.rows[0]
            }
        } catch (error) {
            throw error;
        }

    }
}

export default userModel;