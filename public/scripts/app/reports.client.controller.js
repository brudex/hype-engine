(function () {
    'use strict';

    angular
        .module('app')
        .controller('ReportsController', ReportsController);

    ReportsController.$inject = ['$scope', '$http', 'brudexservices', 'brudexutils', '$timeout'];

    function ReportsController($scope, $http, services, utils, $timeout) {
        var vm = this;

        // Properties
        vm.projects = [];
        vm.selectedProject = null;
        vm.selectedProjectUuid = null;
        vm.loading = false;
        vm.reportData = null;
        vm.accounts = [];
        vm.startDate = null;
        vm.endDate = null;
        vm.selected = {};
        vm.selected.accounts = [];
        vm.activeTab = 'metrics';
        vm.selectedAudienceAccount = null; // null = all accounts, UUID = specific account
        vm.audienceAccounts = []; // Cached audience accounts to prevent infinite digest
        vm.selectedFacebookInsightAccount = null; // null = all accounts, UUID = specific account
        vm.facebookInsightAccounts = []; // Cached Facebook insight accounts to prevent infinite digest
        
        // Methods
        vm.init = init;
        vm.loadProjects = loadProjects;
        vm.selectProject = selectProject;
        vm.getProjectInitials = getProjectInitials;
        vm.loadReports = loadReports;
        vm.loadAccounts = loadAccounts;
        
        // Metrics aggregation methods
        vm.getTotalLikes = getTotalLikes;
        vm.getTotalRetweets = getTotalRetweets;
        vm.getTotalReplies = getTotalReplies;
        vm.getTotalImpressions = getTotalImpressions;
        vm.getMetricValue = getMetricValue;
        vm.toggleMetricRow = toggleMetricRow;
        vm.isRowExpanded = isRowExpanded;
        vm.setActiveTab = setActiveTab;
        
        // Audience chart methods
        vm.initAudienceChart = initAudienceChart;
        vm.updateAudienceChart = updateAudienceChart;
        vm.getAudienceAccounts = getAudienceAccounts;
        vm.selectAudienceAccount = selectAudienceAccount;
        
        // Facebook Insights chart methods
        vm.initFacebookInsightsChart = initFacebookInsightsChart;
        vm.updateFacebookInsightsChart = updateFacebookInsightsChart;
        vm.selectFacebookInsightAccount = selectFacebookInsightAccount;
        
        // Track expanded rows
        vm.expandedRows = {};
        
        // Chart instances
        vm.audienceChart = null;
        vm.facebookInsightsChart = null;

        // Initialize
        function init(projectUuid) {
            // Set default date range (last 30 days)
            var endDate = new Date();
            var startDate = new Date();
            startDate.setDate(startDate.getDate() - 30);
            
            vm.endDate = endDate.toISOString().split('T')[0];
            vm.startDate = startDate.toISOString().split('T')[0];
            
            vm.selectedProjectUuid = projectUuid || null;
            
            loadProjects();
            
            // If projectUuid is provided, set it as selected and load reports for that project
            if (projectUuid) {
                $timeout(function() {
                    loadProjects().then(function() {
                        var project = vm.projects.find(function(p) {
                            return p.uuid === projectUuid;
                        });
                        if (project) {
                            vm.selectedProject = project;
                            loadAccounts(projectUuid);
                            loadReports();
                        }
                    });
                }, 500);
            }
        }

        // Load all projects
        function loadProjects() {
            return new Promise(function(resolve, reject) {
                vm.loading = true;
                services.getProjects(function(response) {
                    vm.loading = false;
                    if (response.success) {
                        vm.projects = response.data || [];
                        resolve(vm.projects);
                    } else {
                        utils.alertError('Error', response.message || 'Failed to load projects');
                        reject(response);
                    }
                });
            });
        }

        // Select project
        function selectProject(project, event) {
            if (event) {
                event.preventDefault();
                event.stopPropagation();
            }
            
            vm.selectedProject = project;
            vm.selectedProjectUuid = project ? project.uuid : null;
            vm.selected.accounts = [];
            vm.reportData = null;
            vm.accounts = [];
            
            // Close the dropdown
            var dropdownToggle = document.querySelector('.project-dropdown-toggle');
            if (dropdownToggle) {
                var parent = dropdownToggle.closest('.dropdown');
                var dropdownMenu = parent ? parent.querySelector('.dropdown-menu') : null;
                
                dropdownToggle.classList.remove('show');
                dropdownToggle.setAttribute('aria-expanded', 'false');
                if (dropdownMenu) {
                    dropdownMenu.classList.remove('show');
                }
                
                // Also use Bootstrap API
                $timeout(function() {
                    try {
                        var dropdown = bootstrap.Dropdown.getInstance(dropdownToggle);
                        if (dropdown) {
                            dropdown.hide();
                        }
                    } catch (e) {
                        // Fallback
                        dropdownToggle.classList.remove('show');
                        dropdownToggle.setAttribute('aria-expanded', 'false');
                        if (dropdownMenu) {
                            dropdownMenu.classList.remove('show');
                        }
                    }
                }, 0);
            }
            
            if (project) {
                loadAccounts(project.uuid);
                loadReports();
            }
        }  

        // Load accounts for the selected project
        function loadAccounts(projectUuid) {
            if (!projectUuid) {
                vm.accounts = [];
                return;
            }
            
            services.getAccounts(projectUuid, function(response) {
                if (response.success) {
                    vm.accounts = response.data || [];
                    console.log('Accounts loaded:', vm.accounts);
                } else {
                    utils.alertError('Error', response.message || 'Failed to load accounts');
                    vm.accounts = [];
                }
            }); 

        }

        // Get project initials
        function getProjectInitials(name) {
            if (!name) return '';
            var words = name.trim().split(/\s+/);
            if (words.length >= 2) {
                return (words[0][0] + words[1][0]).toUpperCase();
            }
            return name.substring(0, 2).toUpperCase();
        }

        // Load reports data
        function loadReports() {
            if (!vm.selectedProject) {
                return;
            }

            vm.loading = true;
            
            var payload = {
                projectUuid: vm.selectedProject.uuid,
                startDate: vm.startDate,
                endDate: vm.endDate
            };
            
            // Add selected accounts if any are selected
            if (vm.selected.accounts && vm.selected.accounts.length > 0) {
                payload.selectedAccounts = vm.selected.accounts;
            }
            
            console.log('Get Reports payload', payload);
            
            services.getReports(vm.selectedProject.uuid, payload, function(response) {
                vm.loading = false;
                if (response.success) {
                    vm.reportData = response.data;
                    console.log('Get Reports response', vm.reportData);
                    vm.expandedRows = {}; // Reset expanded rows when new data loads
                    
                    // Reset audience account selection when new data loads
                    vm.selectedAudienceAccount = null;
                    
                    // Update cached audience accounts
                    updateAudienceAccounts();
                    
                    // Reset Facebook Insights account selection when new data loads
                    vm.selectedFacebookInsightAccount = null;
                    
                    // Update cached Facebook Insights accounts
                    updateFacebookInsightAccounts();
                    
                    // Update audience chart if data is available
                    $timeout(function() {
                        if (vm.reportData && vm.reportData.audience && vm.reportData.audience.length > 0) {
                            // Destroy existing chart if any
                            if (vm.audienceChart) {
                                vm.audienceChart.destroy();
                                vm.audienceChart = null;
                            }
                            initAudienceChart();
                        }
                    }, 100);
                    
                    // Update Facebook Insights chart if data is available
                    $timeout(function() {
                        if (vm.reportData && vm.reportData.facebook_insights && vm.reportData.facebook_insights.length > 0) {
                            // Destroy existing chart if any
                            if (vm.facebookInsightsChart) {
                                vm.facebookInsightsChart.destroy();
                                vm.facebookInsightsChart = null;
                            }
                            initFacebookInsightsChart();
                        }
                    }, 100);
                    
                    // Debug: Log metrics data structure
                    if (vm.reportData && vm.reportData.metrics) {
                        console.log('Metrics loaded:', vm.reportData.metrics.length);
                        if (vm.reportData.metrics.length > 0) {
                            console.log('First metric sample:', JSON.stringify(vm.reportData.metrics[0], null, 2));
                            console.log('First metric data type:', typeof vm.reportData.metrics[0].data);
                            console.log('First metric data:', vm.reportData.metrics[0].data);
                        }
                    }
                } else {
                    utils.alertError('Error', response.message || 'Failed to load reports');
                    vm.reportData = null;
                }
            });
        }

        // ============================================
        // METRICS AGGREGATION
        // ============================================
        
        function getTotalLikes() {
            if (!vm.reportData || !vm.reportData.metrics) return 0;
            
            var total = 0;
            vm.reportData.metrics.forEach(function(metric) {
                if (metric.data) {
                    var data = typeof metric.data === 'string' ? JSON.parse(metric.data) : metric.data;
                    if (data.likes !== undefined && data.likes !== null) {
                        total += parseInt(data.likes) || 0;
                    }
                }
            });
            return total;
        }

        function getTotalRetweets() {
            if (!vm.reportData || !vm.reportData.metrics) return 0;
            
            var total = 0;
            vm.reportData.metrics.forEach(function(metric) {
                if (metric.data) {
                    var data = typeof metric.data === 'string' ? JSON.parse(metric.data) : metric.data;
                    // Handle both retweets and reblogs (Mastodon)
                    if (data.retweets !== undefined && data.retweets !== null) {
                        total += parseInt(data.retweets) || 0;
                    }
                    if (data.reblogs !== undefined && data.reblogs !== null) {
                        total += parseInt(data.reblogs) || 0;
                    }
                }
            });
            return total;
        }

        function getTotalReplies() {
            if (!vm.reportData || !vm.reportData.metrics) return 0;
            
            var total = 0;
            vm.reportData.metrics.forEach(function(metric) {
                if (metric.data) {
                    var data = typeof metric.data === 'string' ? JSON.parse(metric.data) : metric.data;
                    if (data.replies !== undefined && data.replies !== null) {
                        total += parseInt(data.replies) || 0;
                    }
                }
            });
            return total;
        }

        function getTotalImpressions() {
            if (!vm.reportData || !vm.reportData.metrics) return 0;
            
            var total = 0;
            vm.reportData.metrics.forEach(function(metric) {
                if (metric.data) {
                    var data = typeof metric.data === 'string' ? JSON.parse(metric.data) : metric.data;
                    if (data.impressions !== undefined && data.impressions !== null) {
                        total += parseInt(data.impressions) || 0;
                    }
                }
            });
            return total;
        }

        function getMetricValue(metric, key) {
            if (!metric || !metric.data) return 0;
            
            var data = typeof metric.data === 'string' ? JSON.parse(metric.data) : metric.data;
            var value = data[key];
            return value !== undefined && value !== null ? parseInt(value) || 0 : 0;
        }

        function toggleMetricRow(index) {
            if (vm.expandedRows[index]) {
                delete vm.expandedRows[index];
            } else {
                vm.expandedRows[index] = true;
            }
        }

        function isRowExpanded(index) {
            return !!vm.expandedRows[index];
        }

        function setActiveTab(tab) {
            vm.activeTab = tab;
            
            // Initialize audience chart when audience tab is clicked
            if (tab === 'audience') {
                $timeout(function() {
                    if (vm.reportData && vm.reportData.audience && vm.reportData.audience.length > 0) {
                        // Destroy existing chart if any
                        if (vm.audienceChart) {
                            vm.audienceChart.destroy();
                            vm.audienceChart = null;
                        }
                        initAudienceChart();
                    }
                }, 100);
            }
            
            // Initialize Facebook Insights chart when facebook-insights tab is clicked
            if (tab === 'facebook-insights') {
                $timeout(function() {
                    if (vm.reportData && vm.reportData.facebook_insights && vm.reportData.facebook_insights.length > 0) {
                        // Destroy existing chart if any
                        if (vm.facebookInsightsChart) {
                            vm.facebookInsightsChart.destroy();
                            vm.facebookInsightsChart = null;
                        }
                        initFacebookInsightsChart();
                    }
                }, 100);
            }
        }

        // ============================================
        // AUDIENCE CHART
        // ============================================
        
        function updateAudienceAccounts() {
            if (!vm.reportData || !vm.reportData.audience || vm.reportData.audience.length === 0) {
                vm.audienceAccounts = [];
                return;
            }
            
            var accountMap = {};
            vm.reportData.audience.forEach(function(aud) {
                if (aud.account && aud.account.uuid) {
                    if (!accountMap[aud.account.uuid]) {
                        accountMap[aud.account.uuid] = {
                            uuid: aud.account.uuid,
                            name: aud.account.name || 'Unknown Account',
                            provider: aud.account.provider || 'unknown'
                        };
                    }
                }
            });
            
            // Update cached array (sorted by name)
            vm.audienceAccounts = Object.values(accountMap).sort(function(a, b) {
                return a.name.localeCompare(b.name);
            });
        }
        
        function getAudienceAccounts() {
            // Return cached array to prevent infinite digest loops
            return vm.audienceAccounts;
        }
        
        function selectAudienceAccount(accountUuid) {
            vm.selectedAudienceAccount = accountUuid;
            
            // Destroy and recreate chart to avoid memory leaks
            if (vm.audienceChart) {
                vm.audienceChart.destroy();
                vm.audienceChart = null;
            }
            
            // Recreate chart with filtered data
            $timeout(function() {
                initAudienceChart();
            }, 50);
        }
        
        function initAudienceChart() {
            var ctx = document.getElementById('audienceChart');
            if (!ctx) {
                console.warn('Audience chart canvas not found');
                return;
            }
            
            // Destroy existing chart if any
            if (vm.audienceChart) {
                vm.audienceChart.destroy();
                vm.audienceChart = null;
            }
            
            var chartData = prepareAudienceChartData();
            
            if (chartData.labels.length === 0 || chartData.datasets.length === 0) {
                return;
            }
            
            vm.audienceChart = new Chart(ctx, {
                type: 'line',
                data: chartData,
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: vm.selectedAudienceAccount === null,
                            position: 'top',
                            labels: {
                                color: '#E0E0E0',
                                usePointStyle: true,
                                padding: 15,
                                font: {
                                    size: 12,
                                    family: "'Open Sans', sans-serif"
                                }
                            }
                        },
                        tooltip: {
                            mode: 'index',
                            intersect: false,
                            backgroundColor: 'rgba(0, 0, 0, 0.8)',
                            titleColor: '#E0E0E0',
                            bodyColor: '#E0E0E0',
                            borderColor: '#00EFFF',
                            borderWidth: 1,
                            padding: 12,
                            callbacks: {
                                label: function(context) {
                                    return context.dataset.label + ': ' + context.parsed.y.toLocaleString() + ' followers';
                                }
                            }
                        }
                    },
                    scales: {
                        x: {
                            title: {
                                display: true,
                                text: 'Date',
                                color: '#B0B0B0',
                                font: {
                                    size: 12
                                }
                            },
                            grid: {
                                color: 'rgba(255, 255, 255, 0.1)',
                                drawBorder: false
                            },
                            ticks: {
                                color: '#B0B0B0',
                                font: {
                                    size: 11
                                }
                            }
                        },
                        y: {
                            title: {
                                display: true,
                                text: 'Followers',
                                color: '#B0B0B0',
                                font: {
                                    size: 12
                                }
                            },
                            beginAtZero: false,
                            grid: {
                                color: 'rgba(255, 255, 255, 0.1)',
                                drawBorder: false
                            },
                            ticks: {
                                color: '#B0B0B0',
                                font: {
                                    size: 11
                                },
                                callback: function(value) {
                                    return value.toLocaleString();
                                }
                            }
                        }
                    },
                    interaction: {
                        mode: 'nearest',
                        axis: 'x',
                        intersect: false
                    }
                }
            });
        }
        
        function updateAudienceChart() {
            // Destroy and recreate to avoid memory leaks
            if (vm.audienceChart) {
                vm.audienceChart.destroy();
                vm.audienceChart = null;
            }
            initAudienceChart();
        }
        
        function prepareAudienceChartData() {
            if (!vm.reportData || !vm.reportData.audience || vm.reportData.audience.length === 0) {
                return {
                    labels: [],
                    datasets: []
                };
            }
            
            // Filter by selected account if specified
            var filteredAudience = vm.reportData.audience;
            if (vm.selectedAudienceAccount !== null) {
                filteredAudience = vm.reportData.audience.filter(function(aud) {
                    return aud.accountUuid === vm.selectedAudienceAccount;
                });
            }
            
            if (filteredAudience.length === 0) {
                return {
                    labels: [],
                    datasets: []
                };
            }
            
            // Group audience data by account and date
            var accountDataMap = {};
            var allDates = new Set();
            
            filteredAudience.forEach(function(aud) {
                var accountUuid = aud.accountUuid;
                var accountName = aud.account ? aud.account.name : 'Unknown Account';
                var date = aud.date;
                
                if (!accountDataMap[accountUuid]) {
                    accountDataMap[accountUuid] = {
                        name: accountName,
                        provider: aud.account ? aud.account.provider : 'unknown',
                        data: {}
                    };
                }
                
                accountDataMap[accountUuid].data[date] = aud.total;
                allDates.add(date);
            });
            
            // Sort dates chronologically
            var sortedDates = Array.from(allDates).sort(function(a, b) {
                return new Date(a) - new Date(b);
            });
            
            // Generate colors for each account
            var colors = [
                { border: '#00EFFF', background: 'rgba(0, 239, 255, 0.1)' },
                { border: '#FF6B9D', background: 'rgba(255, 107, 157, 0.1)' },
                { border: '#4ECDC4', background: 'rgba(78, 205, 196, 0.1)' },
                { border: '#FFE66D', background: 'rgba(255, 230, 109, 0.1)' },
                { border: '#95E1D3', background: 'rgba(149, 225, 211, 0.1)' },
                { border: '#F38181', background: 'rgba(243, 129, 129, 0.1)' },
                { border: '#AA96DA', background: 'rgba(170, 150, 218, 0.1)' },
                { border: '#FCBAD3', background: 'rgba(252, 186, 211, 0.1)' }
            ];
            
            // Create datasets
            var datasets = [];
            var colorIndex = 0;
            
            Object.keys(accountDataMap).forEach(function(accountUuid) {
                var accountInfo = accountDataMap[accountUuid];
                var data = sortedDates.map(function(date) {
                    return accountInfo.data[date] || 0;
                });
                
                var color = colors[colorIndex % colors.length];
                colorIndex++;
                
                datasets.push({
                    label: accountInfo.name,
                    data: data,
                    borderColor: color.border,
                    backgroundColor: color.background,
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4, // Smooth curve
                    pointRadius: 3,
                    pointHoverRadius: 5,
                    pointBackgroundColor: color.border,
                    pointBorderColor: '#1F1F23',
                    pointBorderWidth: 2
                });
            });
            
            // Format dates for labels (chronologically sorted)
            var formattedLabels = sortedDates.map(function(date) {
                var d = new Date(date);
                return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            });
            
            return {
                labels: formattedLabels,
                datasets: datasets
            };
        }
        
        // ============================================
        // FACEBOOK INSIGHTS CHART
        // ============================================
        
        function updateFacebookInsightAccounts() {
            if (!vm.reportData || !vm.reportData.facebook_insights || vm.reportData.facebook_insights.length === 0) {
                vm.facebookInsightAccounts = [];
                return;
            }
            
            var accountMap = {};
            vm.reportData.facebook_insights.forEach(function(insight) {
                if (insight.account && insight.account.uuid) {
                    if (!accountMap[insight.account.uuid]) {
                        accountMap[insight.account.uuid] = {
                            uuid: insight.account.uuid,
                            name: insight.account.name || 'Unknown Account',
                            provider: insight.account.provider || 'unknown'
                        };
                    }
                }
            });
            
            // Update cached array (sorted by name)
            vm.facebookInsightAccounts = Object.values(accountMap).sort(function(a, b) {
                return a.name.localeCompare(b.name);
            });
        }
        
        function selectFacebookInsightAccount(accountUuid) {
            vm.selectedFacebookInsightAccount = accountUuid;
            
            // Destroy and recreate chart to avoid memory leaks
            if (vm.facebookInsightsChart) {
                vm.facebookInsightsChart.destroy();
                vm.facebookInsightsChart = null;
            }
            
            // Recreate chart with filtered data
            $timeout(function() {
                initFacebookInsightsChart();
            }, 50);
        }
        
        function initFacebookInsightsChart() {
            var ctx = document.getElementById('facebookInsightsChart');
            if (!ctx) {
                console.warn('Facebook Insights chart canvas not found');
                return;
            }
            
            // Destroy existing chart if any
            if (vm.facebookInsightsChart) {
                vm.facebookInsightsChart.destroy();
                vm.facebookInsightsChart = null;
            }
            
            var chartData = prepareFacebookInsightsChartData();
            
            if (chartData.labels.length === 0 || chartData.datasets.length === 0) {
                return;
            }
            
            vm.facebookInsightsChart = new Chart(ctx, {
                type: 'line',
                data: chartData,
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: true,
                            position: 'top',
                            labels: {
                                color: '#E0E0E0',
                                usePointStyle: true,
                                padding: 15,
                                font: {
                                    size: 12,
                                    family: "'Open Sans', sans-serif"
                                }
                            }
                        },
                        tooltip: {
                            mode: 'index',
                            intersect: false,
                            backgroundColor: 'rgba(0, 0, 0, 0.8)',
                            titleColor: '#E0E0E0',
                            bodyColor: '#E0E0E0',
                            borderColor: '#00EFFF',
                            borderWidth: 1,
                            padding: 12,
                            callbacks: {
                                label: function(context) {
                                    return context.dataset.label + ': ' + context.parsed.y.toLocaleString();
                                }
                            }
                        }
                    },
                    scales: {
                        x: {
                            title: {
                                display: true,
                                text: 'Date',
                                color: '#B0B0B0',
                                font: {
                                    size: 12
                                }
                            },
                            grid: {
                                color: 'rgba(255, 255, 255, 0.1)',
                                drawBorder: false
                            },
                            ticks: {
                                color: '#B0B0B0',
                                font: {
                                    size: 11
                                }
                            }
                        },
                        y: {
                            title: {
                                display: true,
                                text: 'Value',
                                color: '#B0B0B0',
                                font: {
                                    size: 12
                                }
                            },
                            beginAtZero: false,
                            grid: {
                                color: 'rgba(255, 255, 255, 0.1)',
                                drawBorder: false
                            },
                            ticks: {
                                color: '#B0B0B0',
                                font: {
                                    size: 11
                                },
                                callback: function(value) {
                                    return value.toLocaleString();
                                }
                            }
                        }
                    },
                    interaction: {
                        mode: 'nearest',
                        axis: 'x',
                        intersect: false
                    }
                }
            });
        }
        
        function updateFacebookInsightsChart() {
            // Destroy and recreate to avoid memory leaks
            if (vm.facebookInsightsChart) {
                vm.facebookInsightsChart.destroy();
                vm.facebookInsightsChart = null;
            }
            initFacebookInsightsChart();
        }
        
        function prepareFacebookInsightsChartData() {
            if (!vm.reportData || !vm.reportData.facebook_insights || vm.reportData.facebook_insights.length === 0) {
                return {
                    labels: [],
                    datasets: []
                };
            }
            
            // Filter by selected account if specified
            var filteredInsights = vm.reportData.facebook_insights;
            if (vm.selectedFacebookInsightAccount !== null) {
                filteredInsights = vm.reportData.facebook_insights.filter(function(insight) {
                    return insight.accountUuid === vm.selectedFacebookInsightAccount;
                });
            }
            
            if (filteredInsights.length === 0) {
                return {
                    labels: [],
                    datasets: []
                };
            }
            
            // Group insights by type and date
            // Type 2 = PAGE_POST_ENGAGEMENTS, Type 3 = PAGE_POSTS_IMPRESSIONS
            var engagementsData = {}; // Type 2
            var impressionsData = {}; // Type 3
            var allDates = new Set();
            
            filteredInsights.forEach(function(insight) {
                var date = insight.date;
                allDates.add(date);
                
                if (insight.type === 2) {
                    // PAGE_POST_ENGAGEMENTS
                    engagementsData[date] = (engagementsData[date] || 0) + insight.value;
                } else if (insight.type === 3) {
                    // PAGE_POSTS_IMPRESSIONS
                    impressionsData[date] = (impressionsData[date] || 0) + insight.value;
                }
            });
            
            // Sort dates chronologically
            var sortedDates = Array.from(allDates).sort(function(a, b) {
                return new Date(a) - new Date(b);
            });
            
            // Create datasets for each insight type
            var datasets = [];
            
            // Engagements dataset (Type 2)
            var engagementsValues = sortedDates.map(function(date) {
                return engagementsData[date] || 0;
            });
            if (engagementsValues.some(function(v) { return v > 0; })) {
                datasets.push({
                    label: 'Post Engagements',
                    data: engagementsValues,
                    borderColor: '#1877F2', // Facebook blue
                    backgroundColor: 'rgba(24, 119, 242, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4,
                    pointRadius: 3,
                    pointHoverRadius: 5,
                    pointBackgroundColor: '#1877F2',
                    pointBorderColor: '#1F1F23',
                    pointBorderWidth: 2
                });
            }
            
            // Impressions dataset (Type 3)
            var impressionsValues = sortedDates.map(function(date) {
                return impressionsData[date] || 0;
            });
            if (impressionsValues.some(function(v) { return v > 0; })) {
                datasets.push({
                    label: 'Post Impressions',
                    data: impressionsValues,
                    borderColor: '#00EFFF', // Cyan
                    backgroundColor: 'rgba(0, 239, 255, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4,
                    pointRadius: 3,
                    pointHoverRadius: 5,
                    pointBackgroundColor: '#00EFFF',
                    pointBorderColor: '#1F1F23',
                    pointBorderWidth: 2
                });
            }
            
            // Format dates for labels (chronologically sorted)
            var formattedLabels = sortedDates.map(function(date) {
                var d = new Date(date);
                return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            });
            
            return {
                labels: formattedLabels,
                datasets: datasets
            };
        }

    }
})();

