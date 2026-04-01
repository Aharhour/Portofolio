import Show from "../models/Show.js";
import Booking from "../models/Booking.js";

// Function to check availability of selected seats for a movie 
const checkSeatAvailability = async (showId, selectedSeats) => { 
    try {
        const showData = await Show.findById(showId)
        if (!showData) return false;

        const occupiedSeats = showData.occupiedSeats;

        const isAnySeatTaken = selectedSeats.some(seat => occupiedSeats[seat]);

        return !isAnySeatTaken;
    } catch (error) {
        console.error(error.message);
        throw false;
    }
 }

 export const createBooking = async (req, res) => { 
    try {
        const {userId} = req.auth();
        const {showId, selectedSeats} = req.body;
        const { origin } = req.headers;

        // Check if the seat is available for the selected show 
        const isAvailable = await checkSeatAvailability(showId, selectedSeats);

        if (!isAvailable) { 
            return res.json({success: false, message: "Selected seats are already occupied. Please choose different seats."})
         }

         // Get the show details 
         const showData = await Show.findById(showId).populate('movie_id');

         // Create a new booking 
         const booking = await Booking.create({
            user: userId,
            show: showId,
            amount: showData.showPrice * selectedSeats.length,
            bookSeats: selectedSeats
         })

         selectedSeats.map((seat) => {
             showData.occupiedSeats[seat] = userId;
         })

         showData.markModified('occupiedSeats');
    
        await showData.save();

        // Stripe Gateway Initialize
        res.json({success: true, message: 'Booking created successfully'})

    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message });
    }
  }

  export const getUserBookings = async (req, res) => {
    try {
        const {showId} = req.params;
        const showData = await Show.findById(showId)

        const occupiedSeats = Object.keys(showData.occupiedSeats)

        res.json({success: true, occupiedSeats})
        
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message });
    }
  }