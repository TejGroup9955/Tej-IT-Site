document.addEventListener('DOMContentLoaded', function() {
    var img = new Image();
    var page = window.location.pathname; // e.g., '/about', '/blog'
    img.src = 'http://10.10.50.93:5000/track_visit?page=' + encodeURIComponent(page);
});