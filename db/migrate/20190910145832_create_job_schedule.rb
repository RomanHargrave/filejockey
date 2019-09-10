class CreateJobSchedule < ActiveRecord::Migration[6.0]
  def change
    create_table :job_schedules do |t|
      t.belongs_to :job
      t.timestamp  :scheduled_time, comment: 'Scheduled run-time for the job'
      t.interval   :resubmit_after, null: true, comment: 'If set, schedule the job again after this interval'
      t.uuid       :transmission_id, null: true, comment: 'The transmission record created by this task'
    end
  end
end
