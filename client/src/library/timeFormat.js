// Converts a total number of minutes into a "Xh Ym" format (e.g. 102 -> "1h 42m")
const timeFormat = (minutes)=>{
    const hours = Math.floor(minutes / 60);        // Calculate the full hours
    const minutesRemainder = minutes % 60;          // Calculate the remaining minutes
    return `${hours}h ${minutesRemainder}m`
}

export default timeFormat;
