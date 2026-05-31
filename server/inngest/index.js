import { Inngest } from "inngest";
import User from "../models/User.js";
import Booking from "../models/Booking.js";
import Show from "../models/Show.js";

export const inngest = new Inngest({ id: "movie-ticket-booking" });

// --- Clerk-gebruiker synchronisatiefuncties ---

// Nieuwe Clerk-gebruiker opslaan in MongoDB
const syncUserCreation = inngest.createFunction(
    { id: 'sync-user-from-clerk', triggers: [{ event: 'clerk/user.created' }] },
    async ({ event }) => {
        const { id, first_name, last_name, email_addresses, image_url } = event.data
        const email = email_addresses?.[0]?.email_address;
        if (!id || !email) return;

        await User.create({
            _id: id,
            email,
            name: `${first_name || ''} ${last_name || ''}`.trim(),
            image: image_url || ''
        })
    }
)

// Verwijderde Clerk-gebruiker uit MongoDB verwijderen
const syncUserDeletion = inngest.createFunction(
    { id: 'delete-user-from-clerk', triggers: [{ event: 'clerk/user.deleted' }] },
    async ({ event }) => {
        await User.findByIdAndDelete(event.data.id)
    }
)

// Clerk-gebruikersgegevens bijwerken in MongoDB
const syncUserUpdation = inngest.createFunction(
    { id: 'update-user-from-clerk', triggers: [{ event: 'clerk/user.updated' }] },
    async ({ event }) => {
        const { id, first_name, last_name, email_addresses, image_url } = event.data
        const email = email_addresses?.[0]?.email_address;
        if (!id) return;

        await User.findByIdAndUpdate(id, {
            ...(email && { email }),
            name: `${first_name || ''} ${last_name || ''}`.trim(),
            image: image_url || ''
        })
    }
)

// --- Boekingsbeheer functies ---

// Wacht 10 minuten, geef daarna de stoelen vrij en verwijder de boeking als deze nog steeds onbetaald is
const releaseSeatsAndDeleteBooking = inngest.createFunction(
    { id: 'release-seats-delete-booking', triggers: [{ event: 'app/checkpayment' }] },
    async ({ event, step }) => {
        const tenMinutesLater = new Date(Date.now() + 10 * 60 * 1000);
        await step.sleepUntil('wait-for-10minutes', tenMinutesLater);

        await step.run("check-payment-status", async () => {
            const bookingId = event.data.bookingId;
            const booking = await Booking.findById(bookingId);

            if (!booking || booking.isPaid) return;

            // Bezette stoelen vrijgeven
            const show = await Show.findById(booking.show);
            booking.bookSeats.forEach((seat) => {
                delete show.occupiedSeats[seat]
            });
            show.markModified('occupiedSeats')
            await show.save()
            await Booking.findByIdAndDelete(booking._id)
        })
    }
)

export const functions = [
    syncUserCreation,
    syncUserDeletion,
    syncUserUpdation,
    releaseSeatsAndDeleteBooking,
];
