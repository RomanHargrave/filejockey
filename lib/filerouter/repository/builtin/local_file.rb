require 'fileutils'

# Implementation of a RepositoryFile on the local filesystem
module FileRouter
  module Repository
    module Builtin

      # A local file made available as RepositoryFile
      class LocalFile

        # Initialize LocalFile
        # @param [Provider] repository repo
        # @param [String] path Path (name) of the file, must exist
        # @param [String] archive_dest Destination to which the source file should be moved if #archive is called.
        #                              A value of nil indicates that archiving is unsupported.
        # @param [Logger] logger Logging facility
        def initialize(repository, path, archive_dest, logger)
          super(repository, path, logger)

          @path         = path
          @archive_path = archive_dest
        end

        # Do something with a read-only IO of the file
        # @param &block action
        def with_io(&block)
          io = File.open(@path, 'r')
          r = yield(io)
          io.close
          r
        end

        # Move the file to an the archive destination
        def archive!
          if @archive_path.nil?
            raise ArchiveNotSupportedError.new(@repository, @path)
          else
            # Pick an appropriate archive destination
            # If the archive path is a directory, use the basename of the source file, otherwise use the full archive path
            dest_file = if File.directory? @archive_path
                          "#{@archive_path}/#{File.basename @path}"
                        else
                          @archive_path
                        end

            dest_dir = File.dirname dest_file

            @logger.debug("Create archive destination #{dest_dir}")
            FileUtils.mkdir_p(dest_dir)

            unless File.directory? dest_dir
              @logger.error("Archive directory is a file or was not created")
              raise "Archive directory #{dest_dir} does not exist or is a regular file"
            end

            @logger.info("Archiving #{@path} to #{@dest_file}")
            FileUtils.mv(@path, @dest_file)
          end
        end # def archive!
      end
    end
  end
end
