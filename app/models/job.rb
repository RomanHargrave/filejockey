class Job < ApplicationRecord

   has_one  :remote
   has_one  :repository
   has_many :transmissions

end
