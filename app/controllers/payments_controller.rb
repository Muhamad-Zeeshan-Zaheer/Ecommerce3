class PaymentsController < ApplicationController
  skip_before_action :verify_authenticity_token, only: [:create]
  require 'stripe'

  def new
    # Render a form if needed or handle any pre-payment logic
  end

  def create
    # Use the parameters passed from frontend (Stripe token, email, and amount)
    token = params[:token]
    email = params[:email]
    amount_in_cents = (params[:amount].to_f * 100).to_i  # Convert to cents

    # Set your Stripe secret key
    Stripe.api_key = "sk_test_51QmV1oArpMqQUTXOXO4s9im4szO6TO18jrlhd9dAXCd1cva05itJjmnXbJY3wuKbvF9MCJTdAd5ZXtpBbwOpsCBB00Ks0ITZkS"

    # Ensure the amount is not too small
    if amount_in_cents < 50
      render json: { error: 'Amount must be at least $0.50 USD' }, status: :unprocessable_entity
    
      return
    end

    begin
      # Create a customer in Stripe
      customer = Stripe::Customer.create({
        email: email,
        source: token,  # Attach the source (token) to the customer
      })

      # Create a PaymentIntent
      payment_intent = Stripe::PaymentIntent.create({
      amount: amount_in_cents,
      currency: 'usd',
      payment_method: token,  # Use 'payment_method' instead of 'payment_method_data'
      confirmation_method: 'manual',
      confirm: true,
      return_url: 'https://your-site.com/return-url'
})

      # Check the status of the payment
      if payment_intent.status == 'requires_action' || payment_intent.status == 'requires_source_action'
        # Payment requires further action (e.g., 3D Secure authentication)
        render json: { success: false, message: 'Payment requires additional authentication', client_secret: payment_intent.client_secret }
      elsif payment_intent.status == 'succeeded'
        # Payment was successful
        flash[:message] = "Payment succesful"

      else
        # Payment failed for other reasons
        flash[:notice] = "Payment failed. Please try again later"
      end
    rescue Stripe::CardError => e
      # Handle payment error (e.g., card declined, etc.)
      render json: { success: false, message: e.message }
    rescue Stripe::InvalidRequestError => e
      # Handle invalid request error (e.g., improper token structure)
      render json: { success: false, message: e.message }
    rescue Stripe::StripeError => e
      # Handle any Stripe-specific errors
      render json: { success: false, message: e.message }
    end
  end
end
