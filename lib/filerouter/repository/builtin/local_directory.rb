require 'fileutils'
require_relative 'local_file'

# FileRouter Local Repository
# (C) 2019 Roman Hargrave <roman@hargrave.info>
module FileRouter
  module Repository
    module Builtin

      # Local repository provider.
      # Retrieves files from a beneath a folder on the host system
      class LocalDirectory < RepositoryProvider

        # Construct a local repository provider
        def initialize(logger, config)
          super(name, logger, config)

          raise ArgumentError.new "Parameter #1 must include a 'directory' key" unless config include? 'directory'

          @directory   = config['directory']
          FileUtils.mkdir_p @directory unless File.exist? @directory
          raise ArgumentError.new "Parameter #1 must be a directory" unless File.directory? @directory

          @archive_dir     = config.fetch('archive_directory', false)
          @allow_overwrite = config.fetch('allow_overwrite',   false)
          name             = config.fetch('name',              "#{self.class.name} «#{@directory}»")
        end

        # Accept a string, with or without leading slash, referring to a file beneath [@directory]
        # @param [String] filespec Path to a file within the repository directory
        def request(filespec)
          qualified = "#{@directory}/#{filespec}"
          raise FileNotFoundError.new(self, filespec) unless File.exist? qualified

          LocalFile.new(self, qualified, @archive_dir, @logger)
        end

        def submit(filespec, src_io)
          qualified = "#{@directory}/#{filespec}"
          raise FileExistsError.new(self, filespec) if File.exist?(qualified) and not @allow_overwrite

          parent_dir = File.dirname qualified
          @logger.info "Ensuring that directory #{parent_dir} exists"
          FileUtils.mkdir_p parent_dir

          @logger.info "Opening #{qualified} for writing"
          dest_io = File.open(qualified, 'w')


          @logger.info "Copying input stream"
          start_time = Time.now
          IO.copy_stream(src_io, dest_io)
          finish_time = Time.now

          { start: start_time, finish: finish_time, status: :success }
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

        def self.provider_id
          "info.hargrave.filerouter.repository.local"
        end

        def self.provider_version
          [0, 1]
        end

        def self.features
          [ :archive, :list, :submit, :retrieve ]
        end

        def self.configuration_spec
          [
            { name: 'name',              type: :string,  required: true  },
            { name: 'archive_directory', type: :string,  required: false },
            { name: 'allow_overwrite',   type: :boolean, required: true, default: false }
          ]
        end
      end # class LocalDirectory
    end # module Local
  end # module Repository
end # module FileRouter
