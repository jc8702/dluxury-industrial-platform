CREATE TABLE "empresas" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"nome" varchar(255) NOT NULL,
	"razao_social" varchar(255) NOT NULL,
	"cnpj" varchar(20) NOT NULL,
	"ativo" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	"created_by" uuid,
	"updated_by" uuid,
	"versao" integer DEFAULT 1 NOT NULL,
	CONSTRAINT "empresas_cnpj_unique" UNIQUE("cnpj")
);
--> statement-breakpoint
CREATE TABLE "usuarios" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"empresa_id" uuid NOT NULL,
	"nome" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"senha_hash" text NOT NULL,
	"role" varchar(50) DEFAULT 'user' NOT NULL,
	"ativo" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	"created_by" uuid,
	"updated_by" uuid,
	"versao" integer DEFAULT 1 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "clientes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"empresa_id" uuid NOT NULL,
	"nome" varchar(255) NOT NULL,
	"documento" varchar(50),
	"email" varchar(255),
	"telefone" varchar(50),
	"endereco" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	"created_by" uuid,
	"updated_by" uuid,
	"versao" integer DEFAULT 1 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "projetos" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"empresa_id" uuid NOT NULL,
	"cliente_id" uuid NOT NULL,
	"nome" varchar(255) NOT NULL,
	"status" varchar(50) DEFAULT 'orcamento' NOT NULL,
	"valor_total" numeric(12, 2),
	"data_entrega" timestamp,
	"notas" text,
	"metadados" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	"created_by" uuid,
	"updated_by" uuid,
	"versao" integer DEFAULT 1 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ambientes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"projeto_id" uuid NOT NULL,
	"nome" varchar(255) NOT NULL,
	"tipo" varchar(100),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	"created_by" uuid,
	"updated_by" uuid,
	"versao" integer DEFAULT 1 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "moveis" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"ambiente_id" uuid NOT NULL,
	"nome" varchar(255) NOT NULL,
	"tipo" varchar(100),
	"largura" numeric(8, 2) NOT NULL,
	"altura" numeric(8, 2) NOT NULL,
	"profundidade" numeric(8, 2) NOT NULL,
	"parametros_iniciais" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	"created_by" uuid,
	"updated_by" uuid,
	"versao" integer DEFAULT 1 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "pecas" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"movel_id" uuid NOT NULL,
	"material_id" uuid NOT NULL,
	"nome" varchar(255) NOT NULL,
	"comprimento" numeric(8, 2) NOT NULL,
	"largura" numeric(8, 2) NOT NULL,
	"espessura" numeric(5, 2) NOT NULL,
	"quantidade" numeric(5, 0) DEFAULT '1' NOT NULL,
	"orientacao_veio" boolean DEFAULT true,
	"fita_topo_id" uuid,
	"fita_base_id" uuid,
	"fita_esq_id" uuid,
	"fita_dir_id" uuid,
	"programa_cnc" varchar(255),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	"created_by" uuid,
	"updated_by" uuid,
	"versao" integer DEFAULT 1 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "materiais" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"empresa_id" uuid NOT NULL,
	"nome" varchar(255) NOT NULL,
	"tipo" varchar(50) NOT NULL,
	"espessura" numeric(5, 2),
	"preco_m2" numeric(10, 2),
	"tem_veio" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	"created_by" uuid,
	"updated_by" uuid,
	"versao" integer DEFAULT 1 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ferragens" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"empresa_id" uuid NOT NULL,
	"nome" varchar(255) NOT NULL,
	"tipo" varchar(100),
	"preco_unidade" numeric(10, 2),
	"codigo_fabricante" varchar(100),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	"created_by" uuid,
	"updated_by" uuid,
	"versao" integer DEFAULT 1 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "validacoes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"projeto_id" uuid NOT NULL,
	"movel_id" uuid,
	"tipo_validacao" varchar(100) NOT NULL,
	"status" varchar(50) NOT NULL,
	"detalhes" jsonb NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	"created_by" uuid,
	"updated_by" uuid,
	"versao" integer DEFAULT 1 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "producao" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"empresa_id" uuid NOT NULL,
	"projeto_id" uuid NOT NULL,
	"status" varchar(50) DEFAULT 'aguardando' NOT NULL,
	"data_inicio" timestamp,
	"data_fim" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	"created_by" uuid,
	"updated_by" uuid,
	"versao" integer DEFAULT 1 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "auditoria" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tabela" varchar(100) NOT NULL,
	"registro_id" uuid NOT NULL,
	"acao" varchar(50) NOT NULL,
	"dados_antigos" jsonb,
	"dados_novos" jsonb,
	"usuario_id" uuid,
	"data" timestamp DEFAULT now() NOT NULL,
	"ip_address" varchar(45),
	"user_agent" text
);
--> statement-breakpoint
CREATE TABLE "embeddings_ia" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"empresa_id" uuid NOT NULL,
	"entidade_tipo" varchar(100) NOT NULL,
	"entidade_id" uuid NOT NULL,
	"conteudo_texto" text NOT NULL,
	"embedding" vector(768) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	"created_by" uuid,
	"updated_by" uuid,
	"versao" integer DEFAULT 1 NOT NULL
);
--> statement-breakpoint
ALTER TABLE "usuarios" ADD CONSTRAINT "usuarios_empresa_id_empresas_id_fk" FOREIGN KEY ("empresa_id") REFERENCES "public"."empresas"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "clientes" ADD CONSTRAINT "clientes_empresa_id_empresas_id_fk" FOREIGN KEY ("empresa_id") REFERENCES "public"."empresas"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "projetos" ADD CONSTRAINT "projetos_empresa_id_empresas_id_fk" FOREIGN KEY ("empresa_id") REFERENCES "public"."empresas"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "projetos" ADD CONSTRAINT "projetos_cliente_id_clientes_id_fk" FOREIGN KEY ("cliente_id") REFERENCES "public"."clientes"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ambientes" ADD CONSTRAINT "ambientes_projeto_id_projetos_id_fk" FOREIGN KEY ("projeto_id") REFERENCES "public"."projetos"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "moveis" ADD CONSTRAINT "moveis_ambiente_id_ambientes_id_fk" FOREIGN KEY ("ambiente_id") REFERENCES "public"."ambientes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pecas" ADD CONSTRAINT "pecas_movel_id_moveis_id_fk" FOREIGN KEY ("movel_id") REFERENCES "public"."moveis"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pecas" ADD CONSTRAINT "pecas_material_id_materiais_id_fk" FOREIGN KEY ("material_id") REFERENCES "public"."materiais"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pecas" ADD CONSTRAINT "pecas_fita_topo_id_materiais_id_fk" FOREIGN KEY ("fita_topo_id") REFERENCES "public"."materiais"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pecas" ADD CONSTRAINT "pecas_fita_base_id_materiais_id_fk" FOREIGN KEY ("fita_base_id") REFERENCES "public"."materiais"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pecas" ADD CONSTRAINT "pecas_fita_esq_id_materiais_id_fk" FOREIGN KEY ("fita_esq_id") REFERENCES "public"."materiais"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pecas" ADD CONSTRAINT "pecas_fita_dir_id_materiais_id_fk" FOREIGN KEY ("fita_dir_id") REFERENCES "public"."materiais"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "materiais" ADD CONSTRAINT "materiais_empresa_id_empresas_id_fk" FOREIGN KEY ("empresa_id") REFERENCES "public"."empresas"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ferragens" ADD CONSTRAINT "ferragens_empresa_id_empresas_id_fk" FOREIGN KEY ("empresa_id") REFERENCES "public"."empresas"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "validacoes" ADD CONSTRAINT "validacoes_projeto_id_projetos_id_fk" FOREIGN KEY ("projeto_id") REFERENCES "public"."projetos"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "validacoes" ADD CONSTRAINT "validacoes_movel_id_moveis_id_fk" FOREIGN KEY ("movel_id") REFERENCES "public"."moveis"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "producao" ADD CONSTRAINT "producao_empresa_id_empresas_id_fk" FOREIGN KEY ("empresa_id") REFERENCES "public"."empresas"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "producao" ADD CONSTRAINT "producao_projeto_id_projetos_id_fk" FOREIGN KEY ("projeto_id") REFERENCES "public"."projetos"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "embeddings_ia" ADD CONSTRAINT "embeddings_ia_empresa_id_empresas_id_fk" FOREIGN KEY ("empresa_id") REFERENCES "public"."empresas"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "empresas_cnpj_idx" ON "empresas" USING btree ("cnpj");--> statement-breakpoint
CREATE INDEX "usuarios_empresa_id_idx" ON "usuarios" USING btree ("empresa_id");--> statement-breakpoint
CREATE UNIQUE INDEX "usuarios_email_idx" ON "usuarios" USING btree ("email");--> statement-breakpoint
CREATE INDEX "clientes_empresa_id_idx" ON "clientes" USING btree ("empresa_id");--> statement-breakpoint
CREATE INDEX "clientes_nome_idx" ON "clientes" USING btree ("nome");--> statement-breakpoint
CREATE INDEX "projetos_empresa_id_idx" ON "projetos" USING btree ("empresa_id");--> statement-breakpoint
CREATE INDEX "projetos_cliente_id_idx" ON "projetos" USING btree ("cliente_id");--> statement-breakpoint
CREATE INDEX "projetos_status_idx" ON "projetos" USING btree ("status");--> statement-breakpoint
CREATE INDEX "ambientes_projeto_id_idx" ON "ambientes" USING btree ("projeto_id");--> statement-breakpoint
CREATE INDEX "moveis_ambiente_id_idx" ON "moveis" USING btree ("ambiente_id");--> statement-breakpoint
CREATE INDEX "pecas_movel_id_idx" ON "pecas" USING btree ("movel_id");--> statement-breakpoint
CREATE INDEX "pecas_material_id_idx" ON "pecas" USING btree ("material_id");--> statement-breakpoint
CREATE INDEX "materiais_empresa_id_idx" ON "materiais" USING btree ("empresa_id");--> statement-breakpoint
CREATE INDEX "ferragens_empresa_id_idx" ON "ferragens" USING btree ("empresa_id");--> statement-breakpoint
CREATE INDEX "validacoes_projeto_id_idx" ON "validacoes" USING btree ("projeto_id");--> statement-breakpoint
CREATE INDEX "validacoes_movel_id_idx" ON "validacoes" USING btree ("movel_id");--> statement-breakpoint
CREATE INDEX "validacoes_status_idx" ON "validacoes" USING btree ("status");--> statement-breakpoint
CREATE INDEX "producao_empresa_id_idx" ON "producao" USING btree ("empresa_id");--> statement-breakpoint
CREATE INDEX "producao_projeto_id_idx" ON "producao" USING btree ("projeto_id");--> statement-breakpoint
CREATE INDEX "producao_status_idx" ON "producao" USING btree ("status");--> statement-breakpoint
CREATE INDEX "auditoria_tabela_idx" ON "auditoria" USING btree ("tabela");--> statement-breakpoint
CREATE INDEX "auditoria_registro_id_idx" ON "auditoria" USING btree ("registro_id");--> statement-breakpoint
CREATE INDEX "embeddings_ia_empresa_id_idx" ON "embeddings_ia" USING btree ("empresa_id");--> statement-breakpoint
CREATE INDEX "embeddings_ia_entidade_idx" ON "embeddings_ia" USING btree ("entidade_tipo","entidade_id");--> statement-breakpoint
CREATE INDEX "embedding_hnsw_idx" ON "embeddings_ia" USING hnsw ("embedding" vector_cosine_ops);