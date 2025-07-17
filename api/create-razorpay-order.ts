import Razorpay from 'razorpay';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { amount, currency, receipt } = req.body;

  if (!amount || !currency || !receipt) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });

  try {
    const order = await razorpay.orders.create({
      amount,
      currency,
      receipt,
      payment_capture: true,
    });
    res.status(200).json(order);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
} 