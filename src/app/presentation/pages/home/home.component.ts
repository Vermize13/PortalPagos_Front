import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { UserStateService } from '../../../data/states/userState.service';
import { SidenavComponent } from "../../components/sidenav/sidenav.component";


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    SidenavComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  constructor(private router: Router, private userState: UserStateService) { }

  ngOnInit() {
    const usuario = this.userState.getUser();
    if (usuario === null) {
      this.router.navigate(['/login']);
    }
  }

}
