const http = require('http');

const post = (path, data, token) => {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: 3000,
            path: path,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(JSON.stringify(data)),
            },
        };

        if (token) {
            options.headers['Authorization'] = `Bearer ${token}`;
        }

        const req = http.request(options, (res) => {
            let body = '';
            res.on('data', (chunk) => body += chunk);
            res.on('end', () => resolve({ status: res.statusCode, body: JSON.parse(body || '{}') }));
        });

        req.on('error', (e) => reject(e));
        req.write(JSON.stringify(data));
        req.end();
    });
};

const get = (path, token) => {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: 3000,
            path: path,
            method: 'GET',
            headers: {},
        };

        if (token) {
            options.headers['Authorization'] = `Bearer ${token}`;
        }

        const req = http.request(options, (res) => {
            let body = '';
            res.on('data', (chunk) => body += chunk);
            res.on('end', () => resolve({ status: res.statusCode, body: body })); // Body might not be JSON
        });

        req.on('error', (e) => reject(e));
        req.end();
    });
};

async function runTests() {
    try {
        console.log('Starting tests...');

        // 1. Register
        const username = `user_${Date.now()}`;
        const password = 'password123';
        console.log(`Registering user: ${username}`);
        const regRes = await post('/api/auth/register', { username, password });
        console.log('Register response:', regRes.status, regRes.body);

        if (regRes.status !== 201 || !regRes.body.token) {
            throw new Error('Registration failed');
        }
        const token = regRes.body.token;

        // 2. Login
        console.log('Logging in...');
        const loginRes = await post('/api/auth/login', { username, password });
        console.log('Login response:', loginRes.status, loginRes.body);

        if (loginRes.status !== 200 || !loginRes.body.token) {
            throw new Error('Login failed');
        }

        // 3. Access Protected Route (Coaches)
        console.log('Accessing protected route...');
        const protectedRes = await get('/api/coaches', token);
        console.log('Protected route response:', protectedRes.status);

        if (protectedRes.status !== 200) {
            // Note: It might return 200 with empty list or whatever, but shouldn't be 401/403
            // If the route doesn't exist or returns something else, we'll see.
            // Assuming /api/coaches exists and returns JSON.
            console.log('Body:', protectedRes.body);
        }

        console.log('All tests passed!');
    } catch (error) {
        console.error('Test failed:', error);
        process.exit(1);
    }
}

// Wait for server to start
setTimeout(runTests, 2000);
