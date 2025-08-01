const Item = require('../model/items');

async function handleGetAllItems(req, res) {
    try {
        const items = await Item.find({ isAvailable: true });
        res.status(200).json({
            success: true,
            count: items.length,
            data: items
        });
    } catch (error) {
        console.error("Get all items error:", error);
        res.status(500).json({
            success: false,
            message: 'Error fetching items',
            error: error.message
        });
    }
}

async function handleGetItemById(req, res) {
    try {
        const item = await Item.findById(req.params.id);
        
        if (!item) {
            return res.status(404).json({
                success: false,
                message: 'Item not found'
            });
        }

        if (!item.isAvailable) {
            return res.status(404).json({
                success: false,
                message: 'Item is not available'
            });
        }

        res.status(200).json({
            success: true,
            data: item
        });
    } catch (error) {
        console.error("Get item by ID error:", error);
        res.status(500).json({
            success: false,
            message: 'Error fetching item',
            error: error.message
        });
    }
}

async function handleCreateItem(req, res) {
    try {
        const { name, price, colors, stock, description } = req.body;

        if (!name || !price || !colors || stock === undefined) {
            return res.status(400).json({
                success: false,
                message: 'Name, price, colors, and stock are required'
            });
        }

        if (price < 0) {
            return res.status(400).json({
                success: false,
                message: 'Price cannot be negative'
            });
        }

        if (stock < 0) {
            return res.status(400).json({
                success: false,
                message: 'Stock cannot be negative'
            });
        }

        let images = [];
        
        if (req.files && req.files.length > 0) {
            req.files.forEach(file => {
                images.push({
                    data: file.buffer,
                    contentType: file.mimetype,
                });
            });
        }

        const newItem = new Item({
            name,
            images,
            price: Number(price),
            colors: Array.isArray(colors) ? colors : [colors],
            stock: Number(stock),
            description: description || ""
        });

        const savedItem = await newItem.save();

        res.status(201).json({
            success: true,
            message: 'Item created successfully',
            data: savedItem
        });
    } catch (error) {
        console.error("Create item error:", error);
        res.status(500).json({
            success: false,
            message: 'Error creating item',
            error: error.message
        });
    }
}

async function handleUpdateItem(req, res) {
    try {
        const { name, price, colors, stock, description, isAvailable } = req.body;
        
        const item = await Item.findById(req.params.id);
        
        if (!item) {
            return res.status(404).json({
                success: false,
                message: 'Item not found'
            });
        }

        if (name !== undefined) item.name = name;
        if (price !== undefined) {
            const numPrice = Number(price);
            if (isNaN(numPrice) || numPrice < 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Price must be a valid positive number'
                });
            }
            item.price = numPrice;
        }
        if (colors !== undefined) {
            item.colors = Array.isArray(colors) ? colors : [colors];
        }
        if (stock !== undefined) {
            const numStock = Number(stock);
            if (isNaN(numStock) || numStock < 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Stock must be a valid positive number'
                });
            }
            item.stock = numStock;
        }
        if (description !== undefined) item.description = description;
        if (isAvailable !== undefined) item.isAvailable = Boolean(isAvailable);

        // Handle multiple images for update
        if (req.files && req.files.length > 0) {
            req.files.forEach(file => {
                item.images.push({
                    data: file.buffer,
                    contentType: file.mimetype,
                });
            });
        }

        const updatedItem = await item.save();

        res.status(200).json({
            success: true,
            message: 'Item updated successfully',
            data: updatedItem
        });
    } catch (error) {
        console.error("Update item error:", error);
        res.status(500).json({
            success: false,
            message: 'Error updating item',
            error: error.message
        });
    }
}

async function handleDeleteItem(req, res) {
    try {
        const item = await Item.findById(req.params.id);
        
        if (!item) {
            return res.status(404).json({
                success: false,
                message: 'Item not found'
            });
        }

        await Item.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            message: 'Item deleted successfully'
        });
    } catch (error) {
        console.error("Delete item error:", error);
        res.status(500).json({
            success: false,
            message: 'Error deleting item',
            error: error.message
        });
    }
}

module.exports = {
    handleGetAllItems,
    handleGetItemById,
    handleCreateItem,
    handleUpdateItem,
    handleDeleteItem
};
