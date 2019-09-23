class JobSchedule < ApplicationRecord

  belongs_to :job
  has_many   :transmissions

  def as_json
    {
      id: self.id,
      scheduled_time: self.scheduled_time,
      is_recurring: self.is_recurring,
      recur_interval: self.recur_interval
    }
  end

end
