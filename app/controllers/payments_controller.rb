class PaymentsController < ApplicationController
  def new
  end

  def create
    # Create a Stripe customer
    customer = Stripe::Customer.create(
      email: params[:email],
      source: params[:stripeToken]
    )

    # Create the charge
    charge = Stripe::Charge.create({
      amount: (params[:price].to_f * 100).to_i, # Convert to cents
      currency: 'usd',
      customer: customer.id,
      description: 'Coffee Shop Order',
      receipt_email: params[:email],
    })

    # If successful, create an order, and clear the cart
    if charge.status == 'succeeded'
      # Here you can create an Order record, store details in the database, etc.
      Order.create(
        user_id: current_user.id, # Assuming you have a current_user
        total_price: params[:amount],
        status: 'paid'
      )
      
      # Clear the cart after successful payment
      localStorage.removeItem('cart')

      # Respond to the frontend
      render json: { success: true }
    else
      render json: { success: false, message: 'Payment failed. Please try again.' }
    end
  rescue Stripe::CardError => e
    flash[:error] = e.message
    redirect_to new_charge_path
  end
end
