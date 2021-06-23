import express from "express";
import bodyParser from "body-parser";
import notesRoutes from "./routes/notes.js";
import settingsRoutes from "./routes/settings.js";

const app = express();
const PORT = 5001;

// initialize middleware
app.use(bodyParser.json());

// routes aus den /routes/....js modules
app.use("/notes", notesRoutes);
app.use("/settings", settingsRoutes);

app.use(express.static("./source/public"));
app.listen(PORT, () => { console.log(`Server running on Port: http://localhost:${PORT}`); });
