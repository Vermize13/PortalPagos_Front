import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment';
import { IncidentStatus, IncidentPriority, IncidentSeverity } from '../../domain/models';
import { IncidentStatusMapping, IncidentPriorityMapping, IncidentSeverityMapping } from '../../domain/models/enum-mappings';

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
  incidentEvolution: IncidentEvolutionMetric[];
}

export interface StatusMetric {
  status: string;
  count: number;
  percentage: number;
}

export interface PriorityMetric {
  priority: string;
  count: number;
  percentage: number;
}

export interface SeverityMetric {
  severity: string;
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

  // Status constants for better readability
  private readonly OPEN_STATUSES = [IncidentStatus.Abierto, IncidentStatus.EnProgreso]; // 0, 1
  private readonly CLOSED_STATUSES = [IncidentStatus.Resuelto, IncidentStatus.Cerrado]; // 2, 3

  constructor(private http: HttpClient) { }

  /**
   * RF4.1: Get metrics by status, priority, and severity
   * RF4.2: Get open/closed incidents per sprint
   * RF4.3: Get incident evolution data for charts
   * @param projectId Optional project ID to filter metrics
   */
  getMetrics(projectId?: string): Observable<DashboardMetrics> {
    // Since the backend doesn't have a dashboard endpoint yet,
    // we'll create one locally that aggregates data from incidents
    let url = `${environment.url}api/Incidents`;
    if (projectId) {
      url += `?projectId=${projectId}`;
    }
    return this.http.get<any[]>(url).pipe(
      map(incidents => this.calculateMetrics(incidents))
    );
  }

  private calculateMetrics(incidents: any[]): DashboardMetrics {
    const total = incidents.length;

    // Calculate status metrics
    const statusGroups = this.groupBy(incidents, 'status');
    const incidentsByStatus: StatusMetric[] = Object.keys(statusGroups).map(statusValue => {
      const statusInt = parseInt(statusValue);
      const statusLabel = IncidentStatusMapping.find(m => m.value === statusInt)?.label || statusValue;
      return {
        status: statusLabel,
        count: statusGroups[statusValue].length,
        percentage: total > 0 ? (statusGroups[statusValue].length / total) * 100 : 0
      };
    });

    // Calculate priority metrics
    const priorityGroups = this.groupBy(incidents, 'priority');
    const incidentsByPriority: PriorityMetric[] = Object.keys(priorityGroups).map(priorityValue => {
      const priorityInt = parseInt(priorityValue);
      const priorityLabel = IncidentPriorityMapping.find(m => m.value === priorityInt)?.label || priorityValue;
      return {
        priority: priorityLabel,
        count: priorityGroups[priorityValue].length,
        percentage: total > 0 ? (priorityGroups[priorityValue].length / total) * 100 : 0
      };
    });

    // Calculate severity metrics
    const severityGroups = this.groupBy(incidents, 'severity');
    const incidentsBySeverity: SeverityMetric[] = Object.keys(severityGroups).map(severityValue => {
      const severityInt = parseInt(severityValue);
      const severityLabel = IncidentSeverityMapping.find(m => m.value === severityInt)?.label || severityValue;
      return {
        severity: severityLabel,
        count: severityGroups[severityValue].length,
        percentage: total > 0 ? (severityGroups[severityValue].length / total) * 100 : 0
      };
    });

    // Calculate sprint metrics
    const sprintGroups = this.groupBy(incidents.filter(i => i.sprintId), 'sprintId');
    const incidentsBySprint: SprintMetric[] = Object.keys(sprintGroups).map(sprintId => {
      const sprintIncidents = sprintGroups[sprintId];
      return {
        sprintId,
        sprintName: sprintIncidents[0]?.sprint?.name || `Sprint ${sprintId}`,
        openCount: sprintIncidents.filter(i => this.OPEN_STATUSES.includes(i.status)).length,
        closedCount: sprintIncidents.filter(i => this.CLOSED_STATUSES.includes(i.status)).length,
        totalCount: sprintIncidents.length
      };
    });

    // Calculate incident evolution (last 30 days)
    const incidentEvolution = this.calculateIncidentEvolution(incidents);

    return {
      totalIncidents: total,
      openIncidents: incidents.filter(i => i.status === IncidentStatus.Abierto).length,
      closedIncidents: incidents.filter(i => this.CLOSED_STATUSES.includes(i.status)).length,
      inProgressIncidents: incidents.filter(i => i.status === IncidentStatus.EnProgreso).length,
      activeProjects: 0, // Will be populated from projects API
      activeUsers: 0, // Will be populated from users API
      incidentsByStatus,
      incidentsByPriority,
      incidentsBySeverity,
      incidentsBySprint,
      incidentEvolution
    };
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
