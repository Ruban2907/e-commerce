const Item = require('../model/items');

async function handleGetAllItems(req, res) {
	try {
		const page = parseInt(req.query.page) || 1;
		const limit = parseInt(req.query.limit) || 12; 
		const skip = (page - 1) * limit;

		const items = await Item.find({ isAvailable: true })
			.select('name price stock description images colors')
			.limit(limit)
			.skip(skip);

		const serializedItems = items.map(item => {
			const itemObj = item.toObject();
			if (itemObj.images && itemObj.images.length > 0) {
				itemObj.images = itemObj.images.map(image => ({
					data: image.data.toString('base64'),
					contentType: image.contentType
				}));
			}
			return itemObj;
		});

		// Debug: Check what we're sending
		// console.log('Backend: Found items:', items.length);
		// if (items.length > 0) {
		// 	console.log('Backend: First item:', {
		// 		_id: items[0]._id,
		// 		name: items[0].name,
		// 		imagesCount: items[0].images?.length || 0,
		// 		hasImages: !!items[0].images,
		// 		firstImage: items[0].images?.[0] ? {
		// 			hasData: !!items[0].images[0].data,
		// 			dataLength: items[0].images[0].data?.length,
		// 			contentType: items[0].images[0].contentType
		// 		} : null
		// 	});
		// } else {
		// 	console.log('Backend: No items found in database');
		// }

		const totalItems = await Item.countDocuments({ isAvailable: true });
		const totalPages = Math.ceil(totalItems / limit);

		res.status(200).json({
			success: true,
			count: serializedItems.length,
			totalItems,
			totalPages,
			currentPage: page,
			data: serializedItems
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

		if (!item || !item.isAvailable) {
			return res.status(404).json({
				success: false,
				message: 'Item not available'
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

		if (price < 0 || stock < 0) {
			return res.status(400).json({
				success: false,
				message: 'Price & Stock cannot be negative'
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
		
		let parsedColors = colors;
		if (typeof colors === 'string') {
			try {
				parsedColors = JSON.parse(colors);
			} catch (error) {
				console.error('Error parsing colors JSON:', error);
				parsedColors = [colors]; 
			}
		}

		const colorsArray = Array.isArray(parsedColors) ? parsedColors : [parsedColors];
		const newItem = new Item({
			name,
			images,
			price: Number(price),
			colors: colorsArray,
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
		const { name, price, colors, stock, description, isAvailable, imageToRemove } = req.body;
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
			let parsedColors = colors;
			if (typeof colors === 'string') {
				try {
					parsedColors = JSON.parse(colors);
				} catch (error) {
					console.error('Error parsing colors JSON:', error);
					parsedColors = [colors];
				}
			}

			item.colors = Array.isArray(parsedColors) ? parsedColors : [parsedColors];
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

		if (imageToRemove !== undefined) {
			try {
				const removeIndex = JSON.parse(imageToRemove);
				if (removeIndex !== null && removeIndex >= 0 && removeIndex < item.images.length) {
					item.images.splice(removeIndex, 1);
				}
			} catch (parseError) {
				console.error("Error parsing imageToRemove:", parseError);
			}
		}

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
