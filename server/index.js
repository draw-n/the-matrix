const express = require("express");
const cors = require("cors");

const connectDB = require("./config/database.js");

const PORT = process.env.PORT || 3001;

const app = express();

connectDB();

app.use(express.json());
const allowedOrigins = ["https://localhost", "https://df-updates.vercel.app"];

const corsOptions = {
    origin: (origin, callback) => {
        if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
            callback(null, true); // Allow the origin
        } else {
            callback(new Error("Not allowed by CORS")); // Reject the origin
        }
    },
    optionsSuccessStatus: 200, // For legacy browser support
};

app.use(cors(corsOptions));

app.use("/issues", require("./routes/issues.router.js"));
app.use("/updates", require("./routes/updates.router.js"));
app.use("/users", require("./routes/users.router.js"));
app.use("/equipment", require("./routes/equipment.router.js"));

app.get("/", (req, res) => {
    res.send("Ello :D");
});

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
