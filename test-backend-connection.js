/**
 * Test script to check backend connectivity and CORS
 */

const axios = require('axios');

const BACKEND_URL = 'https://veilos-backend.onrender.com';
const FRONTEND_ORIGIN = 'https://veilos-frontend.vercel.app';

async function testBackendConnection() {
  console.log('🔍 Testing Backend Connection...');
  console.log('Backend URL:', BACKEND_URL);
  console.log('Frontend Origin:', FRONTEND_ORIGIN);
  console.log('');

  try {
    // Test 1: Health check
    console.log('1️⃣ Testing health endpoint...');
    const healthResponse = await axios.get(`${BACKEND_URL}/health`);
    console.log('✅ Health check passed:', healthResponse.data);
    console.log('');

    // Test 2: API health check
    console.log('2️⃣ Testing API health endpoint...');
    const apiHealthResponse = await axios.get(`${BACKEND_URL}/api/health`);
    console.log('✅ API health check passed:', apiHealthResponse.data);
    console.log('');

    // Test 3: CORS preflight simulation
    console.log('3️⃣ Testing CORS preflight...');
    const corsResponse = await axios.options(`${BACKEND_URL}/api/auth/login`, {
      headers: {
        'Origin': FRONTEND_ORIGIN,
        'Access-Control-Request-Method': 'POST',
        'Access-Control-Request-Headers': 'Content-Type, Authorization'
      }
    });
    console.log('✅ CORS preflight passed:', corsResponse.headers);
    console.log('');

    // Test 4: Actual login endpoint
    console.log('4️⃣ Testing login endpoint...');
    try {
      const loginResponse = await axios.post(`${BACKEND_URL}/api/auth/login`, {
        email: 'test@example.com',
        password: 'testpassword'
      }, {
        headers: {
          'Origin': FRONTEND_ORIGIN,
          'Content-Type': 'application/json'
        }
      });
      console.log('✅ Login endpoint accessible (expected to fail with invalid credentials)');
    } catch (loginError) {
      if (loginError.response && loginError.response.status === 400) {
        console.log('✅ Login endpoint accessible (failed with invalid credentials as expected)');
      } else {
        console.log('❌ Login endpoint error:', loginError.message);
      }
    }

  } catch (error) {
    console.error('❌ Backend connection test failed:');
    console.error('Error:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Headers:', error.response.headers);
    }
  }
}

// Run the test
testBackendConnection();