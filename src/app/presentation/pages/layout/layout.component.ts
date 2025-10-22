import { Component } from '@angular/core';
import { SidenavComponent } from '../../components/sidenav/sidenav.component';
import { RouterModule } from '@angular/router';
import { ToastModule } from 'primeng/toast';

@Component({
    selector: 'app-layout',
    templateUrl: './layout.component.html',
    styleUrls: ['./layout.component.css'],
    standalone: true,
    imports: [
        SidenavComponent,
        RouterModule,
        ToastModule
    ],
    providers: []
})
export class LayoutComponent { }