class Api::RepositoriesController < ApplicationController

  after_action { pagy_headers_merge(@pagy) if @pagy }

  def show
    @pagy, result = pagy Repository.where(
      "provider_id ILIKE :criteria OR name ILIKE :criteria",
      { criteria:  "%#{params.fetch(:criteria, "")}%" }
    )

    render json: result.map {|r| r.as_json}
  end

  def create
    rep  = JSON.parse(params[:data])
    new  = Repository.new(rep)
    render json: new.as_json
  end

  def update
    rep  = JSON.parse(params[:data])

    if rep.include? :id
      Repository.update(rep[:id], rep)
      render json: Repository.get(rep[:id]).as_json
    else
      render status: 404
    end
  end

  def delete
    Repository.delete(params[:id])
  end

end
