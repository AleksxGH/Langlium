import { LANGUAGES, flagUrl } from '../scripts/languages.js';

class AppHeader extends HTMLElement {
    static stylesLoaded = false;

    connectedCallback() {
        this.loadStyles();
        this.render();
        this.attachEvents();
    }

    loadStyles() {
        if (AppHeader.stylesLoaded) return;

        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = './styles/app-header.css';
        document.head.appendChild(link);

        AppHeader.stylesLoaded = true;
    }

    render() {
        const currentPath = window.location.pathname.split('/').pop() || 'index.html';

        const navItems = [
            { href: './index.html', label: 'Home' },
            { href: './materials.html', label: 'My Materials' },
            { href: './exercises.html', label: 'Exercises' },
        ];

        const navHtml = navItems.map(item => {
            const isActive = item.href.replace('./', '') === currentPath;
            return `<a href="${item.href}" class="${isActive ? 'active' : ''}">${item.label}</a>`;
        }).join('');

        const currentLang = LANGUAGES[0];

        const languageOptionsHtml = LANGUAGES.map((lang, i) => `
            <div class="language-option ${i === 0 ? 'active' : ''}" data-lang="${lang.code}">
                <img class="language-flag-img" src="${flagUrl(lang.countryCode)}" alt="${lang.name}">
                <span>${lang.name}</span>
            </div>
        `).join('');

        this.innerHTML = `
            <header class="topbar">
                <div class="topbar-left">
                    <a href="./index.html" class="topbar-logo-link">
                        <div class="topbar-logo">
                            <div class="topbar-logo-icon">
                                <img src="static/logo.svg" alt="Langlium">
                            </div>
                        </div>
                    </a>
                </div>

                <div class="topbar-center">
                    <nav class="topbar-menu">${navHtml}</nav>
                </div>

                <div class="topbar-right">
                    <div class="language-switcher">
                        <button class="language-switcher-trigger" id="langTrigger">
                            <img class="language-flag-img" id="currentFlag" src="${flagUrl(currentLang.countryCode)}" alt="${currentLang.name}">
                            <span class="language-code" id="currentLangCode">${currentLang.code.toUpperCase()}</span>
                            <svg class="chevron" width="12" height="12" viewBox="0 0 24 24" fill="none">
                                <path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </button>

                        <div class="language-dropdown" id="langDropdown">
                            ${languageOptionsHtml}
                            <div class="language-dropdown-divider"></div>
                            <div class="language-option language-option-add">
                                <span>+ Добавить язык</span>
                            </div>
                        </div>
                    </div>

                    <div class="user-avatar" title="Профиль">АН</div>
                </div>
            </header>
        `;
    }

    attachEvents() {
        const trigger = this.querySelector('#langTrigger');
        const dropdown = this.querySelector('#langDropdown');
        const currentFlag = this.querySelector('#currentFlag');
        const currentLangCode = this.querySelector('#currentLangCode');

        trigger.addEventListener('click', (e) => {
            e.stopPropagation();
            const isOpen = dropdown.classList.toggle('open');
            trigger.setAttribute('aria-expanded', isOpen);
        });

        this.querySelectorAll('.language-option[data-lang]').forEach(option => {
            option.addEventListener('click', () => {
                this.querySelector('.language-option.active')?.classList.remove('active');
                option.classList.add('active');

                const flagSrc = option.querySelector('.language-flag-img').src;
                const langCode = option.dataset.lang;

                currentFlag.src = flagSrc;
                currentLangCode.textContent = langCode.toUpperCase();

                dropdown.classList.remove('open');

                // здесь позже: сохранить выбранный язык и перезагрузить контент страницы
                // localStorage.setItem('currentLanguage', langCode);
            });
        });

        document.addEventListener('click', () => {
            dropdown.classList.remove('open');
            trigger.setAttribute('aria-expanded', 'false');
        });
    }
}

customElements.define('app-header', AppHeader);