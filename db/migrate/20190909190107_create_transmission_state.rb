class CreateTransmissionState < ActiveRecord::Migration[6.0]
  def up
    execute <<-SQL
      CREATE TYPE transmission_state AS ENUM ('waiting', 'running', 'complete', 'failed', 'partial')
    SQL
  end

  def down
    execute <<-SQL
      DROP TYPE transmission_state
    SQL
  end
end
