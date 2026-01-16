const express = require("express");
const router = express.Router();
const apiV1Routes = require('./api-v1.routes');
const mixpostRoutes = require('./mixpost.routes');
const authRoutes = require('./auth.routes');
const pageRoutes = require('./page.routes');
const adminRoutes = require('./admin.routes');

router.use('/', pageRoutes);
router.use('/auth', authRoutes);
router.use('/api/v1', apiV1Routes);
router.use('/dashboard', mixpostRoutes);
router.use('/admin', adminRoutes);


router.get("*", (req, res) => {
    res.render("404", { layout: false });
});

module.exports = router;
