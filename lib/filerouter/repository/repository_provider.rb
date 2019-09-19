# FileRouter Repository Provider
# (C) 2019 Roman Hargrave
module FileRouter
  module Repository

    # Base class for Provider implementations
    class RepositoryProvider
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

      # Array of Hash describing configuration parameters, which will be used to generate the user interface
      # Parameters that should not be presented to the user should not be displayed here
      # The format of the Hash objects in this Array is as follows
      #
      #   field:        string,   specifies the key of the item in the configuration hash (mandatory)
      #   display_name: string,   specifies the display name of the item in the UI (defaults to the value of :name)
      #   type:         Class,    String, Boolean, etc... (defaults to :string)
      #   required:     boolean,  whether the field is mandatory (defaults to true)
      #   default:      Object,   default value of the field (defaults to Nil)
      def self.configuration_spec
        []
      end

      # Accepts a provider configuration Hash and returns an array of Hash describing field-level errors
      # The entries in this hash must be as follows
      #
      #   field:    field name
      #   message:  error/warning
      def self.validate_configuration(configuration)
        spec = self.configuration_spec
        errs = []

        # Check for missing required fields
        spec.select {|o| o.fetch(:required, false) and not o.include? :default} .each do |opt|
          unless configuration.include? opt[:field]
            errs << {
              field: opt[:field],
              message: "Missing required field #{opt[:field]}"
            }
          end
        end

        # Validate present fields
        spec.select {|o| configuration.include? o[:field]} .each do |opt|
          field = configuration[opt[:field]]
          unless field.is_a? opt[:type]
            errs << {
              field:    opt[:field],
              message:  "Expected a #{opt[:type].name} but got a #{field.class.name}"
            }
          end
        end

        errs.concat self._validate_configuration configuration
      end


      # Overriding generated MSON in order to provide custom UI forms:
      # Define a method named form_mson as below
      #
      #   def self._form_mson(values)
      #     { ... }
      #   end
      #
      # The values parameter will be passed a Hash containing pre-fill values, if applicable.
      # The keys in the hash will correspond to the configuration field names specified in
      # self.configuration_spec
      def self.form_mson(values)
        components = {
          nil       => 'TextField',
          String    => 'TextField',
          Boolean   => 'BooleanField',
          DateTime  => 'dateField',
          Numeric   => 'numberField',
          Float     => 'numberField',
          Integer   => 'integerField'
        }

        if self.respond_to? :_form_mson
          self._form_mson
        else
          {
            component: 'Form',
            fields: self.configuration_spec.map do |spec|
              {
                component: components.fetch(spec.fetch(:type, nil), 'TextField'),
                required:  spec.fetch(:required, false),
                label:     spec.fetch(:name, spec[:field]),
                value:     values.fetch(spec[:field], spec.fetch(:default, nil)),
                name:      spec[:field]
              }.merge(spec.dig(:form, :params) || {})
            end
          }
        end
      end

      protected

      def self._validate_configuration(configuration)
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
