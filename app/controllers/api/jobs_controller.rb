class Api::JobsController < ApplicationController
  protect_from_forgery with: :null_session

  after_action {
    pagy_headers_merge(@pagy) if @pagy
  }

  def list
    query = Job.where(
      "name ILIKE :criteria",
      { criteria:  "%#{params.fetch(:criteria, "")}%" }
    ).order(params.fetch(:orderBy, 'name') => params.fetch(:order, 'desc').to_sym)

    pagy, result = pagy(query, items: params.fetch(:pageSize, 20))

    render json: {
      status: "ok",
      data: result.map {|r| r.as_json}
    }
  end

  def show
    if Job.exists(params[:id])
      render json: {
        status: "ok",
        data: Job.get(params[:id]).as_json
      }
    else
      render status: 404
    end
  end

  def create
    begin
      spec = JSON.parse(request.body.read)
      new = Job.create(spec)
      render json: {
        status: "ok",
        data: new.as_json
      }
    rescue JSON::ParserError => e
      render json: {
        status: "error",
        code: 400,
        message: "Request body contained invalid JSON: #{e}"
      }
    end
  end

  def update
    begin
      spec = JSON.parse(request.body.read)
      id   = params.fetch(:id, spec[:id])

      if Job.exists? id
        Job.update(id, spec)
        render json: {
          status: "ok",
          data: Job.get(id).as_json
        }
      else
        render status: 404
      end
    rescue JSON::ParserError => e
      render json: {
        status: "error",
        code: 400,
        message: "Request body container invalid JSON: #{e}"
      }
    end
  end

  def delete
    if Job.exists? params[:id]
      Job.delete! params[:id]
      render json: {
        status: "ok"
      }
    else
      render status: 404
    end
  end

  # /:id/destinations

  def list_destinations
    if Job.exists? params[:id]
      render json: {
        status: 'ok',
        data: Job.get(params[:id]).destinations.map {|d| d.as_json}
      }
    else
      render status: 404
    end
  end

  def add_destination
    if Job.exists? params[:id]
      begin
        rep = JSON.parse(request.body.read)
        new = Job.get(params[:id]).destinations.add(rep)
        render json: {
          status: 'ok',
          data: new.as_json
        }
      rescue JSON::ParserError => e
        render json: {
          status: 'error',
          code: 400,
          message: "Invalid request body: #{e}"
        }
      end
    else
      render status: 404
    end
  end

  def show_destination
    # Destinations have a GUID, so we don't need to go via Job for extant Destinations
    if JobDestination.exists? params[:dest]
      render json: {
        status: 'ok',
        data: JobDestination.get(params[:dest])
      }
    else
      render status: 404
    end
  end

  def update_destination
    if JobDestination.exists? params[:dest]
      begin
        rep = JSON.parse(request.body.read)
        JobDestination.update(params[:dest], rep)
        render json: {
          status: 'ok',
          data: JobDestination.get(params[:dest])
        }
      rescue JSON::ParserError => e
        render json: {
          status: 'error',
          code: 400,
          message: "Request body contained invalid JSON: #{e}"
        }
      end
    else
      render status: 404
    end
  end

  def delete_destination
    if JobDestination.delete params[:dest]
      render json: { status: 'ok' }
    else
      render status: 404
    end
  end

  # /:id/schedules

  def list_schedules
    if Job.exists? params[:id]
      render json: {
        status: 'ok',
        data: Job.get(params[:id]).schedules.map {|s| s.as_json}
      }
    else
      render status: 404
    end
  end

  def add_schedule
    if Job.exists? params[:id]
      begin
        rep = JSON.parse(request.body.read)
        render json: {
          status: 'ok',
          data: Job.get(params[:id]).schedules.create(rep)
        }
      rescue JSON::ParseError => e
        render json: {
          status: 'error',
          code: 400,
          message: "Invalid JSON in request body: #{e}"
        }
      end
    else
      render status: 404
    end
  end

  def show_schedule
    # The same applies WRT ID namespace as with JobDestination
    if JobSchedule.exists? params[:sched]
      render json: {
        status: 'ok',
        data: JobSchedule.get(params[:sched]).as_json
      }
    else
      render status: 404
    end
  end

  def update_schedule
    if JobSchedule.exists? params[:sched]
      begin
        rep = JSON.parse(request.body.read)

        render json: {
          status: 'ok',
          data: JobSchedule.update(params[:sched], rep)
        }
      rescue JSON::ParserError => e
        render json: {
          status: 'error',
          code: 400,
          message: "Invalid JSON data in request body: #{e}"
        }
      end
    else
      render status: 404
    end
  end

  def delete_schedule
    if JobSchedule.delete params[:sched]
      render json: { status: 'ok' }
    else
      render status: 404
    end
  end

end
