require_relative 'boot'

require 'rails/all'

# Require the gems listed in Gemfile, including any gems
# you've limited to :test, :development, or :production.
Bundler.require(*Rails.groups)

module Filerouter
  class Application < Rails::Application
    # Initialize configuration defaults for originally generated Rails version.
    config.load_defaults 6.0

    config.active_job.queue_adapter = :sidekiq

    config.generators do |g|
       g.template_engine = :haml
    end

    redis_url = ENV.fetch('REDIS_URL', 'redis://localhost:6379/1')

    config.cache_store = :redis_cache_store, { url: redis_url }

    Sidekiq.configure_server do |c|
      c.redis = { url: redis_url }
    end

    Sidekiq.configure_client do |c|
      c.redis = { url: redis_url }
    end

    # Settings in config/environments/* take precedence over those specified here.
    # Application configuration can go into files in config/initializers
    # -- all .rb files in that directory are automatically loaded after loading
    # the framework and any gems in your application.
  end
end
