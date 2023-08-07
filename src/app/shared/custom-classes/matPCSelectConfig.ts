import { InjectionToken } from '@angular/core';
import { MatSelectConfig } from '@angular/material/select';

export const pCSelectConfig: MatSelectConfig = {
  disableOptionCentering: true,
};

export const PC_SELECT_CONFIG = new InjectionToken<MatSelectConfig>(
  'PC_SELECT_CONFIG'
);
