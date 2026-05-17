'use client';

import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';

export default function ApiDocsPage() {
  return (
    <div className="bg-white min-h-screen p-4">
      <div className="max-w-6xl mx-auto">
        {/* Renderiza a UI do Swagger lendo o Route Handler dinâmico que gera o JSON Spec */}
        <SwaggerUI url="/api/docs" />
      </div>
    </div>
  );
}
