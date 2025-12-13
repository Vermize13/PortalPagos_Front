import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart';
import { TableModule } from 'primeng/table';
import { DashboardService, DashboardMetrics } from '../../../data/services/dashboard.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, CardModule, ChartModule, TableModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  metrics: DashboardMetrics | null = null;
  loading: boolean = false;

  // Chart data
  statusChartData: any;
  priorityChartData: any;
  severityChartData: any;
  evolutionChartData: any;
  chartOptions: any;

  constructor(private dashboardService: DashboardService) {}

  ngOnInit() {
    this.initChartOptions();
    this.loadMetrics();
  }

  loadMetrics() {
    this.loading = true;
    this.dashboardService.getMetrics().subscribe({
      next: (metrics) => {
        this.metrics = metrics;
        this.updateCharts();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading dashboard metrics:', error);
        this.loading = false;
        // Initialize with empty metrics on error
        this.metrics = {
          totalIncidents: 0,
          openIncidents: 0,
          closedIncidents: 0,
          inProgressIncidents: 0,
          activeProjects: 0,
          activeUsers: 0,
          incidentsByStatus: [],
          incidentsByPriority: [],
          incidentsBySeverity: [],
          incidentsBySprint: [],
          incidentEvolution: []
        };
      }
    });
  }

  initChartOptions() {
    this.chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom'
        }
      }
    };
  }

  updateCharts() {
    if (!this.metrics) return;

    // RF4.1: Status Chart
    this.statusChartData = {
      labels: this.metrics.incidentsByStatus.map(s => s.status),
      datasets: [{
        data: this.metrics.incidentsByStatus.map(s => s.count),
        backgroundColor: [
          '#3B82F6', // Open - blue
          '#F59E0B', // InProgress - amber
          '#10B981', // Resolved - green
          '#6B7280', // Closed - gray
          '#EF4444', // Rejected - red
          '#8B5CF6'  // Duplicated - purple
        ]
      }]
    };

    // RF4.1: Priority Chart
    this.priorityChartData = {
      labels: this.metrics.incidentsByPriority.map(p => p.priority),
      datasets: [{
        data: this.metrics.incidentsByPriority.map(p => p.count),
        backgroundColor: [
          '#10B981', // Wont - green
          '#3B82F6', // Could - blue
          '#F59E0B', // Should - amber
          '#EF4444'  // Must - red
        ]
      }]
    };

    // RF4.1: Severity Chart
    this.severityChartData = {
      labels: this.metrics.incidentsBySeverity.map(s => s.severity),
      datasets: [{
        data: this.metrics.incidentsBySeverity.map(s => s.count),
        backgroundColor: [
          '#10B981', // Low - green
          '#F59E0B', // Medium - amber
          '#F97316', // High - orange
          '#EF4444'  // Critical - red
        ]
      }]
    };

    // RF4.3: Evolution Chart
    this.evolutionChartData = {
      labels: this.metrics.incidentEvolution.map(e => e.date),
      datasets: [
        {
          label: 'Abierto',
          data: this.metrics.incidentEvolution.map(e => e.opened),
          borderColor: '#3B82F6',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          fill: true,
          tension: 0.4
        },
        {
          label: 'Cerrado',
          data: this.metrics.incidentEvolution.map(e => e.closed),
          borderColor: '#10B981',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          fill: true,
          tension: 0.4
        },
        {
          label: 'Total Activo',
          data: this.metrics.incidentEvolution.map(e => e.total),
          borderColor: '#F59E0B',
          backgroundColor: 'rgba(245, 158, 11, 0.1)',
          fill: true,
          tension: 0.4
        }
      ]
    };
  }
}
