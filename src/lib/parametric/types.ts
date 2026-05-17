export type ParamType = 'number' | 'boolean' | 'string' | 'option';

export interface ParamDefinition {
  id: string;
  type: ParamType;
  defaultValue?: any;
  formula?: string; // e.g. "Largura - (EspessuraLateral * 2)"
  description?: string;
}

export interface PartDefinition {
  id: string;
  name: string;
  materialIdFormula: string; // Dynamic mapping for material
  widthFormula: string;
  lengthFormula: string;
  thicknessFormula: string;
  quantityFormula: string;
  orientationVeioFormula: string; // boolean formula
  // Coordinates for collision detection (local space X, Y, Z origin and size)
  posXFormula: string;
  posYFormula: string;
  posZFormula: string;
}

export interface HardwareDefinition {
  id: string;
  hardwareIdFormula: string;
  quantityFormula: string;
}

export interface MachiningDefinition {
  id: string;
  partId: string;
  operationType: 'drill' | 'route' | 'pocket';
  xFormula: string;
  yFormula: string;
  zFormula: string;
  diameterFormula?: string;
  depthFormula?: string;
}

export interface ValidationRule {
  id: string;
  conditionFormula: string; // Should evaluate to boolean. e.g. "Largura > 2700"
  errorMessage: string;
  type: 'structural' | 'geometric' | 'collision';
}

export interface ModuleDefinition {
  id: string;
  name: string;
  type: 'aereo' | 'balcao' | 'guarda_roupa' | 'painel' | 'gaveteiro' | 'torre_quente' | 'custom';
  inheritsFrom?: string; // ID of another module to inherit parameters/parts
  parameters: ParamDefinition[];
  parts: PartDefinition[];
  hardware: HardwareDefinition[];
  machining: MachiningDefinition[];
  validations: ValidationRule[];
}

export interface EvaluationContext {
  [key: string]: any;
}

export interface ResolvedPart {
  id: string;
  name: string;
  materialId: string;
  width: number;
  length: number;
  thickness: number;
  quantity: number;
  orientationVeio: boolean;
  boundingBox: {
    x: number;
    y: number;
    z: number;
    w: number;
    h: number;
    d: number;
  };
}

export interface ResolvedHardware {
  id: string;
  hardwareId: string;
  quantity: number;
}

export interface ResolvedMachining {
  id: string;
  partId: string;
  operationType: string;
  x: number;
  y: number;
  z: number;
  diameter?: number;
  depth?: number;
}

export interface CompositionResult {
  moduleId: string;
  parameters: Record<string, any>;
  parts: ResolvedPart[];
  hardware: ResolvedHardware[];
  machining: ResolvedMachining[];
  validationErrors: string[];
}
