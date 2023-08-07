import { RestScopeCountPipe } from './rest-scope-count.pipe';

describe('RestScopeCountPipe', () => {
  it('create an instance', () => {
    const pipe = new RestScopeCountPipe();
    expect(pipe).toBeTruthy();
  });
});
