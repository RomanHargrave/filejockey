class AddEnabledToJob < ActiveRecord::Migration[6.0]
  def change
    change_table :jobs do |c|
      c.boolean :enabled, null: false, default: false
    end
  end
end
