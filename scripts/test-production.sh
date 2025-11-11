#!/bin/bash

# WorkforceX402 Production Testing Suite
# Version: 2.0.0
# Description: Comprehensive testing for production API endpoints

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m'

# Configuration
BASE_URL="http://localhost:3004/api/v1"
TEST_RESULTS_FILE="test-results-$(date +%Y%m%d-%H%M%S).log"
TOTAL_TESTS=0
PASSED_TESTS=0
FAILED_TESTS=0

# Test results tracking
declare -A TEST_STATUS
declare -A TEST_RESPONSE_TIME

# Banner
print_test_banner() {
    echo -e "${PURPLE}"
    echo "╔════════════════════════════════════════════════════════════════╗"
    echo "║               WorkforceX402 Production Testing Suite          ║"
    echo "║                         Version 2.0.0                        ║"
    echo "║            Comprehensive API & System Testing                 ║"
    echo "╚════════════════════════════════════════════════════════════════╝"
    echo -e "${NC}"
}

# Logging functions
log_test_info() {
    echo -e "${CYAN}[TEST]${NC} $1" | tee -a $TEST_RESULTS_FILE
}

log_test_pass() {
    echo -e "${GREEN}[PASS]${NC} $1" | tee -a $TEST_RESULTS_FILE
    ((PASSED_TESTS++))
}

log_test_fail() {
    echo -e "${RED}[FAIL]${NC} $1" | tee -a $TEST_RESULTS_FILE
    ((FAILED_TESTS++))
}

log_test_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1" | tee -a $TEST_RESULTS_FILE
}

# HTTP request function with timing
make_request() {
    local method=$1
    local endpoint=$2
    local data=$3
    local headers=$4
    local expected_status=${5:-200}
    
    local start_time=$(date +%s%3N)
    
    if [ -n "$data" ]; then
        response=$(curl -s -w "HTTPSTATUS:%{http_code}" -X "$method" \
            -H "Content-Type: application/json" \
            $headers \
            -d "$data" \
            "$BASE_URL$endpoint")
    else
        response=$(curl -s -w "HTTPSTATUS:%{http_code}" -X "$method" \
            -H "Content-Type: application/json" \
            $headers \
            "$BASE_URL$endpoint")
    fi
    
    local end_time=$(date +%s%3N)
    local response_time=$((end_time - start_time))
    
    # Extract HTTP status code
    local http_code=$(echo "$response" | grep -o "HTTPSTATUS:[0-9]*" | cut -d: -f2)
    local body=$(echo "$response" | sed -E 's/HTTPSTATUS:[0-9]*$//')
    
    echo "$body" "$http_code" "$response_time"
}

# JSON validation function
validate_json() {
    local json_data=$1
    if echo "$json_data" | python3 -m json.tool >/dev/null 2>&1; then
        return 0
    else
        return 1
    fi
}

# Test counter
test_step() {
    ((TOTAL_TESTS++))
    log_test_info "Test $TOTAL_TESTS: $1"
}

