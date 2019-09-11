# FileRouter Repo File Object
# (C) 2019 Roman Hargrave
module FileRouter
  module Repository
    # Represents a file as retrieved from a repository
    class RepositoryFile
      attr_reader :repository
      attr_reader :name

      # Base constructor for RepositoryFile
      # @param [Provider] repository Repo instance
      # @param [String] name Name of the file
      def initialize(repository, name)
        raise ArgumentError.new("Parameter #1 is not a Repository::Provider") unless repository.is_a? Provider

        @repository = repository
        @name       = name

        # some idempotent value used to track lock state for a given file
        @lock_cache_key = "lock!#{self.to_s}"
      end

      # Do something with the IO object for this file
      # @param &block action to perform
      def with_io(&block)
        raise NotImplementedError.new "This RepositoryFile cannot respond to #open"
      end

      # Request to archive the file, which should prevent it from being retrieved again
      def archive!
        raise NotImplementedError.new "This RepositoryFile cannot respond to #archive"
      end

      # Check the lock state for this file
      # If for some reason it is not possible to inspect the lock, an [IOError] will be raised with
      # an appropriate message
      # @return [true] if the file is locked
      # @return [false] if the file is not locked
      def is_locked?
        Rails.cache.fetch(@lock_cache_key) do
          false
        end
      end

      # Request to lock the file. If the file is not already locked, this method will return;
      # however, if the file is already locked it should raise [FileLockedError] in order to
      # indicate such.
      # If file locking is for some reason not possible, an [IOError] should be expected with
      # an appropriate message.
      def lock!
        raise FileLockedError.new(@repository, @name) if self.is_locked?

        Rails.cache.write(@lock_cache_key, true)
      end

      # Release the lock on the file. This will return true/false depending on whether the file
      # was locked in the first place.
      # If unlocking is not possible (as with #lock!), an [IOError] will be raised with an
      # appropriate message
      # @return [true] if the file was locked
      # @return [false] if the file was not locked
      def release!
        old_state = self.is_locked?
        Rails.cache.write(@lock_cache_key, false)

        old_state
      end

      # Invoke a block after locking the file, and release after the block yields
      def lock_with!(&block)
        self.lock!
        r = yield(self)
        self.release!
        r
      end

      def to_s
        "#{@repository.class.name}(#{@repository.name})/#{@name}"
      end
    end

    # Error raised when a file is requested, exists, but is locked by another thread (locking strategy is up to provider)
    class FileLockedError < RuntimeError
      attr_reader :repository
      attr_reader :message

      # Create a new FileLockedError
      # @param [Provider] repo Repository provider implementation
      # @param [String] name Name of file
      def initialize(repo, name)
        raise ArgumentError.new("Parameter #1 is not a Repository::Provider") unless repo.is_a? Provider

        @repository = repo
        @message    = "The requested file #{repo.name}/#{name} is locked, likely by a running job"
        super(@message)
      end
    end

    # Error raised when a file cannot be archived
    class ArchiveNotSupportedError < RuntimeError
      attr_reader :repository
      attr_reader :message

      # Create a new ArchiveNotSupportedError
      # @param [Provider] repo Repository provider implementation
      # @param [String] name Name of file
      def initialize(repo, name)
        raise ArgumentError.new("Parameter #1 is not a Repository::Provider") unless repo.is_a? Provider

        @repository = repo
        @message    = "The file #{repo.name}/#{name} cannot be archived"
        super(@message)
      end
    end
  end
end
