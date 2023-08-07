import { TestBed, inject } from '@angular/core/testing';
import { CompanyIconPipe } from './company-icon.pipe';
import { BrowserModule, DomSanitizer } from '@angular/platform-browser';

describe('CompanyIconPipe', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [BrowserModule],
    });
  });

  it('create an instance', inject(
    [DomSanitizer],
    (domSanitizer: DomSanitizer) => {
      const pipe = new CompanyIconPipe(domSanitizer);
      expect(pipe).toBeTruthy();
    }
  ));
});
