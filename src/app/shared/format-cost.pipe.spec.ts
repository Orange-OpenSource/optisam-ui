// Copyright (C) 2019 Orange
// 
// This software is distributed under the terms and conditions of the 'Apache License 2.0'
// license which can be found in the file 'License.txt' in this package distribution 
// or at 'http://www.apache.org/licenses/LICENSE-2.0'. 

import { FormatCostPipe } from './format-cost.pipe';

describe('FormatCostPipe', () => {
  it('create an instance', () => {
    const pipe = new FormatCostPipe();
    expect(pipe).toBeTruthy();
  });
});
