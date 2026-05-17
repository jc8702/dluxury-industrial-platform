export interface RAGDocumentChunk {
  content: string;
  metadata: {
    sourceId: string;
    type: 'ferragem' | 'manual' | 'engenharia' | 'sketchup_spec';
    pageNumber?: number;
  };
  embedding?: number[];
}

export interface AgentContext {
  empresaId: string;
  usuarioRole: string;
  projetoId?: string;
}

export interface AskRequest {
  question: string;
  context: AgentContext;
}
