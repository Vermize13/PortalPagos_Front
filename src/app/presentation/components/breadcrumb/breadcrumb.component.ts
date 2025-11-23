import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { ROUTE_LABELS, HOME_ROUTE } from './breadcrumb.constants';

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
  homeRoute = HOME_ROUTE;
  private routerSubscription?: Subscription;
  private static readonly UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

  // Map of routes to Spanish labels
  private routeLabels = ROUTE_LABELS;

  constructor(
    private router: Router,
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
    const url = this.router.routerState.snapshot.url;
    const urlSegments = url.split('/').filter(segment => segment);

    let cumulativeUrl = '';

    urlSegments.forEach((segment, index) => {
      cumulativeUrl += '/' + segment;

        const label = this.routeLabels[segment] || this.capitalizeFirstLetter(segment);
        breadcrumbs.push({
          label: this.isUUID(segment) ? 'Detalle' : label,
          url: cumulativeUrl,
          active: false
        });
    });

    if (breadcrumbs.length > 0) {
      breadcrumbs[breadcrumbs.length - 1].active = true;
    }

    this.breadcrumbs = breadcrumbs;
  }

  private capitalizeFirstLetter(str: string): string {
    if (!str) return str;
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  private isUUID(str: string): boolean {
    return BreadcrumbComponent.UUID_REGEX.test(str);
  }
}
