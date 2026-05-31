import mongoose from "mongoose";

// User model: spiegel van Clerk users in onze eigen DB (voor het admin dashboard en bookings populate).
// Wordt automatisch gesynchroniseerd via Clerk webhooks bij signup/update.
const userSchema = new mongoose.Schema({
    _id: { type: String, required: true },                  // Clerk userId als primary key
    name: { type: String, required: true },                 // Volledige naam
    email: { type: String, required: true, unique: true },  // Uniek e-mailadres
    image: { type: String, required: true }                 // Profielfoto URL
})

const User = mongoose.model('User', userSchema)

export default User;
