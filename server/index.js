const express = require("express");
const session = require("express-session");
const cors = require("cors");
const passport = require("passport");

const connectDB = require("./config/database.js");

const PORT = process.env.PORT || 3001;

const app = express();
require("./config/passport.js");

app.use(
    cors({
        origin: process.env.FRONT_END_ORIGIN,
        credentials: true,
    })
);

//configuration for passport
app.use(
    session({
        secret: process.env.SESSION_KEY,
        resave: false,
        saveUninitialized: false,
        cookie: { secure: true },
        maxAge: null,
    })
); //session secret
app.use(passport.initialize());
app.use(passport.session()); //persistent login session
app.use(express.json());

connectDB();

/*const allowedOrigins = ["https://localhost", "https://df-updates.vercel.app"];

const corsOptions = {
    origin: (origin, callback) => {
        if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
            callback(null, true); // Allow the origin
        } else {
            callback(new Error("Not allowed by CORS")); // Reject the origin
        }
    },
    optionsSuccessStatus: 200, // For legacy browser support
};*/

app.use("/issues", require("./routes/issues.router.js"));
app.use("/announcements", require("./routes/announcements.router.js"));
app.use("/users", require("./routes/users.router.js"));
app.use("/equipment", require("./routes/equipment.router.js"));
app.get("/test-session", (req, res) => {
    if (!req.session.test) {
        req.session.test = "Session created!";
    }
    res.json({ session: req.session });
});

app.get("/", (req, res) => {
    res.send("Ello :D");
});

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
