import mongoose from "mongoose";

const showSchema = new mongoose.Schema(
    {
        movie_id: { type: String, required: true, ref: "Movie" },
        showDateTime: { type: Date, required: true },
        showPrice: { type: Number, required: true, min: 0 },
        occupiedSeats: { type: Object, default: {} },
    }, { minimize: false }
)

showSchema.index({ movie_id: 1 });
showSchema.index({ showDateTime: -1 });

const Show = mongoose.model("Show", showSchema);

export default Show;
