import mongoose from "mongoose";

const noteSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: false,
    },
    tags: {
        type: Array,
        required: false,
        unique: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
    userId: { // to make the note belong to a single user
        type: String,
        typeof: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    isArchived: {
        type: Boolean,
        default: false
    },
    content: {
        type: String,
        required: true,
        unique: false,
        validate: {
            validator: function(v) {
                // Basic markdown validation
                return typeof v === 'string';
            },
            message: props => `${props.value} is not a valid markdown content`
        }
    }
})

const Note = mongoose.model("Note", noteSchema);

export default Note;