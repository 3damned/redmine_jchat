# Plugin's routes
# See: http://guides.rubyonrails.org/routing.html

post '/chat/send_chat', :to => 'chat#send_chat'
get '/chat/receive_chat', :to => 'chat#receive_chat'

resources 'chat'
