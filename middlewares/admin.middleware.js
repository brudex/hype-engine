/**
 * Admin Middleware
 * Checks if user has admin role
 */
const requireAdmin = (req, res, next) => {
    // Check if user is authenticated
    if (!req.isAuthenticated()) {
        return res.redirect('/auth/login');
    }
    
    // Check if user has admin role
    if (!req.user || req.user.role !== 'admin') {
        return res.status(403).render('error', {
            message: 'Access Denied',
            error: 'You do not have permission to access this page. Admin access required.',
            layout: 'layouts/dashboard/index'
        });
    }
    
    next();
};

module.exports = {
    requireAdmin
};
