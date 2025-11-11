#!/bin/bash

# workforceX402 - API Test Script
# Comprehensive testing of all API endpoints

echo "🧪 workforceX402 API Testing Suite"
echo "=================================="

BASE_URL="http://localhost:3003"
FAILED_TESTS=0
TOTAL_TESTS=0

# Function to test API endpoint
test_endpoint() {
    local method=$1
    local endpoint=$2
    local description=$3
    local expected_status=${4:-200}
    
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    
    echo ""
    echo "🔍 Testing: $description"
    echo "   Endpoint: $method $endpoint"
    
    # Make request and capture response
    if [ "$method" = "GET" ]; then
        response=$(curl -s -w "\n%{http_code}" "$BASE_URL$endpoint" 2>/dev/null)
    else
        echo "❌ Only GET requests are supported in this test"
        return 1
    fi
    
    if [ $? -ne 0 ]; then
        echo "❌ FAILED: Request failed"
        FAILED_TESTS=$((FAILED_TESTS + 1))
        return 1
    fi
    
    # Extract status code
    status_code=$(echo "$response" | tail -n1)
    response_body=$(echo "$response" | head -n -1)
    
    # Check status code
    if [ "$status_code" = "$expected_status" ]; then
        echo "✅ PASSED: Status $status_code"
        
        # Check if response contains expected fields
        case "$endpoint" in
            "/api/health")
                if echo "$response_body" | grep -q '"status"' && echo "$response_body" | grep -q '"SUCCESS"'; then
                    echo "   ✓ Response contains expected fields"
                else
                    echo "   ⚠️  Response missing expected fields"
                fi
                ;;
            "/api/tasks")
                if echo "$response_body" | grep -q '"success"' && echo "$response_body" | grep -q '"data"'; then
                    echo "   ✓ Tasks data received"
                    task_count=$(echo "$response_body" | grep -o '"count":[0-9]*' | cut -d':' -f2)
                    echo "   📋 Found $task_count tasks"
                else
                    echo "   ⚠️  Invalid tasks response"
                fi
                ;;
            "/api/agents")
                if echo "$response_body" | grep -q '"success"' && echo "$response_body" | grep -q '"data"'; then
                    echo "   ✓ Agents data received"
                    agent_count=$(echo "$response_body" | grep -o '"count":[0-9]*' | cut -d':' -f2)
                    echo "   🤖 Found $agent_count agents"
                else
                    echo "   ⚠️  Invalid agents response"
                fi
                ;;
            "/api/wallet")
                if echo "$response_body" | grep -q '"success"' && echo "$response_body" | grep -q '"data"'; then
                    echo "   ✓ Wallet data received"
                else
                    echo "   ⚠️  Invalid wallet response"
                fi
                ;;
            "/api/metrics")
                if echo "$response_body" | grep -q '"success"' && echo "$response_body" | grep -q '"data"'; then
                    echo "   ✓ Metrics data received"
                else
                    echo "   ⚠️  Invalid metrics response"
                fi
                ;;
        esac
    else
        echo "❌ FAILED: Expected status $expected_status, got $status_code"
        FAILED_TESTS=$((FAILED_TESTS + 1))
        echo "   Response: $response_body"
    fi
}

# Function to check server availability
check_server() {
    echo ""
    echo "🔍 Checking server availability..."
    
    if curl -s "$BASE_URL/api/health" >/dev/null 2>&1; then
        echo "✅ Server is running at $BASE_URL"
        return 0
    else
        echo "❌ Server is not responding at $BASE_URL"
        echo "   Please start the server first: node workforce-server.js"
        return 1
    fi
}

# Main testing flow
main() {
    echo "Starting tests at $(date)"
    
    # Check if server is available
    if ! check_server; then
        echo ""
        echo "❌ Cannot proceed with testing. Please start the server first."
        exit 1
    fi
    
    # Test all endpoints
    test_endpoint "GET" "/api/health" "Health Check" 200
    test_endpoint "GET" "/api/tasks" "Get All Tasks" 200
    test_endpoint "GET" "/api/agents" "Get All Agents" 200
    test_endpoint "GET" "/api/wallet" "Get Wallet Data" 200
    test_endpoint "GET" "/api/metrics" "Get Platform Metrics" 200
    test_endpoint "GET" "/api/tasks/enhanced" "Get Enhanced Tasks" 200
    test_endpoint "GET" "/api/agents/available" "Get Available Agents" 200
    
    # Test individual task and agent
    test_endpoint "GET" "/api/task/1" "Get Specific Task (ID: 1)" 200
    test_endpoint "GET" "/api/agent/1" "Get Specific Agent (ID: 1)" 200
    
    # Test 404 for non-existent resources
    test_endpoint "GET" "/api/task/999" "Get Non-existent Task (should return 404)" 404
    test_endpoint "GET" "/api/agent/999" "Get Non-existent Agent (should return 404)" 404
    test_endpoint "GET" "/api/nonexistent" "Test 404 Endpoint" 404
    
    # Test CORS preflight
    echo ""
    echo "🔍 Testing CORS Support"
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    cors_response=$(curl -s -I -X OPTIONS "$BASE_URL/api/health" 2>/dev/null)
    if echo "$cors_response" | grep -q "Access-Control-Allow-Origin"; then
        echo "✅ PASSED: CORS headers present"
    else
        echo "❌ FAILED: CORS headers missing"
        FAILED_TESTS=$((FAILED_TESTS + 1))
    fi
    
    # Test response times
    echo ""
    echo "⏱️  Testing Response Times"
    for endpoint in "/api/health" "/api/tasks" "/api/agents" "/api/wallet" "/api/metrics"; do
        TOTAL_TESTS=$((TOTAL_TESTS + 1))
        response_time=$(curl -s -o /dev/null -w "%{time_total}" "$BASE_URL$endpoint" 2>/dev/null)
        if [ $? -eq 0 ]; then
            time_ms=$(echo "$response_time * 1000" | bc 2>/dev/null || echo "N/A")
            if [ "$time_ms" != "N/A" ]; then
                time_int=$(printf "%.0f" $time_ms)
                echo "   $endpoint: ${time_int}ms"
                if [ $time_int -lt 500 ]; then
                    echo "   ✅ PASSED: Response time acceptable"
                else
                    echo "   ⚠️  SLOW: Response time > 500ms"
                fi
            fi
        else
            echo "   ❌ FAILED: Could not measure response time"
            FAILED_TESTS=$((FAILED_TESTS + 1))
        fi
    done
    
    # Final results
    echo ""
    echo "=================================="
    echo "📊 Test Results Summary"
    echo "=================================="
    echo "Total Tests: $TOTAL_TESTS"
    echo "Failed Tests: $FAILED_TESTS"
    echo "Passed Tests: $((TOTAL_TESTS - FAILED_TESTS))"
    
    if [ $FAILED_TESTS -eq 0 ]; then
        echo ""
        echo "🎉 ALL TESTS PASSED!"
        echo "✅ workforceX402 platform is fully functional"
    else
        echo ""
        echo "⚠️  Some tests failed. Please check the output above."
    fi
    
    echo ""
    echo "🧪 Testing completed at $(date)"
    
    # Exit with appropriate code
    if [ $FAILED_TESTS -eq 0 ]; then
        exit 0
    else
        exit 1
    fi
}

# Run main function
main "$@"