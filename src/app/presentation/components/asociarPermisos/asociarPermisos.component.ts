import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PageContainerComponent } from '../../shared/container/container.component';
import { TableComponent } from '../../shared/table/table.component';

@Component({
  selector: 'app-asociarPermisos',
  templateUrl: './asociarPermisos.component.html',
  styleUrls: ['./asociarPermisos.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    TableComponent,
    PageContainerComponent,
    PageContainerComponent,
    FormsModule
  ],
  providers: []
})
export class AsociarPermisosComponent implements OnInit {
  breadcrumbs = [
    { label: 'Inicio', link: '/' },
    { label: 'Administracion', link: '/' },
    { label: 'Asignar permisos a perfil' }
  ];

  data: any = [];


  ngOnInit() {
    /*this.data = [
      { selected: false, nombre: 'Item 1', descripcion: 'Descripción 1', rolAsignado: 'Rol 1', estado: 'Activo' }
    ];*/
  }




}