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
      t.belongs_to :remote, comment: 'Remote to send file to'
      t.belongs_to :repository, comment: 'Repository to collect file from'
      t.string :source_file, comment: 'Source file specification, in repository-specified format'
      t.string :dest_file, comment: 'Destination file specification, in remote-specified format'
      t.string :name, comment: 'Job name'
      t.jsonb  :repository_options, comment: 'Additional parameters that are made available to the repository'
      t.jsonb  :remote_options, comment: 'Additional parameters that are made available to the remote'
    end

    # Completed/scheduled/in-progress file transmissions
    create_table :transmissions, id: :uuid do |t|
      t.belongs_to :job
      t.timestamp  :start_time, index: true, comment: 'Actual start time'
      t.timestamp  :end_time, comment: 'Completion time'
      t.column     :status, :transmission_state, index: true, comment: 'Transmission state (e.g. waiting, failed)'
      t.string     :status_message, comment: 'Free-form status message (e.g. could not connect)'
    end
  end
end
