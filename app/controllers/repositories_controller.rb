class RepositoriesController < ApplicationController

  def available_providers
    render 'select_provider', locals: { providers: FileRouter.repositories }
  end

  def list
    pagy, instances = pagy(Repository.all)
    render 'list', locals: { pagy: pagy, instances: instances }
  end

end
