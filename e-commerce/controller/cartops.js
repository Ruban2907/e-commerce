const Cart = require('../model/cart');
const Item = require('../model/items');
const Order = require('../model/order');

async function handleAddToCart(req, res) {
  try {
    const { quantity, selectedColor } = req.body;
    const itemId = req.params.id;
    const userId = req.user._id;

    if (!quantity || quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Quantity must be greater than 0'
      });
    }

    if (!selectedColor) {
      return res.status(400).json({
        success: false,
        message: 'Selected color is required'
      });
    }

    const item = await Item.findById(itemId);

    if (!item || !item.isAvailable) {
      return res.status(404).json({
        success: false,
        message: 'Item is not available'
      });
    }

    if (item.stock < quantity) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient stock available'
      });
    }

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }
    const existingItemIndex = cart.items.findIndex(
      cartItem => cartItem.itemId.toString() === itemId && cartItem.selectedColor === selectedColor
    );

    if (existingItemIndex !== -1) {
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      cart.items.push({
        itemId: itemId,
        quantity: quantity,
        selectedColor: selectedColor,
        price: item.price
      });
    }
    item.stock -= quantity;
    if (item.stock === 0) {
      item.isAvailable = false;
    }
    await item.save();
    await cart.save();

    res.status(200).json({
      success: true,
      message: 'Item added to cart successfully',
      data: {
        cartId: cart._id,
        itemId: itemId,
        quantity: quantity,
        selectedColor: selectedColor,
        remainingStock: item.stock,
        isAvailable: item.isAvailable
      }
    });
  } catch (error) {
    console.error("Add to cart error:", error);
    res.status(500).json({
      success: false,
      message: 'Error adding item to cart',
      error: error.message
    });
  }
}

async function handleGetCart(req, res) {
  try {
    const userId = req.user._id;
    const cart = await Cart.findOne({ userId })
      .populate({
        path: 'items.itemId',
        select: 'name description images colors stock'
      });
    if (!cart) {
      return res.status(200).json({
        success: true,
        data: {
          items: [],
          totalAmount: 0,
          itemCount: 0
        }
      });
    }

    const serializedCart = {
      _id: cart._id,
      userId: cart.userId,
      totalAmount: cart.totalAmount,
      itemCount: cart.items.length,
      createdAt: cart.createdAt,
      updatedAt: cart.updatedAt,
      items: cart.items.map(cartItem => {
        const item = cartItem.itemId;
        const itemObj = {
          _id: item._id,
          name: item.name,
          description: item.description,
          colors: item.colors,
          stock: item.stock,
          cartItemId: cartItem._id,
          quantity: cartItem.quantity,
          selectedColor: cartItem.selectedColor,
          price: cartItem.price,
          totalPrice: cartItem.price * cartItem.quantity
        };
        if (item.images && item.images.length > 0) {
          itemObj.images = item.images.map(image => ({
            data: image.data.toString('base64'),
            contentType: image.contentType
          }));
        }
        return itemObj;
      })
    };
    res.status(200).json({
      success: true,
      data: serializedCart
    });
  } catch (error) {
    console.error("Get cart error:", error);
    res.status(500).json({
      success: false,
      message: 'Error fetching cart',
      error: error.message
    });
  }
}

async function handleUpdateCartItem(req, res) {
  try {
    const { quantity } = req.body;
    const cartItemId = req.params.cartItemId;
    const userId = req.user._id;
    if (!quantity || quantity < 0) {
      return res.status(400).json({
        success: false,
        message: 'Quantity must be 0 or greater'
      });
    }
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }
    const cartItem = cart.items.id(cartItemId);
    if (!cartItem) {
      return res.status(404).json({
        success: false,
        message: 'Cart item not found'
      });
    }
    const item = await Item.findById(cartItem.itemId);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found'
      });
    }
    const quantityDifference = quantity - cartItem.quantity;
    if (quantityDifference > 0 && item.stock < quantityDifference) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient stock available'
      });
    }
    if (quantity === 0) {
      cart.items.pull(cartItemId);
    } else {
      cartItem.quantity = quantity;
    }
    item.stock -= quantityDifference;
    if (item.stock === 0) {
      item.isAvailable = false;
    } else if (item.stock > 0 && !item.isAvailable) {
      item.isAvailable = true;
    }
    await item.save();
    await cart.save();
    res.status(200).json({
      success: true,
      message: quantity === 0 ? 'Item removed from cart' : 'Cart item updated successfully',
      data: {
        cartItemId: cartItemId,
        quantity: quantity,
        remainingStock: item.stock,
        isAvailable: item.isAvailable
      }
    });
  } catch (error) {
    console.error("Update cart item error:", error);
    res.status(500).json({
      success: false,
      message: 'Error updating cart item',
      error: error.message
    });
  }
}

async function handleRemoveFromCart(req, res) {
  try {
    const cartItemId = req.params.cartItemId;
    const userId = req.user._id;

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }

    const cartItem = cart.items.id(cartItemId);
    if (!cartItem) {
      return res.status(404).json({
        success: false,
        message: 'Cart item not found'
      });
    }

    const item = await Item.findById(cartItem.itemId);
    if (item) {
      item.stock += cartItem.quantity;
      if (item.stock > 0 && !item.isAvailable) {
        item.isAvailable = true;
      }
      await item.save();
    }

    cart.items.pull(cartItemId);
    await cart.save();
    res.status(200).json({
      success: true,
      message: 'Item removed from cart successfully'
    });
  } catch (error) {
    console.error("Remove from cart error:", error);
    res.status(500).json({
      success: false,
      message: 'Error removing item from cart',
      error: error.message
    });
  }
}

async function handleConfirmOrder(req, res) {
  try {
    const userId = req.user._id;

    const cart = await Cart.findOne({ userId });
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Cart is empty'
      });
    }

    const orderItems = [];
    for (const cartItem of cart.items) {
      const item = await Item.findById(cartItem.itemId);
      if (item) {
        orderItems.push({
          itemId: cartItem.itemId,
          quantity: cartItem.quantity,
          selectedColor: cartItem.selectedColor,
          price: cartItem.price,
          itemName: item.name
        });
      }
    }
    
    const order = new Order({
      userId,
      items: orderItems,
      totalAmount: cart.totalAmount,
      status: 'pending'
    });
    await order.save();

    cart.items = [];
    await cart.save();

    res.status(200).json({
      success: true,
      message: 'Order confirmed successfully',
      data: {
        orderId: order._id,
        totalAmount: order.totalAmount,
        itemCount: order.items.length
      }
    });
  } catch (error) {
    console.error("Confirm order error:", error);
    res.status(500).json({
      success: false,
      message: 'Error confirming order',
      error: error.message
    });
  }
}

async function handleClearCart(req, res) {
  try {
    const userId = req.user._id;
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }

    for (const cartItem of cart.items) {
      const item = await Item.findById(cartItem.itemId);
      if (item) {
        item.stock += cartItem.quantity;
        if (item.stock > 0 && !item.isAvailable) {
          item.isAvailable = true;
        }
        await item.save();
      }
    }

    cart.items = [];
    await cart.save();

    res.status(200).json({
      success: true,
      message: 'Cart cleared successfully'
    });
  } catch (error) {
    console.error("Clear cart error:", error);
    res.status(500).json({
      success: false,
      message: 'Error clearing cart',
      error: error.message
    });
  }
}

module.exports = {
  handleAddToCart,
  handleGetCart,
  handleUpdateCartItem,
  handleRemoveFromCart,
  handleConfirmOrder,
  handleClearCart
}; 