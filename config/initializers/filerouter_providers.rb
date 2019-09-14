require 'filerouter/repository'

# Load the FileJockey base configuration, replacing it with a user configuration if set in the environment
module FileRouter
  private

  PROVIDERS_BUILTIN = YAML.load_file(Rails.root.join('config/providers_builtin.yml'))
  PROVIDERS_LOCAL   = if File.exist? Rails.root.join('config/providers.yml')
                        YAML.load_file Rails.root.join('config/providers.yml')
                      else
                        {}
                      end

  PROVIDERS = PROVIDERS_BUILTIN.merge(PROVIDERS_LOCAL)

  public

  @@repositories = PROVIDERS['repository'].map do |classname|
    begin
      provider = classname.constantize

      if provider < FileRouter::Repository::RepositoryProvider
        Rails.logger.info "Registered repository #{provider.provider_name} (#{provider.provider_id}) v#{provider.provider_version.join('.')} as class #{classname}"
        provider
      else
        Rails.logger.error "Could not load repository provider #{classname} because it does not inherit FileRouter::Repository::RepositoryProvider"
        nil
      end
    rescue NameError => ne
      Rails.logger.error "Could not load repository provider #{classname} because the named class does not exist"
      nil
    end
  end.reject {|x| x.nil?} .map {|x| [x.provider_id, x]} .to_h

  def self.repositories
    @@repositories
  end
end
