Rails.application.routes.draw do
  devise_for :users
  get "/users/sign_out", :to => "devise/sessions#destroy"
 root "items#index"
 resources :items
 resources :categories
end
