class Job < ApplicationRecord

  belongs_to   :repository
  has_many     :job_destinations
  has_many     :job_schedules
  has_many     :transmissions

  def as_json
    {
      id: self.id,
      source: self.source.as_json,
      destinations: self.destinations.map {|r| r.as_json}
    }
  end

  # Aliases for assocations
  def source
    self.repository
  end

  def destinations
    self.job_destinations
  end

  def schedules
    self.job_schedules
  end

end
