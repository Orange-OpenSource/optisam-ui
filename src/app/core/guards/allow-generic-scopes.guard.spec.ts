import { TestBed } from '@angular/core/testing';

import { AllowGenericScopesGuard } from './allow-generic-scopes.guard';

describe('AllowGenericScopesGuard', () => {
  let guard: AllowGenericScopesGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(AllowGenericScopesGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
