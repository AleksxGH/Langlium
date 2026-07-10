class AppHeader extends HTMLElement {
    static stylesLoaded = false;

    connectedCallback() {
        this.loadStyles();
        this.render();
    }

    loadStyles() {
        if (AppHeader.stylesLoaded) return;

        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = '/css/components/app-header.css';
        document.head.appendChild(link);

        AppHeader.stylesLoaded = true;
    }

    render() {
        this.innerHTML = `
            <header class="topbar">
                <div class="topbar-left">
                    <a href="/index.html" class="topbar-logo-link">
                        <div class="topbar-logo">
                            <img src="https://static.vecteezy.com/system/resources/previews/045/681/995/non_2x/language-icon-symbol-design-illustration-vector.jpg" alt="СловоЛаб">
                        </div>
                        <div class="topbar-logo-text">LanguagePlatform</div>
                    </a>
                </div>
                <div class="topbar-center">
                    <nav class="topbar-menu"></nav>
                </div>
                <div class="topbar-right"></div>
            </header>
        `;
    }
}

customElements.define('app-header', AppHeader);