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
          default:  spec.fetch(:default, nil).to_s,
          hints:    spec.fetch(:hints, {})
        }
      end
    }
  end

  def show
    if FileRouter::Repository::Registry.contents.include? params[:id]
      render json: {
        status: 'ok',
        data: _provider_to_hash(FileRouter::Repository::Registry.get params[:id])
      }
    else
      render status: 404
    end
  end

  def list
    render json: {
      status: 'ok',
      data: (FileRouter::Repository::Registry.contents.map { |id, provider| _provider_to_hash provider })
    }
  end

  def validate_config
    if FileRouter::Repository::Registry.contents.include? params[:id]
      provider = FileRouter::Repository::Registry.get params[:id]

      begin
        config = JSON.parse(params[:data])

        errs = provider.validate_configuration config

        render json: {
          status: 'ok',
          data: errs
        }
      rescue JSON::ParseError => e
        render json: {
          status: 'error',
          code: 400,
          message: "Invalid JSON data: #{e}"
        }
      end
    else
      render status: 404
    end
  end

end
