const express = require("express");
const cors = require("cors");

const connectDB = require("./config/database.js");

const PORT = process.env.PORT || 3001;

const app = express();

connectDB();

app.use(express.json());
app.use(cors());

//pp.use("/updates", require("./routes/updates.router.js"));
app.use("/users", require("./routes/users.router.js"));

app.get("/", (req, res) => {
    res.send("Ello :o");
});

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
