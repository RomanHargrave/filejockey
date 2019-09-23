class Api::RepositoriesController < ApplicationController
  protect_from_forgery with: :null_session

  after_action {
    pagy_headers_merge(@pagy) if @pagy
  }

  def list
    query = Repository.where(
      "provider_id ILIKE :criteria OR name ILIKE :criteria",
      { criteria:  "%#{params.fetch(:criteria, "")}%" }
    )

    if params.include? :isSource
      query = query.where(is_source: params[:isSource])
    end

    if params.include? :isDestination
      query = query.where(is_destination: params[:isDestination])
    end

    query = query.order(params.fetch(:orderBy, 'name') => params.fetch(:order, 'desc').to_sym)

    pageSize = params.fetch(:pageSize, 20);

    # Workaround for 'all' requests
    if pageSize.to_i < 0
      render json: query.map {|r| r.as_json }
    else
      @pagy, result = pagy(
        query,
        items: params.fetch(:pageSize, 20)
      )

      render json: result.map {|r| r.as_json}
    end
  end

  def show
    if Repository.exists? params[:id]
      repo = Repository.first params[:id]
      render json: {
        status: "ok",
        data: repo.as_json
      }
    else
      render status: 404
    end
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

    if rep.include? :id or params.include? :id
      id = params.fetch(:id, rep[:id])
      Repository.update(id, rep)
      render json: Repository.get(id).as_json
    else
      render status: 404
    end
  end

  def delete
    Repository.delete(params[:id])
  end

end
