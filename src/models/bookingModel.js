import { Pool, Client } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

let pool = new Pool({ connectionString:process.env.DB_URL });

if(process.env.NODE_ENV === 'test'){
    pool = new Pool({ connectionString:process.env.TEST_DB_URL });
}

class bookingModel {

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
            const query = `SELECT 
            bookings.id AS booking_id,bookings.user_id, bookings.seat_number, bookings.trip_id, 
            trips.bus_id, trips.origin, trips.destination, trips.trip_date, trips.status,
            users.first_name, users.last_name, users.email
            FROM bookings JOIN trips ON (bookings.trip_id = trips.id) JOIN users ON (bookings.user_id = users.id)`;

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
            const query = `SELECT 
            bookings.id AS booking_id,bookings.user_id, bookings.seat_number, bookings.trip_id, 
            trips.bus_id, trips.origin, trips.destination, trips.trip_date, trips.status,
            users.first_name, users.last_name, users.email
            FROM bookings JOIN trips ON (bookings.trip_id = trips.id) JOIN users ON (bookings.user_id = users.id) WHERE user_id='${user_id}'`;

            const result = await pool.query(query)
            if(result.rowCount > 0){
                return result.rows
            }
            return null;
        } catch (error) {
            throw error;
        }

    }

    static async getBookingByBookingId(bookingId){

        try {
            const query = `SELECT * FROM bookings WHERE id='${bookingId}'`;

            const result = await pool.query(query)
            if(result.rowCount > 0){
                return result.rows[0]
            }
            return null;
        } catch (error) {
            throw error;
        }

    }

    static async deleteBookingById(bookingId){

        try {
            const query = `DELETE FROM bookings WHERE id='${bookingId}' RETURNING *`;

            const result = await pool.query(query)
            if(result.rowCount > 0){
                return result.rows[0]
            }
            return null;
        } catch (error) {
            throw error;
        }

    }

    static async updateBookingSeat(booking_id, newSeat){

        try {
            const query = `UPDATE bookings SET seat_number='${newSeat}' WHERE id = '${booking_id}' RETURNING *`;
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

export default bookingModel;