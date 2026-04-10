// Converts large numbers to compact format (e.g. 15000 -> "15.0k")
export const kConverter = (num) => {
    if (num >= 1000) {
        return (num / 1000).toFixed(1) + "k"
    }
    return num
}