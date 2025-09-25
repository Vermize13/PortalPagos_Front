import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output
} from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    FormsModule,
    TagModule,
    ButtonModule
  ],
  templateUrl: './table.component.html',
  styleUrl: './table.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableComponent implements OnInit, AfterViewInit {
  @Input() subTitle: string = '';
  @Input() data: Array<any> = [];
  @Input() headers: Array<{ header: string, field: string }> = [];
  @Input() actions: boolean = false;
  @Input() actionIcons: Array<{ icon: string, action: string }> = [];

  @Output() editRow = new EventEmitter<any>();
  @Output() deleteRow = new EventEmitter<any>();

  selectedRows: any[] = [];
  first = 0;
  rows = 10;

  constructor() { }
  ngOnInit(): void { }

  ngAfterViewInit() {
  }

  getSeverity(status: string): 'success' | 'danger' | 'warning' | 'info' {
    switch (status.toLowerCase()) {
      case 'activo':
        return 'success';
      case 'inactivo':
        return 'danger';
      default:
        return 'info';
    }
  }


  onEdit(item: any) {
    this.editRow.emit(item);
  }

  onDelete(item: any) {
    this.deleteRow.emit(item);
  }
}