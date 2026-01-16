// Force HTTP protocol for localhost
// Redirect HTTPS to HTTP for localhost to prevent SSL errors
(function() {
    // Redirect HTTPS to HTTP for localhost
    if (window.location.protocol === 'https:' && window.location.hostname === 'localhost') {
        window.location.replace('http://' + window.location.hostname + (window.location.port ? ':' + window.location.port : '') + window.location.pathname + window.location.search + window.location.hash);
    }
})();

