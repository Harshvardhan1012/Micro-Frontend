import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-react-wrapper',
  template: `<div #reactRoot></div>`
})
export class ReactWrapperComponent implements AfterViewInit {

  @ViewChild('reactRoot', { static: true }) reactRoot!: ElementRef;

  async ngAfterViewInit() {
    const remote = await import('hostApp/HelloComponent');
    remote.mount(this.reactRoot.nativeElement);
  }
}
