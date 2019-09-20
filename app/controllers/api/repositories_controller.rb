class Api::RepositoriesController < ApplicationController
  protect_from_forgery with: :null_session

  after_action {
    pagy_headers_merge(@pagy) if @pagy
  }

  def show
    query = Repository.where(
      "provider_id ILIKE :criteria OR name ILIKE :criteria",
      { criteria:  "%#{params.fetch(:criteria, "")}%" }
    ).order(params.fetch(:orderBy, 'name') => params.fetch(:order, 'desc').to_sym)

    @pagy, result = pagy(query, items: params.fetch(:pageSize, 20))

    render json: result.map {|r| r.as_json}
  end

  def create
    begin
      rep = JSON.parse(request.body.read)
      rec = Repository.create(rep)
      render json: {
        status: 'ok',
        data: rec.as_json
      }
    rescue => e
      render json: {
        status: 'error',
        code: 500,
        message: e
      }
    end
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
