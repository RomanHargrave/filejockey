require 'sidekiq/web'
require 'sidekiq-scheduler/web'

Rails.application.routes.draw do

  # In T&D, mount Sidekiq for debugging
  unless Rails.env.production?
    mount Sidekiq::Web => '/sidekiq'
  end

end
