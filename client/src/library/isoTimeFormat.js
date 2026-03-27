// Converts an ISO date-time string into a local time format like "02:30 PM"
const isoTimeFormat = (dateTime) => {
    const date = new Date(dateTime);               // Create a Date object from the ISO string
    const localTime = date.toLocaleTimeString('en-US', {
        hour: '2-digit',    // Two-digit hour (e.g. "02")
        minute: '2-digit',  // Two-digit minute (e.g. "30")
        hour12: true,       // Use 12-hour format with AM/PM
    });
    return localTime;
}

export default isoTimeFormat
