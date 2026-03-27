// Formats a date into a readable string like "Thu, March 27, 2:30 PM"
export const dateFormat = (date) => {
    return new Date(date).toLocaleString('en-US', {
        weekday: 'short',   // Short day name (e.g. "Thu")
        month: 'long',      // Full month name (e.g. "March")
        day: 'numeric',     // Day of the month (e.g. "27")
        hour: 'numeric',    // Hour (e.g. "2")
        minute: 'numeric'   // Minute (e.g. "30")
    })
}
