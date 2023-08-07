import {
  Directive,
  EventEmitter,
  HostListener,
  Output,
  ViewContainerRef,
  OnInit,
  Input,
} from '@angular/core';
import { event } from 'd3-selection';

@Directive({
  selector: '[optisamScrollPagination]',
})
export class ScrollPaginationDirective implements OnInit {
  @Input('scrolledToLastMargin') margin: number = 0;
  @Input('isLoading') isLoading = false;
  @Output() scrolledToLast: EventEmitter<HTMLElement> =
    new EventEmitter<HTMLElement>();
  @Input('scrollTarget') scrollTarget: HTMLElement;

  constructor(private viewContainerRef: ViewContainerRef) {}

  @HostListener('scroll', ['$event'])
  private onScroll($event: any): void {
    if (this.isLoading) return;
    const el: HTMLElement = this.viewContainerRef.element.nativeElement;
    const scrollBottom = el.scrollTop + el.clientHeight;
    if (scrollBottom >= el.scrollHeight - this.margin) {
      console.log('Emitting scrolledToLast event');
      this.scrolledToLast.next(el);
    }
  }

  ngOnInit(): void {}
}
