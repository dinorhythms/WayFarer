import { Pool, Client } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

let pool = new Pool({ connectionString:process.env.DB_URL });

if(process.env.NODE_ENV === 'test'){
    pool = new Pool({ connectionString:process.env.TEST_DB_URL });
}

class tripModel {

    static async createTrip(tripData){

        try {
            const { bus_id, origin, destination, trip_date, fare, capacity, status } = tripData;
            
            const query = `INSERT INTO trips ( bus_id, origin, destination, trip_date, fare, capacity, status ) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id, bus_id, origin, destination, trip_date, capacity, fare`;

            const result = await pool.query(query, [bus_id, origin, destination, trip_date, fare, capacity, status])
            if(result.rowCount > 0){
                return result.rows[0]
            }
            return null;
        } catch (error) {
            throw error;
        }

    }

    static async getAllTrips(){

        try {
            const query = `SELECT * FROM trips`;

            const result = await pool.query(query)
            if(result.rowCount > 0){
                return result.rows
            }
            return null;
        } catch (error) {
            throw error;
        }

    }

    static async getTripById(trip_id){

        try {
            const query = `SELECT * FROM trips WHERE id='${trip_id}'`;

            const result = await pool.query(query)
            if(result.rowCount > 0){
                return result.rows[0]
            }
            return null;
        } catch (error) {
            throw error;
        }

    }

    static async updateTripSeat(trip_id){

        try {
            const query = `UPDATE trips SET booked_seat=booked_seat+1 WHERE id = '${trip_id}' RETURNING *`;
            const result = await pool.query(query)
            if(result.rowCount > 0){
                return result.rows[0]
            }
            return null
        } catch (error) {
            throw error;
        }
        
    }

    static async updateTripSeatMinus(trip_id){

        try {
            const query = `UPDATE trips SET booked_seat=booked_seat-1 WHERE id = '${trip_id}' RETURNING *`;
            const result = await pool.query(query)
            if(result.rowCount > 0){
                return result.rows[0]
            }
            return null
        } catch (error) {
            throw error;
        }
        
    }

    static async updateTripStatus(tripId){

        try {
            const query = `UPDATE trips SET status='cancelled' WHERE id = '${tripId}' RETURNING *`;
            const result = await pool.query(query)
            if(result.rowCount > 0){
                return result.rows[0]
            }
            return null
        } catch (error) {
            throw error;
        }
        
    }

    static async getTripsByDestination(destination){

        try {
            const query = `SELECT * FROM trips WHERE destination ILIKE '%${destination}%'`;

            const result = await pool.query(query)
            if(result.rowCount > 0){
                return result.rows[0]
            }
            return null;
        } catch (error) {
            throw error;
        }

    }

    static async getTripsByOrigin(origin){

        try {
            const query = `SELECT * FROM trips WHERE origin ILIKE '%${origin}%'`;

            const result = await pool.query(query)
            if(result.rowCount > 0){
                return result.rows[0]
            }
            return null;
        } catch (error) {
            throw error;
        }

    }

}

export default tripModel;