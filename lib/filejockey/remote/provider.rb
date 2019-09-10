# FileJockey remote provider
# (C) 2019 Roman Hargrave <roman@hargrave.info>
module FileJockey
   module Remote

      # Remote provider
      class Provider
         attr_reader :name

         # Base constructor for the remote provider
         # @param [String] name Provider name, different from ::name
         # @param [Hash] config Provider configuration data
         def initialize(name, config)
            @config = config
            @name   = name
         end

         # Submit a file to the remote.
         # Accepts any IO object and produces a transmission result
         # @param [String] filespec Destination file specification, such as a name or fully qualified path (per the remote requirements)
         # @param [IO} io IO object to read file data from
         def submit(filespec, io)
            raise NotImplementedError.new "This remote implementation does not respond to #submit"
         end

         def self.name
            "Base Remote"
         end
      end # class Provider

      # Represents the result of a submission to a remote
      class SubmissionResult

         # Transmission start time
         attr_reader :start_time

         # Transmission finish time
         attr_reader :finish_time

         # File name transmitted, if supported by the Remote
         attr_reader :file_name

         # Size of transmitted files, may be nil if unknown
         attr_reader :file_size

         # Transmission status — one of :failure, :partial, :success
         attr_reader :status

         # Message, if any. May be nil.
         # May describe failure or warning in the event of :failure or :partial status
         attr_reader :message

         # Remote-specific data (e.g. logs) in a Hash
         attr_reader :data

         # The remote to which the file was submitted
         attr_reader :remote

         # Create a SubmissionResult
         # @param [Provider] remote Remote provider implementation
         # @param [Symbol] status Transmission status symbol (one of :failure, :partial, or :complete)
         # @param [DateTime] start_time Transmission start time
         # @param [DateTime] finish_time Transmission end time
         # @param [Hash] params other parameters (:file_name, :file_size, :message, :data)
         def initialize(remote, status, start_time, finish_time, params)
            raise ArgumentError.new("Parameter #1 is not a Remote::Provider") unless remote is_a? Provider
            raise ArgumentError.new("Parameter #2 is not one of :failure, :partial, or :complete") unless [:failure, :partial, :complete] include? status

            @remote      = remote;
            @status      = status;
            @start_time  = start_time;
            @finish_time = finish_time;
            @file_name   = params.fetch(:file_name, nil);
            @file_size   = params.fetch(:file_size, nil);
            @message     = params.fetch(:message, nil);
            @data        = params.fetch(:data, nil);
         end
      end
   end
end
