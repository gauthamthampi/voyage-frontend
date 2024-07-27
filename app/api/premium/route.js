// app/api/final/route.js

import { NextResponse } from 'next/server';
const Razorpay = require('razorpay');

export async function POST(req) {
  try {
    const { amount } = await req.json();

    console.log('Received amount:', amount); // Log received amount

    const instance = new Razorpay({
      key_id: 'rzp_test_EnGfdFv0m1DG7S',
      key_secret: 'XSzEKG1qCUVMqyjafs8PlbJf',
    });

    const order = await instance.orders.create({
      amount: amount * 100, // amount in the smallest currency unit
      currency: 'INR',
      receipt: 'receipt#1',
    });

    console.log('Order created:', order); // Log order details

    return NextResponse.json(order);
  } catch (error) {
    console.error('Razorpay order creation error:', error); // Log the error
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export function GET() {
  return NextResponse.json({ message: 'Method Not Allowed' }, { status: 405 });
}
