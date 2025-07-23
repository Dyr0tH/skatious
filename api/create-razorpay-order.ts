import Razorpay from 'razorpay';

export default async function handler(req: any, res: any) {
  console.log('--- Incoming request to create-razorpay-order ---');
  console.log('Request method:', req.method);
  console.log('Request body (raw):', req.body);

  if (req.method !== 'POST') {
    console.log('Method not allowed');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Parse JSON body if needed
  if (typeof req.body === 'string') {
    try {
      req.body = JSON.parse(req.body);
      console.log('Parsed request body:', req.body);
    } catch (err) {
      console.error('Error parsing JSON body:', err);
      return res.status(400).json({ error: 'Invalid JSON body' });
    }
  }

  const { amount, currency, receipt } = req.body;
  console.log('amount:', amount, 'currency:', currency, 'receipt:', receipt);

  if (!amount || !currency || !receipt) {
    console.error('Missing required fields:', { amount, currency, receipt });
    return res.status(400).json({ error: 'Missing required fields' });
  }

  console.log('Razorpay Key ID:', process.env.RAZORPAY_KEY_ID);
  console.log('Razorpay Key Secret:', process.env.RAZORPAY_KEY_SECRET ? '***' : 'NOT SET');

  const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || "rzp_live_ntMssPF5wTWOLf",
    key_secret: process.env.RAZORPAY_KEY_SECRET || "UtwizdujRAJYcOnFgBKMM",
  });

  try {
    const order = await razorpay.orders.create({
      amount,
      currency,
      receipt,
      payment_capture: true,
    });
    console.log('Razorpay order created:', order);
    res.status(200).json(order);
  } catch (err: any) {
    console.error('Razorpay order error:', err);
    res.status(500).json({ error: err.message, details: err });
  }
} 