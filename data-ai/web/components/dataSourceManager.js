// 数据源管理组件
class DataSourceManager {
    constructor() {
        this.dataSources = [
            {
                id: 'ds_001',
                name: '业务数据库',
                type: 'database',
                subtype: 'mysql',
                status: 'connected',
                host: 'mysql.example.com',
                port: 3306,
                database: 'business_db',
                lastSync: '2024-12-17 10:30:00',
                tables: 15
            },
            {
                id: 'ds_002',
                name: '用户行为日志',
                type: 'stream',
                subtype: 'kafka',
                status: 'running',
                brokers: ['kafka1:9092', 'kafka2:9092'],
                topics: ['user_actions', 'page_views'],
                messagesPerSec: 1500,
                lastSync: '实时'
            },
            {
                id: 'ds_003',
                name: '产品数据文件',
                type: 'file',
                subtype: 'csv',
                status: 'active',
                filePath: '/data/products.csv',
                size: '256MB',
                records: 50000,
                lastModified: '2024-12-17 09:15:00'
            },
            {
                id: 'ds_004',
                name: '第三方API接口',
                type: 'api',
                subtype: 'rest',
                status: 'active',
                url: 'https://api.example.com/v1',
                endpoints: 25,
                requestsPerDay: 50000,
                authType: 'api_key'
            }
        ];

        this.templates = {
            database: {
                mysql: {
                    name: 'MySQL数据库',
                    icon: 'fa-database',
                    color: 'blue',
                    fields: [
                        { name: 'host', label: '主机地址', type: 'text', required: true, placeholder: 'localhost' },
                        { name: 'port', label: '端口', type: 'number', required: true, default: 3306 },
                        { name: 'database', label: '数据库名', type: 'text', required: true },
                        { name: 'username', label: '用户名', type: 'text', required: true },
                        { name: 'password', label: '密码', type: 'password', required: true },
                        { name: 'charset', label: '字符集', type: 'select', options: ['utf8', 'utf8mb4', 'latin1'], default: 'utf8mb4' },
                        { name: 'ssl_mode', label: 'SSL模式', type: 'select', options: ['disable', 'require', 'verify_ca', 'full'], default: 'disable' }
                    ]
                },
                postgresql: {
                    name: 'PostgreSQL数据库',
                    icon: 'fa-database',
                    color: 'purple',
                    fields: [
                        { name: 'host', label: '主机地址', type: 'text', required: true },
                        { name: 'port', label: '端口', type: 'number', required: true, default: 5432 },
                        { name: 'database', label: '数据库名', type: 'text', required: true },
                        { name: 'username', label: '用户名', type: 'text', required: true },
                        { name: 'password', label: '密码', type: 'password', required: true },
                        { name: 'schema', label: '模式名', type: 'text', default: 'public' },
                        { name: 'ssl_mode', label: 'SSL模式', type: 'select', options: ['disable', 'require', 'verify_ca', 'full'], default: 'prefer' }
                    ]
                },
                mongodb: {
                    name: 'MongoDB数据库',
                    icon: 'fa-database',
                    color: 'green',
                    fields: [
                        { name: 'host', label: '主机地址', type: 'text', required: true },
                        { name: 'port', label: '端口', type: 'number', required: true, default: 27017 },
                        { name: 'database', label: '数据库名', type: 'text', required: true },
                        { name: 'username', label: '用户名', type: 'text' },
                        { name: 'password', label: '密码', type: 'password' },
                        { name: 'auth_database', label: '认证数据库', type: 'text', default: 'admin' },
                        { name: 'replica_set', label: '副本集名称', type: 'text' }
                    ]
                }
            },
            file: {
                csv: {
                    name: 'CSV文件',
                    icon: 'fa-file-csv',
                    color: 'green',
                    fields: [
                        { name: 'name', label: '数据源名称', type: 'text', required: true },
                        { name: 'file_path', label: '文件路径', type: 'text', required: true },
                        { name: 'delimiter', label: '分隔符', type: 'select', options: [',', ';', '\\t', '|'], default: ',' },
                        { name: 'encoding', label: '文件编码', type: 'select', options: ['utf-8', 'gbk', 'iso-8859-1', 'utf-16'], default: 'utf-8' },
                        { name: 'has_header', label: '包含表头', type: 'checkbox', default: true },
                        { name: 'skip_rows', label: '跳过行数', type: 'number', default: 0 }
                    ]
                },
                excel: {
                    name: 'Excel文件',
                    icon: 'fa-file-excel',
                    color: 'green',
                    fields: [
                        { name: 'name', label: '数据源名称', type: 'text', required: true },
                        { name: 'file_path', label: '文件路径', type: 'text', required: true },
                        { name: 'sheet_name', label: '工作表名', type: 'text' },
                        { name: 'header_row', label: '表头行号', type: 'number', default: 1 },
                        { name: 'skip_rows', label: '跳过行数', type: 'number', default: 0 }
                    ]
                },
                json: {
                    name: 'JSON文件',
                    icon: 'fa-file-code',
                    color: 'yellow',
                    fields: [
                        { name: 'name', label: '数据源名称', type: 'text', required: true },
                        { name: 'file_path', label: '文件路径', type: 'text', required: true },
                        { name: 'json_path', label: 'JSON路径', type: 'text', placeholder: '如: $.data.records' },
                        { name: 'encoding', label: '文件编码', type: 'select', options: ['utf-8', 'gbk', 'utf-16'], default: 'utf-8' }
                    ]
                },
                parquet: {
                    name: 'Parquet文件',
                    icon: 'fa-file-alt',
                    color: 'orange',
                    fields: [
                        { name: 'name', label: '数据源名称', type: 'text', required: true },
                        { name: 'file_path', label: '文件路径', type: 'text', required: true },
                        { name: 'compression', label: '压缩格式', type: 'select', options: ['none', 'snappy', 'gzip', 'brotli'], default: 'snappy' }
                    ]
                }
            },
            api: {
                rest: {
                    name: 'REST API',
                    icon: 'fa-code',
                    color: 'blue',
                    fields: [
                        { name: 'name', label: '数据源名称', type: 'text', required: true },
                        { name: 'base_url', label: '基础URL', type: 'url', required: true, placeholder: 'https://api.example.com/v1' },
                        { name: 'auth_type', label: '认证类型', type: 'select', options: ['none', 'api_key', 'bearer_token', 'basic_auth', 'oauth2'], default: 'none' },
                        { name: 'api_key', label: 'API密钥', type: 'password', condition: 'auth_type==api_key' },
                        { name: 'bearer_token', label: 'Bearer Token', type: 'password', condition: 'auth_type==bearer_token' },
                        { name: 'username', label: '用户名', type: 'text', condition: 'auth_type==basic_auth' },
                        { name: 'password', label: '密码', type: 'password', condition: 'auth_type==basic_auth' },
                        { name: 'timeout', label: '超时时间(秒)', type: 'number', default: 30 },
                        { name: 'headers', label: '请求头', type: 'json', default: '{}' }
                    ]
                },
                graphql: {
                    name: 'GraphQL API',
                    icon: 'fa-project-diagram',
                    color: 'purple',
                    fields: [
                        { name: 'name', label: '数据源名称', type: 'text', required: true },
                        { name: 'endpoint', label: 'GraphQL端点', type: 'url', required: true },
                        { name: 'headers', label: '请求头', type: 'json', default: '{}' },
                        { name: 'timeout', label: '超时时间(秒)', type: 'number', default: 30 },
                        { name: 'introspection', label: '启用内省', type: 'checkbox', default: true }
                    ]
                },
                soap: {
                    name: 'SOAP API',
                    icon: 'fa-soap',
                    color: 'orange',
                    fields: [
                        { name: 'name', label: '数据源名称', type: 'text', required: true },
                        { name: 'wsdl_url', label: 'WSDL URL', type: 'url', required: true },
                        { name: 'namespace', label: '命名空间', type: 'text' },
                        { name: 'headers', label: '请求头', type: 'json', default: '{}' }
                    ]
                }
            }
        };
    }

