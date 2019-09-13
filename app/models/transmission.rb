# FileRouter transmission log record
# (C) 2019 Roman Hargrave
class Transmission < ActiveRecord::Base

  belongs_to :job
  belongs_to :job_destination
  belongs_to :job_schedule

end
