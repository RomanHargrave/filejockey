class Initial < ActiveRecord::Migration[6.0]

  def change
    # Repositories to retrieve files from, or to send them to
    create_table :repositories, id: :uuid do |t|
      t.string    :provider_id,    null: false, comment: 'Provider ID'
      t.string    :name,           null: false, comment: 'Name of the repository instance'
      t.jsonb     :configuration,  null: false, default: {},   comment: 'Provider-specific configuration'
      t.boolean   :is_source,      null: false, default: true, comment: 'Whether files may be retrieved from the repository'
      t.boolean   :is_destination, null: false, default: true, comment: 'Whether files may be sent to the repository'
    end

    # Jobs that copy a file from Repository to Remote
    create_table :jobs, id: :uuid do |t|
      t.belongs_to :repository,       null: false, type: :uuid, index: true, comment: 'Repository to collect file from'
      t.string     :source_filespec,  null: false, comment: 'Source file specification, in repository-specified format'
      t.string     :name,             null: false, comment: 'Job name'
    end

    # Job destinations
    create_table :job_destinations, id: :uuid do |t|
      t.belongs_to :job,            type: :uuid, null: false, index: true, comment: 'Job to which this destination belongs'
      t.belongs_to :repository,     type: :uuid, null: false, index: true, comment: 'Repository to send file to'
      t.string     :friendly_name,  null: false, comment: 'Display name for the destination'
      t.string     :filespec,       null: false, comment: 'Destination filespec'
    end

    # Job schedules
    create_table :job_schedules, id: :uuid do |t|
      t.belongs_to :job,            type: :uuid, null: false, index: true, comment: 'Job that this schedule will run'
      t.timestamp  :scheduled_time, null: false, index: true,         comment: 'Scheduled run-time for the job, if non-recurring'
      t.boolean    :is_recurring,   null: false, default: true,       comment: 'Whether this is a recurring schedule'
      t.interval   :recur_interval, null: false, default: 15.minutes, comment: 'Interval at which the schedule recurs'
    end

    # Completed/scheduled/in-progress file transmissions
    create_table :transmissions, id: :uuid do |t|
      t.belongs_to :job,              type: :uuid, null: false, index: true, comment: 'Job that generated this transmission'
      t.belongs_to :job_destination,  type: :uuid, null: false, index: true, comment: 'Job destintation that this transmission was sent to'
      t.belongs_to :job_schedule,     type: :uuid, null: true,  index: true, comment: 'Schedule that created this transmission'
      t.timestamp  :start_time,       null: false, index: true,  comment: 'Actual start time'
      t.timestamp  :end_time,         null: true,  index: false, comment: 'Completion time'
      t.string     :status_message,   null: true,  comment: 'Free-form status message (e.g. could not connect)'
      t.jsonb      :log_messages,     null: true,  comment: 'structured log entries'
      t.column     :status, :transmission_state, index: true, comment: 'Transmission state (e.g. waiting, failed)'
    end
  end
end
