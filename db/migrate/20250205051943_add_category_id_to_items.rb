class AddCategoryIdToItems < ActiveRecord::Migration[7.2]
  def change
    add_column :items, :category_id, :integer
  end
end
