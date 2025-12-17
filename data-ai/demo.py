#!/usr/bin/env python3
"""
数智一体化平台演示脚本
演示平台的核心功能：数据源管理、数据采集、ETL处理、AI建模等
"""

import sys
import os
import json
import sqlite3
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
from typing import Dict, List, Any
import logging

# 设置日志
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

class DataAIPlatformDemo:
    """数智一体化平台演示类"""

    def __init__(self):
        self.platform_name = "数智一体化平台"
        self.version = "1.0.0"
        self.data_sources = []
        self.datasets = []
        self.etl_workflows = []
        self.models = []

        # 创建演示数据目录
        self.demo_dir = "demo_data"
        os.makedirs(self.demo_dir, exist_ok=True)

    def print_header(self, title: str):
        """打印标题"""
        print("\n" + "="*60)
        print(f"  {title}")
        print("="*60)

    def print_section(self, title: str):
        """打印章节"""
        print(f"\n{'-'*40}")
        print(f"  {title}")
        print(f"{'-'*40}")

    def demo_data_source_management(self):
        """演示数据源管理功能"""
        self.print_header("1. 数据源管理模块演示")

        # 模拟不同类型的数据源
        data_sources = [
            {
                "id": "ds_001",
                "name": "业务数据库",
                "type": "MySQL",
                "host": "mysql.example.com",
                "port": 3306,
                "database": "business_db",
                "status": "已连接",
                "tables": 15,
                "last_sync": "2024-12-17 10:30:00"
            },
            {
                "id": "ds_002",
                "name": "用户行为日志",
                "type": "Kafka",
                "brokers": ["kafka1:9092", "kafka2:9092"],
                "topics": ["user_actions", "page_views"],
                "status": "运行中",
                "messages_per_sec": 1500,
                "last_sync": "实时"
            },
            {
                "id": "ds_003",
                "name": "用户画像数据",
                "type": "MongoDB",
                "host": "mongo.example.com",
                "port": 27017,
                "database": "user_profiles",
                "status": "已连接",
                "collections": 8,
                "documents": 1000000
            },
            {
                "id": "ds_004",
                "name": "API数据接口",
                "type": "REST API",
                "url": "https://api.example.com/v1",
                "status": "正常",
                "endpoint_count": 25,
                "requests_per_day": 50000
            },
            {
                "id": "ds_005",
                "name": "云存储文件",
                "type": "MinIO",
                "bucket": "data-lake",
                "files": 5000,
                "total_size": "2.5TB",
                "status": "已连接"
            }
        ]

        self.data_sources = data_sources
        self.print_section("已注册的数据源")

        for ds in data_sources:
            print(f"📊 {ds['name']} ({ds['type']})")
            print(f"   状态: {ds['status']}")
            for key, value in ds.items():
                if key not in ['id', 'name', 'type', 'status']:
                    print(f"   {key}: {value}")
            print()

        # 演示连接测试
        self.print_section("数据源连接测试")
        for ds in data_sources:
            print(f"测试连接: {ds['name']} - {'✅ 成功' if ds['status'] in ['已连接', '运行中', '正常'] else '❌ 失败'}")

    def demo_data_collection(self):
        """演示数据采集功能"""
        self.print_header("2. 数据采集模块演示")

        # 模拟数据采集任务
        collection_tasks = [
            {
                "task_id": "task_001",
                "name": "用户行为数据采集",
                "source": "用户行为日志",
                "collection_type": "实时流采集",
                "status": "运行中",
                "records_collected": 1500000,
                "start_time": "2024-12-01 00:00:00",
                "collection_rate": "1500条/秒"
            },
            {
                "task_id": "task_002",
                "name": "电商商品数据爬取",
                "source": "多个电商网站",
                "collection_type": "网络爬虫",
                "status": "已完成",
                "records_collected": 50000,
                "start_time": "2024-12-15 08:00:00",
                "end_time": "2024-12-15 18:00:00"
            },
            {
                "task_id": "task_003",
                "name": "IoT设备数据采集",
                "source": "传感器网络",
                "collection_type": "IoT数据采集",
                "status": "运行中",
                "devices": 100,
                "data_points": 2400000,
                "collection_rate": "1000点/秒"
            }
        ]

        self.print_section("数据采集任务状态")
        for task in collection_tasks:
            print(f"🔄 {task['name']}")
            print(f"   采集类型: {task['collection_type']}")
            print(f"   状态: {task['status']}")
            print(f"   已采集记录: {task.get('records_collected', 0):,}")
            print(f"   采集速率: {task.get('collection_rate', 'N/A')}")
            print()

    def demo_dataset_management(self):
        """演示数据集管理功能"""
        self.print_header("3. 数据集管理模块演示")

        # 创建示例数据集
        datasets = [
            {
                "id": "dataset_001",
                "name": "用户行为数据集",
                "type": "结构化数据",
                "source": "业务数据库",
                "records": 1000000,
                "size": "500MB",
                "columns": 25,
                "created_date": "2024-12-01",
                "last_updated": "2024-12-17",
                "tags": ["用户行为", "实时", "结构化"],
                "version": "v1.2.0",
                "quality_score": 95.2
            },
            {
                "id": "dataset_002",
                "name": "商品推荐训练集",
                "type": "训练数据",
                "source": "用户行为日志",
                "records": 500000,
                "size": "2GB",
                "columns": 18,
                "created_date": "2024-12-10",
                "last_updated": "2024-12-15",
                "tags": ["推荐", "机器学习", "训练集"],
                "version": "v2.1.0",
                "quality_score": 98.5
            },
            {
                "id": "dataset_003",
                "name": "用户评论情感数据",
                "type": "文本数据",
                "source": "用户评论",
                "records": 200000,
                "size": "1.5GB",
                "created_date": "2024-12-05",
                "tags": ["文本", "情感分析", "NLP"],
                "version": "v1.0.0",
                "quality_score": 92.8
            }
        ]

        self.datasets = datasets
        self.print_section("数据集概览")

        for dataset in datasets:
            print(f"📋 {dataset['name']}")
            print(f"   类型: {dataset['type']}")
            print(f"   记录数: {dataset['records']:,}")
            print(f"   大小: {dataset['size']}")
            print(f"   标签: {', '.join(dataset['tags'])}")
            print(f"   质量分数: {dataset['quality_score']}")
            print()

        # 演示数据预览
        self.print_section("数据预览示例")
        self._create_sample_data()

    def _create_sample_data(self):
        """创建示例数据"""
        # 生成示例用户行为数据
        np.random.seed(42)
        n_records = 1000

        sample_data = {
            'user_id': np.random.randint(1, 10000, n_records),
            'action': np.random.choice(['view', 'click', 'purchase', 'cart'], n_records, p=[0.5, 0.3, 0.1, 0.1]),
            'page': np.random.choice(['home', 'product', 'category', 'search'], n_records),
            'timestamp': pd.date_range('2024-12-17', periods=n_records, freq='1min'),
            'duration': np.random.randint(5, 300, n_records),
            'device': np.random.choice(['mobile', 'desktop', 'tablet'], n_records)
        }

        df = pd.DataFrame(sample_data)

        print("示例数据预览 (前5条记录):")
        print(df.head().to_string(index=False))
        print(f"\n数据统计:")
        print(df.describe())

        # 保存示例数据
        df.to_csv(f"{self.demo_dir}/user_behavior_sample.csv", index=False)
        print(f"\n✅ 示例数据已保存到 {self.demo_dir}/user_behavior_sample.csv")

    def demo_etl_workflow(self):
        """演示ETL工作流功能"""
        self.print_header("4. 可视化ETL模块演示")

        # 模拟ETL工作流
        etl_workflows = [
            {
                "workflow_id": "etl_001",
                "name": "用户行为数据清洗",
                "status": "运行中",
                "nodes": 8,
                "schedule": "每30分钟",
                "last_run": "2024-12-17 10:30:00",
                "next_run": "2024-12-17 11:00:00",
                "avg_duration": "5分钟"
            },
            {
                "workflow_id": "etl_002",
                "name": "实时推荐特征计算",
                "status": "运行中",
                "nodes": 12,
                "schedule": "实时流",
                "throughput": "5000条/秒",
                "latency": "<100ms"
            },
            {
                "workflow_id": "etl_003",
                "name": "日报数据聚合",
                "status": "已完成",
                "nodes": 6,
                "schedule": "每天02:00",
                "last_run": "2024-12-17 02:00:00",
                "duration": "15分钟"
            }
        ]

        self.etl_workflows = etl_workflows
        self.print_section("ETL工作流列表")

        for workflow in etl_workflows:
            print(f"🔄 {workflow['name']}")
            print(f"   状态: {workflow['status']}")
            print(f"   节点数: {workflow['nodes']}")
            print(f"   调度: {workflow['schedule']}")
            if workflow['status'] == '运行中':
                print(f"   下次运行: {workflow.get('next_run', 'N/A')}")
            else:
                print(f"   上次运行: {workflow.get('last_run', 'N/A')}")
            print()

        # 演示ETL节点类型
        self.print_section("ETL节点类型")
        node_types = [
            {"type": "输入节点", "examples": ["数据库读取", "文件读取", "API读取"]},
            {"type": "转换节点", "examples": ["数据清洗", "字段映射", "数据过滤"]},
            {"type": "聚合节点", "examples": ["分组聚合", "窗口聚合", "连接合并"]},
            {"type": "输出节点", "examples": ["数据库写入", "文件输出", "消息推送"]},
            {"type": "AI节点", "examples": ["模型预测", "特征提取", "异常检测"]}
        ]

        for node_type in node_types:
            print(f"🔧 {node_type['type']}: {', '.join(node_type['examples'])}")

    def demo_ai_modeling(self):
        """演示AI建模功能"""
        self.print_header("5. AI建模平台演示")

        # 模拟机器学习模型
        models = [
            {
                "model_id": "model_001",
                "name": "用户流失预测模型",
                "type": "分类模型",
                "algorithm": "XGBoost",
                "status": "已部署",
                "accuracy": 0.92,
                "precision": 0.89,
                "recall": 0.94,
                "auc": 0.95,
                "training_data": "用户行为数据集",
                "version": "v2.1.0",
                "deploy_date": "2024-12-10"
            },
            {
                "model_id": "model_002",
                "name": "商品推荐模型",
                "type": "推荐系统",
                "algorithm": "DeepFM",
                "status": "已部署",
                "precision@10": 0.78,
                "recall@10": 0.65,
                "ndcg@10": 0.72,
                "training_data": "商品推荐训练集",
                "version": "v3.0.1",
                "deploy_date": "2024-12-08"
            },
            {
                "model_id": "model_003",
                "name": "评论情感分析模型",
                "type": "NLP模型",
                "algorithm": "BERT",
                "status": "训练中",
                "accuracy": 0.88,
                "f1_score": 0.87,
                "training_progress": "85%",
                "training_data": "用户评论情感数据",
                "version": "v1.0.0"
            }
        ]

        self.models = models
        self.print_section("机器学习模型")

        for model in models:
            print(f"🤖 {model['name']}")
            print(f"   类型: {model['type']}")
            print(f"   算法: {model['algorithm']}")
            print(f"   状态: {model['status']}")
            print(f"   版本: {model['version']}")

            # 显示性能指标
            metrics = [k for k in model.keys() if k in ['accuracy', 'precision', 'recall', 'auc', 'f1_score', 'precision@10', 'recall@10', 'ndcg@10']]
            if metrics:
                print("   性能指标:")
                for metric in metrics[:3]:  # 只显示前3个指标
                    print(f"     {metric}: {model[metric]:.3f}")

            if model['status'] == '训练中':
                print(f"   训练进度: {model['training_progress']}")
            print()

    def demo_agent_platform(self):
        """演示智能体平台功能"""
        self.print_header("6. 智能体平台演示")

        # 模拟智能体
        agents = [
            {
                "agent_id": "agent_001",
                "name": "数据分析助手",
                "type": "数据分析Agent",
                "status": "运行中",
                "capabilities": ["数据探索", "统计分析", "可视化生成"],
                "tools": ["pandas", "matplotlib", "sql"],
                "last_activity": "2024-12-17 10:45:00",
                "tasks_completed": 156
            },
            {
                "agent_id": "agent_002",
                "name": "智能客服机器人",
                "type": "对话Agent",
                "status": "运行中",
                "capabilities": ["问答对话", "问题解决", "工单创建"],
                "tools": ["知识库", "工单系统", "NLP模型"],
                "last_activity": "2024-12-17 10:52:00",
                "tasks_completed": 2341
            },
            {
                "agent_id": "agent_003",
                "name": "数据质量监控Agent",
                "type": "监控Agent",
                "status": "运行中",
                "capabilities": ["质量检查", "异常检测", "告警通知"],
                "tools": ["数据质量规则", "监控系统", "通知服务"],
                "last_activity": "2024-12-17 10:48:00",
                "tasks_completed": 89
            }
        ]

        self.print_section("智能体列表")

        for agent in agents:
            print(f"🤖 {agent['name']}")
            print(f"   类型: {agent['type']}")
            print(f"   状态: {agent['status']}")
            print(f"   能力: {', '.join(agent['capabilities'])}")
            print(f"   已完成任务: {agent['tasks_completed']}")
            print()

    def demo_data_visualization(self):
        """演示数据可视化功能"""
        self.print_header("7. 数据可视化模块演示")

        # 模拟仪表板
        dashboards = [
            {
                "dashboard_id": "dash_001",
                "name": "业务运营驾驶舱",
                "description": "实时监控业务核心指标",
                "charts": 8,
                "refresh_rate": "5分钟",
                "viewers": 45,
                "last_viewed": "2024-12-17 10:50:00"
            },
            {
                "dashboard_id": "dash_002",
                "name": "用户行为分析",
                "description": "深入分析用户行为模式",
                "charts": 12,
                "refresh_rate": "1小时",
                "viewers": 28,
                "last_viewed": "2024-12-17 09:30:00"
            },
            {
                "dashboard_id": "dash_003",
                "name": "AI模型监控",
                "description": "监控AI模型性能和预测",
                "charts": 6,
                "refresh_rate": "实时",
                "viewers": 15,
                "last_viewed": "2024-12-17 10:55:00"
            }
        ]

        self.print_section("数据仪表板")

        for dashboard in dashboards:
            print(f"📊 {dashboard['name']}")
            print(f"   描述: {dashboard['description']}")
            print(f"   图表数: {dashboard['charts']}")
            print(f"   刷新频率: {dashboard['refresh_rate']}")
            print(f"   今日访客: {dashboard['viewers']}")
            print()

        # 生成示例图表数据
        self.print_section("示例图表数据")
        self._generate_chart_data()

    def _generate_chart_data(self):
        """生成示例图表数据"""
        # 生成时间序列数据
        dates = pd.date_range('2024-12-01', '2024-12-17', freq='D')

        # 用户活跃度趋势
        active_users = np.random.randint(10000, 15000, len(dates))
        new_users = np.random.randint(500, 1000, len(dates))

        print("📈 用户活跃度趋势 (最近7天)")
        for i in range(-7, 0):
            date_str = dates[i].strftime('%Y-%m-%d')
            print(f"   {date_str}: 活跃用户 {active_users[i]:,}, 新增用户 {new_users[i]:,}")

        # 行为分布饼图数据
        actions = ['view', 'click', 'purchase', 'cart', 'search']
        action_counts = [45000, 28000, 3500, 8000, 12000]

        print(f"\n🥧 用户行为分布")
        for action, count in zip(actions, action_counts):
            percentage = count / sum(action_counts) * 100
            print(f"   {action}: {count:,} ({percentage:.1f}%)")

    def demo_system_monitoring(self):
        """演示系统监控功能"""
        self.print_header("8. 系统监控与管理模块演示")

        # 系统状态
        system_status = {
            "平台整体状态": "正常",
            "服务可用性": "99.95%",
            "响应时间": "125ms",
            "数据处理量": "2.5TB/天",
            "活跃用户": "1,250",
            "在线数据源": "15/15",
            "运行ETL任务": "23/25",
            "已部署模型": "12",
            "活跃Agent": "8"
        }

        self.print_section("系统状态概览")
        for metric, value in system_status.items():
            print(f"📊 {metric}: {value}")

        # 服务状态
        services = [
            {"name": "API网关", "status": "正常", "cpu": "45%", "memory": "2.1GB", "requests": "1.2k/秒"},
            {"name": "数据处理引擎", "status": "正常", "cpu": "68%", "memory": "4.5GB", "throughput": "50MB/秒"},
            {"name": "AI推理服务", "status": "正常", "cpu": "52%", "memory": "3.8GB", "predictions": "800/秒"},
            {"name": "消息队列", "status": "正常", "cpu": "23%", "memory": "1.2GB", "messages": "15k/秒"},
            {"name": "缓存服务", "status": "正常", "cpu": "18%", "memory": "2.8GB", "hit_rate": "94.5%"}
        ]

        self.print_section("微服务状态")
        for service in services:
            print(f"🔧 {service['name']}")
            print(f"   状态: {service['status']}")
            print(f"   CPU使用率: {service['cpu']}")
            print(f"   内存使用: {service['memory']}")
            for key, value in service.items():
                if key not in ['name', 'status', 'cpu', 'memory']:
                    print(f"   {key}: {value}")
            print()

    def demo_data_security(self):
        """演示数据安全功能"""
        self.print_header("9. 数据安全与权限管理演示")

        # 安全统计
        security_stats = {
            "加密数据源": "15/15",
            "数据脱敏规则": "128",
            "访问控制策略": "45",
            "今日登录用户": "238",
            "权限变更记录": "12",
            "安全告警": "0",
            "数据审计日志": "1,258,450"
        }

        self.print_section("安全状态")
        for metric, value in security_stats.items():
            print(f"🔒 {metric}: {value}")

        # 权限管理
        permissions = [
            {"role": "数据分析师", "users": 45, "permissions": ["数据查看", "报表创建", "查询执行"]},
            {"role": "数据工程师", "users": 12, "permissions": ["数据管理", "ETL设计", "任务调度"]},
            {"role": "AI工程师", "users": 8, "permissions": ["模型训练", "模型部署", "预测服务"]},
            {"role": "系统管理员", "users": 3, "permissions": ["系统配置", "用户管理", "权限分配"]},
            {"role": "业务用户", "users": 170, "permissions": ["报表查看", "数据导出"]}
        ]

        self.print_section("角色权限管理")
        for role in permissions:
            print(f"👥 {role['role']} ({role['users']}人)")
            print(f"   权限: {', '.join(role['permissions'])}")
            print()

    def demo_integration_capabilities(self):
        """演示集成能力"""
        self.print_header("10. 平台集成能力演示")

        # 集成连接器
        connectors = {
            "数据库连接器": ["MySQL", "PostgreSQL", "Oracle", "SQL Server", "MongoDB", "Redis"],
            "消息队列": ["Kafka", "RabbitMQ", "Pulsar", "ActiveMQ"],
            "云平台": ["AWS S3", "阿里云OSS", "腾讯云COS", "华为云OBS"],
            "API框架": ["REST API", "GraphQL", "gRPC", "WebSocket"],
            "大数据平台": ["Hadoop", "Spark", "Flink", "ClickHouse"],
            "机器学习": ["TensorFlow", "PyTorch", "Scikit-learn", "MLflow"]
        }

        self.print_section("支持的集成连接器")
        for category, items in connectors.items():
            print(f"🔌 {category}: {', '.join(items)}")

        # 开放API
        self.print_section("开放API能力")
        apis = [
            {"name": "数据源管理API", "endpoints": 15, "requests_per_day": "50万"},
            {"name": "数据查询API", "endpoints": 12, "requests_per_day": "200万"},
            {"name": "ETL调度API", "endpoints": 8, "requests_per_day": "10万"},
            {"name": "AI预测API", "endpoints": 6, "requests_per_day": "500万"},
            {"name": "Agent通信API", "endpoints": 10, "requests_per_day": "100万"}
        ]

        for api in apis:
            print(f"🔗 {api['name']}")
            print(f"   API端点数: {api['endpoints']}")
            print(f"   日调用量: {api['requests_per_day']}")
            print()

    def generate_summary_report(self):
        """生成平台总结报告"""
        self.print_header("数智一体化平台 - 演示总结报告")

        summary = {
            "数据源总数": len(self.data_sources),
            "数据集总数": len(self.datasets),
            "ETL工作流数": len(self.etl_workflows),
            "AI模型数": len(self.models),
            "平台版本": self.version,
            "演示时间": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        }

        self.print_section("平台能力概览")
        for key, value in summary.items():
            print(f"📊 {key}: {value}")

        self.print_section("核心优势")
        advantages = [
            "✅ 统一的数据中台架构，支持多种数据源接入",
            "✅ 可视化ETL工具，降低数据处理技术门槛",
            "✅ 完整的AI建模平台，支持端到端机器学习流程",
            "✅ 智能体平台，支持多Agent协作和工作流编排",
            "✅ 丰富的可视化组件，支持大屏和仪表板定制",
            "✅ 企业级安全保障，完善的权限管理和数据加密",
            "✅ 高可用架构设计，支持水平扩展和故障恢复",
            "✅ 开放的API生态，支持第三方系统集成"
        ]

        for advantage in advantages:
            print(f"   {advantage}")

        self.print_section("应用场景")
        scenarios = [
            "🏢 企业数据中台建设 - 统一管理企业数据资产",
            "📊 实时数据分析平台 - 支持实时决策和业务洞察",
            "🤖 AI模型工厂 - 规模化机器学习模型开发与部署",
            "📈 智能运营系统 - 自动化业务监控和优化",
            "🔍 用户画像平台 - 深度理解用户行为和偏好",
            "🎯 个性化推荐系统 - 提升用户体验和转化率",
            "🔒 数据治理平台 - 确保数据质量和合规性"
        ]

        for scenario in scenarios:
            print(f"   {scenario}")

        print(f"\n{'='*60}")
        print("  🎉 数智一体化平台演示完成！")
        print("  💡 这是一个完整的数据智能解决方案，助力企业数字化转型")
        print("="*60)

    def run_demo(self):
        """运行完整演示"""
        print(f"🚀 欢迎使用 {self.platform_name} v{self.version}")
        print("正在启动平台演示...\n")

        try:
            self.demo_data_source_management()
            self.demo_data_collection()
            self.demo_dataset_management()
            self.demo_etl_workflow()
            self.demo_ai_modeling()
            self.demo_agent_platform()
            self.demo_data_visualization()
            self.demo_system_monitoring()
            self.demo_data_security()
            self.demo_integration_capabilities()
            self.generate_summary_report()

        except Exception as e:
            logger.error(f"演示过程中出现错误: {e}")
            print(f"\n❌ 演示过程中出现错误: {e}")
        else:
            print(f"\n✅ 演示成功完成！")


def main():
    """主函数"""
    demo = DataAIPlatformDemo()
    demo.run_demo()

    # 生成演示报告文件
    report_file = "demo_report.json"
    report_data = {
        "platform_name": demo.platform_name,
        "version": demo.version,
        "demo_time": datetime.now().isoformat(),
        "data_sources_count": len(demo.data_sources),
        "datasets_count": len(demo.datasets),
        "etl_workflows_count": len(demo.etl_workflows),
        "models_count": len(demo.models),
        "summary": "数智一体化平台演示成功完成"
    }

    with open(report_file, 'w', encoding='utf-8') as f:
        json.dump(report_data, f, indent=2, ensure_ascii=False)

    print(f"\n📄 演示报告已保存到: {report_file}")


if __name__ == "__main__":
    main()