class AddStripeIdToCustomers < ActiveRecord::Migration[7.2]
  def change
    add_column :customers, :stripe_id, :string
  end
end
