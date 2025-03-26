class CreateOrders < ActiveRecord::Migration[7.1]
  def change
    create_table :orders do |t|
      t.text :items
      t.decimal :total

      t.timestamps
    end
  end
end
