import { Inngest } from "inngest";
import User from "../models/User.js";
import Booking from "../models/Booking.js";
import Show from "../models/Show.js";
import sendEmail from "../configs/nodeMailer.js";

export const inngest = new Inngest({ id: "movie-ticket-booking" });

// --- Clerk user sync functions ---

// Save new Clerk user to MongoDB
const syncUserCreation = inngest.createFunction(
    { id: 'sync-user-from-clerk', triggers: [{ event: 'clerk/user.created' }] },
    async ({ event }) => {
        const { id, first_name, last_name, email_addresses, image_url } = event.data
        await User.create({
            _id: id,
            email: email_addresses[0].email_address,
            name: first_name + ' ' + last_name,
            image: image_url
        })
    }
)

// Remove deleted Clerk user from MongoDB
const syncUserDeletion = inngest.createFunction(
    { id: 'delete-user-from-clerk', triggers: [{ event: 'clerk/user.deleted' }] },
    async ({ event }) => {
        await User.findByIdAndDelete(event.data.id)
    }
)

// Update Clerk user data in MongoDB
const syncUserUpdation = inngest.createFunction(
    { id: 'update-user-from-clerk', triggers: [{ event: 'clerk/user.updated' }] },
    async ({ event }) => {
        const { id, first_name, last_name, email_addresses, image_url } = event.data
        await User.findByIdAndUpdate(id, {
            email: email_addresses[0].email_address,
            name: first_name + ' ' + last_name,
            image: image_url
        })
    }
)

// --- Booking management functions ---

