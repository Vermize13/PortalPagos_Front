import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { forkJoin } from 'rxjs';
import { UserService } from '../../../data/services/user.service';
import { ProjectService } from '../../../data/services/project.service';
import { IncidentService } from '../../../data/services/incident.service';
import { IncidentStatus } from '../../../domain/models';

interface DashboardMetrics {
  openIncidents: number;
  closedIncidents: number;
  activeProjects: number;
  activeUsers: number;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, CardModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  metrics: DashboardMetrics = {
    openIncidents: 0,
    closedIncidents: 0,
    activeProjects: 0,
    activeUsers: 0
  };
  loading: boolean = false;

  constructor(
    private userService: UserService,
    private projectService: ProjectService,
    private incidentService: IncidentService
  ) {}

  ngOnInit() {
    this.loadMetrics();
  }

  loadMetrics() {
    this.loading = true;
    
    forkJoin({
      users: this.userService.getAllUsers(),
      projects: this.projectService.getAll(),
      incidents: this.incidentService.getAll()
    }).subscribe({
      next: (data) => {
        // Calculate metrics
        this.metrics.activeUsers = data.users.filter(u => u.isActive).length;
        this.metrics.activeProjects = data.projects.filter(p => p.isActive).length;
        this.metrics.openIncidents = data.incidents.filter(
          i => i.status === IncidentStatus.Open || i.status === IncidentStatus.InProgress
        ).length;
        this.metrics.closedIncidents = data.incidents.filter(
          i => i.status === IncidentStatus.Closed || i.status === IncidentStatus.Resolved
        ).length;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading dashboard metrics:', error);
        this.loading = false;
        // Use mock data on error
        this.metrics = {
          openIncidents: 2,
          closedIncidents: 5,
          activeProjects: 3,
          activeUsers: 8
        };
      }
    });
  }
}
