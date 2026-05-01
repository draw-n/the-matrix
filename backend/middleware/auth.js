const Equipment = require("../models/Equipment");

const ensureAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    return res.status(401).json({ message: "Unauthorized" });
};

/**
 * Ensures that the authenticated user has one of the specified access levels
 * @param {*} accesses - array of allowed access levels (e.g., ["admin", "user"])
 * @returns - middleware function that checks user access
 */
const ensureAccess = (accesses) => {
    return (req, res, next) => {
        if (
            req.isAuthenticated() &&
            req.user &&
            accesses.includes(req.user.access)
        ) {
            return next();
        }
        return res.status(403).json({ message: "Forbidden" });
    };
};

/**
 * Ensures that the request is coming from an internal Pi device
 * @param {*} req - request details
 * @param {*} res - response details
 * @param {*} next - next middleware function
 * @returns 
 */
const ensureInternalRequest = async (req, res, next) => {
    const secret = req.headers["x-internal-key"];
    const piId   = req.headers["x-pi-id"];

    if (!secret || !piId) {
        return res.status(403).json({ message: "Forbidden: missing credentials" });
    }

    try {
        const device = await Equipment.findOne({ piId, key: secret, remotePrintAvailable: true });

        if (!device) {
            console.warn(`Blocked unauthorized Pi request — id: ${piId}`);
            return res.status(403).json({ message: "Forbidden: invalid credentials" });
        }

        // Attach device to request for use in controllers
        req.piId     = piId;
        req.piDevice = device;
        return next();
    } catch (err) {
        console.error("ensureInternalRequest error:", err.message);
        return res.status(500).json({ message: "Server error during Pi auth" });
    }
};

module.exports = {
    ensureAuthenticated,
    ensureAccess,
    ensureInternalRequest
};