import dotenv from 'dotenv';
import tripModel from '../models/tripModel';
import busModel from '../models/busModel';

class tripController {

    constructor(){
        dotenv.config();
    }

    static async createTrip(req,res){
        const { token, bus_id, origin, destination, trip_date, fare } = req.body;

        // return res.status(200).json({data: req.body})

        if(!bus_id || !origin || !destination || !trip_date || !fare ){
            return res.status(400).json({status:'error', error: "All fields are required"})
        }

        //check if bus_id is valid and available
        const bus = await busModel.getBusById(bus_id);
        //check if bus id exist
        if(!bus) return res.status(400).json({status:'error', error: "The select bus_id: "+bus_id+" does not exist"})
        //check if bus is available
        if(bus.available !== 1) return res.status(400).json({status:'error', error: "The select bus "+bus.number_plate+" is not available for trip selection"})
        //create trip
        const tripData = {bus_id, origin, destination, trip_date, fare, capacity: bus.capacity, status: 'active' }
        const trip = await tripModel.createTrip(tripData)
        //update bus as not available again until after trip
        //const tripBus = await busModel.updateBusAvailability(bus_id)
        //check trip
        if(trip) {
        return res.status(200)
            .json({
                status: 'success',
                data: {
                    id:trip.id,
                    trip_id: trip.id,
                    bus_id: trip.bus_id,
                    origin: trip.origin,
                    destination: trip.destination,
                    trip_date: trip.trip_date,
                    fare: trip.fare,
                    capacity: trip.capacity
                }
            })
        }

    }

    static async getTrips(req,res){

        const trips = await tripModel.getAllTrips()
        //check trip
        if(trips) {
            return res.status(200)
                .json({
                    status: 'success',
                    data: trips
                })
        } else {
            return res.status(400).json({status:'error', error: "No trip available currently"})
        }

    }

    static async cancelTrip(req,res){

        const tripId = parseInt(req.params.tripId, 10);

        if(!tripId ){
            return res.status(400).json({status:'error', error: "Please pass a tripId"})
        }

        //get trip by id to check existence
        const trip = await tripModel.getTripById(tripId)
        if(!trip) return res.status(400).json({status:'error', error: "trip with Id: "+tripId+" cannot be found!"})

        //update trip status to cancelled
        const updatedTrip = await tripModel.updateTripStatus(tripId)

        if(!updatedTrip) return res.status(400).json({status:'error', error: "trip with Id: "+tripId+" could not be updated, please try again!"})

        return res.status(200).json({status:'success', data: {message : "Trip cancelled successfully"}})

    }

    static async filterTripsByDestination(req,res){

        const destination = req.params.destination;

        const trips = await tripModel.getTripsByDestination(destination)
        //check trip
        if(trips) {
            return res.status(200)
                .json({
                    status: 'success',
                    data: trips
                })
        } else {
            return res.status(400).json({status:'error', error: `No trip with destination ${destination} available currently`})
        }

    }

    static async filterTripsByOrigin(req,res){

        const origin = req.params.origin;

        const trips = await tripModel.getTripsByOrigin(origin)
        //check trip
        if(trips) {
            return res.status(200)
                .json({
                    status: 'success',
                    data: trips
                })
        } else {
            return res.status(400).json({status:'error', error: `No trip with origin ${origin} available currently`})
        }

    }

}

export default tripController;
