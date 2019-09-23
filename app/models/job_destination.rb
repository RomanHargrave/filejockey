class JobDestination < ApplicationRecord

  belongs_to :job
  belongs_to :repository
  has_many   :transmissions

  def name
    self.friendly_name
  end

  def as_json
    {
      job_id: self.job_id,
      repository_id: self.repository_id,
      name: self.name,
      repository_name: self.repository.name,
      filespec: self.filespec
    }
  end

end
