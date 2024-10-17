const express = require("express");
const cors = require("cors");

const connectDB = require("./config/database.js");

const PORT = process.env.PORT || 3001;

const app = express();

connectDB();

app.use(express.json());
app.use(cors());

app.use("/issues", require("./routes/issues.router.js"));
app.use("/updates", require("./routes/updates.router.js"));
app.use("/users", require("./routes/users.router.js"));
app.use("/equipment", require("./routes/equipment.router.js"))

app.get("/", (req, res) => {
    res.send("Ello :o");
});

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
