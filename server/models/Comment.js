import mongoose from "mongoose";

// Comment model: één reactie van een gebruiker op een specifieke film.
// We bewaren wie de reactie schreef (userId + naam) en bij welke film hij hoort.
const commentSchema = new mongoose.Schema({
    movieId: { type: String, required: true },   // Bij welke film hoort de reactie
    userId: { type: String, required: true },    // Clerk userId van de schrijver
    userName: { type: String, required: true },  // Naam zoals getoond onder de reactie
    text: { type: String, required: true, maxlength: 500 }, // De reactietekst (max 500 tekens)
}, { timestamps: true }) // createdAt en updatedAt automatisch toevoegen

// Index op movieId zodat alle reacties van één film snel opgehaald kunnen worden
commentSchema.index({ movieId: 1 })

const Comment = mongoose.model("Comment", commentSchema);

export default Comment;
