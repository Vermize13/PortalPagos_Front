import { ChangeDetectionStrategy, Component, OnInit, ViewChild, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { Sidebar, SidebarModule } from 'primeng/sidebar';
import { StyleClassModule } from 'primeng/styleclass';
@Component({
  selector: 'app-sidenav',
  standalone: true,
  // expose 'collapsed' as a host class so parent layout CSS can react
  host: {
    '[class.collapsed]': 'collapsed'
  },
  imports: [CommonModule, SidebarModule, ButtonModule, RippleModule, AvatarModule, StyleClassModule, RouterModule ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SidenavComponent),
      multi: true
    }
  ],
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidenavComponent implements OnInit, ControlValueAccessor {

  ngOnInit(): void {
    console.log("llego aqui");
  }

  @ViewChild('sidebarRef') sidebarRef!: Sidebar;

  // When collapsed, show only icons and shrink width. Controlled by layout toggle.
  collapsed: boolean = false;

  // Keep sidebar visible always (we collapse to narrow bar). Toggle collapsed state.
  toggleCollapsed(): void {
    this.collapsed = !this.collapsed;
    // notify ngModel / form control consumers
    this.onChange(this.collapsed);
    this.onTouched();
  }

  // ControlValueAccessor boilerplate
  private onChange: (value: any) => void = () => {};
  private onTouched: () => void = () => {};
  disabled: boolean = false;

  writeValue(obj: any): void {
    this.collapsed = !!obj;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
