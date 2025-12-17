// 主题切换系统
class ThemeManager {
    constructor() {
        this.currentTheme = localStorage.getItem('theme') || 'light';
        this.themes = {
            light: {
                name: '浅色主题',
                primary: '#667eea',
                secondary: '#764ba2',
                background: '#ffffff',
                surface: '#f7fafc',
                text: '#2d3748',
                textSecondary: '#718096',
                border: '#e2e8f0',
                shadow: 'rgba(0, 0, 0, 0.1)'
            },
            dark: {
                name: '深色主题',
                primary: '#7c3aed',
                secondary: '#a78bfa',
                background: '#1a202c',
                surface: '#2d3748',
                text: '#f7fafc',
                textSecondary: '#cbd5e0',
                border: '#4a5568',
                shadow: 'rgba(0, 0, 0, 0.3)'
            },
            blue: {
                name: '蓝色主题',
                primary: '#3b82f6',
                secondary: '#60a5fa',
                background: '#f8fafc',
                surface: '#ffffff',
                text: '#1e293b',
                textSecondary: '#64748b',
                border: '#e2e8f0',
                shadow: 'rgba(0, 0, 0, 0.1)'
            },
            green: {
                name: '绿色主题',
                primary: '#10b981',
                secondary: '#34d399',
                background: '#f0fdf4',
                surface: '#ffffff',
                text: '#064e3b',
                textSecondary: '#047857',
                border: '#d1fae5',
                shadow: 'rgba(0, 0, 0, 0.1)'
            }
        };

        this.init();
    }

    init() {
        // 应用保存的主题
        this.applyTheme(this.currentTheme);

        // 监听系统主题变化
        if (window.matchMedia) {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            mediaQuery.addEventListener('change', (e) => {
                if (this.currentTheme === 'system') {
                    this.applyTheme(e.matches ? 'dark' : 'light');
                }
            });
        }

        // 使主题管理器全局可用
        window.themeManager = this;
    }

    // 设置主题
    setTheme(themeName) {
        if (!this.themes[themeName]) {
            console.warn(`主题 "${themeName}" 不存在`);
            return;
        }

        this.currentTheme = themeName;
        localStorage.setItem('theme', themeName);
        this.applyTheme(themeName);

        // 触发主题变化事件
        this.dispatchThemeChangeEvent(themeName);
    }

    // 应用主题
    applyTheme(themeName) {
        const theme = this.themes[themeName];

        if (!theme) return;

        // 设置CSS自定义属性
        const root = document.documentElement;
        Object.entries(theme).forEach(([key, value]) => {
            const cssVar = this.camelToKebab(key);
            root.style.setProperty(`--theme-${cssVar}`, value);
        });

        // 设置body类名
        document.body.className = `theme-${themeName}`;

        // 设置data-theme属性
        document.documentElement.setAttribute('data-theme', themeName);

        // 更新meta标签
        this.updateMetaThemeColor(theme.primary);

        // 更新favicon（如果需要）
        this.updateFavicon(themeName);
    }

    // 获取当前主题
    getCurrentTheme() {
        return this.currentTheme;
    }

    // 获取主题信息
    getThemeInfo(themeName) {
        return this.themes[themeName];
    }

    // 获取所有主题
    getAllThemes() {
        return Object.entries(this.themes).map(([key, theme]) => ({
            key,
            name: theme.name,
            colors: theme
        }));
    }

    // 切换主题（在浅色和深色之间）
    toggleTheme() {
        const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.setTheme(newTheme);
        return newTheme;
    }

    // 添加自定义主题
    addTheme(name, themeConfig) {
        this.themes[name] = themeConfig;
    }

    // 移除主题
    removeTheme(name) {
        if (name === 'light' || name === 'dark') {
            console.warn('不能移除默认主题');
            return false;
        }

        if (this.themes[name]) {
            delete this.themes[name];
            return true;
        }
        return false;
    }

    // 导出主题配置
    exportTheme(themeName) {
        const theme = this.themes[themeName];
        if (!theme) return null;

        return {
            name: themeName,
            displayName: theme.name,
            colors: theme,
            timestamp: new Date().toISOString()
        };
    }

    // 导入主题配置
    importTheme(themeConfig) {
        try {
            this.addTheme(themeConfig.name, themeConfig.colors);
            return true;
        } catch (error) {
            console.error('导入主题失败:', error);
            return false;
        }
    }

    // 重置为默认主题
    reset() {
        this.setTheme('light');
        localStorage.removeItem('theme');
    }

    // 触发主题变化事件
    dispatchThemeChangeEvent(themeName) {
        const event = new CustomEvent('themechange', {
            detail: {
                theme: themeName,
                colors: this.themes[themeName]
            }
        });
        window.dispatchEvent(event);
    }

    // 监听主题变化
    onThemeChange(callback) {
        window.addEventListener('themechange', callback);
    }

    // 移除主题变化监听
    offThemeChange(callback) {
        window.removeEventListener('themechange', callback);
    }

