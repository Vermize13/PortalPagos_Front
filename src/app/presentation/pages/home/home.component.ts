import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { UserStateService } from '../../../data/states/userState.service';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  constructor(private router: Router, private userState: UserStateService) { }

  ngOnInit() {
    const usuario = this.userState.getUser();
    if (usuario === null) {
      this.router.navigate(['/login']);
    }
  }

}
