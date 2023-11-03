import { AbsoluteValuePipe } from './absolute-value.pipe';

describe('AbsoluteValuePipe', () => {
  it('create an instance', () => {
    const pipe = new AbsoluteValuePipe();
    expect(pipe).toBeTruthy();
  });
});
