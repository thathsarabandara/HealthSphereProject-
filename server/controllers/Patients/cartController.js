const { findUserID, Token } = require("../../models/auth/Token");
const { findUserById } = require("../../models/auth/User");
const { CartItem } = require("../../models/ecommerce/CartItem");
const { Cart } = require("../../models/ecommerce/Cart");

exports.findUserByToken = async (token) => {
    try {
        if (!token) {
            throw { status: 401, message: 'User token not found' };
        }

        const isValidToken = await findUserID(token);

        if (!isValidToken) {
            throw { status: 401, message: 'Token expired or not a valid token' };
        }

        const user = await findUserById(isValidToken.user_id);

        if (!user) {
            throw { status: 401, message: 'User not found' };
        }

        if (!user.isVerified) {
            throw { status: 401, message: 'User is not verified!' };
        }

        // Return user information if authentication and verification are successful
        return user;

    } catch (error) {
        // Pass error to the calling function
        throw error.status ? error : { status: 500, message: 'An internal error occurred' };
    }
};
exports.addItems = async (req, res) => {
    try {
        const token = req.cookies['token'];

        if (!token) {
            return res.status(401).json({ message: 'Unauthorized: Token not found in cookies' });
        }

        const itemID = req.params.id;

        // Check if the item is already in the cart
        const cartRow = await Cart.findOne({ where: { cart_item_id: itemID , status: 'pending'} });
        if (cartRow) {
            return res.status(400).json({ message: 'Item is already added to the cart' });
        }

        // Find the user associated with the token
        const user = await Token.findOne({ where: { token: token } });
        if (!user) {
            return res.status(401).json({ message: 'Unauthorized: Invalid token' });
        }

        // Find the item details from CartItem
        const item = await CartItem.findOne({ where: { id: itemID } });
        if (!item) {
            return res.status(404).json({ message: 'Item not found' });
        }

        // Create a new cart entry
        const cartSuccess = await Cart.create({
            user_id: user.user_id,
            cart_item_id: itemID,
            unit_price: item.price,
            quantity: 1,
            total_price: item.price * 1,
            status: 'Pending',
        });

        return res.status(201).json({ message: 'Item added to the cart', cart: cartSuccess });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'An error occurred', error: error.message });
    }
};

exports.loadCart = async (req, res) => {
    try {
        const token = req.cookies['token'];

        // Validate token and retrieve user
        const userToken = await Token.findOne({ where: { token: token } });
        if (!userToken) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        // Fetch all cart items for the user
        const userCartItems = await Cart.findAll({
            where: { user_id: userToken.user_id, status: 'pending' },
            attributes: ['id', 'cart_item_id', 'unit_price', 'quantity', 'total_price', 'status', 'created_at']
        });

        // Extract the cart_item_ids from the user's cart items
        const cartItemIds = userCartItems.map(item => item.cart_item_id);

        // Fetch product names from CartItem using the cart_item_ids
        const cartItemsDetails = await CartItem.findAll({
            where: { id: cartItemIds },
            attributes: ['id', 'product_name']
        });

        // Create a mapping of cart_item_id to product_name for easy lookup
        const productNamesMap = cartItemsDetails.reduce((map, item) => {
            map[item.id] = item.product_name;
            return map;
        }, {});

        // Format the response with associated product data
        const cartDetails = userCartItems.map(userCartItem => ({
            id: userCartItem.id,
            productName: productNamesMap[userCartItem.cart_item_id] || 'Unknown',  // Get product_name from map
            unitPrice: userCartItem.unit_price,
            quantity: userCartItem.quantity,
            totalPrice: userCartItem.total_price,
            status: userCartItem.status,
            createdAt: userCartItem.created_at,
        }));

        return res.status(200).json({ cart: cartDetails });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'An error occurred', error: error.message });
    }
};

exports.deleteCartItem = async (req, res) => {
    try {
        const { id } = req.params;
        console.error(id);
        const token = req.cookies['token'];

        // Validate token and retrieve user
        const userToken = await Token.findOne({ where: { token } });
        if (!userToken) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        // Find the cart item belonging to the user and update the status
        const cartItem = await Cart.findOne({
            where: { id, user_id: userToken.user_id, status: 'pending' }
        });

        if (!cartItem) {
            return res.status(404).json({ message: 'Item not found or already deleted' });
        }

        // Update status to 'deleted'
        await cartItem.update({ status: 'deleted' });
        return res.status(200).json({ message: 'Item deleted successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'An error occurred', error: error.message });
    }
};