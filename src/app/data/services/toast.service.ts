import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  TOAST_KEY:string = 'global-toast';
  STICKY:boolean = true;


  constructor(private msgService: MessageService) { }

  async Success(summary:string,
                        detail:string): Promise<void> {
    this.showToast(summary,detail,'success');
  }

  async Info(summary:string,
                        detail:string): Promise<void> {
    this.showToast(summary,detail,'info');
  }
  async Warn(summary:string,
                        detail:string): Promise<void> {
    this.showToast(summary,detail,'warn');
  }

  async Error(summary:string,
                        detail:string): Promise<void> {
    this.showToast(summary,detail,'error');
  }

  async showToast(summary:string,
                  detail:string,
                  severity:string): Promise<void> {
    this.msgService.add({
      key:this.TOAST_KEY,
      severity: severity,
      summary: summary,
      detail: detail,
      life: 3000,
      });
}

}
