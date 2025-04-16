import express from "express";
import {
    createNote,
    getNotes,
    getNote,
    updateNote,
    deleteNote,
    searchNotes,
    getNoteStats,
    archiveNote,
    getArchivedNotes,
    unarchiveNote,
    autoSaveNote,
} from "../controllers/noteController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect); // 👈 This protects all note routes

router.post("/", createNote);
router.get("/", getNotes);
router.get("/:id", getNote);
router.put("/:id", updateNote);
router.delete("/:id", deleteNote);
router.get("/search", searchNotes);
router.get("/stats", getNoteStats);
router.patch('/:id/archive', archiveNote);
router.patch('/:id/unarchive', unarchiveNote);
router.get('/archived', getArchivedNotes);
router.put('/:id/autosave', autoSaveNote);

export default router;