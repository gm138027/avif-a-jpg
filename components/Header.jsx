import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';

// 页面头部组件 - 简洁的导航结构
export default function Header() {
  const { t } = useTranslation('common');
  const router = useRouter();
  const [activeSection, setActiveSection] = useState('');
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // 获取当前语言
  const currentLocale = router.locale || 'es';
  const currentLangDisplay = currentLocale.toUpperCase();

  // 组件挂载后设置状态，避免hydration不匹配
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // 监听滚动，更新激活的导航项
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['how-to-use', 'faq'];
      const scrollPosition = window.scrollY + 100; // 考虑导航栏高度

      for (const sectionId of sections) {
        const element = document.getElementById(sectionId);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // 初始检查

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 处理LOGO点击，智能导航
  const handleLogoClick = (e) => {
    e.preventDefault();

    // 检查当前是否在首页
    if (window.location.pathname === '/') {
      // 在首页，平滑滚动到顶部
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    } else {
      // 不在首页，返回首页
      window.location.href = '/';
    }
  };

  // 处理导航链接点击，确保平滑滚动
  const handleNavClick = (e, targetId) => {
    e.preventDefault();

    // 检查当前是否在首页
    if (window.location.pathname === '/') {
      // 在首页，直接滚动到目标元素
      const element = document.getElementById(targetId);
      if (element) {
        const headerHeight = 80; // 固定导航栏高度
        const elementPosition = element.offsetTop - headerHeight;

        window.scrollTo({
          top: elementPosition,
          behavior: 'smooth'
        });
      }
    } else {
      // 不在首页，跳转到首页的对应锚点
      window.location.href = `/#${targetId}`;
    }
  };

  // 处理语言切换下拉菜单
  const toggleLangDropdown = () => {
    setIsLangDropdownOpen(!isLangDropdownOpen);
  };

  // 处理语言切换 - 避免查询参数传递
  const handleLanguageSwitch = (locale) => {
    setIsLangDropdownOpen(false);

    // 只使用pathname，避免传递查询参数
    const { pathname } = router;

    // 使用Next.js的内置语言切换，确保URL清洁
    router.push({ pathname }, pathname, { locale });
  };

  // 点击外部关闭下拉菜单
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
        {/* Logo区域 - 使用图片Logo */}
        <div className="header__logo">
          <a href="/" className="header__logo-link" onClick={handleLogoClick}>
            <img
              src="/logo/android-chrome-192x192.png"
              alt={t('site.name')}
              className="header__logo-image"
              width="32"
              height="32"
            />
            <span className="header__logo-text">{t('site.name')}</span>
          </a>
        </div>

        {/* 导航区域 - 保持最简结构 */}
        <nav className="header__nav">
          <a
            href="/#how-to-use"
            className={`header__nav-link ${activeSection === 'how-to-use' ? 'header__nav-link--active' : ''}`}
            onClick={(e) => handleNavClick(e, 'how-to-use')}
          >
            {t('nav.how_to_use')}
          </a>
          <a
            href="/#faq"
            className={`header__nav-link ${activeSection === 'faq' ? 'header__nav-link--active' : ''}`}
            onClick={(e) => handleNavClick(e, 'faq')}
          >
            {t('nav.faq')}
          </a>

          {/* 语言切换下拉菜单 */}
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

        {/* 移动端菜单按钮 - 预留 */}
        <button className="header__menu-btn" aria-label={t('nav.menu')}>
          <span className="header__menu-icon"></span>
        </button>
      </div>
    </header>
  );
}