    // 显示新增数据源对话框
    showAddDataSourceDialog() {
        const modal = this.createModal();
        document.body.appendChild(modal);

        // 显示模态框
        setTimeout(() => {
            modal.style.display = 'flex';
        }, 10);
    }

    // 创建模态框
    createModal() {
        const modal = document.createElement('div');
        modal.className = 'modal fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4';
        modal.style.display = 'none';

        modal.innerHTML = `
            <div class="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div class="gradient-bg text-white p-6 rounded-t-xl">
                    <div class="flex justify-between items-center">
                        <h3 class="text-2xl font-bold">
                            <i class="fas fa-plus-circle mr-2"></i>新增数据源
                        </h3>
                        <button onclick="closeModal(this)" class="text-white hover:text-gray-200 text-2xl leading-none">
                            ×
                        </button>
                    </div>
                </div>

                <div class="p-6">
                    <div class="mb-6">
                        <label class="block text-sm font-medium text-gray-700 mb-3">选择数据源类型</label>
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                            ${this.createSourceTypeSelector()}
                        </div>
                    </div>

                    <div id="configForm" class="space-y-4">
                        <!-- 动态表单内容将在这里显示 -->
                        <div class="text-center py-12 text-gray-500">
                            <i class="fas fa-hand-pointer text-4xl mb-4"></i>
                            <p>请先选择数据源类型</p>
                        </div>
                    </div>
                </div>

                <div class="bg-gray-50 px-6 py-4 rounded-b-xl flex justify-end space-x-3">
                    <button onclick="closeModal(this)" class="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100">
                        取消
                    </button>
                    <button onclick="testConnection()" class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                        <i class="fas fa-plug mr-2"></i>测试连接
                    </button>
                    <button onclick="saveDataSource()" class="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                        <i class="fas fa-save mr-2"></i>保存
                    </button>
                </div>
            </div>
        `;

        return modal;
    }

