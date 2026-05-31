// Zet minuten om naar "Xh Ym" formaat (bijv. 102 -> "1h 42m")
const timeFormat = (minutes)=>{
    const hours = Math.floor(minutes / 60);
    const minutesRemainder = minutes % 60;
    return `${hours}h ${minutesRemainder}m`
}

export default timeFormat;
