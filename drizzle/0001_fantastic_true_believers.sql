CREATE TABLE "accounts" (
	"userId" uuid NOT NULL,
	"type" varchar(255) NOT NULL,
	"provider" varchar(255) NOT NULL,
	"providerAccountId" varchar(255) NOT NULL,
	"refresh_token" text,
	"access_token" text,
	"expires_at" integer,
	"token_type" varchar(255),
	"scope" varchar(255),
	"id_token" text,
	"session_state" varchar(255),
	CONSTRAINT "accounts_provider_providerAccountId_pk" PRIMARY KEY("provider","providerAccountId")
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"sessionToken" varchar(255) PRIMARY KEY NOT NULL,
	"userId" uuid NOT NULL,
	"expires" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "verificationToken" (
	"identifier" varchar(255) NOT NULL,
	"token" varchar(255) NOT NULL,
	"expires" timestamp NOT NULL,
	CONSTRAINT "verificationToken_identifier_token_pk" PRIMARY KEY("identifier","token")
);
--> statement-breakpoint
CREATE TABLE "documentos_tecnicos" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"empresa_id" uuid NOT NULL,
	"nome_arquivo" varchar(500) NOT NULL,
	"url" text NOT NULL,
	"provider" varchar(50) NOT NULL,
	"chave_storage" varchar(500) NOT NULL,
	"extensao" varchar(20) NOT NULL,
	"mime_type" varchar(100),
	"tamanho_bytes" integer,
	"versao" integer DEFAULT 1 NOT NULL,
	"versao_anterior_id" uuid,
	"categoria" varchar(100) NOT NULL,
	"status_indexacao" varchar(50) DEFAULT 'pendente',
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	"created_by" uuid,
	"updated_by" uuid
);
--> statement-breakpoint
CREATE TABLE "apontamento_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"rastreabilidade_id" uuid NOT NULL,
	"etapa" varchar(50) NOT NULL,
	"operador_id" uuid NOT NULL,
	"data_apontamento" timestamp DEFAULT now() NOT NULL,
	"observacao" text
);
--> statement-breakpoint
CREATE TABLE "rastreabilidade_pecas" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"empresa_id" uuid NOT NULL,
	"producao_id" uuid NOT NULL,
	"peca_id" uuid NOT NULL,
	"codigo_barras" varchar(100) NOT NULL,
	"status_corte" boolean DEFAULT false NOT NULL,
	"status_borda" boolean DEFAULT false NOT NULL,
	"status_furo" boolean DEFAULT false NOT NULL,
	"status_montagem" boolean DEFAULT false NOT NULL,
	"status_expedicao" boolean DEFAULT false NOT NULL,
	"data_ultima_leitura" timestamp,
	"maquina_ultima_leitura" varchar(100),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	"created_by" uuid,
	"updated_by" uuid,
	"versao" integer DEFAULT 1 NOT NULL,
	CONSTRAINT "rastreabilidade_pecas_codigo_barras_unique" UNIQUE("codigo_barras")
);
--> statement-breakpoint
CREATE TABLE "planos" (
	"id" varchar(50) PRIMARY KEY NOT NULL,
	"nome" varchar(255) NOT NULL,
	"limite_usuarios" integer NOT NULL,
	"limite_projetos" integer NOT NULL,
	"limite_storage_mb" integer NOT NULL,
	"limite_ai_tokens" integer NOT NULL,
	"stripe_price_id" varchar(255)
);
--> statement-breakpoint
CREATE TABLE "uso_recursos" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"empresa_id" uuid NOT NULL,
	"periodo" varchar(7) NOT NULL,
	"usuarios_ativos" integer DEFAULT 0 NOT NULL,
	"projetos_criados" integer DEFAULT 0 NOT NULL,
	"storage_utilizado_mb" integer DEFAULT 0 NOT NULL,
	"ai_tokens_utilizados" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	"created_by" uuid,
	"updated_by" uuid,
	"versao" integer DEFAULT 1 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "modulos_sketchup" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"empresa_id" uuid NOT NULL,
	"projeto_id" uuid NOT NULL,
	"ambiente_id" uuid,
	"guid_sketchup" varchar(255) NOT NULL,
	"nome_componente" varchar(255) NOT NULL,
	"posicao_x" varchar(50),
	"posicao_y" varchar(50),
	"posicao_z" varchar(50),
	"dimensoes_raw" jsonb,
	"atributos_dinamicos" jsonb,
	"hash_importacao" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	"created_by" uuid,
	"updated_by" uuid,
	"versao" integer DEFAULT 1 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "usinagens" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"empresa_id" uuid NOT NULL,
	"peca_id" uuid NOT NULL,
	"tipo_operacao" varchar(50) NOT NULL,
	"face" varchar(20) NOT NULL,
	"x" numeric(10, 2) NOT NULL,
	"y" numeric(10, 2) NOT NULL,
	"z" numeric(10, 2) NOT NULL,
	"diametro_broca" numeric(5, 2),
	"profundidade" numeric(10, 2) NOT NULL,
	"comprimento_x" numeric(10, 2),
	"comprimento_y" numeric(10, 2),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	"created_by" uuid,
	"updated_by" uuid,
	"versao" integer DEFAULT 1 NOT NULL
);
--> statement-breakpoint
ALTER TABLE "empresas" ADD COLUMN "plano" varchar(50) DEFAULT 'starter' NOT NULL;--> statement-breakpoint
ALTER TABLE "empresas" ADD COLUMN "stripe_customer_id" varchar(255);--> statement-breakpoint
ALTER TABLE "empresas" ADD COLUMN "stripe_subscription_id" varchar(255);--> statement-breakpoint
ALTER TABLE "empresas" ADD COLUMN "status_assinatura" varchar(50) DEFAULT 'trialing' NOT NULL;--> statement-breakpoint
ALTER TABLE "empresas" ADD COLUMN "trial_fim" text;--> statement-breakpoint
ALTER TABLE "usuarios" ADD COLUMN "emailVerified" timestamp;--> statement-breakpoint
ALTER TABLE "usuarios" ADD COLUMN "image" varchar(255);--> statement-breakpoint
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_userId_usuarios_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."usuarios"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_userId_usuarios_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."usuarios"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "documentos_tecnicos" ADD CONSTRAINT "documentos_tecnicos_empresa_id_empresas_id_fk" FOREIGN KEY ("empresa_id") REFERENCES "public"."empresas"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "apontamento_logs" ADD CONSTRAINT "apontamento_logs_rastreabilidade_id_rastreabilidade_pecas_id_fk" FOREIGN KEY ("rastreabilidade_id") REFERENCES "public"."rastreabilidade_pecas"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rastreabilidade_pecas" ADD CONSTRAINT "rastreabilidade_pecas_empresa_id_empresas_id_fk" FOREIGN KEY ("empresa_id") REFERENCES "public"."empresas"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rastreabilidade_pecas" ADD CONSTRAINT "rastreabilidade_pecas_producao_id_producao_id_fk" FOREIGN KEY ("producao_id") REFERENCES "public"."producao"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rastreabilidade_pecas" ADD CONSTRAINT "rastreabilidade_pecas_peca_id_pecas_id_fk" FOREIGN KEY ("peca_id") REFERENCES "public"."pecas"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "uso_recursos" ADD CONSTRAINT "uso_recursos_empresa_id_empresas_id_fk" FOREIGN KEY ("empresa_id") REFERENCES "public"."empresas"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "modulos_sketchup" ADD CONSTRAINT "modulos_sketchup_empresa_id_empresas_id_fk" FOREIGN KEY ("empresa_id") REFERENCES "public"."empresas"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "modulos_sketchup" ADD CONSTRAINT "modulos_sketchup_projeto_id_projetos_id_fk" FOREIGN KEY ("projeto_id") REFERENCES "public"."projetos"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "modulos_sketchup" ADD CONSTRAINT "modulos_sketchup_ambiente_id_ambientes_id_fk" FOREIGN KEY ("ambiente_id") REFERENCES "public"."ambientes"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "usinagens" ADD CONSTRAINT "usinagens_empresa_id_empresas_id_fk" FOREIGN KEY ("empresa_id") REFERENCES "public"."empresas"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "usinagens" ADD CONSTRAINT "usinagens_peca_id_pecas_id_fk" FOREIGN KEY ("peca_id") REFERENCES "public"."pecas"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "documentos_tecnicos_empresa_idx" ON "documentos_tecnicos" USING btree ("empresa_id");--> statement-breakpoint
CREATE INDEX "documentos_tecnicos_categoria_idx" ON "documentos_tecnicos" USING btree ("categoria");--> statement-breakpoint
CREATE INDEX "documentos_tecnicos_status_idx" ON "documentos_tecnicos" USING btree ("status_indexacao");--> statement-breakpoint
CREATE INDEX "rastreabilidade_empresa_idx" ON "rastreabilidade_pecas" USING btree ("empresa_id");--> statement-breakpoint
CREATE INDEX "rastreabilidade_codigo_idx" ON "rastreabilidade_pecas" USING btree ("codigo_barras");--> statement-breakpoint
CREATE INDEX "rastreabilidade_producao_idx" ON "rastreabilidade_pecas" USING btree ("producao_id");--> statement-breakpoint
CREATE UNIQUE INDEX "uso_recursos_tenant_periodo_idx" ON "uso_recursos" USING btree ("empresa_id","periodo");--> statement-breakpoint
CREATE INDEX "uso_recursos_empresa_idx" ON "uso_recursos" USING btree ("empresa_id");--> statement-breakpoint
CREATE INDEX "modulos_sketchup_empresa_idx" ON "modulos_sketchup" USING btree ("empresa_id");--> statement-breakpoint
CREATE INDEX "modulos_sketchup_projeto_idx" ON "modulos_sketchup" USING btree ("projeto_id");--> statement-breakpoint
CREATE UNIQUE INDEX "modulos_sketchup_guid_projeto_idx" ON "modulos_sketchup" USING btree ("projeto_id","guid_sketchup");--> statement-breakpoint
CREATE INDEX "usinagens_empresa_idx" ON "usinagens" USING btree ("empresa_id");--> statement-breakpoint
CREATE INDEX "usinagens_peca_idx" ON "usinagens" USING btree ("peca_id");--> statement-breakpoint
CREATE INDEX "usinagens_tipo_idx" ON "usinagens" USING btree ("tipo_operacao");