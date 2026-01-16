const PageController = {};

/**
 * Render Terms of Service page
 * @route GET /terms
 */
PageController.terms = (req, res) => {
    res.render('pages/terms', {
        title: 'Terms of Service',
        layout: 'layouts/content'
    });
};

/**
 * Render Privacy Policy page
 * @route GET /privacy-policy
 */
PageController.privacyPolicy = (req, res) => {
    res.render('pages/privacy-policy', {
        title: 'Privacy Policy',
        layout: 'layouts/content'
    });
};

module.exports = PageController;

