// Several functions to check the authorization level (user, admin, superAdmin) of a given user.

// Check is the user is authorized (voter/user level access).
module.exports.isAuth = (req, res, next) => {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.status(401).json({msg: 'You are not authorized to view this resource'});
    }
}

// Check is the user is authorized as an admin.
module.exports.isAdmin = (req, res, next) => {
    if (req.isAuthenticated() && req.user.authLevel == 'admin') {
        next();
    } else {
        res.status(401).json({msg: 'You are not authorized to view this resource because you are not an admin.'});
    }
}

// Check is the user is authorized as a superAdmin.
module.exports.isSuperAdmin = (req, res, next) => {
    if (req.isAuthenticated() && req.user.authLevel == 'superAdmin') {
        next();
    } else {
        res.status(401).json({msg: 'You are not authorized to view this resource because you are not a super admin.'});
    }
}