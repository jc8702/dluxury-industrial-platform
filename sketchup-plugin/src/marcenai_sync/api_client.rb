require 'json'
require 'net/http'
require 'uri'

module MarcenAI
  module Sync
    class ApiClient
      
      def initialize(api_key, project_id)
        @api_key = api_key
        @project_id = project_id
        
        # Num cenário real local/dev vs cloud:
        # @base_url = "http://localhost:3000/api/v1"
        @base_url = "https://api.marcenai.com/v1" 
      end

      def send_payload(payload)
        uri = URI.parse("#{@base_url}/projetos/#{@project_id}/sync-sketchup")
        
        # Sketchup::Http::Request é assíncrono e não congela a interface do usuário (UI Thread)
        request = Sketchup::Http::Request.new(uri.to_s, Sketchup::Http::POST)
        
        request.headers = {
          'Content-Type' => 'application/json',
          'Authorization' => "Bearer #{@api_key}",
          'X-Sketchup-Version' => Sketchup.version
        }
        
        request.body = JSON.generate(payload)

        request.start do |req, response|
          if response.status_code == 200 || response.status_code == 201
            # Parse de resposta segura
            begin
              res_body = JSON.parse(response.body)
              UI.messagebox("Sincronização Completa!\n\n#{res_body['data']['modules_updated']} Módulos Atualizados na Nuvem.\n#{res_body['data']['machinings_generated']} Usinagens Geradas.")
            rescue
              UI.messagebox("Sincronizado com sucesso (Ocorreu falha apenas ao ler retorno).")
            end
          elsif response.status_code == 401 || response.status_code == 403
            UI.messagebox("Falha de Autenticação: Verifique sua API Key e Permissões (Erro #{response.status_code}).")
          else
            UI.messagebox("Erro de Sincronização. O Servidor retornou: #{response.status_code}\n\nDetalhes: #{response.body}")
          end
        end
        
      rescue => e
        UI.messagebox("Erro crítico de rede: #{e.message}")
      end
      
    end
  end
end