    // 创建数据源类型选择器
    createSourceTypeSelector() {
        const types = [
            { key: 'database', name: '数据库源', icon: 'fa-database', color: 'blue' },
            { key: 'file', name: '文件源', icon: 'fa-file', color: 'green' },
            { key: 'api', name: 'API源', icon: 'fa-code', color: 'orange' }
        ];

        return types.map(type => `
            <div class="source-type-card border-2 border-gray-200 rounded-lg p-4 cursor-pointer hover:border-blue-500 transition-all"
                 onclick="selectSourceType('${type.key}')"
                 data-type="${type.key}">
                <div class="text-center">
                    <div class="w-12 h-12 mx-auto mb-3 bg-${type.color}-100 rounded-lg flex items-center justify-center">
                        <i class="fas ${type.icon} text-${type.color}-600 text-xl"></i>
                    </div>
                    <h4 class="font-semibold text-gray-800">${type.name}</h4>
                    <p class="text-sm text-gray-600 mt-1">选择${type.name}类型</p>
                </div>
            </div>
        `).join('');
    }

    // 选择数据源类型
    selectSourceType(type) {
        // 更新选中状态
        document.querySelectorAll('.source-type-card').forEach(card => {
            card.classList.remove('border-blue-500', 'bg-blue-50');
            if (card.dataset.type === type) {
                card.classList.add('border-blue-500', 'bg-blue-50');
            }
        });

        // 显示子类型选择
        this.showSubtypeSelector(type);
    }

