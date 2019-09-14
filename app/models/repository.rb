class Repository < ApplicationRecord

  has_many :jobs, as: :outgoing_jobs
  has_many :jobs, as: :incoming_jobs, through: :job_destination
  has_many :transmissions, as: :outgoing_transmissions, through: :job
  has_many :transmissions, as: :incoming_transmissions, through: :job_destination

  validates :provider_id, inclusion: {
    in: FileRouter.repositories.keys,
    message: "%{value} is not a known RepositoryProvider"
  }

  validates :is_source, inclusion: {
    in: [false],
    message: "The repository implementation does not support source functionality",
    unless: Proc.new { |inst| inst.provider_class.features.include? :retrieve }
  }

  validates :is_destination, inclusion: {
    in: [false],
    message: "The repository implementation does not support destination functionality",
    unless: Proc.new { |inst| inst.provider_class.features.include? :submit }
  }

  validates :name, presence: true

  validates :configuration, presence: true

  validate :valid_configuration

  # Get the class object for the provider
  def provider_class
    FileRouter.repositories.fetch(self.provider_id, nil)
  end

  # Instantiate a provider from the record
  def to_provider
    inst = self.provider_class

    if inst.nil?
      nil
    else
      Rails.cache.fetch("repository.#{self.id}", expires_in: 5.minutes) do
        inst.new(self.name, self.configiration)
      end
    end
  end

  # Called by ActiveRecord to validate the provider configuration with the implementation-provided validator
  def valid_configuration
    self.provider_class.validate_configuration(self.configuration) do |err|
      errors.add(:configuration, "Repository configuration field #{err[:field]} is invalid: #{err[:message]}")
    end
  end

end
