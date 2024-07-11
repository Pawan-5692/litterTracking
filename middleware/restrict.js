function restrictTo(roles = []) {
    return function (req, res, next) {
        if (!req.user) return res.redirect('/signin');

        if (!roles.includes(req.user.role)) return res.status(403).send("Unauthorized");

        return next();
    }
}

module.exports = {
    restrictTo,
}