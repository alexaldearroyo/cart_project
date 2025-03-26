#!/bin/bash

echo "Setting up backend..."
cd cart_app
bundle install
rails db:create db:migrate db:seed

echo "Setting up frontend..."
cd ../cart_ui
npm install

