const { CartItem } = require("../../models/ecommerce/CartItem");
const { Cart } = require("../../models/ecommerce/Cart");
const { Patient } = require("../../models/healthcare/Patient");


exports.addItems = async (req, res) => {
    try {
        const itemID = req.params.id;

        const cartRow = await Cart.findOne({ where: { cart_item_id: itemID , status: 'pending'} });
        if (cartRow) {
            return res.status(400).json({ message: 'Item is already added to the cart' });
        }

        const item = await CartItem.findOne({ where: { id: itemID } });
        if (!item) {
            return res.status(404).json({ message: 'Item not found' });
        }

        const cartSuccess = await Cart.create({
            patient_id: req.patientID,
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
         const userCartItems = await Cart.findAll({
            where: { patient_id: req.patientID , status: 'pending' },
            attributes: ['id', 'cart_item_id', 'unit_price', 'quantity', 'total_price', 'status', 'created_at']
        });

        const cartItemIds = userCartItems.map(item => item.cart_item_id);

        const cartItemsDetails = await CartItem.findAll({
            where: { id: cartItemIds },
            attributes: ['id', 'product_name']
        });

        const productNamesMap = cartItemsDetails.reduce((map, item) => {
            map[item.id] = item.product_name;
            return map;
        }, {});

        const cartDetails = userCartItems.map(userCartItem => ({
            id: userCartItem.id,
            productName: productNamesMap[userCartItem.cart_item_id] || 'Unknown',  
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
        console.log('hi')
        const { id } = req.params;

        const cartItem = await Cart.findOne({
            where: { id, patient_id: req.patientID , status: 'pending' }
        });

        if (!cartItem) {
            return res.status(404).json({ message: 'Item not found or already deleted' });
        }

        await cartItem.update({ status: 'deleted' });
        return res.status(200).json({ message: 'Item deleted successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'An error occurred', error: error.message });
    }
};