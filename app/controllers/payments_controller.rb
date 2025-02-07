class PaymentsController < ApplicationController
  skip_before_action :verify_authenticity_token, only: [:create]
  require 'stripe'

  def create
    # Fetch payment parameters from frontend
    token = params[:token]
    email = params[:email]
    amount_in_cents = (params[:amount].to_f * 100).to_i # Convert to cents

    # Set your Stripe secret key
    Stripe.api_key = "sk_test_51QmV1oArpMqQUTXOXO4s9im4szO6TO18jrlhd9dAXCd1cva05itJjmnXbJY3wuKbvF9MCJTdAd5ZXtpBbwOpsCBB00Ks0ITZkS"

    # Ensure the amount is valid
    if amount_in_cents < 50
      render json: { success: false, message: 'Amount must be at least $0.50 USD' }, status: :unprocessable_entity
      return
    end

    begin
      # Create a new customer
      customer = Stripe::Customer.create({
        email: email,
        source: token
      })

      # Create a charge
      charge = Stripe::Charge.create({
        customer: customer.id,
        amount: amount_in_cents,
        currency: 'usd',
        description: "Payment from #{email}"
      })

      if charge.paid
        render json: { success: true, message: 'Payment successful' }
      else
        render json: { success: false, message: 'Payment failed' }, status: :payment_required
      end

    rescue Stripe::CardError => e
      render json: { success: false, message: e.message }, status: :unprocessable_entity
    rescue Stripe::InvalidRequestError => e
      render json: { success: false, message: e.message }, status: :unprocessable_entity
    rescue Stripe::StripeError => e
      render json: { success: false, message: 'Payment processing error. Please try again later.' }, status: :internal_server_error
    rescue => e
      render json: { success: false, message: "An error occurred: #{e.message}" }, status: :internal_server_error
    end
  end
end
