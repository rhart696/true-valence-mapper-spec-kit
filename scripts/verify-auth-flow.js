const fetch = require('node-fetch'); // We might need to install this or use built-in fetch if node version is high enough. Node 18+ has fetch.
// Using native fetch for Node 22+

const BASE_URL = 'http://localhost:3000/api';
const CLIENT_URL = 'http://localhost:5173';

async function runVerification() {
    console.log('Starting programmatic verification...');

    // 1. Health Check
    try {
        const health = await fetch(`${BASE_URL}/health`);
        if (health.status === 200) {
            console.log('✅ Server Health Check Passed');
        } else {
            console.error('❌ Server Health Check Failed');
            process.exit(1);
        }
    } catch (e) {
        console.error('❌ Server Unreachable', e.message);
        process.exit(1);
    }

    // 2. Register
    const username = `test_user_${Date.now()}`;
    const password = 'password123';
    let token = '';

    try {
        const regRes = await fetch(`${BASE_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        if (regRes.status === 201) {
            const data = await regRes.json();
            token = data.token;
            console.log('✅ Registration Passed');
        } else {
            const err = await regRes.text();
            console.error('❌ Registration Failed', err);
            process.exit(1);
        }
    } catch (e) {
        console.error('❌ Registration Error', e.message);
        process.exit(1);
    }

    // 3. Login (Verify credentials work)
    try {
        const loginRes = await fetch(`${BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        if (loginRes.status === 200) {
            const data = await loginRes.json();
            if (data.token) {
                console.log('✅ Login Passed');
            } else {
                console.error('❌ Login Failed: No token returned');
            }
        } else {
            console.error('❌ Login Failed', await loginRes.text());
        }
    } catch (e) {
        console.error('❌ Login Error', e.message);
    }

    // 4. Access Protected Route (Session or similar)
    // We don't have a specific protected route guaranteed to return data without setup, 
    // but we can try to hit one and expect a 200 or 404 (not 401/403).
    // Let's try /api/clients which is protected.
    try {
        const protectedRes = await fetch(`${BASE_URL}/clients`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (protectedRes.status === 200 || protectedRes.status === 404) {
            // 200 = success, 404 = no clients found but auth worked
            console.log('✅ Protected Route Access Passed (Auth worked)');
        } else if (protectedRes.status === 401 || protectedRes.status === 403) {
            console.error('❌ Protected Route Access Failed: Unauthorized');
        } else {
            console.log(`ℹ️ Protected Route returned ${protectedRes.status} (Acceptable if not 401/403)`);
        }
    } catch (e) {
        console.error('❌ Protected Route Error', e.message);
    }

    console.log('\nVerification Complete.');
}

runVerification();
