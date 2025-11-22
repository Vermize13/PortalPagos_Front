import { Component } from '@angular/core';
import { SidenavComponent } from '../../components/sidenav/sidenav.component';
import { BreadcrumbComponent } from '../../components/breadcrumb/breadcrumb.component';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';

@Component({
    selector: 'app-layout',
    templateUrl: './layout.component.html',
    styleUrls: ['./layout.component.css'],
    standalone: true,
    imports: [
        SidenavComponent,
        BreadcrumbComponent,
        RouterModule,
        ToastModule,
        ButtonModule,
        FormsModule
    ],
    providers: []
})
export class LayoutComponent {
    // model bound to the sidenav collapsed state via [(ngModel)]
    sidenavCollapsed: boolean = false;

    toggleSidenav(): void {
        this.sidenavCollapsed = !this.sidenavCollapsed;
    }
}