// Wait 10 minutes, then release seats and delete booking if still unpaid
const releaseSeatsAndDeleteBooking = inngest.createFunction(
    { id: 'release-seats-delete-booking', triggers: [{ event: 'app/checkpayment' }] },
    async ({ event, step }) => {
        const tenMinutesLater = new Date(Date.now() + 10 * 60 * 1000);
        await step.sleepUntil('wait-for-10minutes', tenMinutesLater);

        await step.run("check-payment-status", async () => {
            const bookingId = event.data.bookingId;
            const booking = await Booking.findById(bookingId);

            if (!booking || booking.isPaid) return;

            // Release the occupied seats
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

// --- Email notification functions ---

// Send booking confirmation email after successful payment
const sendBookingConfirmationEmail = inngest.createFunction(
    { id: 'send-booking-confirmation-email', triggers: [{ event: 'app/show.booked' }] },
    async ({ event }) => {
        const { bookingId } = event.data;

        const booking = await Booking.findById(bookingId).populate({
            path: 'show',
            populate: { path: "movie_id" }
        }).populate('user');

        const showDate = new Date(booking.show.showDateTime).toLocaleDateString('nl-NL', {
            timeZone: 'Europe/Amsterdam', weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
        })
        const showTime = new Date(booking.show.showDateTime).toLocaleTimeString('nl-NL', {
            timeZone: 'Europe/Amsterdam', hour: '2-digit', minute: '2-digit'
        })

        const seatList = booking.bookSeats.join(', ');
        const seatCount = booking.bookSeats.length;
        const totalAmount = booking.amount.toFixed(2);

        await sendEmail({
            to: booking.user.email,
            subject: `Bevestiging: Je tickets voor "${booking.show.movie_id.title}"`,
            body: `
            <div style="margin:0;padding:0;background-color:#f4f4f5;font-family:'Helvetica Neue',Arial,sans-serif;">
                <div style="max-width:600px;margin:0 auto;padding:32px 16px;">

                    <!-- Header -->
                    <div style="background:linear-gradient(135deg,#1a1a2e 0%,#16213e 100%);border-radius:16px 16px 0 0;padding:32px;text-align:center;">
                        <h1 style="color:#F84565;margin:0;font-size:28px;letter-spacing:1px;">BetaTicket</h1>
                        <p style="color:#a0a0b0;margin:8px 0 0;font-size:14px;">Jouw ticket is bevestigd!</p>
                    </div>

                    <!-- Body -->
                    <div style="background:#ffffff;padding:32px;border-radius:0 0 16px 16px;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
                        <p style="font-size:16px;color:#333;">Hoi <strong>${booking.user.name}</strong>,</p>
                        <p style="font-size:15px;color:#555;line-height:1.6;">
                            Bedankt voor je aankoop! Je boeking voor
                            <strong style="color:#F84565;">${booking.show.movie_id.title}</strong>
                            is succesvol bevestigd.
                        </p>

                        <!-- Ticket Card -->
                        <div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:12px;padding:24px;margin:24px 0;">
                            <table style="width:100%;border-collapse:collapse;">
                                <tr>
                                    <td style="padding:8px 0;color:#888;font-size:13px;text-transform:uppercase;letter-spacing:0.5px;">Film</td>
                                    <td style="padding:8px 0;color:#1a1a2e;font-size:15px;font-weight:600;text-align:right;">${booking.show.movie_id.title}</td>
                                </tr>
                                <tr>
                                    <td style="padding:8px 0;border-top:1px dashed #e5e7eb;color:#888;font-size:13px;text-transform:uppercase;letter-spacing:0.5px;">Datum</td>
                                    <td style="padding:8px 0;border-top:1px dashed #e5e7eb;color:#1a1a2e;font-size:15px;font-weight:600;text-align:right;">${showDate}</td>
                                </tr>
                                <tr>
                                    <td style="padding:8px 0;border-top:1px dashed #e5e7eb;color:#888;font-size:13px;text-transform:uppercase;letter-spacing:0.5px;">Tijd</td>
                                    <td style="padding:8px 0;border-top:1px dashed #e5e7eb;color:#1a1a2e;font-size:15px;font-weight:600;text-align:right;">${showTime}</td>
                                </tr>
                                <tr>
                                    <td style="padding:8px 0;border-top:1px dashed #e5e7eb;color:#888;font-size:13px;text-transform:uppercase;letter-spacing:0.5px;">Stoelen (${seatCount}x)</td>
                                    <td style="padding:8px 0;border-top:1px dashed #e5e7eb;color:#1a1a2e;font-size:15px;font-weight:600;text-align:right;">${seatList}</td>
                                </tr>
                                <tr>
                                    <td style="padding:12px 0;border-top:2px solid #e5e7eb;color:#888;font-size:13px;text-transform:uppercase;letter-spacing:0.5px;">Totaal betaald</td>
                                    <td style="padding:12px 0;border-top:2px solid #e5e7eb;color:#F84565;font-size:20px;font-weight:700;text-align:right;">&euro;${totalAmount}</td>
                                </tr>
                            </table>
                        </div>

                        <p style="font-size:14px;color:#888;line-height:1.6;text-align:center;">
                            Bewaar deze e-mail als bewijs van je aankoop.<br/>
                            Veel plezier met de film!
                        </p>
                    </div>

                    <!-- Footer -->
                    <div style="text-align:center;padding:24px 0 0;">
                        <p style="color:#aaa;font-size:12px;margin:0;">&copy; ${new Date().getFullYear()} BetaTicket. Alle rechten voorbehouden.</p>
                    </div>

                </div>
            </div>`
        })
    }
)

// Cron job: send reminders for shows starting within the next 8 hours
const sendShowReminders = inngest.createFunction(
    { id: "send-show-reminders", triggers: [{ cron: "0 */8 * * *" }] },
    async ({ step }) => {
        const now = new Date();
        const in8Hours = new Date(now.getTime() + 8 * 60 * 60 * 1000);
        const windowStart = new Date(in8Hours.getTime() - 10 * 60 * 1000);

        // Find shows starting soon and collect user emails
        const reminderTasks = await step.run("prepare-reminder-tasks", async () => {
            const shows = await Show.find({
                showDateTime: { $gte: windowStart, $lte: in8Hours },
            }).populate('movie_id');

            const tasks = [];

            for (const show of shows) {
                if (!show.movie_id || !show.occupiedSeats) continue;

                const userIds = [...new Set(Object.values(show.occupiedSeats))];
                if (userIds.length === 0) continue;

                const users = await User.find({ _id: { $in: userIds } }).select("name email");

                for (const user of users) {
                    tasks.push({
                        userEmail: user.email,
                        userName: user.name,
                        movieTitle: show.movie_id.title,
                        showDateTime: show.showDateTime,
                    })
                }
            }
            return tasks;
        })

        if (reminderTasks.length === 0) {
            return { sent: 0, message: "No reminders to send" }
        }

        // Send all reminder emails
        const results = await step.run('send-all-reminders', async () => {
            return await Promise.allSettled(
                reminderTasks.map(task => {
                    const showDate = new Date(task.showDateTime).toLocaleDateString('en-US', { timeZone: 'Europe/Amsterdam' })
                    const showTime = new Date(task.showDateTime).toLocaleTimeString('en-US', { timeZone: 'Europe/Amsterdam' })

                    return sendEmail({
                        to: task.userEmail,
                        subject: `Reminder: Your movie "${task.movieTitle}" starts soon!`,
                        body: `<div style="font-family: Arial, sans-serif; padding:20px">
                                    <h2>Hello ${task.userName},</h2>
                                    <p>This is a quick reminder that your movie:</p>
                                    <h3 style="color: #F84565;">"${task.movieTitle}"</h3>
                                    <p>
                                        is scheduled for <strong>${showDate}</strong> at
                                        <strong>${showTime}</strong>
                                    </p>
                                    <p>It starts in approximately <strong>8 hours</strong> - make sure you're ready!</p>
                                    <br/>
                                    <p>Enjoy the show!<br/>BetaTicket Team</p>
                                </div>`
                    })
                })
            )
        })

        const sent = results.filter(r => r.status === "fulfilled").length;
        const failed = results.length - sent;

        return { sent, failed, message: `Sent ${sent} reminder(s), ${failed} failed.` }
    }
)

// Notify all users when a new show is added
const sendNewShowNotifications = inngest.createFunction(
    { id: "send-new-show-notifications", triggers: [{ event: "app/show.added" }] },
    async ({ event }) => {
        const { movieTitle } = event.data;
        const users = await User.find({})

        for (const user of users) {
            await sendEmail({
                to: user.email,
                subject: `New Show Added: ${movieTitle}`,
                body: `<div style="font-family: Arial, sans-serif; padding: 20px;">
                            <h2>Hi ${user.name},</h2>
                            <p>We've just added a new show to our library:</p>
                            <h3 style="color: #F84565;">"${movieTitle}"</h3>
                            <p>Visit our website to book your tickets!</p>
                            <br/>
                            <p>Thanks,<br/>BetaTicket Team</p>
                        </div>`
            })
        }

        return { message: "Notifications sent." }
    }
)

export const functions = [
    syncUserCreation,
    syncUserDeletion,
    syncUserUpdation,
    releaseSeatsAndDeleteBooking,
    sendBookingConfirmationEmail,
    sendShowReminders,
    sendNewShowNotifications
];
