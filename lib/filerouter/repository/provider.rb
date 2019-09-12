# FileRouter Repository Provider
# (C) 2019 Roman Hargrave
module FileRouter
  module Repository

    # Base class for Provider implementations
    class Provider
      attr_reader :name

      # Base constructor for Provider
      # @param [String] name Name of this provider instance, different from from self.name
      # @param [Hash] config Provider configuration data
      def initialize(name, logger, config)
        @name   = name
        @config = config
        @logger = logger
      end

      # Request, by provider-specified identity (filespec), a file from the repository
      # If no file matching the provided specification can be found, a [FileNotFoundError] will be raised.
      # @param [String] filespec String matching provider-specified format (e.g. URI) which is used to locate a file
      def request(filespec)
        raise NotImplementedError.new "This provider cannot respond to #retrieve"
      end

      # If supported, list the contents of the repository
      def list
        raise NotImplementedError.new "This provider cannot respond to #list"
      end

      # Returns a descriptive, short name, which is used to represent the provider in the user interface
      def self.provider_name
        "Base Provider"
      end

      # Returns an array of supported features.
      # Meaningful values are
      #  » :archive - the repository supports archiving
      #  » :list    - the repository can produce a file listing
      def self.features
        []
      end
    end

    # Error raised when a repository does not contain the requested file
    class FileNotFoundError < RuntimeError
      attr_reader :repository
      attr_reader :message

      # Create a new FileNotFoundError
      # @param [Provider] repo Repository provider implementation
      # @param [String] name Name of the file
      def initialize(repo, name)
        raise ArgumentError.new("Parameter #1 is not a Repository::Provider") unless repo.is_a? Provider

        @repository = repo
        @message    = "#{repo.class.provider_name} #{repo.name} does not have the requested file (#{name})"
        super(@message)
      end
    end
  end
end