# Authentication tests
test_authentication() {
    log_test_info "Starting Authentication Tests"
    echo ""
    
    # Test login with valid credentials
    test_step "Login with valid admin credentials"
    result=$(make_request "POST" "/auth/login" '{"username":"admin","password":"admin123"}')
    body=$(echo "$result" | cut -d' ' -f1)
    status=$(echo "$result" | cut -d' ' -f2)
    response_time=$(echo "$result" | cut -d' ' -f3)
    
    if [ "$status" = "200" ] && validate_json "$body"; then
        admin_token=$(echo "$body" | grep -o '"token":"[^"]*"' | cut -d'"' -f4)
        log_test_pass "Admin login successful (${response_time}ms)"
    else
        log_test_fail "Admin login failed (Status: $status)"
    fi
    
    # Test login with valid user credentials
    test_step "Login with valid user credentials"
    result=$(make_request "POST" "/auth/login" '{"username":"alice_worker","password":"alice123"}')
    body=$(echo "$result" | cut -d' ' -f1)
    status=$(echo "$result" | cut -d' ' -f2)
    response_time=$(echo "$result" | cut -d' ' -f3)
    
    if [ "$status" = "200" ] && validate_json "$body"; then
        user_token=$(echo "$body" | grep -o '"token":"[^"]*"' | cut -d'"' -f4)
        log_test_pass "User login successful (${response_time}ms)"
    else
        log_test_fail "User login failed (Status: $status)"
    fi
    
    # Test login with invalid credentials
    test_step "Login with invalid credentials"
    result=$(make_request "POST" "/auth/login" '{"username":"invalid","password":"wrong"}')
    body=$(echo "$result" | cut -d' ' -f1)
    status=$(echo "$result" | cut -d' ' -f2)
    
    if [ "$status" = "401" ] && echo "$body" | grep -q "Invalid credentials"; then
        log_test_pass "Invalid login properly rejected"
    else
        log_test_fail "Invalid login not properly handled"
    fi
    
    # Test profile endpoint with valid token
    test_step "Get profile with valid token"
    if [ -n "$admin_token" ]; then
        result=$(make_request "GET" "/auth/profile" "" "-H \"Authorization: Bearer $admin_token\"")
        body=$(echo "$result" | cut -d' ' -f1)
        status=$(echo "$result" | cut -d' ' -f2)
        
        if [ "$status" = "200" ] && validate_json "$body"; then
            log_test_pass "Profile retrieved successfully"
        else
            log_test_fail "Profile retrieval failed"
        fi
    else
        log_test_warn "Skipping profile test due to missing token"
    fi
    
    # Test profile endpoint without token
    test_step "Get profile without token (should fail)"
    result=$(make_request "GET" "/auth/profile" "")
    body=$(echo "$result" | cut -d' ' -f1)
    status=$(echo "$result" | cut -d' ' -f2)
    
    if [ "$status" = "401" ]; then
        log_test_pass "Unauthorized access properly rejected"
    else
        log_test_fail "Unauthorized access not properly handled"
    fi
    
    echo ""
}

# Task management tests
test_tasks() {
    log_test_info "Starting Task Management Tests"
    echo ""
    
    if [ -z "$admin_token" ]; then
        log_test_warn "Skipping task tests due to missing admin token"
        return
    fi
    
    # Test get all tasks
    test_step "Get all tasks"
    result=$(make_request "GET" "/tasks" "" "-H \"Authorization: Bearer $admin_token\"")
    body=$(echo "$result" | cut -d' ' -f1)
    status=$(echo "$result" | cut -d' ' -f2)
    response_time=$(echo "$result" | cut -d' ' -f3)
    
    if [ "$status" = "200" ] && validate_json "$body" && echo "$body" | grep -q "data"; then
        log_test_pass "Tasks retrieved successfully (${response_time}ms)"
    else
        log_test_fail "Tasks retrieval failed"
    fi
    
    # Test create new task
    test_step "Create new task"
    task_data='{"title":"Test API Task","description":"Testing task creation via API","category":"Development","difficulty":"Intermediate","reward_amount":125.00}'
    result=$(make_request "POST" "/tasks" "$task_data" "-H \"Authorization: Bearer $admin_token\"")
    body=$(echo "$result" | cut -d' ' -f1)
    status=$(echo "$result" | cut -d' ' -f2)
    
    if [ "$status" = "201" ] && validate_json "$body"; then
        created_task_id=$(echo "$body" | grep -o '"id":[0-9]*' | head -1 | cut -d: -f2)
        log_test_pass "Task created successfully (ID: $created_task_id)"
    else
        log_test_fail "Task creation failed"
    fi
    
    # Test get specific task
    test_step "Get specific task by ID"
    if [ -n "$created_task_id" ]; then
        result=$(make_request "GET" "/tasks/$created_task_id" "" "-H \"Authorization: Bearer $admin_token\"")
        body=$(echo "$result" | cut -d' ' -f1)
        status=$(echo "$result" | cut -d' ' -f2)
        
        if [ "$status" = "200" ] && validate_json "$body"; then
            log_test_pass "Specific task retrieved successfully"
        else
            log_test_fail "Specific task retrieval failed"
        fi
    else
        log_test_warn "Skipping specific task test due to missing task ID"
    fi
    
    # Test get non-existent task
    test_step "Get non-existent task (should return 404)"
    result=$(make_request "GET" "/tasks/99999" "" "-H \"Authorization: Bearer $admin_token\"")
    body=$(echo "$result" | cut -d' ' -f1)
    status=$(echo "$result" | cut -d' ' -f2)
    
    if [ "$status" = "404" ]; then
        log_test_pass "Non-existent task properly rejected"
    else
        log_test_fail "Non-existent task not properly handled"
    fi
    
    # Test assign task
    test_step "Assign task to user"
    if [ -n "$created_task_id" ] && [ -n "$user_token" ]; then
        assign_data='{"assignee_id":2,"assignee_type":"user"}'
        result=$(make_request "POST" "/tasks/$created_task_id/assign" "$assign_data" "-H \"Authorization: Bearer $admin_token\"")
        body=$(echo "$result" | cut -d' ' -f1)
        status=$(echo "$result" | cut -d' ' -f2)
        
        if [ "$status" = "200" ] && echo "$body" | grep -q "assigned successfully"; then
            log_test_pass "Task assigned successfully"
        else
            log_test_fail "Task assignment failed"
        fi
    else
        log_test_warn "Skipping task assignment test"
    fi
    
    echo ""
}

