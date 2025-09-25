import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { PageContainerComponent } from '../../shared/container/container.component';
import { TableComponent } from '../../shared/table/table.component';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MenuItem } from 'primeng/api';
import { AccordionModule } from 'primeng/accordion';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { Perfil } from '../../../domain/models/perfil.model';

@Component({
  selector: 'app-crearPerfil',
  templateUrl: './crearPerfil.component.html',
  styleUrls: ['./crearPerfil.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    TableComponent,
    PageContainerComponent,
    PageContainerComponent,
    FormsModule,
    AccordionModule,
    ButtonModule,
    DropdownModule,
    FloatLabelModule,
    InputTextModule,
    InputTextareaModule,
    ReactiveFormsModule
  ],
  providers: []
})
export class CrearPerfilComponent implements OnInit {

  breadcrumbs: MenuItem[] = [
    { label: 'Inicio', url: '/inicio' },
    { label: 'Administracion', url: '/inicio' },
    { label: 'Crear Perfil', route: '/inicio/crearPerfil' }
  ];
  headers: Array<any> = [
    { header: 'Nombre', field: 'nombre' },
    { header: 'Descripción', field: 'descripcion' },
    { header: 'Rol asignado', field: 'rol' },
    { header: 'Estado', field: 'estado' }
  ]

  actionIcons: Array<{ icon: string, action: string }> = [
    { icon: 'pi pi-pencil', action: 'edit' },
    { icon: 'pi pi-trash', action: 'delete' }
  ];

  perfilForm!: FormGroup;


  perfiles: Perfil[] = [{
    id: 1,
    nombre: "Jose",
    descripcion: "Descripcion de jose",
    rol: "Admin",
    estado: "Activo"
  }, {
    id: 2,
    nombre: "Daniel",
    descripcion: "Descripcion de Daniel",
    rol: "Operador",
    estado: "Activo"
  }, {
    id: 3,
    nombre: "Rafael",
    descripcion: "Descripcion de Rafael",
    rol: "Auxiliar",
    estado: "Inactivo"
  }];

  roles = [
    { name: 'Supervisor', code: 'SV' },
    { name: 'Administrador', code: 'AD' },
    { name: 'Empleado', code: 'EM' }
  ];

  estados = [
    { name: 'Activo', code: 'A' },
    { name: 'Inactivo', code: 'I' }
  ];


  constructor(private fb: FormBuilder) {
    this.perfilForm = this.fb.group({
      nombre: ['', Validators.required],
      rol: ['', Validators.required],
      estado: ['', Validators.required],
      descripcion: ['', [Validators.required, Validators.maxLength(300)]]
    });
  }

  ngOnInit() {
  }


  onEditRow(item: any) {
    console.log('Editar', item);
    // Implementa la lógica de edición aquí
  }

  onDeleteRow(item: any) {
    console.log('Eliminar', item);
    // Implementa la lógica de eliminación aquí
  }


  clearForm() {
    this.perfilForm.reset({
      nombre: '',
      rol: null, // Asegúrate de usar null para dropdowns para que se limpien correctamente
      estado: null,
      descripcion: ''
    });
  }

  onSubmit() {
    if (this.perfilForm.valid) {
      const formData: Perfil = this.perfilForm.value;
      const rol: any = formData.rol;
      const estado: any = formData.estado;
      this.perfiles.push(
        {
          nombre: formData.nombre,
          rol: rol.name,
          estado: estado.name,
          descripcion: formData.descripcion
        }
      );
      console.log('Formulario enviado', formData);
    } else {
      console.log('Formulario no válido');
    }
  }

}