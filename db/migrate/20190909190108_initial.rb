class Initial < ActiveRecord::Migration[6.0]

  def change
    # Repositories to retrieve files from
    create_table :repositories, id: :uuid do |t|
      t.string    :provider_id, comment: 'ID of the provider implementation used by this instance'
      t.string    :name, comment: 'name of this provider instance'
      t.jsonb     :configuration, comment: 'implementation-defined settings'
    end

    # Remotes to send files to
    create_table :remotes, id: :uuid do |t|
      t.string :provider_id, comment: 'ID of the provider implementation used by this instance'
      t.string :name, comment: 'name of the remote'
      t.string :configuration, comment: 'implementation-defined settings'
    end

    # Jobs that copy a file from Repository to Remote
    create_table :jobs, id: :uuid do |t|
      t.uuid   :repository_id, comment: 'Repository to collect file from'
      t.uuid   :remote_id, comment: 'Remote to send file to'
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
