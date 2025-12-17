// 图表增强组件
class ChartManager {
    constructor() {
        this.charts = new Map();
        this.defaultOptions = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                    labels: {
                        usePointStyle: true,
                        padding: 20,
                        font: {
                            size: 12
                        }
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    padding: 12,
                    titleFont: {
                        size: 14
                    },
                    bodyFont: {
                        size: 12
                    },
                    cornerRadius: 6,
                    displayColors: true
                }
            },
            animation: {
                duration: 1000,
                easing: 'easeInOutQuart'
            }
        };

        // 使图表管理器全局可用
        window.chartManager = this;
    }

    // 创建折线图
    createLineChart(canvasId, data, options = {}) {
        const ctx = document.getElementById(canvasId);
        if (!ctx) return null;

        const config = {
            type: 'line',
            data: data,
            options: {
                ...this.defaultOptions,
                ...options,
                scales: {
                    x: {
                        grid: {
                            display: false,
                            drawBorder: false
                        },
                        ticks: {
                            font: {
                                size: 11
                            },
                            color: '#666'
                        }
                    },
                    y: {
                        grid: {
                            borderDash: [2, 2],
                            color: '#e0e0e0'
                        },
                        ticks: {
                            font: {
                                size: 11
                            },
                            color: '#666'
                        }
                    }
                },
                elements: {
                    line: {
                        tension: 0.4,
                        borderWidth: 3,
                        pointRadius: 4,
                        pointHoverRadius: 6,
                        pointBackgroundColor: '#fff',
                        pointBorderWidth: 2
                    }
                }
            }
        };

        const chart = new Chart(ctx, config);
        this.charts.set(canvasId, chart);
        return chart;
    }

    // 创建柱状图
    createBarChart(canvasId, data, options = {}) {
        const ctx = document.getElementById(canvasId);
        if (!ctx) return null;

        const config = {
            type: 'bar',
            data: data,
            options: {
                ...this.defaultOptions,
                ...options,
                scales: {
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            font: {
                                size: 11
                            },
                            color: '#666'
                        }
                    },
                    y: {
                        grid: {
                            borderDash: [2, 2],
                            color: '#e0e0e0'
                        },
                        ticks: {
                            font: {
                                size: 11
                            },
                            color: '#666'
                        },
                        beginAtZero: true
                    }
                },
                elements: {
                    bar: {
                        borderRadius: 6,
                        borderWidth: 0
                    }
                }
            }
        };

        const chart = new Chart(ctx, config);
        this.charts.set(canvasId, chart);
        return chart;
    }

    // 创建饼图
    createPieChart(canvasId, data, options = {}) {
        const ctx = document.getElementById(canvasId);
        if (!ctx) return null;

        const config = {
            type: 'doughnut',
            data: data,
            options: {
                ...this.defaultOptions,
                ...options,
                cutout: '60%',
                plugins: {
                    ...this.defaultOptions.plugins,
                    legend: {
                        ...this.defaultOptions.plugins.legend,
                        position: 'right'
                    }
                },
                elements: {
                    arc: {
                        borderWidth: 0
                    }
                }
            }
        };

        const chart = new Chart(ctx, config);
        this.charts.set(canvasId, chart);
        return chart;
    }

    // 创建面积图
    createAreaChart(canvasId, data, options = {}) {
        const ctx = document.getElementById(canvasId);
        if (!ctx) return null;

        const config = {
            type: 'line',
            data: data,
            options: {
                ...this.defaultOptions,
                ...options,
                scales: {
                    x: {
                        grid: {
                            display: false
                        }
                    },
                    y: {
                        grid: {
                            borderDash: [2, 2],
                            color: '#e0e0e0'
                        },
                        beginAtZero: true
                    }
                },
                elements: {
                    line: {
                        tension: 0.4,
                        borderWidth: 3,
                        fill: true
                    },
                    point: {
                        radius: 0,
                        hoverRadius: 6
                    }
                }
            }
        };

        const chart = new Chart(ctx, config);
        this.charts.set(canvasId, chart);
        return chart;
    }

    // 创建雷达图
    createRadarChart(canvasId, data, options = {}) {
        const ctx = document.getElementById(canvasId);
        if (!ctx) return null;

        const config = {
            type: 'radar',
            data: data,
            options: {
                ...this.defaultOptions,
                ...options,
                scales: {
                    r: {
                        grid: {
                            borderDash: [2, 2],
                            color: '#e0e0e0'
                        },
                        pointLabels: {
                            font: {
                                size: 12
                            },
                            color: '#666'
                        },
                        ticks: {
                            backdropColor: 'transparent',
                            color: '#666'
                        }
                    }
                },
                elements: {
                    line: {
                        borderWidth: 3
                    },
                    point: {
                        radius: 4,
                        hoverRadius: 6
                    }
                }
            }
        };

        const chart = new Chart(ctx, config);
        this.charts.set(canvasId, chart);
        return chart;
    }

    // 更新图表数据
    updateChart(canvasId, newData) {
        const chart = this.charts.get(canvasId);
        if (chart) {
            chart.data = newData;
            chart.update('active');
            return true;
        }
        return false;
    }

    // 添加数据点
    addDataPoint(canvasId, label, data) {
        const chart = this.charts.get(canvasId);
        if (chart) {
            chart.data.labels.push(label);
            chart.data.datasets.forEach((dataset, index) => {
                dataset.data.push(data[index] || 0);
            });
            chart.update('active');
            return true;
        }
        return false;
    }

    // 移除数据点
    removeDataPoint(canvasId, index) {
        const chart = this.charts.get(canvasId);
        if (chart && chart.data.labels.length > 0) {
            chart.data.labels.splice(index, 1);
            chart.data.datasets.forEach(dataset => {
                dataset.data.splice(index, 1);
            });
            chart.update('active');
            return true;
        }
        return false;
    }

    // 更新数据集
    updateDataset(canvasId, datasetIndex, newData) {
        const chart = this.charts.get(canvasId);
        if (chart && chart.data.datasets[datasetIndex]) {
            chart.data.datasets[datasetIndex].data = newData;
            chart.update('active');
            return true;
        }
        return false;
    }

    // 添加数据集
    addDataset(canvasId, newDataset) {
        const chart = this.charts.get(canvasId);
        if (chart) {
            chart.data.datasets.push(newDataset);
            chart.update('active');
            return true;
        }
        return false;
    }

    // 设置图表主题
    setTheme(theme) {
        const isDark = theme === 'dark';
        const textColor = isDark ? '#e5e7eb' : '#374151';
        const gridColor = isDark ? '#374151' : '#e5e7eb';

        this.charts.forEach(chart => {
            // 更新文字颜色
            if (chart.options.scales) {
                Object.values(chart.options.scales).forEach(scale => {
                    if (scale.ticks) {
                        scale.ticks.color = textColor;
                        scale.ticks.font.color = textColor;
                    }
                    if (scale.grid) {
                        scale.grid.color = gridColor;
                    }
                    if (scale.pointLabels) {
                        scale.pointLabels.color = textColor;
                    }
                });
            }

            // 更新图例颜色
            if (chart.options.plugins && chart.options.plugins.legend) {
                chart.options.plugins.legend.labels.color = textColor;
                chart.options.plugins.legend.labels.font.color = textColor;
            }

            chart.update('none');
        });
    }

    // 销毁图表
    destroyChart(canvasId) {
        const chart = this.charts.get(canvasId);
        if (chart) {
            chart.destroy();
            this.charts.delete(canvasId);
            return true;
        }
        return false;
    }

    // 调整图表大小
    resizeChart(canvasId) {
        const chart = this.charts.get(canvasId);
        if (chart) {
            chart.resize();
            return true;
        }
        return false;
    }

    // 生成随机颜色
    generateColors(count) {
        const colors = [
            'rgba(99, 102, 241, 0.8)',
            'rgba(236, 72, 153, 0.8)',
            'rgba(34, 197, 94, 0.8)',
            'rgba(251, 146, 60, 0.8)',
            'rgba(147, 51, 234, 0.8)',
            'rgba(59, 130, 246, 0.8)',
            'rgba(16, 185, 129, 0.8)',
            'rgba(245, 101, 101, 0.8)',
            'rgba(234, 179, 8, 0.8)',
            'rgba(139, 92, 246, 0.8)'
        ];

        const result = [];
        for (let i = 0; i < count; i++) {
            result.push(colors[i % colors.length]);
        }
        return result;
    }

    // 创建渐变色
    createGradient(ctx, color1, color2) {
        const gradient = ctx.createLinearGradient(0, 0, 0, 300);
        gradient.addColorStop(0, color1);
        gradient.addColorStop(1, color2);
        return gradient;
    }

    // 格式化数字
    formatNumber(num) {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        } else if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num.toString();
    }

    // 获取图表统计信息
    getChartStats(canvasId) {
        const chart = this.charts.get(canvasId);
        if (!chart) return null;

        const stats = {
            datasets: chart.data.datasets.length,
            labels: chart.data.labels.length,
            dataPoints: chart.data.datasets.reduce((total, dataset) => {
                return total + dataset.data.filter(v => v !== null && v !== undefined).length;
            }, 0)
        };

        // 计算数据统计
        if (chart.data.datasets.length > 0) {
            const allData = chart.data.datasets.flatMap(dataset => dataset.data);
            const validData = allData.filter(v => typeof v === 'number');

            if (validData.length > 0) {
                stats.min = Math.min(...validData);
                stats.max = Math.max(...validData);
                stats.avg = validData.reduce((sum, val) => sum + val, 0) / validData.length;
                stats.sum = validData.reduce((sum, val) => sum + val, 0);
            }
        }

        return stats;
    }

    // 导出图表为图片
    exportChart(canvasId, filename = 'chart.png') {
        const chart = this.charts.get(canvasId);
        if (!chart) return false;

        const url = chart.toBase64Image();
        const link = document.createElement('a');
        link.download = filename;
        link.href = url;
        link.click();

        return true;
    }

    // 获取所有图表实例
    getAllCharts() {
        return Array.from(this.charts.entries());
    }

    // 清空所有图表
    clearAllCharts() {
        this.charts.forEach(chart => chart.destroy());
        this.charts.clear();
    }
}

// 初始化图表管理器
const chartManager = new ChartManager();

// 监听主题变化
if (typeof themeManager !== 'undefined') {
    themeManager.onThemeChange((event) => {
        chartManager.setTheme(event.detail.theme);
    });
}