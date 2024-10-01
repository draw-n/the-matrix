const express = require("express");
const cors = require("cors");

const connectDB = require("./config/database.js");

const PORT = process.env.PORT || 3000;

const app = express();

connectDB();

app.use(express.json());
app.use(cors());

app.use("/updates", require("./routes/updates.router.js"));

app.get("/", (req, res) => {
    res.send("Ello :o");
});

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
