import dotenv from 'dotenv';
import tripModel from '../models/tripModel';
import bookingModel from '../models/bookingModel';
import userModel from '../models/userModel';

class bookingController {

    constructor(){
        dotenv.config();
    }

    static async createBooking(req,res){

        const { trip_id } = req.body;
        const { id } = req.user;

        if(!trip_id ){
            return res.status(400).json({status:'error', data: "All fields are required, pass a trip_id"})
        }

        //check if trip exists, capacity and active
        const trip = await tripModel.getTripById(trip_id)
        if(!trip) return res.status(400).json({status:'error', data: "Trip with id: "+trip_id+" does not exist"})
        if(trip.status === "cancelled") return res.status(400).json({status:'error', data: "Trip with id: "+trip_id+" is canceled"})
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

    static async getAllBookings(req,res){

        //check if user is_admin = true
        const user = await userModel.getUserById(req.user.id);

        let bookings = null;
        if(user.is_admin){
            bookings = await bookingModel.getAllBookings()
        } else {
            bookings = await bookingModel.getAllBookingsByUserId(req.user.id)
        }

        //check bookings
        if(bookings) {
            return res.status(200)
                .json({
                    status: 'success',
                    data: bookings
                })
        } else {
            return res.status(400).json({status:'error', data: "No booking made"})
        }

    }

    static async deleteBooking(req, res){
        const bookingId = parseInt(req.params.bookingId, 10);
        if(!bookingId ){
            return res.status(400).json({status:'error', data: "Please pass a bookingId"})
        }
        //check if booking owned by requested user exist
        const booking = await bookingModel.getBookingByBookingId(bookingId)

        if(!booking) return res.status(400).json({status:'error', data: "booking doesn't exist"})

        //compare req.user.id with booking user_id
        if(booking.user_id != req.user.id) return res.status(400).json({status:'error', data: "Access denied, you don't have access to this booking"})

        //delete booking as requested by user
        const delBooking = await bookingModel.deleteBookingById(bookingId)

        if(delBooking) {
            //minus from trip seat to give room to another booking
            const updatedTrip = await tripModel.updateTripSeatMinus(delBooking.trip_id)

            if(updatedTrip) return res.status(200).json({status:'success', data: { message: "Booking deleted successfully" }})

        } else {
            return res.status(400).json({status:'error', data: "Problem deleting booking, try again!"})
        }

    }

    static async changeSeat(req, res){

        const { booking_id } = req.body;

        if(!booking_id ){
            return res.status(400).json({status:'error', data: "booking_id is required"})
        }

        //check if booking exists and belong to user
        const booking = await bookingModel.getBookingByBookingId(booking_id)

        if(!booking) return res.status(400).json({status:'error', data: "booking doesn't exist"})

        //compare req.user.id with booking user_id
        if(booking.user_id != req.user.id) return res.status(400).json({status:'error', data: "Access denied, you don't have access to this booking"})

        //check if there is space in trip to replace
        const trip = await tripModel.getTripById(booking.trip_id)
        if(trip.capacity === trip.booked_seat) return res.status(400).json({status:'error', data: "Trip with id: "+trip_id+" has no seat available anymore"})

        //update trip seats
        const updatedTrip = await tripModel.updateTripSeat(booking.trip_id)

        if(updatedTrip){
            //update users booking seat
            const newSeat = updatedTrip.booked_seat;
            const updatedBooking = await bookingModel.updateBookingSeat(booking_id, newSeat)
            if(updatedBooking){
                return res.status(200).json({
                    status: "success",
                    data: {updatedBooking}
                })
            }
        }
    }

}

export default bookingController;