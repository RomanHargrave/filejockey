class Api::Providers::RepositoriesController < ApplicationController
  protect_from_forgery with: :null_session

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

  # Respond with a single provider
  def show
    if FileRouter::Repository::Registry.contents.include? params[:id]
      render json: {
        status: 'ok',
        data: _provider_to_hash(FileRouter::Repository::Registry.contents[params[:id]])
      }
    else
      render status: 404
    end
  end

  # Respond with a list of providers
  def list
    render json: {
      status: 'ok',
      data: (FileRouter::Repository::Registry.contents.map { |id, provider| _provider_to_hash provider })
    }
  end

  # Respond with a JSONSchema form specification for the provider configuration
  def jsf
    if FileRouter::Repository::Registry.contents.include? params[:id]
      provider   = FileRouter::Repository::Registry.contents[params[:id]]

      render json: {
        status: 'ok',
        data: provider.form_spec({})
      }
    else
      render status: 404
    end
  end

  # Validate the passed configuration and respond with a list of errors
  def validate_config
    if FileRouter::Repository::Registry.contents.include? params[:id]
      provider = FileRouter::Repository::Registry.contents[params[:id]]

      begin
        config = JSON.parse(request.body.read)

        errs = provider.validate_configuration config

        render json: {
          status: 'ok',
          data: errs
        }
      rescue JSON::ParserError => e
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
