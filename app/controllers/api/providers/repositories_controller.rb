class Api::Providers::RepositoriesController < ApplicationController

  def list
    render json: (FileRouter::Repository::Registry.contents.map do |id, provider|
      {
        id:         id,
        name:       provider.provider_name,
        version:    provider.provider_version,
        features:   provider.features.map {|f| f.to_s},
        parameters: provider.configuration_spec.map do |spec|
          {
            field:    spec[:field],
            type:     spec.fetch(:type, String).name,
            required: spec.fetch(:required, false),
            default:  spec.fetch(:default, nil).to_s
          }
        end
      }
    end)
  end

end
