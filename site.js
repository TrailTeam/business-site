(function () {
    var root = document.documentElement;
    var button = document.querySelector('.theme-toggle');
    var themeColor = document.querySelector('meta[name="theme-color"]');

    // Dark unless the visitor has explicitly asked for light.
    function active() {
        return root.dataset.theme === 'light' ? 'light' : 'dark';
    }

    function sync() {
        var dark = active() === 'dark';
        button.setAttribute('aria-label', dark ? 'Switch to light theme' : 'Switch to dark theme');
        if (themeColor) themeColor.setAttribute('content', dark ? '#10151a' : '#f8f9fa');
    }

    button.addEventListener('click', function () {
        var next = active() === 'dark' ? 'light' : 'dark';
        root.dataset.theme = next;
        try { localStorage.setItem('theme', next); } catch (e) {}
        sync();
    });

    sync();
})();
