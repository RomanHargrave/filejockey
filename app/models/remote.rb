class Remote < ApplicationRecord

  has_many :jobs
  has_many :transmissions, through: :jobs

end
