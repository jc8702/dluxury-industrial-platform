require 'json'
require 'digest'

module MarcenAI
  module Sync
    class Exporter
      
      def initialize(model)
        @model = model
        @entities_data = []
      end

      # Ponto de entrada: Lê tudo na raiz
      def extract_all
        @model.entities.each do |entity|
          if is_valid_component?(entity)
            @entities_data << extract_recursive(entity, nil)
          end
        end
        
        {
          "model_name" => @model.name.empty? ? "Sem Nome" : @model.name,
          "timestamp" => Time.now.utc.iso8601,
          "modules" => @entities_data.compact
        }
      end

      private

      def is_valid_component?(entity)
        entity.is_a?(Sketchup::ComponentInstance) || entity.is_a?(Sketchup::Group)
      end

      # Navega pela hierarquia (Grupos dentro de Grupos, Componentes aninhados)
      def extract_recursive(entity, parent_guid)
        guid = entity.persistent_id.to_s.empty? ? entity.guid : entity.persistent_id
        
        name = entity.name.empty? ? entity.definition.name : entity.name
        
        # Geometria Real em Milímetros
        bbox = entity.bounds
        width = bbox.width.to_mm.round(2)
        height = bbox.height.to_mm.round(2)
        depth = bbox.depth.to_mm.round(2)

        # Extração de Atributos Dinâmicos (Dynamic Components - DC)
        # É aqui que os parâmetros de engenharia residem (portas, prateleiras, ferragens embutidas)
        dynamic_attributes = extract_dynamic_attributes(entity)
        
        # Análise do Material Primário
        material_name = entity.material ? entity.material.name : "Material Base"

        # Transformações Globais X,Y,Z para validação de colisão da API
        transformation = entity.transformation
        pos_x = transformation.origin.x.to_mm.round(2)
        pos_y = transformation.origin.y.to_mm.round(2)
        pos_z = transformation.origin.z.to_mm.round(2)

        # Filhos Aninhados
        children = []
        if entity.is_a?(Sketchup::Group)
          entities = entity.entities
        elsif entity.is_a?(Sketchup::ComponentInstance)
          entities = entity.definition.entities
        end

        entities.each do |child|
          if is_valid_component?(child)
            children << extract_recursive(child, guid)
          end
        end if entities

        # Assinatura SHA256 do módulo para a API não regravar o que não mudou
        hash_string = "#{name}-#{width}-#{height}-#{depth}-#{pos_x}-#{pos_y}-#{pos_z}-#{dynamic_attributes.to_json}"
        module_hash = Digest::SHA256.hexdigest(hash_string)

        {
          "guid" => guid,
          "parent_guid" => parent_guid,
          "name" => name,
          "material" => material_name,
          "dimensions" => {
            "width" => width,
            "height" => height,
            "depth" => depth
          },
          "position" => {
            "x" => pos_x,
            "y" => pos_y,
            "z" => pos_z
          },
          "dynamic_attributes" => dynamic_attributes,
          "hash" => module_hash,
          "children" => children.compact
        }
      end

      # Lê o dicionário oculto "dynamic_attributes" que o plugin DC do SketchUp utiliza
      def extract_dynamic_attributes(entity)
        attrs = {}
        # Grupos guardam DC na própria entidade, Instances guardam no Definition
        dict = entity.attribute_dictionary('dynamic_attributes')
        dict = entity.definition.attribute_dictionary('dynamic_attributes') if dict.nil? && entity.respond_to?(:definition)

        if dict
          dict.each do |key, value|
            # Filtra chaves internas do SketchUp começando com '_' e pega apenas as expostas (ex: num_gavetas, espessura_caixa)
            unless key.start_with?('_') || key == 'name'
              attrs[key] = value.to_s
            end
          end
        end
        attrs
      end

    end
  end
end
