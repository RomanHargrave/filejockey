class Initial < ActiveRecord::Migration[6.0]

  def change
    # Repositories to retrieve files from, or to send them to
    create_table :repositories, id: :uuid do |t|
      t.string    :provider_id, comment: 'Provider ID'
      t.string    :name, comment: 'Name of the repository instance'
      t.jsonb     :configuration, comment: 'Provider-specific configuration'
      t.boolean   :is_source, comment: 'Whether files may be retrieved from the repository'
      t.boolean   :is_destination, comment: 'Whether files may be sent to the repository'
    end

    # Jobs that copy a file from Repository to Remote
    create_table :jobs, id: :uuid do |t|
      t.belongs_to :repository, comment: 'Repository to collect file from'
      t.string     :source_filespec, comment: 'Source file specification, in repository-specified format'
      t.string     :name, comment: 'Job name'
      t.boolean    :enabled, comment: 'Whether the Job is enabled'
    end

    # Job destinations
    create_table :job_destinations do |t|
      t.belongs_to :job
      t.belongs_to :repository, comment: 'Remote to send file to'
      t.string     :filespect, comment: 'Destination filespec'
    end

    # Job schedules
    create_table :job_schedules, id: :uuid do |t|
      t.belongs_to :job
      t.timestamp  :scheduled_time, comment: 'Scheduled run-time for the job'
      t.boolean    :is_recurring, null: false, default: true, comment: 'Whether this is a recurring schedule'
      t.interval   :recur_interval, null: false, default: 15.minutes comment: 'Interval at which the schedule recurs'
    end

    # Completed/scheduled/in-progress file transmissions
    create_table :transmissions, id: :uuid do |t|
      t.belongs_to :job_schedule, comment: 'Schedule that created this transmission'
      t.belongs_to :repository, comment: 'Repository that received the file'
      t.timestamp  :start_time, index: true, comment: 'Actual start time'
      t.timestamp  :end_time, comment: 'Completion time'
      t.column     :status, :transmission_state, index: true, comment: 'Transmission state (e.g. waiting, failed)'
      t.string     :status_message, comment: 'Free-form status message (e.g. could not connect)'
      t.text       :extendend_status, comment: 'Extended status, e.g. log messages'
    end
  end
end
