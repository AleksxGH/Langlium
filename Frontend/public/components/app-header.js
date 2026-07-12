import {
    LANGUAGES, flagUrl, getUserLanguages, addUserLanguage,
    getCurrentLanguage, setCurrentLanguage,
} from '../scripts/languages.js';
import { isAuthenticated, logout } from '../scripts/auth.js';

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
        const authed = isAuthenticated();
        // const authed = true;

        this.innerHTML = `
            <header class="topbar">
                <div class="topbar-left">
                    <a href="./index.html" class="topbar-logo-link">
                        <div class="topbar-logo">
                            <div class="topbar-logo-icon">
                                <img src="../public/static/logo.svg" alt="Langlium">
                            </div>
                        </div>
                    </a>
                </div>

                <div class="topbar-center">
                    ${authed ? this.renderNav() : ''}
                </div>

                <div class="topbar-right" id="topbarRight">
                    ${authed ? this.renderAuthedRight() : this.renderGuestRight()}
                </div>
            </header>
        `;
    }

    renderNav() {
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

        return `<nav class="topbar-menu">${navHtml}</nav>`;
    }

    renderAuthedRight() {
        const userLangCodes = getUserLanguages();
        const currentCode = getCurrentLanguage();

        return `
        ${this.renderLanguageSwitcher(userLangCodes, currentCode)}
        <div class="user-avatar" id="userAvatar" title="Profile">AN</div>
    `;
    }

    renderGuestRight() {
        return `
            <a href="../public/auth/login.html" class="topbar-btn topbar-btn-login">Log In</a>
            <a href="../public/auth/register.html" class="topbar-btn topbar-btn-register">Sign Up</a>
        `;
    }

    renderLanguageSwitcher(userLangCodes, currentCode) {
        const userLanguages = userLangCodes
            .map(code => LANGUAGES.find(l => l.code === code))
            .filter(Boolean);

        const current = userLanguages.find(l => l.code === currentCode) || userLanguages[0] || null;

        const triggerContent = current
            ? `
            <img class="language-flag-img" id="currentFlag" src="${flagUrl(current.countryCode)}" alt="${current.name}">
            <span class="language-code" id="currentLangCode">${current.code.toUpperCase()}</span>
        `
            : `
            <span class="language-placeholder-icon">🌐</span>
            <span class="language-code" id="currentLangCode">Not selected</span>
        `;

        const userOptionsHtml = userLanguages.map(lang => `
            <div class="language-option ${lang.code === current?.code ? 'active' : ''}" data-lang="${lang.code}">
                <img class="language-flag-img" src="${flagUrl(lang.countryCode)}" alt="${lang.name}">
                <span>${lang.name}</span>
            </div>
        `).join('');

        return `
        <div class="language-switcher">
            <button class="language-switcher-trigger" id="langTrigger">
                ${triggerContent}
                <svg class="chevron" width="12" height="12" viewBox="0 0 24 24" fill="none">
                    <path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </button>

            <div class="language-dropdown" id="langDropdown">
                ${userOptionsHtml}
                ${userOptionsHtml ? '<div class="language-dropdown-divider"></div>' : ''}
                <button class="language-option language-option-add" id="openAddLangModal">
                    <span class="add-icon">+</span> Add language
                </button>
            </div>
        </div>
    `;
    }

    attachEvents() {
        // const authed = isAuthenticated();
        // if (!authed) return;

        const trigger = this.querySelector('#langTrigger');
        const dropdown = this.querySelector('#langDropdown');

        trigger?.addEventListener('click', (e) => {
            e.stopPropagation();
            const isOpen = dropdown.classList.toggle('open');
            trigger.setAttribute('aria-expanded', isOpen);
        });

        this.querySelectorAll('.language-option[data-lang]').forEach(option => {
            option.addEventListener('click', () => {
                setCurrentLanguage(option.dataset.lang);
                dropdown.classList.remove('open');
                this.render();
                this.attachEvents();
            });
        });

        this.querySelector('#openAddLangModal')?.addEventListener('click', () => {
            dropdown.classList.remove('open');
            this.openLanguageSearchModal();
        });

        this.querySelector('#userAvatar')?.addEventListener('click', () => {
            logout();
        });

        document.addEventListener('click', () => {
            dropdown?.classList.remove('open');
            trigger?.setAttribute('aria-expanded', 'false');
        });
    }

    openLanguageSearchModal() {
    // на случай если модалка уже открыта — не плодим дубликаты
    document.getElementById('langModalOverlay')?.remove();

    const userLangCodes = getUserLanguages();
    const available = LANGUAGES.filter(l => !userLangCodes.includes(l.code));

    const renderList = (list) => list.map(lang => `
        <div class="language-option" data-lang="${lang.code}">
            <img class="language-flag-img" src="${flagUrl(lang.countryCode)}" alt="${lang.name}">
            <span>${lang.name}</span>
        </div>
    `).join('') || '<p class="language-modal-empty">No languages found</p>';

    const wrapper = document.createElement('div');
    wrapper.innerHTML = `
        <div class="language-modal-overlay" id="langModalOverlay">
            <div class="language-modal">
                <p class="language-modal-title">Which language are you learning?</p>
                <input
                    type="text"
                    class="language-search-input"
                    id="langSearchInput"
                    placeholder="Search language..."
                    autocomplete="off"
                >
                <div class="language-modal-list" id="langSearchResults">
                    ${renderList(available)}
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(wrapper.firstElementChild);

    const overlay = document.getElementById('langModalOverlay');
    const searchInput = document.getElementById('langSearchInput');
    const resultsList = document.getElementById('langSearchResults');

    searchInput.focus();

    const bindOptionClicks = () => {
        resultsList.querySelectorAll('.language-option[data-lang]').forEach(option => {
            option.addEventListener('click', () => {
                addUserLanguage(option.dataset.lang);
                closeModal();
                this.render();
                this.attachEvents();
            });
        });
    };
    bindOptionClicks();

    searchInput.addEventListener('input', () => {
        const query = searchInput.value.trim().toLowerCase();
        const filtered = available.filter(lang =>
            lang.name.toLowerCase().includes(query)
        );
        resultsList.innerHTML = renderList(filtered);
        bindOptionClicks();
    });

    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeModal();
    });

    function escHandler(e) {
        if (e.key === 'Escape') closeModal();
    }
    document.addEventListener('keydown', escHandler);

    function closeModal() {
        overlay.remove();
        document.removeEventListener('keydown', escHandler);
    }
}

}

customElements.define('app-header', AppHeader);