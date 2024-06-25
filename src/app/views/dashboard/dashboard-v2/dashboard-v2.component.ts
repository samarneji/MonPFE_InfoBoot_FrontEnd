import {Component, OnInit} from '@angular/core';
import {echartStyles} from 'src/app/shared/echart-styles';
import {DashboardService} from '../dashboard.service';

@Component({
    selector: 'app-dashboard-v2',
    templateUrl: './dashboard-v2.component.html',
    styleUrls: ['./dashboard-v2.component.scss']
})
export class DashboardV2Component implements OnInit {
    chartPie1: any;
    chartLineOption3: any;
    totalBotMessages: number;
    totalUserMessages: number;
    totalMessagesToday: number;
    totalTextResponseMessages: number;
    totalFileResponseMessages: number;
    totalSqlResponseMessages: number;
    totalDocuments: number;
    totalMessages: number;

    constructor(private dashboardService: DashboardService) {
    }

    ngOnInit() {
        this.chartPie1 = {
            ...echartStyles.defaultOptions, ...{
                legend: {
                    show: true,
                    bottom: 0,
                },
                series: [{
                    type: 'pie',
                    ...echartStyles.pieRing,

                    label: echartStyles.pieLabelCenterHover,
                    data: [{
                        name: 'Completed',
                        value: 80,
                        itemStyle: {
                            color: '#663399',
                        }
                    }, {
                        name: 'Pending',
                        value: 20,
                        itemStyle: {
                            color: '#ced4da',
                        }
                    }]
                }]
            }
        };

        this.chartLineOption3 = {
            ...echartStyles.lineNoAxis, ...{
                series: [{
                    data: [40, 80, 20, 90, 30, 80, 40],
                    lineStyle: {
                        color: 'rgba(102, 51, 153, .86)',
                        width: 3,
                        shadowColor: 'rgba(0, 0, 0, .2)',
                        shadowOffsetX: -1,
                        shadowOffsetY: 8,
                        shadowBlur: 10
                    },
                    label: {show: true, color: '#212121'},
                    type: 'line',
                    smooth: true,
                    itemStyle: {
                        borderColor: 'rgba(69, 86, 172, 0.86)'
                    }
                }]
            }
        };
        this.chartLineOption3.xAxis.data = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

        this.loadDashboardData();
    }

    loadDashboardData() {
        this.dashboardService.getTotalBotMessages().subscribe(data => {
            this.totalBotMessages = data.total_bot_messages;
        });

        this.dashboardService.getTotalUserMessages().subscribe(data => {
            this.totalUserMessages = data.total_user_messages;
        });

        this.dashboardService.getTotalMessagesToday().subscribe(data => {
            this.totalMessagesToday = data.total_messages_today;
        });

        this.dashboardService.getTotalTextResponseMessages().subscribe(data => {
            this.totalTextResponseMessages = data.total_text_response_messages;
        });

        this.dashboardService.getTotalFileResponseMessages().subscribe(data => {
            this.totalFileResponseMessages = data.total_file_response_messages;
        });
        this.dashboardService.getTotalDocuments().subscribe(data => {
            this.totalDocuments = data.total_documents;
        });
        this.dashboardService.getTotalMessages().subscribe(data => {
            this.totalMessages = data.total_messages;
        });
        this.dashboardService.getTotalSqlResponseMessages().subscribe(data => {
            this.totalSqlResponseMessages = data.total_sql_response_messages;
        });
    }
}
