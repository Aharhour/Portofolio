import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
    user: { type: String, required: true, ref: 'User' },
    show: { type: String, required: true, ref: 'Show' },
    amount: { type: Number, required: true, min: 0 },
    bookSeats: [{ type: String, required: true }],
    isPaid: { type: Boolean, default: false },
    paymentLink: { type: String },
    stripeSessionId: { type: String },
}, { timestamps: true })

bookingSchema.index({ user: 1 });
bookingSchema.index({ show: 1 });
bookingSchema.index({ isPaid: 1 });

const Booking = mongoose.model("Booking", bookingSchema);

export default Booking;