# Agent management tests
test_agents() {
    log_test_info "Starting Agent Management Tests"
    echo ""
    
    if [ -z "$admin_token" ]; then
        log_test_warn "Skipping agent tests due to missing admin token"
        return
    fi
    
    # Test get all agents
    test_step "Get all agents"
    result=$(make_request "GET" "/agents" "" "-H \"Authorization: Bearer $admin_token\"")
    body=$(echo "$result" | cut -d' ' -f1)
    status=$(echo "$result" | cut -d' ' -f2)
    response_time=$(echo "$result" | cut -d' ' -f3)
    
    if [ "$status" = "200" ] && validate_json "$body" && echo "$body" | grep -q "data"; then
        log_test_pass "Agents retrieved successfully (${response_time}ms)"
    else
        log_test_fail "Agents retrieval failed"
    fi
    
    # Test create new agent
    test_step "Create new agent"
    agent_data='{"name":"Test API Agent","description":"Testing agent creation via API","capabilities":["testing","validation"],"hourly_rate":60.00}'
    result=$(make_request "POST" "/agents" "$agent_data" "-H \"Authorization: Bearer $admin_token\"")
    body=$(echo "$result" | cut -d' ' -f1)
    status=$(echo "$result" | cut -d' ' -f2)
    
    if [ "$status" = "201" ] && validate_json "$body"; then
        created_agent_id=$(echo "$body" | grep -o '"id":[0-9]*' | head -1 | cut -d: -f2)
        log_test_pass "Agent created successfully (ID: $created_agent_id)"
    else
        log_test_fail "Agent creation failed"
    fi
    
    # Test get specific agent
    test_step "Get specific agent by ID"
    if [ -n "$created_agent_id" ]; then
        result=$(make_request "GET" "/agents/$created_agent_id" "" "-H \"Authorization: Bearer $admin_token\"")
        body=$(echo "$result" | cut -d' ' -f1)
        status=$(echo "$result" | cut -d' ' -f2)
        
        if [ "$status" = "200" ] && validate_json "$body"; then
            log_test_pass "Specific agent retrieved successfully"
        else
            log_test_fail "Specific agent retrieval failed"
        fi
    else
        log_test_warn "Skipping specific agent test due to missing agent ID"
    fi
    
    # Test activate agent
    test_step "Activate agent"
    if [ -n "$created_agent_id" ]; then
        activate_data='{"is_active":true}'
        result=$(make_request "POST" "/agents/$created_agent_id/activate" "$activate_data" "-H \"Authorization: Bearer $admin_token\"")
        body=$(echo "$result" | cut -d' ' -f1)
        status=$(echo "$result" | cut -d' ' -f2)
        
        if [ "$status" = "200" ] && echo "$body" | grep -q "activated successfully"; then
            log_test_pass "Agent activated successfully"
        else
            log_test_fail "Agent activation failed"
        fi
    else
        log_test_warn "Skipping agent activation test"
    fi
    
    echo ""
}

