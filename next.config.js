/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
      RAZORPAY_KEY_ID: 'rzp_test_EnGfdFv0m1DG7S',
      RAZORPAY_KEY_SECRET: 'XSzEKG1qCUVMqyjafs8PlbJf',
      NEXT_PUBLIC_RAZORPAY_KEY_ID: 'rzp_test_EnGfdFv0m1DG7S'
    },
    reactStrictMode: true,
    images: {
        remotePatterns: [
          {
            protocol: 'http',
            hostname: 'localhost',
          },
        ],
      },
  };
  
module.exports = nextConfig
  