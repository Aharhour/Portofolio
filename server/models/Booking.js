import mongoose from "mongoose";

// Booking model: één boeking koppelt een user aan een show + gekozen stoelen + betaalstatus.
const bookingSchema = new mongoose.Schema({
    user: { type: String, required: true, ref: 'User' },           // Clerk userId van de boeker
    show: { type: String, required: true, ref: 'Show' },           // Welke voorstelling is geboekt
    amount: { type: Number, required: true, min: 0 },              // Totaalbedrag in euro's
    bookSeats: [{ type: String, required: true }],                 // Lijst met stoel-codes ("A1", "B5", ...)
    theater: { type: String, enum: ["zaal-1", "zaal-2", "zaal-3"], default: "zaal-1" }, // In welke zaal
    isPaid: { type: Boolean, default: false },                     // Betaald of nog open
    paymentLink: { type: String },                                  // Stripe checkout URL (leeg na betaling)
    stripeSessionId: { type: String },                              // Voor verificatie bij Stripe achteraf
}, { timestamps: true }) // Voegt automatisch createdAt en updatedAt velden toe

// Indexen voor snellere queries op vaak gebruikte velden
bookingSchema.index({ user: 1 });   // "Mijn boekingen" pagina filtert op user
bookingSchema.index({ show: 1 });   // Bezette stoelen ophalen filtert op show
bookingSchema.index({ isPaid: 1 }); // Dashboard filtert op betaalstatus

const Booking = mongoose.model("Booking", bookingSchema);

export default Booking;
