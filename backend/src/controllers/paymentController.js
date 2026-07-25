const stripe = require('../config/stripe');
const SaleModel = require('../models/saleModel');

const paymentController = {
    createCheckoutSession: async (req, res) => {
        try {
        const { items } = req.body; // [{ id, name, price, qty }]

        if (!items || items.length === 0) {
            return res.status(400).json({ success: false, message: 'El carrito está vacío.' });
        }

        const line_items = items.map((item) => ({
            price_data: {
            currency: 'cop',
            product_data: { name: item.name },
            unit_amount: Math.round(item.price * 100),
            },
            quantity: item.qty,
        }));
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items,
            mode: 'payment',
            success_url: `${process.env.FRONTEND_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.FRONTEND_URL}/checkout/cancel`,
            metadata: {
            user_id: req.user.id,
            items: JSON.stringify(items.map(i => ({ product_id: i.id, quantity: i.qty, unit_price: i.price }))),
            },
        });

        res.status(200).json({ success: true, url: session.url });
        } catch (error) {
        console.error('Error al crear sesión de pago:', error);
        res.status(500).json({ success: false, message: 'Error al iniciar el pago.' });
        }
    },
        handleWebhook: async (req, res) => {
        const sig = req.headers['stripe-signature'];
        let event;

        try {
            event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
        } catch (err) {
            console.error('Error al verificar webhook:', err.message);
            return res.status(400).send(`Webhook Error: ${err.message}`);
        }

        if (event.type === 'checkout.session.completed') {
            const session = event.data.object;

            try {
                const userId = session.metadata.user_id;
                const items = JSON.parse(session.metadata.items);

                const saleId = await SaleModel.create(userId, items);
                console.log(`✅ Venta creada desde Stripe: saleId=${saleId}`);
            } catch (error) {
                console.error('Error al crear venta desde webhook:', error);
                return res.status(500).json({ received: true, error: 'Error al procesar la venta' });
            }
        }

        res.status(200).json({ received: true });
    },
};

module.exports = paymentController;