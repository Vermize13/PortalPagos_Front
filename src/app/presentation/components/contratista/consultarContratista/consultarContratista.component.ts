import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { TableComponent } from "../../../shared/table/table.component";
import { PageContainerComponent } from "../../../shared/container/container.component";

@Component({
    selector: 'app-consultar-contratista',
    standalone: true,
    imports: [
    CommonModule,
    TableComponent,
    PageContainerComponent,
],
    template: `
    <app-page-container
    [breadcrumbs]="breadcrumbs"
      [title]="'Contratistas'"
      [addButtonText]="'Adicionar contratista'"
    >
    <app-table [data]="data()" [headers]="headers()" [actions]="true"></app-table>
    </app-page-container>
    `,
    styleUrl: './consultarContratista.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConsultarContratistaComponent {
    data = signal<any[]>([]);
    headers = signal<any[]>([]);
    breadcrumbs = [
      { label: 'Inicio', link: '/' },
      { label: 'Registro', link: '/' },
      { label: 'Contratista' }
    ];
    constructor() {
      this.data = signal([
          {nit: '123456789', nombreTercero: 'Empresa A', tipoContratista: 'Proveedor', nroContratos: 3, estado: 'Activo'},
          {nit: '987654321', nombreTercero: 'Empresa B', tipoContratista: 'Consultor', nroContratos: 1, estado: 'Inactivo'},
          {nit: '456789123', nombreTercero: 'Empresa C', tipoContratista: 'Proveedor', nroContratos: 5, estado: 'Activo'},
          {nit: '789123456', nombreTercero: 'Empresa D', tipoContratista: 'Consultor', nroContratos: 2, estado: 'Activo'},
          {nit: '321654987', nombreTercero: 'Empresa E', tipoContratista: 'Proveedor', nroContratos: 4, estado: 'Inactivo'},
          {nit: '654987321', nombreTercero: 'Empresa F', tipoContratista: 'Consultor', nroContratos: 1, estado: 'Activo'},
          {nit: '147258369', nombreTercero: 'Empresa G', tipoContratista: 'Proveedor', nroContratos: 3, estado: 'Activo'},
          {nit: '258369147', nombreTercero: 'Empresa H', tipoContratista: 'Consultor', nroContratos: 2, estado: 'Inactivo'},
          {nit: '369147258', nombreTercero: 'Empresa I', tipoContratista: 'Proveedor', nroContratos: 6, estado: 'Activo'},
          {nit: '159753456', nombreTercero: 'Empresa J', tipoContratista: 'Consultor', nroContratos: 1, estado: 'Activo'},
        ]);
        this.headers = signal([
          {header: 'Nit', key: 'nit'},
          {header: 'Nombre tercero', key: 'nombreTercero'},
          {header: 'Tipo de contratista', key: 'tipoContratista'},
          {header: 'Nro de contratos', key: 'nroContratos'},
          {header: 'Estado', key: 'estado'}
        ]);
    }

}
