class ReactAppController < ApplicationController
  def index
    render 'react_app/index', layout: false
  end
end
