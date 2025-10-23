import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment';
import { IncidentStatus, IncidentPriority, IncidentSeverity } from '../../domain/models';

export interface DashboardMetrics {
  totalIncidents: number;
  openIncidents: number;
  closedIncidents: number;
  inProgressIncidents: number;
  activeProjects: number;
  activeUsers: number;
  incidentsByStatus: StatusMetric[];
  incidentsByPriority: PriorityMetric[];
  incidentsBySeverity: SeverityMetric[];
  incidentsBySprint: SprintMetric[];
  mttr: number; // Mean Time To Resolution in hours
  incidentEvolution: IncidentEvolutionMetric[];
}

export interface StatusMetric {
  status: IncidentStatus;
  count: number;
  percentage: number;
}

export interface PriorityMetric {
  priority: IncidentPriority;
  count: number;
  percentage: number;
}

export interface SeverityMetric {
  severity: IncidentSeverity;
  count: number;
  percentage: number;
}

export interface SprintMetric {
  sprintId: string;
  sprintName: string;
  openCount: number;
  closedCount: number;
  totalCount: number;
}

export interface IncidentEvolutionMetric {
  date: string;
  opened: number;
  closed: number;
  total: number;
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private readonly apiUrl = `${environment.url}api/Dashboard`;

  constructor(private http: HttpClient) { }

  /**
   * RF4.1: Get metrics by status, priority, and severity
   * RF4.2: Get open/closed incidents per sprint
   * RF4.3: Calculate MTTR (Mean Time To Resolution)
   * RF4.4: Get incident evolution data for charts
   */
  getMetrics(): Observable<DashboardMetrics> {
    // Since the backend doesn't have a dashboard endpoint yet,
    // we'll create one locally that aggregates data from incidents
    return this.http.get<any[]>(`${environment.url}api/Incidents`).pipe(
      map(incidents => this.calculateMetrics(incidents))
    );
  }

  private calculateMetrics(incidents: any[]): DashboardMetrics {
    const total = incidents.length;
    
    // Calculate status metrics
    const statusGroups = this.groupBy(incidents, 'status');
    const incidentsByStatus: StatusMetric[] = Object.keys(statusGroups).map(status => ({
      status: status as IncidentStatus,
      count: statusGroups[status].length,
      percentage: total > 0 ? (statusGroups[status].length / total) * 100 : 0
    }));

    // Calculate priority metrics
    const priorityGroups = this.groupBy(incidents, 'priority');
    const incidentsByPriority: PriorityMetric[] = Object.keys(priorityGroups).map(priority => ({
      priority: priority as IncidentPriority,
      count: priorityGroups[priority].length,
      percentage: total > 0 ? (priorityGroups[priority].length / total) * 100 : 0
    }));

    // Calculate severity metrics
    const severityGroups = this.groupBy(incidents, 'severity');
    const incidentsBySeverity: SeverityMetric[] = Object.keys(severityGroups).map(severity => ({
      severity: severity as IncidentSeverity,
      count: severityGroups[severity].length,
      percentage: total > 0 ? (severityGroups[severity].length / total) * 100 : 0
    }));

    // Calculate sprint metrics
    const sprintGroups = this.groupBy(incidents.filter(i => i.sprintId), 'sprintId');
    const incidentsBySprint: SprintMetric[] = Object.keys(sprintGroups).map(sprintId => {
      const sprintIncidents = sprintGroups[sprintId];
      return {
        sprintId,
        sprintName: sprintIncidents[0]?.sprint?.name || `Sprint ${sprintId}`,
        openCount: sprintIncidents.filter(i => i.status === IncidentStatus.Open || i.status === IncidentStatus.InProgress).length,
        closedCount: sprintIncidents.filter(i => i.status === IncidentStatus.Closed || i.status === IncidentStatus.Resolved).length,
        totalCount: sprintIncidents.length
      };
    });

    // Calculate MTTR (Mean Time To Resolution)
    const resolvedIncidents = incidents.filter(i => i.closedAt);
    const mttr = this.calculateMTTR(resolvedIncidents);

    // Calculate incident evolution (last 30 days)
    const incidentEvolution = this.calculateIncidentEvolution(incidents);

    return {
      totalIncidents: total,
      openIncidents: incidents.filter(i => i.status === IncidentStatus.Open).length,
      closedIncidents: incidents.filter(i => i.status === IncidentStatus.Closed || i.status === IncidentStatus.Resolved).length,
      inProgressIncidents: incidents.filter(i => i.status === IncidentStatus.InProgress).length,
      activeProjects: 0, // Will be populated from projects API
      activeUsers: 0, // Will be populated from users API
      incidentsByStatus,
      incidentsByPriority,
      incidentsBySeverity,
      incidentsBySprint,
      mttr,
      incidentEvolution
    };
  }

  private calculateMTTR(resolvedIncidents: any[]): number {
    if (resolvedIncidents.length === 0) return 0;

    const totalResolutionTime = resolvedIncidents.reduce((sum, incident) => {
      const created = new Date(incident.createdAt).getTime();
      const closed = new Date(incident.closedAt).getTime();
      const diff = closed - created;
      return sum + diff;
    }, 0);

    // Return MTTR in hours
    return Math.round((totalResolutionTime / resolvedIncidents.length) / (1000 * 60 * 60));
  }

  private calculateIncidentEvolution(incidents: any[]): IncidentEvolutionMetric[] {
    const evolution: IncidentEvolutionMetric[] = [];
    const today = new Date();
    
    // Generate data for last 30 days
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const openedOnDate = incidents.filter(inc => {
        const createdDate = new Date(inc.createdAt).toISOString().split('T')[0];
        return createdDate === dateStr;
      }).length;

      const closedOnDate = incidents.filter(inc => {
        if (!inc.closedAt) return false;
        const closedDate = new Date(inc.closedAt).toISOString().split('T')[0];
        return closedDate === dateStr;
      }).length;

      const totalAtDate = incidents.filter(inc => {
        const created = new Date(inc.createdAt);
        const isClosed = inc.closedAt ? new Date(inc.closedAt) : null;
        return created <= date && (!isClosed || isClosed > date);
      }).length;

      evolution.push({
        date: dateStr,
        opened: openedOnDate,
        closed: closedOnDate,
        total: totalAtDate
      });
    }

    return evolution;
  }

  private groupBy(array: any[], key: string): { [key: string]: any[] } {
    return array.reduce((result, item) => {
      const groupKey = item[key];
      if (!result[groupKey]) {
        result[groupKey] = [];
      }
      result[groupKey].push(item);
      return result;
    }, {});
  }
}
