(function() {
    const page = window.location.pathname;
    fetch(`http://10.10.50.93:5000/track_visit?page=${encodeURIComponent(page)}`, {
        method: 'GET',
        credentials: 'include'
    }).catch(err => console.error('Tracking error:', err));
})();