    // 显示子类型选择
    showSubtypeSelector(type) {
        const configForm = document.getElementById('configForm');
        const subtypes = this.templates[type] || {};

        if (Object.keys(subtypes).length === 0) {
            configForm.innerHTML = `
                <div class="text-center py-12 text-gray-500">
                    <p>该类型暂无可用的子类型</p>
                </div>
            `;
            return;
        }

        configForm.innerHTML = `
            <div class="mb-6">
                <label class="block text-sm font-medium text-gray-700 mb-3">选择具体类型</label>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    ${Object.entries(subtypes).map(([key, template]) => `
                        <div class="subtype-card border-2 border-gray-200 rounded-lg p-4 cursor-pointer hover:border-green-500 transition-all"
                             onclick="selectSubtype('${type}', '${key}')"
                             data-subtype="${key}">
                            <div class="flex items-center space-x-3">
                                <div class="w-10 h-10 bg-${template.color}-100 rounded-lg flex items-center justify-center">
                                    <i class="fas ${template.icon} text-${template.color}-600"></i>
                                </div>
                                <div>
                                    <h5 class="font-semibold text-gray-800">${template.name}</h5>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
            <div id="formFields">
                <div class="text-center py-8 text-gray-500">
                    <i class="fas fa-hand-point-right text-2xl"></i>
                    <p class="mt-2">请先选择具体的子类型</p>
                </div>
            </div>
        `;
    }

    // 选择子类型
    selectSubtype(type, subtype) {
        // 更新选中状态
        document.querySelectorAll('.subtype-card').forEach(card => {
            card.classList.remove('border-green-500', 'bg-green-50');
            if (card.dataset.subtype === subtype) {
                card.classList.add('border-green-500', 'bg-green-50');
            }
        });

        // 生成表单字段
        this.generateFormFields(type, subtype);
    }

    // 生成表单字段
    generateFormFields(type, subtype) {
        const template = this.templates[type][subtype];
        const formFields = document.getElementById('formFields');

        if (!template || !template.fields) {
            formFields.innerHTML = '<p class="text-gray-500">该类型暂无配置选项</p>';
            return;
        }

        let fieldsHtml = template.fields.map(field => {
            const isConditional = field.condition;
            const fieldId = `field_${field.name}`;

            let fieldHtml = '';

            // 输入类型
            switch (field.type) {
                case 'text':
                case 'password':
                case 'url':
                case 'number':
                    fieldHtml = `
                        <input type="${field.type}"
                               id="${fieldId}"
                               name="${field.name}"
                               class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                               placeholder="${field.placeholder || ''}"
                               ${field.required ? 'required' : ''}
                               ${field.default ? `value="${field.default}"` : ''}>
                    `;
                    break;

                case 'select':
                    const options = Array.isArray(field.options)
                        ? field.options.map(opt => `<option value="${opt}">${opt}</option>`).join('')
                        : '';
                    fieldHtml = `
                        <select id="${fieldId}"
                                name="${field.name}"
                                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                            ${options}
                        </select>
                    `;
                    break;

                case 'checkbox':
                    fieldHtml = `
                        <input type="checkbox"
                               id="${fieldId}"
                               name="${field.name}"
                               class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                               ${field.default ? 'checked' : ''}>
                        <label for="${fieldId}" class="ml-2 text-sm text-gray-700">${field.label}</label>
                    `;
                    break;

                case 'json':
                    fieldHtml = `
                        <textarea id="${fieldId}"
                                  name="${field.name}"
                                  rows="4"
                                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                                  placeholder='${field.placeholder || "{}"}'>${field.default || ''}</textarea>
                    `;
                    break;
            }

            return `
                <div class="form-group ${isConditional ? 'hidden' : ''}" ${isConditional ? `data-condition="${field.condition}"` : ''}>
                    <label for="${fieldId}" class="block text-sm font-medium text-gray-700 mb-2">
                        ${field.label} ${field.required ? '<span class="text-red-500">*</span>' : ''}
                    </label>
                    ${fieldHtml}
                    ${field.help ? `<p class="text-sm text-gray-500 mt-1">${field.help}</p>` : ''}
                </div>
            `;
        }).join('');

        formFields.innerHTML = `
            <div class="space-y-4">
                ${fieldsHtml}
            </div>
        `;

        // 处理条件字段显示
        this.handleConditionalFields();
    }

    // 处理条件字段
    handleConditionalFields() {
        const formFields = document.getElementById('formFields');
        if (!formFields) return;

        formFields.addEventListener('change', (e) => {
            const target = e.target;
            const name = target.name;
            const value = target.type === 'checkbox' ? target.checked : target.value;

            // 查找条件字段
            const conditionalFields = formFields.querySelectorAll('[data-condition]');
            conditionalFields.forEach(field => {
                const condition = field.dataset.condition;
                const [fieldName, expectedValue] = condition.split('==');

                if (fieldName === name) {
                    const shouldShow = value.toString() === expectedValue;
                    field.classList.toggle('hidden', !shouldShow);
                }
            });
        });
    }

    // 测试连接
    async testConnection() {
        const formData = this.collectFormData();

        if (!this.validateForm(formData)) {
            return;
        }

        // 显示测试中状态
        if (typeof window.notificationSystem !== 'undefined') {
            window.notificationSystem.loading('正在测试数据源连接...');
        }

        try {
            // 模拟连接测试
            await this.simulateConnectionTest(formData);

            if (typeof window.notificationSystem !== 'undefined') {
                window.notificationSystem.success('连接测试成功！', {
                    duration: 3000,
                    actions: [{
                        label: '保存数据源',
                        handler: () => this.saveDataSource()
                    }]
                });
            }
        } catch (error) {
            if (typeof window.notificationSystem !== 'undefined') {
                window.notificationSystem.error(`连接测试失败: ${error.message}`);
            }
        }
    }

    // 模拟连接测试
    simulateConnectionTest(formData) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const success = Math.random() > 0.2; // 80% 成功率

                if (success) {
                    resolve({
                        status: 'success',
                        message: '连接测试成功',
                        latency: Math.floor(Math.random() * 1000) + 100
                    });
                } else {
                    reject(new Error('连接超时，请检查网络或配置'));
                }
            }, 2000);
        });
    }

    // 保存数据源
    saveDataSource() {
        const formData = this.collectFormData();

        if (!this.validateForm(formData)) {
            return;
        }

        // 创建新数据源
        const newDataSource = {
            id: `ds_${Date.now()}`,
            name: formData.name || '新数据源',
            type: formData.type,
            subtype: formData.subtype,
            status: 'connecting',
            created_at: new Date().toISOString(),
            config: formData
        };

        this.dataSources.push(newDataSource);

        // 刷新数据源列表
        if (typeof window.DataAIPlatform !== 'undefined') {
            window.DataAIPlatform.loadDataSources();
        }

        if (typeof window.notificationSystem !== 'undefined') {
            window.notificationSystem.success('数据源创建成功！');
        }

        // 关闭模态框
        const modal = document.querySelector('.modal');
        if (modal) {
            modal.remove();
        }
    }

    // 收集表单数据
    collectFormData() {
        const formData = {};
        const formFields = document.getElementById('formFields');

        if (!formFields) return formData;

        formFields.querySelectorAll('input, select, textarea').forEach(field => {
            if (field.type === 'checkbox') {
                formData[field.name] = field.checked;
            } else {
                formData[field.name] = field.value;
            }
        });

        return formData;
    }

    // 验证表单
    validateForm(formData) {
        // 检查必填字段
        const requiredFields = ['name', 'type', 'subtype'];
        for (const field of requiredFields) {
            if (!formData[field] || formData[field].trim() === '') {
                if (typeof window.notificationSystem !== 'undefined') {
                    window.notificationSystem.error(`请填写必填字段: ${field}`);
                }
                return false;
            }
        }

        // 检查特定类型的验证
        if (formData.subtype === 'mysql' && !formData.host) {
            if (typeof window.notificationSystem !== 'undefined') {
                window.notificationSystem.error('请填写数据库主机地址');
            }
            return false;
        }

        if (formData.subtype === 'rest' && !formData.base_url) {
            if (typeof window.notificationSystem !== 'undefined') {
                window.notificationSystem.error('请填写API基础URL');
            }
            return false;
        }

        return true;
    }

    // 删除数据源
    deleteDataSource(dataSourceId) {
        if (!confirm('确定要删除这个数据源吗？')) {
            return;
        }

        const index = this.dataSources.findIndex(ds => ds.id === dataSourceId);
        if (index > -1) {
            this.dataSources.splice(index, 1);

            if (typeof window.DataAIPlatform !== 'undefined') {
                window.DataAIPlatform.loadDataSources();
            }

            if (typeof window.notificationSystem !== 'undefined') {
                window.notificationSystem.success('数据源删除成功！');
            }
        }
    }

    // 测试所有连接
    async testAllConnections() {
        if (typeof window.notificationSystem !== 'undefined') {
            window.notificationSystem.loading('正在测试所有数据源连接...');
        }

        const results = [];

        for (const dataSource of this.dataSources) {
            try {
                const result = await this.simulateConnectionTest(dataSource.config);
                results.push({
                    id: dataSource.id,
                    name: dataSource.name,
                    status: 'success',
                    message: '连接成功'
                });
            } catch (error) {
                results.push({
                    id: dataSource.id,
                    name: dataSource.name,
                    status: 'error',
                    message: error.message
                });
            }
        }

        const successCount = results.filter(r => r.status === 'success').length;
        const totalCount = results.length;

        if (typeof window.notificationSystem !== 'undefined') {
            window.notificationSystem.success(
                `连接测试完成: ${successCount}/${totalCount} 个数据源连接成功`,
                {
                    duration: 5000
                }
            );
        }

        return results;
    }

    /**
     * 按ID测试连接
     */
    async testConnectionById(id) {
        const dataSource = this.dataSources.find(ds => ds.id === id);
        if (!dataSource) {
            this.showNotification('error', '数据源不存在');
            return;
        }

        // 显示加载状态
        const originalStatus = dataSource.status;
        dataSource.status = 'connecting';
        this.renderDataSources();

        try {
            // 模拟连接测试
            await this.simulateConnectionTest(dataSource);

            dataSource.status = 'connected';
            dataSource.lastTest = new Date().toISOString();
            this.showNotification('success', `${dataSource.name} 连接测试成功`);
        } catch (error) {
            dataSource.status = 'error';
            this.showNotification('error', `${dataSource.name} 连接测试失败: ${error.message}`);
        }

        this.renderDataSources();
    }

    /**
     * 编辑数据源
     */
    editDataSource(id) {
        const dataSource = this.dataSources.find(ds => ds.id === id);
        if (!dataSource) {
            this.showNotification('error', '数据源不存在');
            return;
        }

        // 设置当前数据源
        this.currentDataSource = dataSource;

        // 显示模态框
        this.showModal();

        // 根据数据源类型选择相应的类型和子类型
        if (dataSource.type === 'database') {
            this.selectedType = 'database';
            this.selectedSubtype = dataSource.config.database_type || 'mysql';
        } else if (dataSource.type === 'file') {
            this.selectedType = 'file';
            this.selectedSubtype = dataSource.config.file_type || 'csv';
        } else if (dataSource.type === 'api') {
            this.selectedType = 'api';
            this.selectedSubtype = dataSource.config.api_type || 'rest';
        }

        // 更新模态框内容
        this.updateModalContent();

        // 填充表单数据
        setTimeout(() => {
            this.fillFormWithDataSource(dataSource);
        }, 100);
    }

    /**
     * 填充表单数据
     */
    fillFormWithDataSource(dataSource) {
        const form = document.getElementById('dataSourceForm');
        if (!form) return;

        // 填充基本信息
        const nameInput = form.querySelector('[name="name"]');
        const descInput = form.querySelector('[name="description"]');

        if (nameInput) nameInput.value = dataSource.name;
        if (descInput) descInput.value = dataSource.description;

        // 填充配置信息
        Object.keys(dataSource.config).forEach(key => {
            const input = form.querySelector(`[name="${key}"]`);
            if (input) {
                if (input.type === 'checkbox') {
                    input.checked = dataSource.config[key];
                } else {
                    input.value = dataSource.config[key];
                }
            }
        });
    }

    /**
     * 模拟连接测试
     */
    async simulateConnectionTest(dataSource) {
        // 模拟网络延迟
        await new Promise(resolve => setTimeout(resolve, 2000));

        // 模拟连接测试逻辑
        if (dataSource.type === 'database') {
            // 数据库连接测试
            if (!dataSource.config.host || !dataSource.config.database) {
                throw new Error('数据库配置不完整');
            }
        } else if (dataSource.type === 'file') {
            // 文件访问测试
            if (!dataSource.config.path && !dataSource.config.url) {
                throw new Error('文件路径或URL不能为空');
            }
        } else if (dataSource.type === 'api') {
            // API连接测试
            if (!dataSource.config.base_url && !dataSource.config.endpoint) {
                throw new Error('API端点不能为空');
            }
        }

        // 模拟随机失败（10%概率）
        if (Math.random() < 0.1) {
            throw new Error('网络连接超时');
        }
    }

    /**
     * 导入数据源
     */
    importDataSources() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = (event) => {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    try {
                        const importedDataSources = JSON.parse(e.target.result);
                        this.handleImportDataSources(importedDataSources);
                    } catch (error) {
                        this.showNotification('error', '导入文件格式错误');
                    }
                };
                reader.readAsText(file);
            }
        };
        input.click();
    }

    /**
     * 处理导入的数据源
     */
    handleImportDataSources(importedDataSources) {
        if (!Array.isArray(importedDataSources)) {
            this.showNotification('error', '导入文件格式错误');
            return;
        }

        let importCount = 0;
        importedDataSources.forEach(dataSource => {
            // 验证必要字段
            if (dataSource.name && dataSource.type && dataSource.config) {
                // 生成新的ID
                dataSource.id = Date.now() + Math.random();
                dataSource.status = 'idle';
                dataSource.createdTime = new Date().toISOString();
                dataSource.updatedTime = new Date().toISOString();
                dataSource.lastTest = null;

                this.dataSources.push(dataSource);
                importCount++;
            }
        });

        if (importCount > 0) {
            this.saveDataSources();
            this.renderDataSources();
            this.showNotification('success', `成功导入 ${importCount} 个数据源`);
        } else {
            this.showNotification('warning', '没有有效的数据源可导入');
        }
    }
}

// 全局函数
function closeModal(button) {
    const modal = button.closest('.modal');
    if (modal) {
        modal.remove();
    }
}

function selectSourceType(type) {
    if (typeof dataSourceManager !== 'undefined') {
        dataSourceManager.selectSourceType(type);
    }
}

function selectSubtype(type, subtype) {
    if (typeof dataSourceManager !== 'undefined') {
        dataSourceManager.selectSubtype(type, subtype);
    }
}

function testConnection() {
    if (typeof dataSourceManager !== 'undefined') {
        dataSourceManager.testConnection();
    }
}

function saveDataSource() {
    if (typeof dataSourceManager !== 'undefined') {
        dataSourceManager.saveDataSource();
    }
}

// 初始化数据源管理器
const dataSourceManager = new DataSourceManager();