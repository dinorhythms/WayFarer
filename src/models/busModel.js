import { Pool, Client } from 'pg';
import dotenv from 'dotenv';

dotenv.config();
const pool = new Pool({ connectionString:process.env.DB_URL });

class busModel {

    static async getBusById(bus_id){

        try {
            const query = `SELECT * FROM buses WHERE id = '${bus_id}'`;
            const result = await pool.query(query)
            if(result.rowCount > 0){
                return result.rows[0]
            }
            return null
        } catch (error) {
            throw error;
        }
        
    }

    static async updateBusAvailability(bus_id){

        try {
            const query = `UPDATE buses SET available=0 WHERE id = '${bus_id}'`;
            const result = await pool.query(query)
            if(result.rowCount > 0){
                return result.rows[0]
            }
            return null
        } catch (error) {
            throw error;
        }
        
    }

}

export default busModel;