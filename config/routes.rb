require 'sidekiq/web'
require 'sidekiq-scheduler/web'

Rails.application.routes.draw do

  # In T&D, mount Sidekiq for debugging
  unless Rails.env.production?
    mount Sidekiq::Web => '/sidekiq'
  end

  get '/', to: 'dashboard#overview'

  get '/repositories',      to: 'repositories#list'
  get '/repositories/new',  to: 'repositories#new'

  get '/jobs',          to: 'jobs#list'
  get '/transmissions', to: 'transmissions#list'
  get '/audit',         to: 'audit#home'
  get '/system',        to: 'system#home'

end
