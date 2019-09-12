class CacheCleanupJob < ApplicationJob
  queue_as :system

  def perform(*args)
      Rails.cache.cleanup
  end
end
