import { IsSaasPipe } from './is-saas.pipe';

describe('IsSaasPipe', () => {
  it('create an instance', () => {
    const pipe = new IsSaasPipe();
    expect(pipe).toBeTruthy();
  });
});
