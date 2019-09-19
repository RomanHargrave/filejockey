require 'sidekiq/web'
require 'sidekiq-scheduler/web'

Rails.application.routes.draw do

  # In T&D, mount Sidekiq for debugging
  unless Rails.env.production?
    mount Sidekiq::Web => '/sidekiq'
  end

  namespace :api do
    namespace :providers do
      get  '/repositories',               to: 'repositories#list'
      get  '/repositories/:id',           to: 'repositories#show', constraints: { id: /[^\/]+/ }
      get  '/repositories/:id/form',      to: 'repositories#mson', constraints: { id: /[^\/]+/ }
      post '/repositories/:id/validate',  to: 'repositories#validate_config', constraints: { id: /[^\/]+/ }
    end

    resource :repositories

    get '/*path', to: proc { [404, {}, ['']] }
  end

  # Route, by default, all non-matched traffic to the Web UI
  root 'react_app#index'
  get  '/*path', to: 'react_app#index'

end
