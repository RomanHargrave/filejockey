class Repository < ApplicationRecord

  validates :provider_id, inclusion: {
    in: FileRouter.repositories.keys,
    message: "%{value} is not a known RepositoryProvider"
  }

  validates :is_source, inclusion: {
    in: [false],
    message: "The repository implementation does not support source functionality",
    unless: self.provider_class.features.include? :retrieve
  }

  validates :is_destination, inclusion: {
    in: [false],
    message: "The repository implementation does not support destination functionality",
    unless: self.provider_class.features.include? :submit
  }

  validates :name, presence: true

  validates :configuration, presence: true

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

end
