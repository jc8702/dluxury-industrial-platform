# MarcenAI Enterprise Sync - SketchUp Extension

Este plugin conecta o SketchUp Pro diretamente ao motor paramétrico e chão de fábrica em nuvem da **MarcenAI Enterprise**.

## Funcionalidades
- **Extração Profunda**: Vasculha componentes, grupos e subgrupos recursivamente.
- **Leitura Paramétrica**: Intercepta *Dynamic Attributes* do SketchUp (ideal para módulos que possuem atributos "Num de Gavetas", "Espessura da Chapa", "Folga da Porta").
- **Assinatura Hashing**: Evita gargalos de rede gerando o hash SHA256 do módulo na máquina local. Só envia o payload total de peças modificadas pelo engenheiro/projetista.
- **I/O Não Bloqueante**: Utiliza `Sketchup::Http::Request` nativo operando em thread assíncrona, não travando (congelando) a interface 3D do projetista durante o upload do projeto.

## Instalação
1. Comprima as pastas/arquivos `marcenai_sync.rb` e a pasta `src` em um arquivo `.zip`.
2. Renomeie a extensão de `.zip` para `.rbz`.
3. No SketchUp, acesse: **Extensões > Gerenciador de Extensões > Instalar Extensão**.
4. Selecione o arquivo `.rbz`.

## Configuração B2B (Tenant)
Após ativar o plugin no SketchUp:
1. Vá em **Extensões > MarcenAI Sync > Configurações**.
2. Cole sua `API Key` (Gerada no Painel do Administrador MarcenAI na aba "Desenvolvedores").
3. Digite o `Project ID` (UUID) correspondente ao projeto web atual do cliente.
4. Clique em **Sincronizar Produção** na *Toolbar* flutuante do MarcenAI.
