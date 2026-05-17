import { createUploadthing, type FileRouter } from 'uploadthing/next';
import { UploadThingError } from 'uploadthing/server';
// Simulação de check de autenticação do nosso Auth.js
// import { auth } from '@/auth';

const f = createUploadthing();

// Simulação de Middleware de Autenticação Edge-compatible
const authMiddleware = async () => {
  // const session = await auth();
  // if (!session) throw new UploadThingError("Unauthorized");
  
  // Hardcoded tenant apenas para o design arquitetural
  return { empresaId: '7e7811d7-bfd3-4fc6-b250-9ce068d374ce', userId: 'user-1' };
};

export const industrialFileRouter = {
  // Rota para Documentos Técnicos Pesados (Suporta Chunking Automático até 512MB no R2)
  technicalDocument: f({ 
    pdf: { maxFileSize: "128MB", maxFileCount: 1 },
    image: { maxFileSize: "16MB", maxFileCount: 5 }
  })
    .middleware(async () => {
      const user = await authMiddleware();
      return { empresaId: user.empresaId, uploaderId: user.userId };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // Inicia a Pipeline de OCR Assíncrona no background (Trigger Event)
      console.log(`Upload completo: ${file.url} pelo usuário ${metadata.uploaderId}`);
      
      // Chamada para o Indexer (O indexer pegará a URL e rodará o OCR com Gemini)
      // fetch('.../api/process-document', { body: file.url })
      
      return { uploadedBy: metadata.uploaderId, fileUrl: file.url };
    }),

  // Rota para DXF / STEP da Engenharia
  cadFile: f({ 
    "application/dxf": { maxFileSize: "64MB" },
    "model/step": { maxFileSize: "256MB" }
  })
    .middleware(async () => {
      const user = await authMiddleware();
      return { empresaId: user.empresaId };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log(`Geometria recebida no tenant: ${metadata.empresaId}`);
      return { fileUrl: file.url };
    }),

} satisfies FileRouter;

export type IndustrialFileRouter = typeof industrialFileRouter;
