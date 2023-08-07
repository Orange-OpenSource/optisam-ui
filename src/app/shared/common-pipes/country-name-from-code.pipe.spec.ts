import { CountryNameFromCodePipe } from './country-name-from-code.pipe';

describe('CountryNameFromCodePipe', () => {
  it('create an instance', () => {
    const pipe = new CountryNameFromCodePipe();
    expect(pipe).toBeTruthy();
  });
});
