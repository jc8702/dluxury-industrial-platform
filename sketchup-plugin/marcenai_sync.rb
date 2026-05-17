require 'sketchup.rb'
require 'extensions.rb'

module MarcenAI
  module Sync
    unless file_loaded?(__FILE__)
      ex = SketchupExtension.new('MarcenAI Enterprise Sync', 'src/marcenai_sync/main')
      ex.description = 'Integração CAD/CAM paramétrica bidirecional com a plataforma SaaS MarcenAI.'
      ex.version     = '1.0.0'
      ex.copyright   = '© 2026 MarcenAI'
      ex.creator     = 'Equipe de Engenharia'
      
      Sketchup.register_extension(ex, true)
      file_loaded(__FILE__)
    end
  end
end
