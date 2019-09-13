class JobSchedule < ApplicationRecord

  belongs_to :job
  has_many   :transmissions

end
