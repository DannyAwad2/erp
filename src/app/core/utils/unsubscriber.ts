import { Injectable, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
@Injectable()
export abstract class Unsubscriber implements OnDestroy {
  unsubscriber$ = new Subject<void>();
  ngOnDestroy(): void {
    this.unsubscriber$.next();
    this.unsubscriber$.complete();
    this.unsubscriber$.unsubscribe();
  }
}
