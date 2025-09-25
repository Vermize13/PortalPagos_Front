import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-page-container',
  standalone: true,
  imports: [CommonModule, RouterModule, BreadcrumbModule, ButtonModule,CardModule],
  templateUrl: './container.component.html',
  styleUrl: './container.component.css',
})
export class PageContainerComponent {
  @Input() breadcrumbs: MenuItem[] | undefined;
  @Input() title: string = '';
  @Input() showAddButton: boolean = false;
  @Input() addButtonText: string = 'Adicionar';
  items: MenuItem[] | undefined;


  constructor() {
  }

  ngOnInit() {
    this.items = this.breadcrumbs;
  }

  onAddClick() {
    // Implementa la lógica para el clic en el botón de agregar
  }
}