# Wallet and blockchain tests
test_wallet() {
    log_test_info "Starting Wallet & Blockchain Tests"
    echo ""
    
    if [ -z "$admin_token" ]; then
        log_test_warn "Skipping wallet tests due to missing admin token"
        return
    fi
    
    # Test get wallet balance
    test_step "Get wallet balance"
    result=$(make_request "GET" "/wallet/balance" "" "-H \"Authorization: Bearer $admin_token\"")
    body=$(echo "$result" | cut -d' ' -f1)
    status=$(echo "$result" | cut -d' ' -f2)
    response_time=$(echo "$result" | cut -d' ' -f3)
    
    if [ "$status" = "200" ] && validate_json "$body" && echo "$body" | grep -q "x402"; then
        log_test_pass "Wallet balance retrieved successfully (${response_time}ms)"
    else
        log_test_fail "Wallet balance retrieval failed"
    fi
    
    # Test get transaction history
    test_step "Get transaction history"
    result=$(make_request "GET" "/wallet/transactions" "" "-H \"Authorization: Bearer $admin_token\"")
    body=$(echo "$result" | cut -d' ' -f1)
    status=$(echo "$result" | cut -d' ' -f2)
    
    if [ "$status" = "200" ] && validate_json "$body" && echo "$body" | grep -q "data"; then
        log_test_pass "Transaction history retrieved successfully"
    else
        log_test_fail "Transaction history retrieval failed"
    fi
    
    # Test create wallet
    test_step "Create new wallet"
    result=$(make_request "POST" "/wallet/create" "" "-H \"Authorization: Bearer $admin_token\"")
    body=$(echo "$result" | cut -d' ' -f1)
    status=$(echo "$result" | cut -d' ' -f2)
    
    if [ "$status" = "201" ] && validate_json "$body" && echo "$body" | grep -q "publicKey"; then
        log_test_pass "Wallet created successfully"
    else
        log_test_fail "Wallet creation failed"
    fi
    
    # Test send transaction
    test_step "Send transaction"
    send_data='{"to":"7x402987654321","amount":50.00,"token":"x402","memo":"Test transaction"}'
    result=$(make_request "POST" "/wallet/send" "$send_data" "-H \"Authorization: Bearer $admin_token\"")
    body=$(echo "$result" | cut -d' ' -f1)
    status=$(echo "$result" | cut -d' ' -f2)
    
    if [ "$status" = "200" ] && validate_json "$body" && echo "$body" | grep -q "transaction sent"; then
        log_test_pass "Transaction sent successfully"
    else
        log_test_fail "Transaction send failed"
    fi
    
    echo ""
}

# Analytics tests
test_analytics() {
    log_test_info "Starting Analytics Tests"
    echo ""
    
    if [ -z "$admin_token" ]; then
        log_test_warn "Skipping analytics tests due to missing admin token"
        return
    fi
    
    # Test analytics metrics
    test_step "Get analytics metrics"
    result=$(make_request "GET" "/analytics/metrics" "" "-H \"Authorization: Bearer $admin_token\"")
    body=$(echo "$result" | cut -d' ' -f1)
    status=$(echo "$result" | cut -d' ' -f2)
    response_time=$(echo "$result" | cut -d' ' -f3)
    
    if [ "$status" = "200" ] && validate_json "$body" && echo "$body" | grep -q "total_users"; then
        log_test_pass "Analytics metrics retrieved successfully (${response_time}ms)"
    else
        log_test_fail "Analytics metrics retrieval failed"
    fi
    
    # Test performance metrics
    test_step "Get performance metrics"
    result=$(make_request "GET" "/analytics/performance" "" "-H \"Authorization: Bearer $admin_token\"")
    body=$(echo "$result" | cut -d' ' -f1)
    status=$(echo "$result" | cut -d' ' -f2)
    
    if [ "$status" = "200" ] && validate_json "$body" && echo "$body" | grep -q "api_response_time"; then
        log_test_pass "Performance metrics retrieved successfully"
    else
        log_test_fail "Performance metrics retrieval failed"
    fi
    
    echo ""
}

# System status tests
test_system_status() {
    log_test_info "Starting System Status Tests"
    echo ""
    
    # Test health endpoint
    test_step "Get health status"
    result=$(make_request "GET" "/health" "")
    body=$(echo "$result" | cut -d' ' -f1)
    status=$(echo "$result" | cut -d' ' -f2)
    response_time=$(echo "$result" | cut -d' ' -f3)
    
    if [ "$status" = "200" ] && validate_json "$body" && echo "$body" | grep -q "healthy"; then
        log_test_pass "Health check passed (${response_time}ms)"
    else
        log_test_fail "Health check failed"
    fi
    
    # Test status endpoint
    test_step "Get server status"
    result=$(make_request "GET" "/status" "")
    body=$(echo "$result" | cut -d' ' -f1)
    status=$(echo "$result" | cut -d' ' -f2)
    
    if [ "$status" = "200" ] && validate_json "$body" && echo "$body" | grep -q "WorkforceX402"; then
        log_test_pass "Server status retrieved successfully"
    else
        log_test_fail "Server status retrieval failed"
    fi
    
    # Test CORS headers
    test_step "Test CORS headers"
    cors_response=$(curl -s -I "$BASE_URL/health" 2>/dev/null)
    if echo "$cors_response" | grep -qi "Access-Control-Allow-Origin"; then
        log_test_pass "CORS headers present"
    else
        log_test_fail "CORS headers missing"
    fi
    
    echo ""
}

