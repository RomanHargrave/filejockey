require 'local_file'
require 'fileutils'

# FileRouter Local Repository
# (C) 2019 Roman Hargrave <roman@hargrave.info>
module FileRouter
  module Repository

    # Local repository provider.
    # Retrieves files from a beneath a folder on the host system
    class LocalDirectory < Provider

      # Construct a local repository provider
      def initialize(logger, config)
        super(name, logger, config)

        raise ArgumentError.new "Parameter #1 must include a 'directory' key" unless config include? 'directory'

        @directory   = config['directory']
        FileUtils.mkdir_p @directory unless File.exist? @directory
        raise ArgumentError.new "Parameter #1 must be a directory" unless File.directory? @directory

        @archive_dir = config.fetch('archive_directory', "#{@directory}/archive")
        name         = config.fetch('name', "#{self.class.name} «#{@directory}»")
      end

      # Accept a string, with or without leading slash, referring to a file beneath [@directory]
      # @param [String] filespec Path to a file within the repository directory
      def request(filespec)
        qualified = "#{@directory}/#{filespec}"
        raise FileNotFoundError.new "#{filespec} is not available from this repository" unless File.exist? qualified

        LocalFile.new(self, qualified, @archive_dir, @logger)
      end

      # Returns a listing of the repository, relative to the base directory
      def list
        Dir.glob("#{@directory}/**/*").reject(&File.directory?).map do |p|
          Pathname.new(p).relative_path_from(@directory)
        end
      end


      def self.provider_name
        "Local Directory"
      end

      def self.features
        [ :archive, :list ]
      end
    end # class LocalDirectory
  end # module Repository
end # module FileRouter
