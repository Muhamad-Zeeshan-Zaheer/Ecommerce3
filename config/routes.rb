Rails.application.routes.draw do
  devise_for :users
  get "/users/sign_out", :to => "devise/sessions#destroy"
  root "items#index"
  post 'add_to_cart/:id', to: 'carts#add', as: 'add_to_cart'
  resources :items
  resources :categories
end
