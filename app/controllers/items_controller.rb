class ItemsController < ApplicationController
  before_action :authenticate_user!
  def index
    @items=Item.all
  end
  def show
    @item=Item.find(params[:id])
  end
  def new
    @item=Item.new
  end

  def create
    @item=Item.new(item_params)
    if @item.save
      redirect_to items_path
    else
      render :new, status: :unprocessable_entity
    end
  end

  def edit
    @item=Item.find(params[:id])
  end

  def update
    @item=Item.find(params[:id])
    if @item.update(item_params)
      redirect_to items_path
    else
      render :edit, status: :unprocessable_entity
    end
  end

  def destroy
    @item=Item.find(params[:id])
    @item.destroy
    redirect_to root_path
  end

  private
  def item_params
    params.require(:item).permit(:name, :description, :price , :image, :category_id)

  end
end
