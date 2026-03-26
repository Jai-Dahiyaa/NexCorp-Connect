function authroizeRoles(roles) {
    return (req, res, next) => {
        try {
            const userRole = req.user.role;

            if (roles.includes(userRole)) {
                return next();
            }

            return res.status(403).json({
                success: false,
                message: "Forbidden: You don't have permission"
            });
        } catch (err) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized: Invalid token"
            });
        }
    };
}

export default authroizeRoles;