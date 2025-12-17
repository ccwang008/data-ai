// 数智一体化平台前端应用
class DataAIPlatform {
    constructor() {
        this.currentPage = 'dashboard';
        this.charts = {};
        this.init();
    }

    init() {
        this.loadDashboard();
        this.setupEventListeners();
        this.startRealTimeUpdates();
    }

    setupEventListeners() {
        // 监听页面可见性变化，优化性能
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.stopRealTimeUpdates();
            } else {
                this.startRealTimeUpdates();
            }
        });
    }

    showPage(pageName) {
        this.currentPage = pageName;
        const title = document.getElementById('currentPageTitle');

        // 更新导航状态
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('bg-purple-100', 'text-purple-700');
        });

        // 标记当前页面
        event.currentTarget.classList.add('bg-purple-100', 'text-purple-700');

        // 加载页面内容
        switch(pageName) {
            case 'data-sources':
                title.textContent = '数据源管理';
                this.loadDataSources();
                break;
            case 'datasets':
                title.textContent = '数据集管理';
                this.loadDatasets();
                break;
            case 'etl':
                title.textContent = '可视化ETL';
                this.loadETL();
                break;
            case 'models':
                title.textContent = '模型管理';
                this.loadModels();
                break;
            case 'agents':
                title.textContent = '智能体平台';
                this.loadAgents();
                break;
            case 'dashboard':
                title.textContent = '数据可视化';
                this.loadDashboard();
                break;
            case 'monitoring':
                title.textContent = '系统监控';
                this.loadMonitoring();
                break;
            default:
                this.loadDashboard();
        }

        // 移动端自动关闭侧边栏
        if (window.innerWidth < 1024) {
            document.getElementById('sidebar').classList.add('-translate-x-full');
        }
    }

    loadDashboard() {
        const content = document.getElementById('content');
        content.innerHTML = `
            <div class="mb-8">
                <h2 class="text-2xl font-bold text-gray-800 mb-4">数据可视化仪表板</h2>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    ${this.createMetricCard('数据源', '15', 'fas fa-database', 'text-green-600')}
                    ${this.createMetricCard('数据集', '248', 'fas fa-dataset', 'text-blue-600')}
                    ${this.createMetricCard('ETL任务', '23', 'fas fa-project-diagram', 'text-purple-600')}
                    ${this.createMetricCard('AI模型', '12', 'fas fa-brain', 'text-orange-600')}
                </div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <div class="bg-white rounded-lg shadow p-6">
                    <h3 class="text-lg font-semibold mb-4">数据处理趋势</h3>
                    <div class="chart-container">
                        <canvas id="dataTrendChart"></canvas>
                    </div>
                </div>
                <div class="bg-white rounded-lg shadow p-6">
                    <h3 class="text-lg font-semibold mb-4">用户行为分布</h3>
                    <div class="chart-container">
                        <canvas id="userBehaviorChart"></canvas>
                    </div>
                </div>
            </div>

            <div class="bg-white rounded-lg shadow p-6">
                <h3 class="text-lg font-semibold mb-4">实时数据流</h3>
                <div class="overflow-x-auto">
                    <table class="min-w-full divide-y divide-gray-200">
                        <thead class="bg-gray-50">
                            <tr>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">时间</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">数据源</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">类型</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">记录数</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">状态</th>
                            </tr>
                        </thead>
                        <tbody id="dataStreamTable" class="bg-white divide-y divide-gray-200">
                            <!-- 动态加载 -->
                        </tbody>
                    </table>
                </div>
            </div>
        `;

        // 初始化图表
        setTimeout(() => {
            this.initDataTrendChart();
            this.initUserBehaviorChart();
            this.startDataStream();
        }, 100);
    }

    createMetricCard(title, value, icon, iconColor) {
        return `
            <div class="metric-card bg-white rounded-lg shadow p-6 text-white card-hover">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-purple-100 text-sm">${title}</p>
                        <p class="text-3xl font-bold mt-2">${value}</p>
                    </div>
                    <div class="${iconColor} text-4xl opacity-80">
                        <i class="${icon}"></i>
                    </div>
                </div>
            </div>
        `;
    }

    initDataTrendChart() {
        const ctx = document.getElementById('dataTrendChart').getContext('2d');
        this.charts.dataTrend = new Chart(ctx, {
            type: 'line',
            data: {
                labels: this.generateTimeLabels(7),
                datasets: [{
                    label: '数据处理量 (GB)',
                    data: this.generateRandomData(7, 100, 500),
                    borderColor: 'rgb(99, 102, 241)',
                    backgroundColor: 'rgba(99, 102, 241, 0.1)',
                    tension: 0.4
                }, {
                    label: '用户活跃度',
                    data: this.generateRandomData(7, 1000, 5000),
                    borderColor: 'rgb(236, 72, 153)',
                    backgroundColor: 'rgba(236, 72, 153, 0.1)',
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                    }
                }
            }
        });
    }

    initUserBehaviorChart() {
        const ctx = document.getElementById('userBehaviorChart').getContext('2d');
        this.charts.userBehavior = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['浏览', '点击', '购买', '加购', '搜索'],
                datasets: [{
                    data: [45000, 28000, 3500, 8000, 12000],
                    backgroundColor: [
                        'rgba(99, 102, 241, 0.8)',
                        'rgba(236, 72, 153, 0.8)',
                        'rgba(34, 197, 94, 0.8)',
                        'rgba(251, 146, 60, 0.8)',
                        'rgba(147, 51, 234, 0.8)'
                    ]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'right',
                    }
                }
            }
        });
    }

    loadDataSources() {
        const content = document.getElementById('content');

        // 检查dataSourceManager是否已初始化
        if (typeof dataSourceManager === 'undefined') {
            content.innerHTML = `
                <div class="text-center py-8">
                    <i class="fas fa-exclamation-triangle text-yellow-500 text-4xl mb-4"></i>
                    <p class="text-gray-600">数据源管理器未初始化，正在加载...</p>
                </div>
            `;
            return;
        }

        content.innerHTML = `
            <!-- 数据源管理页面头部 -->
            <div class="mb-6">
                <div class="flex justify-between items-center flex-wrap gap-4">
                    <h2 class="text-2xl font-bold text-gray-800">
                        <i class="fas fa-database mr-2"></i>数据源管理
                    </h2>
                    <div class="flex space-x-3">
                        <button onclick="dataSourceManager.showAddDataSourceDialog()"
                                class="btn btn-primary">
                            <i class="fas fa-plus mr-2"></i>新增数据源
                        </button>
                        <button onclick="dataSourceManager.testAllConnections()"
                                class="btn btn-secondary">
                            <i class="fas fa-plug mr-2"></i>测试所有连接
                        </button>
                        <div class="relative">
                            <button onclick="dataSourceManager.showImportDialog()"
                                    class="btn btn-secondary">
                                <i class="fas fa-file-import mr-2"></i>导入
                            </button>
                        </div>
                        <div class="relative">
                            <button onclick="dataSourceManager.exportDataSources()"
                                    class="btn btn-secondary">
                                <i class="fas fa-file-export mr-2"></i>导出
                            </button>
                        </div>
                    </div>
                </div>

                <!-- 统计信息 -->
                <div class="mt-4 grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div class="bg-white p-4 rounded-lg border border-gray-200">
                        <div class="flex items-center">
                            <div class="flex-shrink-0 bg-blue-100 rounded-lg p-3">
                                <i class="fas fa-database text-blue-600"></i>
                            </div>
                            <div class="ml-4">
                                <p class="text-sm text-gray-500">总数据源</p>
                                <p class="text-lg font-semibold text-gray-900" id="totalSources">0</p>
                            </div>
                        </div>
                    </div>
                    <div class="bg-white p-4 rounded-lg border border-gray-200">
                        <div class="flex items-center">
                            <div class="flex-shrink-0 bg-green-100 rounded-lg p-3">
                                <i class="fas fa-check-circle text-green-600"></i>
                            </div>
                            <div class="ml-4">
                                <p class="text-sm text-gray-500">已连接</p>
                                <p class="text-lg font-semibold text-gray-900" id="connectedSources">0</p>
                            </div>
                        </div>
                    </div>
                    <div class="bg-white p-4 rounded-lg border border-gray-200">
                        <div class="flex items-center">
                            <div class="flex-shrink-0 bg-yellow-100 rounded-lg p-3">
                                <i class="fas fa-exclamation-triangle text-yellow-600"></i>
                            </div>
                            <div class="ml-4">
                                <p class="text-sm text-gray-500">连接异常</p>
                                <p class="text-lg font-semibold text-gray-900" id="errorSources">0</p>
                            </div>
                        </div>
                    </div>
                    <div class="bg-white p-4 rounded-lg border border-gray-200">
                        <div class="flex items-center">
                            <div class="flex-shrink-0 bg-gray-100 rounded-lg p-3">
                                <i class="fas fa-clock text-gray-600"></i>
                            </div>
                            <div class="ml-4">
                                <p class="text-sm text-gray-500">待测试</p>
                                <p class="text-lg font-semibold text-gray-900" id="idleSources">0</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 搜索和筛选栏 -->
            <div class="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
                <div class="flex flex-col md:flex-row gap-4">
                    <div class="flex-1">
                        <div class="relative">
                            <input type="text"
                                   id="searchInput"
                                   placeholder="搜索数据源名称..."
                                   class="form-control pl-10"
                                   onkeyup="dataSourceManager.handleSearch(event)">
                            <i class="fas fa-search absolute left-3 top-3 text-gray-400"></i>
                        </div>
                    </div>
                    <div class="flex gap-2">
                        <select id="typeFilter" class="form-select" onchange="dataSourceManager.handleFilter()">
                            <option value="">所有类型</option>
                            <option value="database">数据库</option>
                            <option value="file">文件</option>
                            <option value="api">API</option>
                            <option value="stream">流数据</option>
                        </select>
                        <select id="statusFilter" class="form-select" onchange="dataSourceManager.handleFilter()">
                            <option value="">所有状态</option>
                            <option value="connected">已连接</option>
                            <option value="connecting">连接中</option>
                            <option value="error">连接异常</option>
                            <option value="idle">待测试</option>
                        </select>
                    </div>
                </div>
            </div>

            <!-- 数据源列表 -->
            <div id="dataSourceList" class="space-y-4">
                <!-- 数据源卡片将在这里渲染 -->
            </div>

            <!-- 加载状态 -->
            <div id="loadingState" class="hidden text-center py-8">
                <div class="inline-flex items-center">
                    <div class="loading-spinner mr-3"></div>
                    <span class="text-gray-600">加载中...</span>
                </div>
            </div>

            <!-- 空状态 -->
            <div id="emptyState" class="hidden text-center py-12">
                <i class="fas fa-database text-gray-300 text-6xl mb-4"></i>
                <h3 class="text-lg font-medium text-gray-900 mb-2">暂无数据源</h3>
                <p class="text-gray-500 mb-4">开始添加您的第一个数据源</p>
                <button onclick="dataSourceManager.showAddDataSourceDialog()" class="btn btn-primary">
                    <i class="fas fa-plus mr-2"></i>新增数据源
                </button>
            </div>
        `;

        // 初始化数据源管理器（如果还未初始化）
        if (typeof dataSourceManager !== 'undefined') {
            dataSourceManager.init();
        }
    }

    createDataSourceCard(dataSource) {
        const statusColor = dataSource.status === '已连接' || dataSource.status === '运行中' ? 'text-green-600' : 'text-red-600';
        const statusIcon = dataSource.status === '已连接' || dataSource.status === '运行中' ? 'fa-check-circle' : 'fa-exclamation-circle';

        return `
            <div class="bg-white rounded-lg shadow p-6 card-hover">
                <div class="flex items-center justify-between mb-4">
                    <h3 class="text-lg font-semibold text-gray-800">${dataSource.name}</h3>
                    <span class="${statusColor}">
                        <i class="fas ${statusIcon}"></i>
                    </span>
                </div>
                <div class="space-y-2 text-sm">
                    <div class="flex justify-between">
                        <span class="text-gray-600">类型:</span>
                        <span class="font-medium">${dataSource.type}</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-gray-600">状态:</span>
                        <span class="font-medium">${dataSource.status}</span>
                    </div>
                    ${dataSource.host ? `
                    <div class="flex justify-between">
                        <span class="text-gray-600">主机:</span>
                        <span class="font-medium">${dataSource.host}</span>
                    </div>` : ''}
                    ${dataSource.tables ? `
                    <div class="flex justify-between">
                        <span class="text-gray-600">表数:</span>
                        <span class="font-medium">${dataSource.tables}</span>
                    </div>` : ''}
                    ${dataSource.messagesPerSec ? `
                    <div class="flex justify-between">
                        <span class="text-gray-600">消息/秒:</span>
                        <span class="font-medium">${dataSource.messagesPerSec}</span>
                    </div>` : ''}
                    <div class="flex justify-between">
                        <span class="text-gray-600">最后同步:</span>
                        <span class="font-medium">${dataSource.lastSync}</span>
                    </div>
                </div>
                <div class="mt-4 flex space-x-2">
                    <button class="flex-1 bg-purple-600 text-white px-3 py-2 rounded text-sm hover:bg-purple-700">
                        <i class="fas fa-sync mr-1"></i>同步
                    </button>
                    <button class="flex-1 bg-gray-200 text-gray-700 px-3 py-2 rounded text-sm hover:bg-gray-300">
                        <i class="fas fa-cog mr-1"></i>配置
                    </button>
                </div>
            </div>
        `;
    }

    loadDatasets() {
        const content = document.getElementById('content');
        const datasets = [
            {
                name: '用户行为数据集',
                type: '结构化数据',
                records: 1000000,
                size: '500MB',
                quality: 95.2,
                tags: ['用户行为', '实时', '结构化'],
                created: '2024-12-01'
            },
            {
                name: '商品推荐训练集',
                type: '训练数据',
                records: 500000,
                size: '2GB',
                quality: 98.5,
                tags: ['推荐', '机器学习', '训练集'],
                created: '2024-12-10'
            },
            {
                name: '用户评论情感数据',
                type: '文本数据',
                records: 200000,
                size: '1.5GB',
                quality: 92.8,
                tags: ['文本', '情感分析', 'NLP'],
                created: '2024-12-05'
            }
        ];

        content.innerHTML = `
            <div class="mb-6">
                <div class="flex justify-between items-center">
                    <h2 class="text-2xl font-bold text-gray-800">数据集管理</h2>
                    <button class="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700">
                        <i class="fas fa-plus mr-2"></i>创建数据集
                    </button>
                </div>
            </div>

            <div class="bg-white rounded-lg shadow overflow-hidden">
                <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-50">
                        <tr>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">名称</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">类型</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">记录数</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">大小</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">质量分数</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">标签</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">操作</th>
                        </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                        ${datasets.map(ds => `
                            <tr class="hover:bg-gray-50">
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <div class="text-sm font-medium text-gray-900">${ds.name}</div>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">
                                        ${ds.type}
                                    </span>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    ${ds.records.toLocaleString()}
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    ${ds.size}
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <div class="flex items-center">
                                        <div class="flex-1 bg-gray-200 rounded-full h-2 mr-2">
                                            <div class="bg-green-500 h-2 rounded-full" style="width: ${ds.quality}%"></div>
                                        </div>
                                        <span class="text-sm text-gray-900">${ds.quality}%</span>
                                    </div>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    ${ds.tags.map(tag => `
                                        <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800 mr-1">
                                            ${tag}
                                        </span>
                                    `).join('')}
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <button class="text-purple-600 hover:text-purple-900 mr-3">预览</button>
                                    <button class="text-gray-600 hover:text-gray-900">编辑</button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    }

    loadETL() {
        const content = document.getElementById('content');
        content.innerHTML = `
            <div class="mb-6">
                <div class="flex justify-between items-center">
                    <h2 class="text-2xl font-bold text-gray-800">可视化ETL工作流</h2>
                    <div class="flex space-x-2">
                        <button class="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700">
                            <i class="fas fa-plus mr-2"></i>新建工作流
                        </button>
                        <button class="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
                            <i class="fas fa-play mr-2"></i>运行
                        </button>
                    </div>
                </div>
            </div>

            <div class="bg-white rounded-lg shadow p-6">
                <div class="mb-4 flex space-x-4">
                    <button class="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg">输入节点</button>
                    <button class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg">转换节点</button>
                    <button class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg">聚合节点</button>
                    <button class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg">输出节点</button>
                    <button class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg">AI节点</button>
                </div>

                <div class="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <i class="fas fa-project-diagram text-6xl text-gray-400 mb-4"></i>
                    <p class="text-gray-600 text-lg">拖拽节点到此处开始设计ETL工作流</p>
                    <p class="text-gray-500 text-sm mt-2">支持数据库读取、数据清洗、特征提取、模型预测等多种节点类型</p>
                </div>

                <div class="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <h4 class="font-semibold text-blue-800 mb-2">
                            <i class="fas fa-history mr-2"></i>最近运行
                        </h4>
                        <p class="text-sm text-blue-700">用户行为数据清洗</p>
                        <p class="text-xs text-blue-600 mt-1">5分钟前完成</p>
                    </div>
                    <div class="bg-green-50 border border-green-200 rounded-lg p-4">
                        <h4 class="font-semibold text-green-800 mb-2">
                            <i class="fas fa-check-circle mr-2"></i>运行中
                        </h4>
                        <p class="text-sm text-green-700">实时推荐特征计算</p>
                        <p class="text-xs text-green-600 mt-1">已处理 1.2M 条记录</p>
                    </div>
                    <div class="bg-orange-50 border border-orange-200 rounded-lg p-4">
                        <h4 class="font-semibold text-orange-800 mb-2">
                            <i class="fas fa-clock mr-2"></i>计划任务
                        </h4>
                        <p class="text-sm text-orange-700">日报数据聚合</p>
                        <p class="text-xs text-orange-600 mt-1">今日 02:00 执行</p>
                    </div>
                </div>
            </div>
        `;
    }

    loadModels() {
        const content = document.getElementById('content');
        const models = [
            {
                name: '用户流失预测模型',
                type: '分类模型',
                algorithm: 'XGBoost',
                status: '已部署',
                accuracy: 0.92,
                version: 'v2.1.0'
            },
            {
                name: '商品推荐模型',
                type: '推荐系统',
                algorithm: 'DeepFM',
                status: '已部署',
                accuracy: 0.78,
                version: 'v3.0.1'
            },
            {
                name: '评论情感分析模型',
                type: 'NLP模型',
                algorithm: 'BERT',
                status: '训练中',
                accuracy: 0.88,
                version: 'v1.0.0'
            }
        ];

        content.innerHTML = `
            <div class="mb-6">
                <div class="flex justify-between items-center">
                    <h2 class="text-2xl font-bold text-gray-800">AI模型管理</h2>
                    <button class="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700">
                        <i class="fas fa-plus mr-2"></i>训练新模型
                    </button>
                </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                ${models.map(model => this.createModelCard(model)).join('')}
            </div>
        `;
    }

    createModelCard(model) {
        const statusColor = model.status === '已部署' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800';

        return `
            <div class="bg-white rounded-lg shadow p-6 card-hover">
                <div class="flex items-center justify-between mb-4">
                    <h3 class="text-lg font-semibold text-gray-800">${model.name}</h3>
                    <span class="px-2 py-1 text-xs font-semibold rounded-full ${statusColor}">
                        ${model.status}
                    </span>
                </div>
                <div class="space-y-2 text-sm">
                    <div class="flex justify-between">
                        <span class="text-gray-600">类型:</span>
                        <span class="font-medium">${model.type}</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-gray-600">算法:</span>
                        <span class="font-medium">${model.algorithm}</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-gray-600">准确率:</span>
                        <span class="font-medium">${(model.accuracy * 100).toFixed(1)}%</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-gray-600">版本:</span>
                        <span class="font-medium">${model.version}</span>
                    </div>
                </div>
                <div class="mt-4 flex space-x-2">
                    <button class="flex-1 bg-purple-600 text-white px-3 py-2 rounded text-sm hover:bg-purple-700">
                        <i class="fas fa-chart-line mr-1"></i>监控
                    </button>
                    <button class="flex-1 bg-gray-200 text-gray-700 px-3 py-2 rounded text-sm hover:bg-gray-300">
                        <i class="fas fa-cog mr-1"></i>设置
                    </button>
                </div>
            </div>
        `;
    }

    loadAgents() {
        const content = document.getElementById('content');
        const agents = [
            {
                name: '数据分析助手',
                type: '数据分析Agent',
                status: '运行中',
                capabilities: ['数据探索', '统计分析', '可视化生成'],
                tasksCompleted: 156
            },
            {
                name: '智能客服机器人',
                type: '对话Agent',
                status: '运行中',
                capabilities: ['问答对话', '问题解决', '工单创建'],
                tasksCompleted: 2341
            },
            {
                name: '数据质量监控Agent',
                type: '监控Agent',
                status: '运行中',
                capabilities: ['质量检查', '异常检测', '告警通知'],
                tasksCompleted: 89
            }
        ];

        content.innerHTML = `
            <div class="mb-6">
                <div class="flex justify-between items-center">
                    <h2 class="text-2xl font-bold text-gray-800">智能体平台</h2>
                    <button class="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700">
                        <i class="fas fa-plus mr-2"></i>创建智能体
                    </button>
                </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                ${agents.map(agent => `
                    <div class="bg-white rounded-lg shadow p-6 card-hover border-l-4 border-purple-500">
                        <div class="flex items-center justify-between mb-4">
                            <h3 class="text-lg font-semibold text-gray-800">${agent.name}</h3>
                            <div class="flex items-center space-x-2">
                                <div class="w-2 h-2 bg-green-500 rounded-full status-online"></div>
                                <span class="text-xs text-green-600">${agent.status}</span>
                            </div>
                        </div>
                        <div class="space-y-3">
                            <div>
                                <span class="text-xs text-gray-500 uppercase tracking-wider">类型</span>
                                <p class="text-sm font-medium text-gray-900">${agent.type}</p>
                            </div>
                            <div>
                                <span class="text-xs text-gray-500 uppercase tracking-wider">能力</span>
                                <div class="mt-1 flex flex-wrap gap-1">
                                    ${agent.capabilities.map(cap => `
                                        <span class="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                                            ${cap}
                                        </span>
                                    `).join('')}
                                </div>
                            </div>
                            <div>
                                <span class="text-xs text-gray-500 uppercase tracking-wider">完成任务</span>
                                <p class="text-lg font-semibold text-purple-600">${agent.tasksCompleted}</p>
                            </div>
                        </div>
                        <div class="mt-4 flex space-x-2">
                            <button class="flex-1 bg-purple-600 text-white px-3 py-2 rounded text-sm hover:bg-purple-700">
                                <i class="fas fa-comments mr-1"></i>对话
                            </button>
                            <button class="flex-1 bg-gray-200 text-gray-700 px-3 py-2 rounded text-sm hover:bg-gray-300">
                                <i class="fas fa-cog mr-1"></i>配置
                            </button>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    loadMonitoring() {
        const content = document.getElementById('content');
        content.innerHTML = `
            <div class="mb-6">
                <h2 class="text-2xl font-bold text-gray-800">系统监控</h2>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                ${this.createMonitoringCard('服务可用性', '99.95%', 'fas fa-server', 'text-green-600', 'bg-green-50')}
                ${this.createMonitoringCard('响应时间', '125ms', 'fas fa-clock', 'text-blue-600', 'bg-blue-50')}
                ${this.createMonitoringCard('数据处理量', '2.5TB/天', 'fas fa-database', 'text-purple-600', 'bg-purple-50')}
                ${this.createMonitoringCard('活跃用户', '1,250', 'fas fa-users', 'text-orange-600', 'bg-orange-50')}
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div class="bg-white rounded-lg shadow p-6">
                    <h3 class="text-lg font-semibold mb-4">服务状态</h3>
                    <div class="space-y-4">
                        ${['API网关', '数据处理引擎', 'AI推理服务', '消息队列', '缓存服务'].map((service, index) => `
                            <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div class="flex items-center space-x-3">
                                    <div class="w-2 h-2 bg-green-500 rounded-full"></div>
                                    <span class="font-medium">${service}</span>
                                </div>
                                <div class="flex items-center space-x-4 text-sm">
                                    <span class="text-gray-600">CPU: ${45 + index * 5}%</span>
                                    <span class="text-gray-600">内存: ${2.1 + index * 0.5}GB</span>
                                    <span class="text-green-600">正常</span>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <div class="bg-white rounded-lg shadow p-6">
                    <h3 class="text-lg font-semibold mb-4">系统日志</h3>
                    <div class="space-y-3">
                        ${this.generateSystemLogs().map(log => `
                            <div class="flex items-start space-x-3 p-3 border-l-4 ${log.borderColor} bg-gray-50">
                                <div class="flex-shrink-0">
                                    <i class="fas ${log.icon} ${log.iconColor}"></i>
                                </div>
                                <div class="flex-1 min-w-0">
                                    <p class="text-sm font-medium text-gray-900">${log.title}</p>
                                    <p class="text-sm text-gray-500">${log.message}</p>
                                    <p class="text-xs text-gray-400 mt-1">${log.time}</p>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
    }

    createMonitoringCard(title, value, icon, iconColor, bgColor) {
        return `
            <div class="bg-white rounded-lg shadow p-6">
                <div class="flex items-center justify-between mb-4">
                    <span class="text-gray-600 text-sm">${title}</span>
                    <div class="${bgColor} p-3 rounded-lg">
                        <i class="fas ${icon} ${iconColor}"></i>
                    </div>
                </div>
                <div class="text-3xl font-bold text-gray-900">${value}</div>
            </div>
        `;
    }

    generateSystemLogs() {
        return [
            {
                title: '数据同步完成',
                message: '业务数据库同步完成，处理 15,234 条记录',
                time: '2分钟前',
                icon: 'fa-check-circle',
                iconColor: 'text-green-500',
                borderColor: 'border-green-500'
            },
            {
                title: '模型部署成功',
                message: '用户流失预测模型 v2.1.0 部署成功',
                time: '5分钟前',
                icon: 'fa-rocket',
                iconColor: 'text-blue-500',
                borderColor: 'border-blue-500'
            },
            {
                title: 'ETL任务执行',
                message: '用户行为数据清洗工作流执行完成',
                time: '10分钟前',
                icon: 'fa-cogs',
                iconColor: 'text-purple-500',
                borderColor: 'border-purple-500'
            },
            {
                title: '系统告警',
                message: 'API网关响应时间超过阈值，平均 450ms',
                time: '15分钟前',
                icon: 'fa-exclamation-triangle',
                iconColor: 'text-yellow-500',
                borderColor: 'border-yellow-500'
            }
        ];
    }

    startDataStream() {
        const table = document.getElementById('dataStreamTable');
        if (!table) return;

        const dataStreams = [
            { source: 'MySQL业务库', type: '增量同步', records: '1,234', status: '完成' },
            { source: 'Kafka用户日志', type: '实时流', records: '15,234', status: '运行中' },
            { source: 'MongoDB画像', type: '全量同步', records: '45,678', status: '运行中' },
            { source: 'API接口', type: 'REST调用', records: '892', status: '完成' }
        ];

        setInterval(() => {
            const newRows = dataStreams.map(stream => {
                const records = Math.floor(Math.random() * 10000) + 1000;
                const time = new Date().toLocaleTimeString();
                return `
                    <tr>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${time}</td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${stream.source}</td>
                        <td class="px-6 py-4 whitespace-nowrap">
                            <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">
                                ${stream.type}
                            </span>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${records.toLocaleString()}</td>
                        <td class="px-6 py-4 whitespace-nowrap">
                            <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${stream.status === '完成' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}">
                                ${stream.status}
                            </span>
                        </td>
                    </tr>
                `;
            }).join('');

            table.innerHTML = newRows + table.innerHTML.substring(0, table.innerHTML.length - 1000);
        }, 3000);
    }

    startRealTimeUpdates() {
        // 模拟实时数据更新
        this.updateInterval = setInterval(() => {
            this.updateMetrics();
        }, 5000);
    }

    stopRealTimeUpdates() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
        }
    }

    updateMetrics() {
        // 模拟指标更新
        console.log('Updating real-time metrics...');
    }

    generateTimeLabels(days) {
        const labels = [];
        for (let i = days - 1; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            labels.push(date.toLocaleDateString());
        }
        return labels;
    }

    generateRandomData(count, min, max) {
        const data = [];
        for (let i = 0; i < count; i++) {
            data.push(Math.floor(Math.random() * (max - min + 1)) + min);
        }
        return data;
    }

    toggleSidebar() {
        const sidebar = document.getElementById('sidebar');
        sidebar.classList.toggle('-translate-x-full');
    }
}

// 全局函数
function showPage(pageName) {
    platform.showPage(pageName);
}

function toggleSidebar() {
    platform.toggleSidebar();
}

function testAllConnections() {
    if (typeof dataSourceManager !== 'undefined') {
        dataSourceManager.testAllConnections();
    } else {
        alert('正在测试所有数据源连接...');
    }
}

// 数据源操作函数
function testConnection(dataSourceId) {
    if (typeof dataSourceManager !== 'undefined') {
        dataSourceManager.testConnectionById(dataSourceId);
    } else {
        alert('测试连接功能暂不可用');
    }
}

function editDataSource(dataSourceId) {
    if (typeof dataSourceManager !== 'undefined') {
        dataSourceManager.editDataSource(dataSourceId);
    } else {
        alert('编辑功能暂不可用');
    }
}

function deleteDataSource(dataSourceId) {
    if (typeof dataSourceManager !== 'undefined') {
        dataSourceManager.deleteDataSource(dataSourceId);
    } else {
        if (confirm('确定要删除这个数据源吗？')) {
            console.log('删除数据源:', dataSourceId);
        }
    }
}

// 初始化应用
const platform = new DataAIPlatform();