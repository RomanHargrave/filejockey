# Load the FileJockey base configuration, replacing it with a user configuration if set in the environment
module FileJockey
   PROVIDERS = YAML.load_file(ENV['FILEJOCKEY_PROVIDER_CONFIG'] || Rails.root.join('config/providers.yml'))
end
