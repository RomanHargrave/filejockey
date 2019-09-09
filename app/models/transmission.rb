# FileJockey transmission log record
# (C) 2019 Roman Hargrave
class Transmission < ActiveRecord::Base
   belongs_to :job

   def remote
      self.job.remote
   end

   def repository
      self.job.repository
   end
end
