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
            return res.status(400).json({status:'error', data: "All fields are required"})
        }

        //check if bus_id is valid and available
        const bus = await busModel.getBusById(bus_id);
        //check if bus id exist
        if(!bus) return res.status(400).json({status:'error', data: "The select bus_id: "+bus_id+" does not exist"})
        //check if bus is available
        if(bus.available !== 1) return res.status(400).json({status:'error', data: "The select bus "+bus.number_plate+" is not available for trip selection"})
        //create trip
        const tripData = {bus_id, origin, destination, trip_date, fare, capacity: bus.capacity, status: 'active' }
        const trip = await tripModel.createTrip(tripData)
        //update bus as not available again until after trip
        const tripBus = await busModel.updateBusAvailability(bus_id)
        //check trip
        if(trip && tripBus) {
        return res.status(200)
            .json({
                status: 'success',
                data: {
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

}

export default tripController;