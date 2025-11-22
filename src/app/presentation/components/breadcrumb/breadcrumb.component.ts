import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { ROUTE_LABELS } from './breadcrumb.constants';

interface Breadcrumb {
  label: string;
  url: string;
  active: boolean;
}

@Component({
  selector: 'app-breadcrumb',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.css']
})
export class BreadcrumbComponent implements OnInit, OnDestroy {
  breadcrumbs: Breadcrumb[] = [];
  private routerSubscription?: Subscription;

  // Map of routes to Spanish labels
  private routeLabels = ROUTE_LABELS;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Build breadcrumbs on initial load
    this.buildBreadcrumbs();
    
    // Rebuild breadcrumbs on navigation
    this.routerSubscription = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => this.buildBreadcrumbs());
  }

  ngOnDestroy(): void {
    this.routerSubscription?.unsubscribe();
  }

  private buildBreadcrumbs(): void {
    const breadcrumbs: Breadcrumb[] = [];
    const urlSegments = this.router.url.split('/').filter(segment => segment);

    // Build cumulative URL and breadcrumbs
    let cumulativeUrl = '';
    
    urlSegments.forEach((segment, index) => {
      cumulativeUrl += '/' + segment;
      
      // Skip numeric IDs in breadcrumb display but keep in URL
      if (!this.isNumeric(segment)) {
        // Get label from route mapping or use segment
        const label = this.routeLabels[segment] || this.capitalizeFirstLetter(segment);
        
        breadcrumbs.push({
          label: label,
          url: cumulativeUrl,
          active: false  // Will be set after loop
        });
      }
    });
    
    // Mark the last breadcrumb as active
    if (breadcrumbs.length > 0) {
      breadcrumbs[breadcrumbs.length - 1].active = true;
    }

    this.breadcrumbs = breadcrumbs;
  }

  private capitalizeFirstLetter(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  private isNumeric(str: string): boolean {
    return /^\d+$/.test(str);
  }
}
