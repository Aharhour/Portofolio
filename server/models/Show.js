import mongoose from "mongoose";

// Show model: één voorstelling = één film op een specifiek tijdstip met eigen prijs en bezette stoelen.
const showSchema = new mongoose.Schema(
    {
        movie_id: { type: String, required: true, ref: "Movie" },  // Welke film draait er
        showDateTime: { type: Date, required: true },              // Datum + tijd van de voorstelling
        showPrice: { type: Number, required: true, min: 0 },       // Basisprijs per stoel (excl. zaal-toeslag)
        occupiedSeats: { type: Object, default: {} },              // Object: { "A1": userId, "B5": userId, ... }
    },
    // minimize:false zorgt dat een leeg occupiedSeats object {} bewaard blijft (niet wegoptimaliseerd wordt)
    { minimize: false }
)

// Indexen voor snelle queries
showSchema.index({ movie_id: 1 });    // Shows van één film opzoeken
showSchema.index({ showDateTime: -1 }); // Sorteren op datum (nieuwste eerst)

const Show = mongoose.model("Show", showSchema);

export default Show;
