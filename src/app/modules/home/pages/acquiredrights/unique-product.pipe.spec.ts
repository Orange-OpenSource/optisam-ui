import { UniqueProductPipe } from './unique-product.pipe';

describe('UniqueProductPipe', () => {
  it('create an instance', () => {
    const pipe = new UniqueProductPipe();
    expect(pipe).toBeTruthy();
  });
});