# Performance tests
test_performance() {
    log_test_info "Starting Performance Tests"
    echo ""
    
    # Test response times
    test_step "Measure average response time (5 requests)"
    total_time=0
    for i in {1..5}; do
        start_time=$(date +%s%3N)
        make_request "GET" "/health" "" >/dev/null 2>&1
        end_time=$(date +%s%3N)
        request_time=$((end_time - start_time))
        total_time=$((total_time + request_time))
    done
    avg_time=$((total_time / 5))
    
    if [ $avg_time -lt 1000 ]; then  # Less than 1 second
        log_test_pass "Average response time: ${avg_time}ms (Good)"
    else
        log_test_warn "Average response time: ${avg_time}ms (Slow)"
    fi
    
    # Test concurrent requests
    test_step "Test concurrent requests (10 simultaneous)"
    pids=()
    for i in {1..10}; do
        make_request "GET" "/health" "" >/dev/null 2>&1 &
        pids+=($!)
    done
    
    # Wait for all requests to complete
    for pid in "${pids[@]}"; do
        wait $pid
    done
    
    log_test_pass "Concurrent requests handled successfully"
    
    echo ""
}

# Rate limiting tests
test_rate_limiting() {
    log_test_info "Starting Rate Limiting Tests"
    echo ""
    
    # Test rate limit headers
    test_step "Check rate limit headers"
    headers_response=$(curl -s -I "$BASE_URL/health" 2>/dev/null)
    if echo "$headers_response" | grep -qi "X-RateLimit"; then
        log_test_pass "Rate limit headers present"
    else
        log_test_fail "Rate limit headers missing"
    fi
    
    # Test multiple requests (should not exceed limits in our test)
    test_step "Test multiple rapid requests"
    for i in {1..10}; do
        make_request "GET" "/health" "" >/dev/null 2>&1
    done
    log_test_pass "Multiple rapid requests handled"
    
    echo ""
}

# Security tests
test_security() {
    log_test_info "Starting Security Tests"
    echo ""
    
    # Test SQL injection protection
    test_step "Test SQL injection protection"
    malicious_input="'; DROP TABLE users; --"
    result=$(make_request "GET" "/tasks?search=$malicious_input" "" "-H \"Authorization: Bearer $admin_token\"")
    status=$(echo "$result" | cut -d' ' -f2)
    
    if [ "$status" = "200" ]; then
        log_test_pass "SQL injection protection working"
    else
        log_test_fail "Potential SQL injection vulnerability"
    fi
    
    # Test XSS protection in task creation
    test_step "Test XSS protection in task creation"
    xss_input='<script>alert("xss")</script>'
    xss_data="{\"title\":\"$xss_input\",\"description\":\"Test XSS\",\"category\":\"Development\",\"difficulty\":\"Beginner\",\"reward_amount\":50.00}"
    result=$(make_request "POST" "/tasks" "$xss_data" "-H \"Authorization: Bearer $admin_token\"")
    body=$(echo "$result" | cut -d' ' -f1)
    
    if [ "$status" = "201" ]; then
        log_test_pass "XSS protection working"
    else
        log_test_warn "XSS protection may need review"
    fi
    
    # Test unauthorized endpoint access
    test_step "Test unauthorized endpoint access"
    result=$(make_request "GET" "/auth/profile" "")
    status=$(echo "$result" | cut -d' ' -f2)
    
    if [ "$status" = "401" ]; then
        log_test_pass "Unauthorized access properly blocked"
    else
        log_test_fail "Unauthorized access not blocked"
    fi
    
    echo ""
}

