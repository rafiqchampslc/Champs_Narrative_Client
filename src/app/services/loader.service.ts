import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {
  private isLoading = new BehaviorSubject<boolean>(false);
  isLoading$ = this.isLoading.asObservable();
  private activeRequests = 0;

  show() {
    this.activeRequests++;
    this.isLoading.next(true);
  }

  hide() {
    this.activeRequests--;
    if (this.activeRequests === 0) {
      this.isLoading.next(false);
    }
  }
}
