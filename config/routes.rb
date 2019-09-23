require 'sidekiq/web'
require 'sidekiq-scheduler/web'

Rails.application.routes.draw do

  # In T&D, mount Sidekiq for debugging
  unless Rails.env.production?
    mount Sidekiq::Web => '/sidekiq'
  end

  namespace :api do
    namespace :providers do
      get  '/repositories',                 to: 'repositories#list'
      get  '/repositories/:id',             to: 'repositories#show', constraints: { id: /[^\/]+/ }
      get  '/repositories/:id/form',        to: 'repositories#jsf',  constraints: { id: /[^\/]+/ }
      post '/repositories/:id/validate',    to: 'repositories#validate_config', constraints: { id: /[^\/]+/ }
    end

    get     '/repositories',                to: 'repositories#list'
    post    '/repositories',                to: 'repositories#create'
    put     '/repositories(/:id)',          to: 'repositories#update'
    delete  '/repositories/:id',            to: 'repositories#delete'
    get     '/repositories/:id',            to: 'repositories#show'

    get     '/jobs',                        to: 'jobs#list'
    post    '/jobs',                        to: 'jobs#create'
    put     '/jobs(/:id)',                  to: 'jobs#update'
    delete  '/jobs/:id',                    to: 'jobs#delete'
    get     '/jobs/:id',                    to: 'jobs#show'
    get     '/jobs/:id/destinations',       to: 'jobs#list_destinations'
    post    '/jobs/:id/destinations',       to: 'jobs#add_destination'
    get     '/jobs/:id/destinations/:dest', to: 'jobs#show_destination'
    put     '/jobs/:id/destinations/:dest', to: 'jobs#update_destination'
    delete  '/jobs/:id/destinations/:dest', to: 'jobs#delete_destination'
    get     '/jobs/:id/schedules',          to: 'jobs#list_schedules'
    post    '/jobs/:id/schedules',          to: 'jobs#add_schedule'
    get     '/jobs/:id/schedules/:sched',   to: 'jobs#show_scedule'
    put     '/jobs/:id/schedules/:sched',   to: 'jobs#update_schedule'
    delete  '/jobs/:id/schedules/:sched',   to: 'jobs#delete_schedule'


    get '/*path', to: proc { [404, {}, ['']] }
  end

  # Route, by default, all non-matched traffic to the Web UI
  root 'react_app#index'
  get  '/*path', to: 'react_app#index'

end
