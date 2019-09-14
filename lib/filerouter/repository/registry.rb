module FileRouter
  module Repository
    module Registry

      @@registry = {}

      def self.register(repo)
        if repo < RepositoryProvider
          @@registry[repo.provider_id] = repo
        else
          raise ArgumentError.new "Parameter #1 of Registry::register expects a RepositoryProvider but got a #{repo?.name || repo.class.name} instead"
        end
      end

      def self.contents
        @@registry
      end
    end
  end
end

