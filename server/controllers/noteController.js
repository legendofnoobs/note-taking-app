import Note from "../database/models/noteModel.js";

// @desc    Create a new note
export const createNote = async (req, res) => {
    try {
        const { title, content, tags } = req.body;
        const newNote = new Note({
            title,
            content,
            tags,
            userId: req.user.id
        });
        const savedNote = await newNote.save();
        res.status(201).json(savedNote);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all notes for a user
export const getNotes = async (req, res) => {
    try {
        const notes = await Note.find({ userId: req.user.id });
        res.status(200).json(notes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get a single note
export const getNote = async (req, res) => {
    try {
        const note = await Note.findOne({
            _id: req.params.id,
            userId: req.user.id
        });
        if (!note) return res.status(404).json({ message: "Note not found" });
        res.status(200).json(note);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update a note
export const updateNote = async (req, res) => {
    try {
        const { title, content, tags } = req.body;
        const updatedNote = await Note.findOneAndUpdate(
            { _id: req.params.id, userId: req.user.id },
            { title, content, tags, updatedAt: Date.now() },
            { new: true }
        );
        if (!updatedNote) return res.status(404).json({ message: "Note not found" });
        res.status(200).json(updatedNote);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete a note
export const deleteNote = async (req, res) => {
    try {
        const deletedNote = await Note.findOneAndDelete({
            _id: req.params.id,
            userId: req.user.id
        });
        if (!deletedNote) return res.status(404).json({ message: "Note not found" });
        res.status(200).json({ message: "Note deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const searchNotes = async (req, res) => {
    try {
        const { title, tag } = req.query;
        const query = { userId: req.user.id };

        if (title) {
            query.title = { $regex: title, $options: 'i' };
        }

        if (tag) {
            query.tags = { $in: [tag] };
        }

        const notes = await Note.find(query);
        res.status(200).json(notes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc Get note statistics
export const getNoteStats = async (req, res) => {
    try {
        const totalNotes = await Note.countDocuments({ userId: req.user.id });
        const tags = await Note.aggregate([
            { $match: { userId: req.user.id } },
            { $unwind: "$tags" },
            { $group: { _id: "$tags", count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ]);

        res.status(200).json({
            totalNotes,
            tags
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Archive a note
export const archiveNote = async (req, res) => {
    try {
        const note = await Note.findOneAndUpdate(
            { _id: req.params.id, userId: req.user.id },
            { isArchived: true },
            { new: true }
        );
        if (!note) return res.status(404).json({ message: "Note not found" });
        res.status(200).json(note);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Unarchive a note
export const unarchiveNote = async (req, res) => {
    try {
        const note = await Note.findOneAndUpdate(
            { _id: req.params.id, userId: req.user.id },
            { isArchived: false },
            { new: true }
        );
        if (!note) return res.status(404).json({ message: "Note not found" });
        res.status(200).json(note);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get archived notes
export const getArchivedNotes = async (req, res) => {
    try {
        const notes = await Note.find({
            userId: req.user.id,
            isArchived: true
        });
        res.status(200).json(notes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Auto-save a note
export const autoSaveNote = async (req, res) => {
    try {
        const { title, content, tags } = req.body;
        const updatedNote = await Note.findOneAndUpdate(
            { _id: req.params.id, userId: req.user.id },
            { title, content, tags, updatedAt: Date.now() },
            { new: true }
        );
        if (!updatedNote) return res.status(404).json({ message: "Note not found" });
        res.status(200).json(updatedNote);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};