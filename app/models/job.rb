class Job < ApplicationRecord

   belongs_to   :repository, alias: :source
   has_many     :job_destinations, alias: :destinations
   has_many     :job_schedules, alias: :schedules
   has_many     :transmissions

end
