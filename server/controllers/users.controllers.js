const User = require("../models/User.js");
const axios = require("axios");
const createUser = async (req, res) => {
    const { token } = req.body;

    try {
        const userInfoResponse = await axios.get(
            `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${token}`
        );
        const userInfo = userInfoResponse.data;

        let user = await User.findOne({ _id: userInfo.id });
        if (!user) {
            user = new User({
                _id: userInfo.id,
                firstName: userInfo.given_name,
                lastName: userInfo.family_name,
                email: userInfo.email,
                access: "view",
            });
            console.log(user);
            await user.save();
        }

        return res.status(200).json(user);
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
        console.log(err.message);
        return res.status(500).send({ message: err.message });
    }
};

const updateUser = async (req, res) => {
    const userId = req.params?.id;
    try {
        if (userId) {
            const user = User.findByIdAndUpdate(userId, req.body)
                .then(function () {
                    console.log(req.body);
                    console.log(userId)
                    res.status(200).json(user);
                })
                .catch(function (error) {
                    console.log(error);
                    res.status(400).send({ message: error });
                });
        } else {
            res.status(400).send({ message: "Missing User ID" });
        }
    } catch (err) {
        console.log(err.message);
        res.status(500).send({ message: err.message });
    }
};

const getUser = async (req, res) => {
    const userId = req.params?.id;
    if (userId) {
        try {
            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).send("User not found");
            }
            return res.status(200).json(user);
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
    getUsers
};
