export const MARGINS = {
  MIN_WIDTH: 200,
  MAX_WIDTH: 3000,
  MIN_HEIGHT: 100,
  MAX_HEIGHT: 2500,
  MIN_DEPTH: 100,
  MAX_DEPTH: 700,
  MAX_UNSUPPORTED_SPAN: 1200, // em mm
};

export type ModuleType = 'aereo' | 'balcao' | 'torre' | 'outro';

export interface ValidationMessage {
  level: 'error' | 'warning' | 'info';
  code: string;
  message: string;
  field?: string;
}

export const VALID_THICKNESSES = [6, 9, 12, 15, 18, 25];
