import { Pool, Client } from 'pg';
import dotenv from 'dotenv';

dotenv.config();
const pool = new Pool({ connectionString:process.env.DB_URL });

class tripModel {

    static async createBooking(bookingData){

        try {
            const { trip_id, user_id, seat_number } = bookingData;
            
            const query = `INSERT INTO bookings ( trip_id, user_id, seat_number) VALUES ($1, $2, $3) RETURNING id, trip_id, user_id, seat_number`;

            const result = await pool.query(query, [trip_id, user_id, seat_number])
            if(result.rowCount > 0){
                return result.rows[0]
            }
            return null;
        } catch (error) {
            throw error;
        }

    }

    static async getAllBookings(){

        try {
            const query = `SELECT * FROM bookings`;

            const result = await pool.query(query)
            if(result.rowCount > 0){
                return result.rows
            }
            return null;
        } catch (error) {
            throw error;
        }

    }

    static async getAllBookingsByUserId(user_id){

        try {
            const query = `SELECT * FROM bookings WHERE user_id='${user_id}'`;

            const result = await pool.query(query)
            if(result.rowCount > 0){
                return result.rows
            }
            return null;
        } catch (error) {
            throw error;
        }

    }

}

export default tripModel;