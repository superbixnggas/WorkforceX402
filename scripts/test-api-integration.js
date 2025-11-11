#!/usr/bin/env node

// Comprehensive API Integration Test
const http = require('http');

const API_BASE = 'http://localhost:3004/api/v1';

function makeRequest(path, method = 'GET', body = null, headers = {}) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: '127.0.0.1',  // Force IPv4 to avoid localhost resolution issues
            port: 3004,
            path: path,
            method: method,
            headers: {
                'Content-Type': 'application/json',
                ...headers
            }
        };

        const req = http.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                try {
                    const parsed = JSON.parse(data);
                    resolve({ status: res.statusCode, data: parsed, headers: res.headers });
                } catch (e) {
                    resolve({ status: res.statusCode, data: data, headers: res.headers });
                }
            });
        });

        req.on('error', reject);
        if (body) req.write(JSON.stringify(body));
        req.end();
    });
}

async function runTests() {
    console.log('🔍 WORKFORCEX402 API INTEGRATION TEST');
    console.log('=====================================\n');

    let authToken = null;
    const results = [];

    // Test 1: Health Check
    try {
        const health = await makeRequest('/api/v1/health');
        results.push({ name: 'Health Check', status: health.status, success: health.data.success });
        console.log(`✅ Health Check: ${health.status} - ${health.data.data.status}`);
    } catch (e) {
        results.push({ name: 'Health Check', status: 500, success: false, error: e.message });
        console.log(`❌ Health Check: FAILED - ${e.message}`);
    }

    // Test 2: Authentication
    try {
        const login = await makeRequest('/api/v1/auth/login', 'POST', {
            username: 'admin',
            password: 'admin123'
        });
        
        if (login.status === 200 && login.data.success) {
            authToken = login.data.data.token;
            results.push({ name: 'Authentication', status: 200, success: true });
            console.log(`✅ Authentication: SUCCESS - Token obtained`);
        } else {
            results.push({ name: 'Authentication', status: login.status, success: false });
            console.log(`❌ Authentication: FAILED - ${login.data.error || 'Unknown error'}`);
        }
    } catch (e) {
        results.push({ name: 'Authentication', status: 500, success: false, error: e.message });
        console.log(`❌ Authentication: FAILED - ${e.message}`);
    }

    // Test 3: Tasks (Public)
    try {
        const tasks = await makeRequest('/api/v1/tasks');
        if (tasks.status === 200 && tasks.data.success) {
            results.push({ name: 'Tasks (Public)', status: 200, success: true, count: tasks.data.data.length });
            console.log(`✅ Tasks (Public): SUCCESS - ${tasks.data.data.length} tasks`);
        } else {
            results.push({ name: 'Tasks (Public)', status: tasks.status, success: false });
            console.log(`❌ Tasks (Public): FAILED - ${tasks.data.error || 'Unknown error'}`);
        }
    } catch (e) {
        results.push({ name: 'Tasks (Public)', status: 500, success: false, error: e.message });
        console.log(`❌ Tasks (Public): FAILED - ${e.message}`);
    }

    // Test 4: Protected Endpoints with Auth
    if (authToken) {
        const protectedEndpoints = [
            { path: '/api/v1/tasks', name: 'Tasks (Auth)' },
            { path: '/api/v1/agents', name: 'Agents' },
            { path: '/api/v1/wallet/balance', name: 'Wallet Balance' },
            { path: '/api/v1/analytics/metrics', name: 'Analytics' }
        ];

        for (const endpoint of protectedEndpoints) {
            try {
                const response = await makeRequest(endpoint.path, 'GET', null, {
                    'Authorization': `Bearer ${authToken}`
                });
                
                if (response.status === 200 && response.data.success) {
                    results.push({ name: endpoint.name, status: 200, success: true });
                    console.log(`✅ ${endpoint.name}: SUCCESS`);
                } else {
                    results.push({ name: endpoint.name, status: response.status, success: false, error: response.data.error });
                    console.log(`❌ ${endpoint.name}: FAILED - ${response.data.error || 'Unknown error'}`);
                }
            } catch (e) {
                results.push({ name: endpoint.name, status: 500, success: false, error: e.message });
                console.log(`❌ ${endpoint.name}: FAILED - ${e.message}`);
            }
        }
    }

    // Test 5: CORS Preflight
    try {
        const cors = await makeRequest('/api/v1/tasks', 'OPTIONS', null, {
            'Origin': 'http://localhost:9000',
            'Access-Control-Request-Method': 'GET',
            'Access-Control-Request-Headers': 'Content-Type,Authorization'
        });
        
        if (cors.status === 200) {
            results.push({ name: 'CORS Preflight', status: 200, success: true });
            console.log(`✅ CORS Preflight: SUCCESS`);
        } else {
            results.push({ name: 'CORS Preflight', status: cors.status, success: false });
            console.log(`❌ CORS Preflight: FAILED - ${cors.status}`);
        }
    } catch (e) {
        results.push({ name: 'CORS Preflight', status: 500, success: false, error: e.message });
        console.log(`❌ CORS Preflight: FAILED - ${e.message}`);
    }

    // Summary
    console.log('\n📊 TEST SUMMARY:');
    console.log('================');
    
    const total = results.length;
    const passed = results.filter(r => r.success).length;
    const failed = results.filter(r => !r.success).length;
    
    console.log(`Total Tests: ${total}`);
    console.log(`Passed: ${passed} ✅`);
    console.log(`Failed: ${failed} ❌`);
    console.log(`Success Rate: ${Math.round((passed/total) * 100)}%`);

    if (failed > 0) {
        console.log('\n🔍 FAILED TESTS:');
        results.filter(r => !r.success).forEach(result => {
            console.log(`- ${result.name}: ${result.status} - ${result.error || 'Unknown error'}`);
        });
    }

    console.log('\n🎯 INTEGRATION TEST COMPLETE');
}

runTests().catch(console.error);