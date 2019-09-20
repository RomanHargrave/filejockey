require "filerouter/configurable"

# FileRouter Repository Provider
# (C) 2019 Roman Hargrave
module FileRouter
  module Repository

    # Base class for Provider implementations
    class RepositoryProvider < Configurable
      attr_reader :name

      # Base constructor for RepositoryProvider
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
        raise NotImplementedError.new "This repository does not respond to #retrieve"
      end

      # Submit a file to the remote.
      # Accepts any IO object and produces a transmission result
      # @param [String] filespec Destination file specification, such as a name or fully qualified path (per the remote requirements)
      # @param [IO] io IO object to read file data from
      def submit(filespec, io)
        raise NotImplementedError.new "This repository does not respond to #submit"
      end

      # If supported, list the contents of the repository
      def list
        raise NotImplementedError.new "This provider does not respond to #list"
      end

      # Returns a descriptive, short name, which is used to represent the provider in the user interface
      def self.provider_name
        "Base Provider"
      end

      # Returns an array of supported features.
      # Meaningful values are
      #  » :archive  - the repository supports archiving
      #  » :list     - the repository can produce a file listing
      #  » :retrieve - files may be retrieved from the repository
      #  » :submit   - files may be submitted to the repository
      def self.features
        []
      end

      # Unique value used to link a provider instance from the database to an instance in the registry
      # As a rule of thumb, this ID should be changed if the (new) provider implementation becomes incompatible
      # with previous versions
      def self.provider_id
        "info.hargrave.filerouter.repository.base"
      end

      # Array representing the provider version, [major, minor]
      def self.provider_version
        [0, 1]
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
        raise ArgumentError.new("Parameter #1 is not a RepositoryProvider") unless repo.is_a? Provider

        @repository = repo
        @message    = "#{repo.class.provider_name} #{repo.name} does not have the requested file (#{name})"
        super(@message)
      end
    end

    class FileExistsError < RuntimeError
      attr_reader :repository
      attr_reader :message

      # Create a new FileExistsError
      # @param [Provider] repo Repository provider implementation
      # @param [String] name Name of the file
      def initialize(repo, name)
        raise ArgumentError.new("Parameter #1 is not a RepositoryProvider") unless repo.is_a? Provider

        @repository = repo
        @message    = "#{repo.class.provider_name} #{repo.name} already has file #{name} and does not permit overwriting"
        super(@message)
      end
    end
  end
end
