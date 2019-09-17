class Api::RepositoriesController < ApplicationController

  after_action { pagy_headers_merge(@pagy) if @pagy }

  def show
    @pagy, result = pagy Repository.where(
      "provider_id ILIKE :criteria OR name ILIKE :criteria",
      { criteria:  "%#{params.fetch(:criteria, "")}%" }
    )

    render json: result.map {|r| r.as_json}
  end

end
