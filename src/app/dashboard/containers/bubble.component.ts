import { Component } from '@angular/core';

@Component({
  selector: 'app-bubble',
  template: `
    <div class="row mt-2">
      <app-bubble-chart [width]='1200' [height]='800'></app-bubble-chart>
    </div>
  `,
  styles: [],
})
export class BubbleComponent {


}
