Rails.application.routes.draw do
  resources :products, only: [:index]
  resources :orders, only: [:create]
end
