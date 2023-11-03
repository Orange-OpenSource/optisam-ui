import { CheckForMillionPipe } from './check-for-million.pipe';

describe('CheckForMillionPipe', () => {
  it('create an instance', () => {
    const pipe = new CheckForMillionPipe();
    expect(pipe).toBeTruthy();
  });
});
