class JobDestination < ApplicationRecord

  belongs_to :job
  belongs_to :repository
  has_many   :transmissions

end
