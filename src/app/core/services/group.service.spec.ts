import { TestBed } from '@angular/core/testing';

import { GroupService } from './group.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

describe('GroupService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      RouterTestingModule, 
      HttpClientTestingModule
    ],
    providers: [GroupService]}));

  it('should be created', () => {
    const service: GroupService = TestBed.inject(GroupService);
    expect(service).toBeTruthy();
  });
});
