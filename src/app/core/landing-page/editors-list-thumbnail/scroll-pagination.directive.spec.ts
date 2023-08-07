import { ViewContainerRef } from '@angular/core';
import { ScrollPaginationDirective } from './scroll-pagination.directive';

class TestViewContainerRef extends ViewContainerRef {
  get element(): import('@angular/core').ElementRef<any> {
    throw new Error('Method not implemented.');
  }
  get injector(): import('@angular/core').Injector {
    throw new Error('Method not implemented.');
  }
  get parentInjector(): import('@angular/core').Injector {
    throw new Error('Method not implemented.');
  }
  clear(): void {
    throw new Error('Method not implemented.');
  }
  get(index: number): import('@angular/core').ViewRef {
    throw new Error('Method not implemented.');
  }
  get length(): number {
    throw new Error('Method not implemented.');
  }
  createEmbeddedView<C>(
    templateRef: import('@angular/core').TemplateRef<C>,
    context?: C,
    index?: number
  ): import('@angular/core').EmbeddedViewRef<C> {
    throw new Error('Method not implemented.');
  }
  createComponent<C>(
    componentFactory: import('@angular/core').ComponentFactory<C>,
    index?: number,
    injector?: import('@angular/core').Injector,
    projectableNodes?: any[][],
    ngModule?: import('@angular/core').NgModuleRef<any>
  ): import('@angular/core').ComponentRef<C> {
    throw new Error('Method not implemented.');
  }
  insert(
    viewRef: import('@angular/core').ViewRef,
    index?: number
  ): import('@angular/core').ViewRef {
    throw new Error('Method not implemented.');
  }
  move(
    viewRef: import('@angular/core').ViewRef,
    currentIndex: number
  ): import('@angular/core').ViewRef {
    throw new Error('Method not implemented.');
  }
  indexOf(viewRef: import('@angular/core').ViewRef): number {
    throw new Error('Method not implemented.');
  }
  remove(index?: number): void {
    throw new Error('Method not implemented.');
  }
  detach(index?: number): import('@angular/core').ViewRef {
    throw new Error('Method not implemented.');
  }
}

describe('ScrollPaginationDirective', () => {
  it('should create an instance', () => {
    const directive = new ScrollPaginationDirective(new TestViewContainerRef());
    expect(directive).toBeTruthy();
  });
});
