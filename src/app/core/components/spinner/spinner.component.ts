import { Component } from '@angular/core';

@Component({
  selector: 'app-spinner',
  template: `<div class="d-flex justify-content-center m-5">
    <div class="spinner-border" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>
  </div> `,
  standalone: true,
})
export class SpinnerComponent {}