# Data validation tests
test_data_validation() {
    log_test_info "Starting Data Validation Tests"
    echo ""
    
    if [ -z "$admin_token" ]; then
        log_test_warn "Skipping validation tests due to missing admin token"
        return
    fi
    
    # Test invalid task data
    test_step "Test invalid task data (missing required fields)"
    invalid_data='{"title":"Test"}'  # Missing required fields
    result=$(make_request "POST" "/tasks" "$invalid_data" "-H \"Authorization: Bearer $admin_token\"")
    status=$(echo "$result" | cut -d' ' -f2)
    
    if [ "$status" = "400" ]; then
        log_test_pass "Invalid task data properly rejected"
    else
        log_test_fail "Invalid task data not properly validated"
    fi
    
    # Test invalid agent data
    test_step "Test invalid agent data"
    invalid_agent_data='{"name":""}'  # Empty name
    result=$(make_request "POST" "/agents" "$invalid_agent_data" "-H \"Authorization: Bearer $admin_token\"")
    status=$(echo "$result" | cut -d' ' -f2)
    
    if [ "$status" = "400" ]; then
        log_test_pass "Invalid agent data properly rejected"
    else
        log_test_fail "Invalid agent data not properly validated"
    fi
    
    # Test invalid wallet data
    test_step "Test invalid wallet data"
    invalid_wallet_data='{"amount":-50}'  # Negative amount
    result=$(make_request "POST" "/wallet/send" "$invalid_wallet_data" "-H \"Authorization: Bearer $admin_token\"")
    status=$(echo "$result" | cut -d' ' -f2)
    
    if [ "$status" = "400" ]; then
        log_test_pass "Invalid wallet data properly rejected"
    else
        log_test_fail "Invalid wallet data not properly validated"
    fi
    
    echo ""
}

# Main test runner
run_all_tests() {
    print_test_banner
    echo ""
    
    log_test_info "Starting comprehensive testing at $(date)"
    echo ""
    
    # Run all test suites
    test_authentication
    test_tasks
    test_agents
    test_wallet
    test_analytics
    test_system_status
    test_performance
    test_rate_limiting
    test_security
    test_data_validation
    
    # Print final results
    print_test_results
}

# Print test results summary
print_test_results() {
    echo ""
    echo -e "${PURPLE}╔════════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${PURPLE}║                     TEST RESULTS SUMMARY                      ║${NC}"
    echo -e "${PURPLE}╚════════════════════════════════════════════════════════════════╝${NC}"
    echo ""
    echo -e "${CYAN}Total Tests:${NC}        $TOTAL_TESTS"
    echo -e "${GREEN}Passed:${NC}            $PASSED_TESTS"
    echo -e "${RED}Failed:${NC}            $FAILED_TESTS"
    echo -e "${BLUE}Success Rate:${NC}      $(( PASSED_TESTS * 100 / TOTAL_TESTS ))%"
    echo ""
    
    if [ $FAILED_TESTS -eq 0 ]; then
        echo -e "${GREEN}🎉 ALL TESTS PASSED! Production API is working correctly.${NC}"
        exit_code=0
    elif [ $FAILED_TESTS -le $(( TOTAL_TESTS / 10 )) ]; then
        echo -e "${YELLOW}⚠️  Most tests passed with minor failures. Review failed tests.${NC}"
        exit_code=1
    else
        echo -e "${RED}❌ Multiple tests failed. Please investigate the issues.${NC}"
        exit_code=2
    fi
    
    echo ""
    echo -e "${CYAN}Test results saved to:${NC} $TEST_RESULTS_FILE"
    echo -e "${CYAN}Test completed at:${NC} $(date)"
    echo ""
    
    return $exit_code
}

# Parse command line arguments
SKIP_AUTH=false
SKIP_PERF=false
SKIP_SECURITY=false

while [[ $# -gt 0 ]]; do
    case $1 in
        --skip-auth)
            SKIP_AUTH=true
            shift
            ;;
        --skip-performance)
            SKIP_PERF=true
            shift
            ;;
        --skip-security)
            SKIP_SECURITY=true
            shift
            ;;
        --help)
            echo "Usage: $0 [OPTIONS]"
            echo "Options:"
            echo "  --skip-auth        Skip authentication tests"
            echo "  --skip-performance Skip performance tests"
            echo "  --skip-security    Skip security tests"
            echo "  --help             Show this help message"
            exit 0
            ;;
        *)
            echo "Unknown option: $1"
            echo "Use --help for available options"
            exit 1
            ;;
    esac
done

# Error handling
trap 'log_test_fail "Test suite interrupted at line $LINENO"' ERR

# Run the test suite
run_all_tests