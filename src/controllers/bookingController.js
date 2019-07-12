import dotenv from 'dotenv';
import tripModel from '../models/tripModel';
import bookingModel from '../models/bookingModel';
import userModel from '../models/userModel';

class tripController {

    constructor(){
        dotenv.config();
    }

    static async createBooking(req,res){

        const { trip_id } = req.body;
        const { id } = req.user;

        //check if trip exists, capacity and active
        const trip = await tripModel.getTripById(trip_id)
        if(!trip) return res.status(400).json({status:'error', data: "Trip with id: "+trip_id+" does not exist"})
        if(trip.status === "canceled") return res.status(400).json({status:'error', data: "Trip with id: "+trip_id+" is canceled"})
        if(trip.capacity === trip.booked_seat) return res.status(400).json({status:'error', data: "Trip with id: "+trip_id+" has no seat available anymore"})

        const bookingData = {
            trip_id,
            user_id: id,
            seat_number: trip.booked_seat+1
        }

        const booking = await bookingModel.createBooking(bookingData)
        if(booking){

            //update trip seats
            const updatedTrip = await tripModel.updateTripSeat(trip_id)
            //get user by id
            const user = await userModel.getUserById(req.user.id);

            if(updatedTrip){
                return res.status(200)
                    .json({
                        status: 'success',
                        data: {
                            booking_id: booking.id,
                            user_id: booking.user_id,
                            trip_id: booking.trip_id,
                            bus_id: trip.bus_id,
                            trip_date: trip.trip_date,
                            origin: trip.origin,
                            destination: trip.destination,
                            seat_number: booking.seat_number,
                            first_name: user.first_name,
                            last_name: user.last_name,
                            email: user.email
                        }
                    })
            }
        }else{
            return  res.status(400).json({status:'error', data: "Something went wrong during process, please try again"})
        }

    }

}

export default tripController;