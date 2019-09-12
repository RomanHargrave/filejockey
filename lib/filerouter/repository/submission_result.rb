# FileRouter repository submission result
# (C) 2019 Roman Hargrave <roman@hargrave.info>
module FileRouter
   module Repository

      # Represents the result of a submission to a repository
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

         # The repository to which the file was submitted
         attr_reader :repository

         # Create a SubmissionResult
         # @param [RepositoryProvider] repository Repository implementation
         # @param [Symbol] status Transmission status symbol (one of :failure, :partial, or :complete)
         # @param [DateTime] start_time Transmission start time
         # @param [DateTime] finish_time Transmission end time
         # @param [Hash] params other parameters (:file_name, :file_size, :message, :data)
         def initialize(repository, status, start_time, finish_time, params)
            raise ArgumentError.new("Parameter #1 is not a RepositoryProvider") unless repository is_a? RepositoryProvider
            raise ArgumentError.new("Parameter #2 is not one of :failure, :partial, or :complete") unless [:failure, :partial, :complete].include? status

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
