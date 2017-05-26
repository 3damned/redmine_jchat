class CreateChats < ActiveRecord::Migration
  def self.up
    create_table :chats do |t|
      t.column :message, :string
      t.column :user, :integer				# from user 
      t.column :user2, :integer				# to user - NULL or 0 means the message to all users in scope of project_id
      t.column :project_id, :integer		# project_id - NULL describes messages in default public chat 
      t.column :created_at, :timestamp
    end
  end

  def self.down
    drop_table :chats
  end
end
