import Link from 'next/link';
import Image from 'next/image';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { analytics } from '@/utils/analytics';

const HOME_SECTIONS = ['how-to-use', 'faq'];
const HEADER_HEIGHT = 80;

export default function Header() {
  const { t, i18n } = useTranslation('common');
  const router = useRouter();
  const currentLocale = i18n?.language || router.locale || 'es';

  const [activeSection, setActiveSection] = useState('');
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const currentLangDisplay = currentLocale.toUpperCase();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + HEADER_HEIGHT + 20;

      for (const sectionId of HOME_SECTIONS) {
        const element = document.getElementById(sectionId);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(sectionId);
            return;
          }
        }
      }

      setActiveSection('');
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogoClick = (event) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) {
      return;
    }

    event.preventDefault();

    if (router.pathname === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      router.push('/', undefined, { locale: currentLocale });
    }
  };

  const handleNavClick = (event, targetId) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) {
      return;
    }

    event.preventDefault();

    if (router.pathname === '/') {
      const element = document.getElementById(targetId);
      if (element) {
        const elementPosition = element.offsetTop - HEADER_HEIGHT;
        window.scrollTo({ top: elementPosition, behavior: 'smooth' });
      }
    } else {
      router.push(
        { pathname: '/', hash: targetId },
        undefined,
        { locale: currentLocale }
      );
    }
  };

  const toggleLangDropdown = () => {
    setIsLangDropdownOpen((prev) => !prev);
  };

  const handleLanguageSwitch = (locale) => {
    analytics.trackLanguageSwitch(currentLocale, locale);
    setIsLangDropdownOpen(false);

    router.push(router.asPath, undefined, { locale });
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isLangDropdownOpen && !event.target.closest('.header__lang-switch')) {
        setIsLangDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isLangDropdownOpen]);

  return (
    <header className="header">
      <div className="header__container">
        <div className="header__logo">
          <Link
            href="/"
            locale={currentLocale}
            className="header__logo-link"
            onClick={handleLogoClick}
          >
            <Image
              src="/logo/android-chrome-192x192.png"
              alt={t('site.logo_alt')}
              className="header__logo-image"
              width={32}
              height={32}
              priority
              sizes="32px"
            />
            <span className="header__logo-text">{t('site.name')}</span>
          </Link>
        </div>

        <nav className="header__nav">
          <Link
            href={{ pathname: '/', hash: 'how-to-use' }}
            locale={currentLocale}
            className={`header__nav-link ${activeSection === 'how-to-use' ? 'header__nav-link--active' : ''}`}
            onClick={(event) => handleNavClick(event, 'how-to-use')}
          >
            {t('nav.how_to_use')}
          </Link>
          <Link
            href={{ pathname: '/', hash: 'faq' }}
            locale={currentLocale}
            className={`header__nav-link ${activeSection === 'faq' ? 'header__nav-link--active' : ''}`}
            onClick={(event) => handleNavClick(event, 'faq')}
          >
            {t('nav.faq')}
          </Link>
          <div className="header__lang-switch">
            <button
              className="header__lang-trigger"
              onClick={toggleLangDropdown}
              aria-expanded={isMounted ? isLangDropdownOpen : false}
              aria-haspopup="true"
            >
              <span className="header__lang-current">{currentLangDisplay}</span>
              <svg
                className={`header__lang-arrow ${isMounted && isLangDropdownOpen ? 'header__lang-arrow--open' : ''}`}
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
              >
                <path
                  d="M3 4.5L6 7.5L9 4.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            {isMounted && isLangDropdownOpen && (
              <div className="header__lang-dropdown">
                <button
                  className={`header__lang-option ${currentLocale === 'es' ? 'header__lang-option--active' : ''}`}
                  onClick={() => handleLanguageSwitch('es')}
                >
                  <span className="header__lang-flag">🇪🇸</span>
                  <span className="header__lang-name">Español</span>
                </button>
                <button
                  className={`header__lang-option ${currentLocale === 'en' ? 'header__lang-option--active' : ''}`}
                  onClick={() => handleLanguageSwitch('en')}
                >
                  <span className="header__lang-flag">🇺🇸</span>
                  <span className="header__lang-name">English</span>
                </button>
                <button
                  className={`header__lang-option ${currentLocale === 'fr' ? 'header__lang-option--active' : ''}`}
                  onClick={() => handleLanguageSwitch('fr')}
                >
                  <span className="header__lang-flag">🇫🇷</span>
                  <span className="header__lang-name">Français</span>
                </button>
              </div>
            )}
          </div>
        </nav>

        <button className="header__menu-btn" aria-label={t('nav.menu')}>
          <span className="header__menu-icon" />
        </button>
      </div>
    </header>
  );
}
