// 认证模块
class Auth {
    constructor() {
        this.currentUser = null;
        this.token = localStorage.getItem('token');
        this.init();
    }

    init() {
        // 检查是否有保存的用户信息
        const savedUser = localStorage.getItem('currentUser');
        if (savedUser) {
            this.currentUser = JSON.parse(savedUser);
        }

        // 如果没有token，重定向到登录页
        if (!this.token && window.location.pathname !== '/login.html') {
            this.redirectToLogin();
        }
    }

    // 登录
    async login(credentials) {
        try {
            // 模拟API调用
            const response = await this.mockLoginAPI(credentials);

            if (response.success) {
                this.token = response.token;
                this.currentUser = response.user;

                // 保存到localStorage
                localStorage.setItem('token', this.token);
                localStorage.setItem('currentUser', JSON.stringify(this.currentUser));

                return { success: true, user: this.currentUser };
            } else {
                return { success: false, error: response.error };
            }
        } catch (error) {
            return { success: false, error: '登录失败，请稍后重试' };
        }
    }

    // 登出
    logout() {
        this.token = null;
        this.currentUser = null;

        // 清除localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('currentUser');

        // 重定向到登录页
        this.redirectToLogin();

        // 显示通知
        if (window.notificationSystem) {
            window.notificationSystem.show('success', '已成功退出登录');
        }
    }

    // 检查是否已登录
    isAuthenticated() {
        return !!this.token;
    }

    // 获取当前用户
    getCurrentUser() {
        return this.currentUser;
    }

    // 检查用户权限
    hasPermission(permission) {
        if (!this.currentUser) return false;
        return this.currentUser.permissions && this.currentUser.permissions.includes(permission);
    }

    // 检查用户角色
    hasRole(role) {
        if (!this.currentUser) return false;
        return this.currentUser.role === role;
    }

    // 更新用户信息
    updateUserData(userData) {
        this.currentUser = { ...this.currentUser, ...userData };
        localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
    }

    // 重定向到登录页
    redirectToLogin() {
        window.location.href = '/login.html';
    }

    // 模拟登录API
    async mockLoginAPI(credentials) {
        // 模拟网络延迟
        await new Promise(resolve => setTimeout(resolve, 1000));

        // 预设的用户数据
        const users = [
            {
                id: 1,
                username: 'admin',
                password: 'admin123',
                name: '系统管理员',
                email: 'admin@data-ai.com',
                role: 'admin',
                avatar: 'https://ui-avatars.com/api/?name=Admin&background=667eea&color=fff',
                permissions: ['all'],
                lastLogin: new Date().toISOString()
            },
            {
                id: 2,
                username: 'analyst',
                password: 'analyst123',
                name: '数据分析师',
                email: 'analyst@data-ai.com',
                role: 'analyst',
                avatar: 'https://ui-avatars.com/api/?name=Analyst&background=48bb78&color=fff',
                permissions: ['view', 'analyze', 'export'],
                lastLogin: new Date().toISOString()
            },
            {
                id: 3,
                username: 'developer',
                password: 'dev123',
                name: '开发工程师',
                email: 'dev@data-ai.com',
                role: 'developer',
                avatar: 'https://ui-avatars.com/api/?name=Developer&background=4299e1&color=fff',
                permissions: ['view', 'create', 'edit', 'deploy'],
                lastLogin: new Date().toISOString()
            }
        ];

        // 查找用户
        const user = users.find(u =>
            u.username === credentials.username &&
            u.password === credentials.password
        );

        if (user) {
            // 生成token（实际应用中应该由后端生成）
            const token = btoa(JSON.stringify({
                userId: user.id,
                username: user.username,
                exp: Date.now() + 24 * 60 * 60 * 1000 // 24小时过期
            }));

            return {
                success: true,
                token: token,
                user: {
                    id: user.id,
                    username: user.username,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    avatar: user.avatar,
                    permissions: user.permissions,
                    lastLogin: user.lastLogin
                }
            };
        } else {
            return {
                success: false,
                error: '用户名或密码错误'
            };
        }
    }

    // 验证token
    validateToken() {
        if (!this.token) return false;

        try {
            const decoded = JSON.parse(atob(this.token));
            return decoded.exp > Date.now();
        } catch {
            return false;
        }
    }
}

// 导出认证实例
const auth = new Auth();