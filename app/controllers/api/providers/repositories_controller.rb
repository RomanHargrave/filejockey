class Api::Providers::RepositoriesController < ApplicationController

  def _provider_to_hash(provider)
    {
      id:         provider.provider_id,
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
  end

  def get
    if FileRouter::Repository::Registry.contents.include? params[:id]
      render json: _provider_to_hash(FileRouter::Repository::Registry.get params[:id])
    else
      render status: 404
    end
  end

  def list
    render json: (FileRouter::Repository::Registry.contents.map { |id, provider| _provider_to_hash provider })
  end

end
