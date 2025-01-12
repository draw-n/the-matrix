const User = require("../models/User.js");

const createUser = async (req, res) => {
    const { firstName, lastName, email, password, accessCode } = req.body;

    try {
        let user = await User.findOne({ email: email });
        if (user)
            return res.status(400).json({ message: "User already exists." });
        if (accessCode != process.env.ACCESS_CODE) {
            return res
                .status(401)
                .json({
                    message:
                        "Doesn't match the access code in the Digital Fabrication Lab.",
                });
        }
        user = new User({
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: password,
            access: "view",
        });

        await user.save();

        return res
            .status(200)
            .json({ message: "User registered successfully." });
    } catch (err) {
        console.error(err.message);
        return res.status(500).send({ message: err.message });
    }
};

const deleteUser = async (req, res) => {
    const userId = req.params.id;

    try {
        if (userId) {
            User.findByIdAndDelete(userId)
                .then(function () {
                    return res
                        .status(200)
                        .json({ message: "Successfully deleted." });
                })
                .catch(function (error) {
                    return res.status(400).send({ message: error });
                });
        } else {
            return res.status(400).send({ message: "Missing User ID" });
        }
    } catch (err) {
        console.error(err.message);
        return res.status(500).send({ message: err.message });
    }
};

const updateUser = async (req, res) => {
    const userId = req.params?.id;
    try {
        if (userId) {
            const user = User.findByIdAndUpdate(userId, req.body)
                .then(function () {
                    
                    res.status(200).json(user);
                })
                .catch(function (error) {
                    console.error(error);
                    res.status(400).send({ message: error });
                });
        } else {
            res.status(400).send({ message: "Missing User ID" });
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send({ message: err.message });
    }
};

const getUser = async (req, res) => {
    const id = req.params?.id;
    if (id) {
        try {
            const user = await User.findById(id);
            if (!user) {
                return res.status(404).send("User not found");
            }

            return res.status(200).json({ user });
        } catch (error) {
            console.error("Error fetching user:", error);
            return res.status(500).send("Internal server error");
        }
    }
};

const getUsers = async (req, res) => {
    try {
        const user = await User.find();
        return res.status(200).json(user);
    } catch (err) {
        return res.status(500).send({ message: err.message });
    }
};

module.exports = {
    createUser,
    deleteUser,
    updateUser,
    getUser,
    getUsers,
};