    // 获取系统主题偏好
    getSystemThemePreference() {
        if (window.matchMedia) {
            return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        }
        return 'light';
    }

    // 应用系统主题
    applySystemTheme() {
        const systemTheme = this.getSystemThemePreference();
        this.setTheme(systemTheme);
        return systemTheme;
    }

    // 生成主题预览
    generateThemePreview(themeName) {
        const theme = this.themes[themeName];
        if (!theme) return null;

        return `
            <div class="theme-preview" style="
                background: ${theme.background};
                border: 1px solid ${theme.border};
                border-radius: 8px;
                padding: 16px;
                margin-bottom: 8px;
                cursor: pointer;
                transition: all 0.2s ease;
            ">
                <div style="display: flex; align-items: center; margin-bottom: 12px;">
                    <div style="
                        width: 24px;
                        height: 24px;
                        background: ${theme.primary};
                        border-radius: 4px;
                        margin-right: 12px;
                    "></div>
                    <div style="
                        width: 24px;
                        height: 24px;
                        background: ${theme.secondary};
                        border-radius: 50%;
                        margin-right: 12px;
                    "></div>
                    <div style="color: ${theme.text}; font-weight: 500;">
                        ${theme.name}
                    </div>
                </div>
                <div style="
                    height: 8px;
                    background: ${theme.surface};
                    border: 1px solid ${theme.border};
                    border-radius: 4px;
                    margin-bottom: 8px;
                "></div>
                <div style="color: ${theme.textSecondary}; font-size: 12px;">
                    主色调: ${theme.primary}
                </div>
            </div>
        `;
    }

    // 创建主题选择器
    createThemeSelector() {
        const selector = document.createElement('div');
        selector.className = 'theme-selector';
        selector.innerHTML = `
            <div class="theme-selector-content">
                <h3>选择主题</h3>
                <div class="theme-list">
                    ${Object.entries(this.themes).map(([key, theme]) => `
                        <div class="theme-option ${key === this.currentTheme ? 'active' : ''}"
                             data-theme="${key}"
                             onclick="themeManager.setTheme('${key}')">
                            ${this.generateThemePreview(key)}
                        </div>
                    `).join('')}
                </div>
                <div class="theme-actions">
                    <button onclick="themeManager.applySystemTheme()" class="btn btn-secondary">
                        使用系统主题
                    </button>
                    <button onclick="themeManager.toggleTheme()" class="btn btn-primary">
                        切换主题
                    </button>
                </div>
            </div>
        `;

        return selector;
    }

    // 骆驼命名转短横线命名
    camelToKebab(str) {
        return str.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase();
    }

    // 更新meta主题色
    updateMetaThemeColor(color) {
        let metaThemeColor = document.querySelector('meta[name="theme-color"]');
        if (!metaThemeColor) {
            metaThemeColor = document.createElement('meta');
            metaThemeColor.name = 'theme-color';
            document.head.appendChild(metaThemeColor);
        }
        metaThemeColor.content = color;
    }

    // 更新favicon
    updateFavicon(themeName) {
        // 根据主题更新favicon（可选功能）
        const favicon = document.querySelector('link[rel="icon"]');
        if (favicon && themeName === 'dark') {
            favicon.href = '/favicon-dark.ico';
        } else if (favicon) {
            favicon.href = '/favicon.ico';
        }
    }

    // 获取当前主题的CSS变量
    getThemeCSSVariables() {
        const root = document.documentElement;
        const style = getComputedStyle(root);
        const variables = {};

        for (let i = 0; i < style.length; i++) {
            const property = style[i];
            if (property.startsWith('--theme-')) {
                const value = style.getPropertyValue(property);
                const key = property.replace('--theme-', '').replace(/-/g, '');
                variables[key] = value.trim();
            }
        }

        return variables;
    }
}

// 初始化主题管理器
const themeManager = new ThemeManager();

// 创建主题切换按钮组件
function createThemeToggle() {
    const toggle = document.createElement('button');
    toggle.className = 'theme-toggle';
    toggle.innerHTML = `
        <i class="fas fa-${themeManager.currentTheme === 'dark' ? 'sun' : 'moon'}"></i>
    `;
    toggle.title = '切换主题';
    toggle.style.cssText = `
        background: none;
        border: none;
        color: var(--theme-text);
        font-size: 18px;
        cursor: pointer;
        padding: 8px;
        border-radius: 6px;
        transition: all 0.2s ease;
    `;

    toggle.addEventListener('click', () => {
        const newTheme = themeManager.toggleTheme();
        toggle.innerHTML = `<i class="fas fa-${newTheme === 'dark' ? 'sun' : 'moon'}"></i>`;
    });

    toggle.addEventListener('mouseenter', () => {
        toggle.style.backgroundColor = 'var(--theme-surface)';
    });

    toggle.addEventListener('mouseleave', () => {
        toggle.style.backgroundColor = 'transparent';
    });

    return toggle;
}