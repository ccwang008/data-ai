// 通知系统
class NotificationSystem {
    constructor() {
        this.notifications = [];
        this.container = null;
        this.init();
    }

    init() {
        // 创建通知容器
        this.container = document.createElement('div');
        this.container.className = 'notification-container';
        this.container.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 9999;
            max-width: 400px;
        `;
        document.body.appendChild(this.container);

        // 使通知系统全局可用
        window.notificationSystem = this;
    }

    // 显示通知
    show(type, message, options = {}) {
        const {
            duration = 5000,
            closable = true,
            persistent = false,
            actions = [],
            icon = this.getDefaultIcon(type)
        } = options;

        const notification = this.createNotification(type, message, {
            duration,
            closable,
            persistent,
            actions,
            icon
        });

        this.notifications.push(notification);
        this.container.appendChild(notification.element);

        // 显示动画
        requestAnimationFrame(() => {
            notification.element.style.opacity = '1';
            notification.element.style.transform = 'translateX(0)';
        });

        // 自动关闭
        if (!persistent && duration > 0) {
            notification.timer = setTimeout(() => {
                this.remove(notification);
            }, duration);
        }

        return notification;
    }

    // 成功通知
    success(message, options = {}) {
        return this.show('success', message, options);
    }

    // 错误通知
    error(message, options = {}) {
        return this.show('error', message, { ...options, duration: 8000 });
    }

    // 警告通知
    warning(message, options = {}) {
        return this.show('warning', message, options);
    }

    // 信息通知
    info(message, options = {}) {
        return this.show('info', message, options);
    }

    // 加载通知
    loading(message, options = {}) {
        return this.show('loading', message, { ...options, persistent: true });
    }

    // 创建通知元素
    createNotification(type, message, options) {
        const element = document.createElement('div');
        element.className = `notification notification-${type}`;
        element.style.cssText = `
            background: white;
            border-left: 4px solid ${this.getTypeColor(type)};
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            margin-bottom: 12px;
            padding: 16px;
            opacity: 0;
            transform: translateX(100%);
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
        `;

        const content = document.createElement('div');
        content.className = 'notification-content';
        content.innerHTML = `
            <div class="notification-header" style="display: flex; align-items: flex-start; margin-bottom: 8px;">
                <div class="notification-icon" style="margin-right: 12px; font-size: 18px; color: ${this.getTypeColor(type)};">
                    ${options.icon}
                </div>
                <div class="notification-message" style="flex: 1; font-size: 14px; line-height: 1.4; color: #374151;">
                    ${message}
                </div>
                ${options.closable ? `
                    <button class="notification-close" style="
                        background: none;
                        border: none;
                        color: #9ca3af;
                        cursor: pointer;
                        padding: 4px;
                        font-size: 18px;
                        line-height: 1;
                        margin-left: 8px;
                        border-radius: 4px;
                        transition: background 0.2s;
                    " onmouseover="this.style.background='#f3f4f6'" onmouseout="this.style.background='none'">
                        ×
                    </button>
                ` : ''}
            </div>
            ${options.actions.length > 0 ? `
                <div class="notification-actions" style="display: flex; gap: 8px; margin-top: 12px;">
                    ${options.actions.map(action => `
                        <button class="notification-action" style="
                            background: ${this.getTypeColor(type)};
                            color: white;
                            border: none;
                            padding: 6px 12px;
                            border-radius: 4px;
                            font-size: 12px;
                            cursor: pointer;
                            transition: opacity 0.2s;
                        " onmouseover="this.style.opacity='0.8'" onmouseout="this.style.opacity='1'">
                            ${action.label}
                        </button>
                    `).join('')}
                </div>
            ` : ''}
        `;

        element.appendChild(content);

        // 添加进度条（用于自动关闭的通知）
        if (options.duration > 0 && !options.persistent) {
            const progressBar = document.createElement('div');
            progressBar.style.cssText = `
                position: absolute;
                bottom: 0;
                left: 0;
                height: 3px;
                background: ${this.getTypeColor(type)};
                transition: width linear ${options.duration}ms;
                width: 100%;
            `;
            progressBar.className = 'notification-progress';
            element.appendChild(progressBar);

            // 启动进度条动画
            requestAnimationFrame(() => {
                progressBar.style.width = '0%';
            });
        }

        const notification = {
            id: Date.now() + Math.random(),
            type,
            message,
            element,
            timer: null,
            options
        };

        // 绑定事件
        if (options.closable) {
            const closeBtn = element.querySelector('.notification-close');
            closeBtn.addEventListener('click', () => {
                this.remove(notification);
            });
        }

        // 绑定操作按钮事件
        if (options.actions.length > 0) {
            const actionBtns = element.querySelectorAll('.notification-action');
            actionBtns.forEach((btn, index) => {
                btn.addEventListener('click', () => {
                    if (options.actions[index].handler) {
                        options.actions[index].handler(notification);
                    }
                    this.remove(notification);
                });
            });
        }

        return notification;
    }

    // 移除通知
    remove(notification) {
        if (!notification) return;

        // 清除定时器
        if (notification.timer) {
            clearTimeout(notification.timer);
        }

        // 移除动画
        notification.element.style.opacity = '0';
        notification.element.style.transform = 'translateX(100%)';

        // 延迟移除DOM元素
        setTimeout(() => {
            if (notification.element.parentNode) {
                notification.element.parentNode.removeChild(notification.element);
            }

            // 从数组中移除
            const index = this.notifications.indexOf(notification);
            if (index > -1) {
                this.notifications.splice(index, 1);
            }
        }, 300);
    }

    // 清除所有通知
    clear() {
        const notifications = [...this.notifications];
        notifications.forEach(notification => {
            this.remove(notification);
        });
    }

    // 获取类型对应的颜色
    getTypeColor(type) {
        const colors = {
            success: '#10b981',
            error: '#ef4444',
            warning: '#f59e0b',
            info: '#3b82f6',
            loading: '#6366f1'
        };
        return colors[type] || '#6b7280';
    }

    // 获取类型对应的默认图标
    getDefaultIcon(type) {
        const icons = {
            success: '✓',
            error: '✕',
            warning: '⚠',
            info: 'ℹ',
            loading: '⟳'
        };
        return icons[type] || 'ℹ';
    }

    // 显示连接状态通知
    showConnectionStatus(isOnline) {
        const message = isOnline ? '网络连接已恢复' : '网络连接已断开';
        const type = isOnline ? 'success' : 'warning';

        // 移除之前的连接状态通知
        const connectionNotifications = this.notifications.filter(
            n => n.type === 'connection'
        );
        connectionNotifications.forEach(n => this.remove(n));

        const notification = this.show(type, message, {
            persistent: !isOnline,
            closable: true
        });
        notification.type = 'connection';

        return notification;
    }

    // 显示系统消息
    showSystemMessage(title, message, type = 'info', options = {}) {
        const fullMessage = `<strong>${title}</strong><br>${message}`;
        return this.show(type, fullMessage, options);
    }

    // 显示进度通知
    showProgress(title, current, total, options = {}) {
        const percentage = Math.round((current / total) * 100);
        const message = `${title}: ${current}/${total} (${percentage}%)`;

        // 查找是否已有进度通知
        let notification = this.notifications.find(n => n.options.progressId === options.progressId);

        if (notification) {
            // 更新现有通知
            const messageEl = notification.element.querySelector('.notification-message');
            messageEl.innerHTML = message;

            // 如果完成，转换为成功通知
            if (current >= total) {
                notification.element.className = 'notification notification-success';
                notification.element.style.borderLeftColor = '#10b981';
                setTimeout(() => this.remove(notification), 3000);
            }
        } else {
            // 创建新通知
            notification = this.show('info', message, {
                ...options,
                persistent: current < total
            });
        }

        return notification;
    }
}

// 初始化通知系统
const notificationSystem = new NotificationSystem();

// 监听网络状态变化
window.addEventListener('online', () => {
    notificationSystem.showConnectionStatus(true);
});

window.addEventListener('offline', () => {
    notificationSystem.showConnectionStatus(false);
});