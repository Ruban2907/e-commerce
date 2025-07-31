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
        if (req.file) {
            images.push({
                data: req.file.buffer,
                contentType: req.file.mimetype,
            });
        }

        const newItem = new Item({
            name,
            images,
            price,
            colors: Array.isArray(colors) ? colors : [colors],
            stock,
            description
        });

        const savedItem = await newItem.save();

        res.status(201).json({
            success: true,
            message: 'Item created successfully',
            data: savedItem
        });
    } catch (error) {
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
            if (price < 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Price cannot be negative'
                });
            }
            item.price = price;
        }
        if (colors !== undefined) {
            item.colors = Array.isArray(colors) ? colors : [colors];
        }
        if (stock !== undefined) {
            if (stock < 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Stock cannot be negative'
                });
            }
            item.stock = stock;
        }
        if (description !== undefined) item.description = description;
        if (isAvailable !== undefined) item.isAvailable = isAvailable;

        if (req.file) {
            item.images.push({
                data: req.file.buffer,
                contentType: req.file.mimetype,
            });
        }

        const updatedItem = await item.save();

        res.status(200).json({
            success: true,
            message: 'Item updated successfully',
            data: updatedItem
        });
    } catch (error) {
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
