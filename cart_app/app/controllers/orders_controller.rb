class OrdersController < ApplicationController

  def create
    order = Order.new(order_params)
    if order.save
      render json: { message: 'Order saved successfully' }, status: :created
    else
      render json: { error: order.errors.full_messages }, status: :unprocessable_entity
    end
  end

  private

  def order_params
    params.require(:order).permit(:items, :total)
  end
end
