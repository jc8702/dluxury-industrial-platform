require 'sketchup.rb'
require_relative 'exporter'
require_relative 'api_client'

module MarcenAI
  module Sync
    module Main
      
      def self.sync_project
        model = Sketchup.active_model
        
        # 1. Recupera Configurações e Auth
        api_key = Sketchup.read_default('MarcenAI', 'api_key', '')
        project_id = model.get_attribute('MarcenAI', 'project_id', '')
        
        if api_key.empty? || project_id.empty?
          UI.messagebox("Por favor, configure sua API Key e ID do Projeto antes de sincronizar (Menu Plugins > MarcenAI > Configurações).")
          return
        end

        # 2. Roda a Extração Profunda da Hierarquia
        UI.messagebox("Iniciando extração estrutural MarcenAI. Isso pode levar alguns segundos...")
        exporter = MarcenAI::Sync::Exporter.new(model)
        payload = exporter.extract_all()

        # 3. Envia para a API SaaS (Vercel Functions)
        client = MarcenAI::Sync::ApiClient.new(api_key, project_id)
        client.send_payload(payload)
      end

      def self.settings_dialog
        prompts = ["API Key (Bearer):", "ID do Projeto (UUID):"]
        defaults = [
          Sketchup.read_default('MarcenAI', 'api_key', ''),
          Sketchup.active_model.get_attribute('MarcenAI', 'project_id', '')
        ]
        
        results = UI.inputbox(prompts, defaults, "Configurações MarcenAI Sync")
        return unless results
        
        Sketchup.write_default('MarcenAI', 'api_key', results[0])
        Sketchup.active_model.set_attribute('MarcenAI', 'project_id', results[1])
        UI.messagebox("Configurações salvas com sucesso no modelo.")
      end

      # Registra Interface de Usuário
      unless file_loaded?(__FILE__)
        menu = UI.menu('Plugins').add_submenu('MarcenAI Sync')
        menu.add_item('Sincronizar Produção') { self.sync_project }
        menu.add_item('Configurações') { self.settings_dialog }

        toolbar = UI::Toolbar.new("MarcenAI Enterprise")
        
        cmd_sync = UI::Command.new("Sincronizar Nuvem") { self.sync_project }
        cmd_sync.tooltip = "Envia estrutura do SketchUp para a Nuvem Paramétrica MarcenAI"
        cmd_sync.status_bar_text = "Sincronizando Módulos e Geometria..."
        # Omitido large/small icon paths para simplificação do exemplo
        
        toolbar = toolbar.add_item cmd_sync
        toolbar.show
        
        file_loaded(__FILE__)
      end

    end
  end
end
