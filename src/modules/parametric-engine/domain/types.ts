export interface SketchupModuleData {
  guid: string;
  parent_guid: string | null;
  name: string;
  material: string;
  dimensions: { width: number; height: number; depth: number };
  position: { x: number; y: number; z: number };
  dynamic_attributes: Record<string, any>;
  children?: SketchupModuleData[];
}

export interface ExplodedPart {
  nome: string;
  comprimento: number;
  largura: number;
  espessura: number;
  material: string;
  quantidade: number;
}

export interface HardwareSpec {
  codigo: string;
  quantidade: number;
}

export interface MachiningOp {
  tipo: string;
  face: string;
  x: number;
  y: number;
  z: number;
  profundidade: number;
  diametroBroca?: number;
}
