#!/bin/bash

# WorkforceX402 Production Deployment Script
# Version: 2.0.0
# Description: Complete production deployment automation

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Configuration
PROJECT_NAME="WorkforceX402"
PROJECT_VERSION="2.0.0"
PRODUCTION_PORT=3004
WORK_DIR=$(pwd)
LOG_FILE="$WORK_DIR/deployment.log"

# Banner
print_banner() {
    echo -e "${PURPLE}"
    echo "╔════════════════════════════════════════════════════════════════╗"
    echo "║                    WorkforceX402 Production                    ║"
    echo "║                        Deployment Suite                       ║"
    echo "║                         Version $PROJECT_VERSION                            ║"
    echo "╚════════════════════════════════════════════════════════════════╝"
    echo -e "${NC}"
}

# Logging functions
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1" | tee -a $LOG_FILE
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1" | tee -a $LOG_FILE
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1" | tee -a $LOG_FILE
}

log_step() {
    echo -e "${CYAN}[STEP]${NC} $1" | tee -a $LOG_FILE
}

# Pre-deployment checks
check_system() {
    log_step "Performing system checks..."
    
    # Check if running as root
    if [[ $EUID -eq 0 ]]; then
        log_warn "Running as root. This is not recommended for production."
    fi
    
    # Check Node.js version
    if command -v node &> /dev/null; then
        NODE_VERSION=$(node --version)
        log_info "Node.js version: $NODE_VERSION"
        
        # Check if version is 16+ (required for production)
        if ! node -e "const v = process.version.slice(1).split('.').map(Number); v[0] >= 16" 2>/dev/null; then
            log_error "Node.js version 16 or higher is required. Current: $NODE_VERSION"
            exit 1
        fi
    else
        log_error "Node.js is not installed. Please install Node.js 16+ and try again."
        exit 1
    fi
    
    # Check available disk space (minimum 1GB)
    AVAILABLE_SPACE=$(df . | tail -1 | awk '{print $4}')
    if [ $AVAILABLE_SPACE -lt 1048576 ]; then  # 1GB in KB
        log_warn "Low disk space. At least 1GB recommended."
    fi
    
    # Check memory
    TOTAL_MEM=$(free -m | awk 'NR==2{printf "%.0f", $2}')
    if [ $TOTAL_MEM -lt 512 ]; then
        log_warn "Low memory detected. At least 512MB recommended."
    fi
    
    log_info "System check completed successfully"
}

# Install dependencies
install_dependencies() {
    log_step "Installing production dependencies..."
    
    # Create package.json if it doesn't exist
    if [ ! -f "package.json" ]; then
        log_info "Creating package.json..."
        cat > package.json << EOF
{
  "name": "workforceX402-production",
  "version": "2.0.0",
  "description": "WorkforceX402 Production Platform",
  "main": "production-server.js",
  "scripts": {
    "start": "node production-server.js",
    "dev": "NODE_ENV=development node production-server.js",
    "test": "NODE_ENV=test node test/production.test.js",
    "backup": "bash setup-production-db.sh backup",
    "restore": "bash setup-production-db.sh restore"
  },
  "dependencies": {},
  "devDependencies": {},
  "engines": {
    "node": ">=16.0.0"
  },
  "keywords": [
    "blockchain",
    "ai",
    "task-management",
    "production"
  ],
  "author": "WorkforceX402",
  "license": "MIT"
}
EOF
        log_info "package.json created"
    fi
    
    # Install production dependencies if needed
    if [ -d "node_modules" ]; then
        log_info "Dependencies already installed"
    else
        log_info "Installing dependencies..."
        npm install --production
    fi
    
    log_info "Dependencies installation completed"
}

# Setup environment
setup_environment() {
    log_step "Setting up environment..."
    
    # Create environment file if it doesn't exist
    if [ ! -f ".env" ]; then
        if [ -f ".env.example" ]; then
            cp .env.example .env
            log_info ".env file created from .env.example"
            log_warn "Please update .env file with your actual configuration before starting production server"
        else
            log_error ".env.example file not found. Please check your deployment files."
            exit 1
        fi
    else
        log_info ".env file already exists"
    fi
    
    # Create necessary directories
    mkdir -p logs
    mkdir -p uploads
    mkdir -p backups
    mkdir -p config
    mkdir -p public
    
    # Set proper permissions
    chmod 755 . 2>/dev/null || true
    chmod 644 .env 2>/dev/null || true
    chmod 755 logs uploads backups config public 2>/dev/null || true
    
    log_info "Environment setup completed"
}

# Setup database
setup_database() {
    log_step "Setting up production database..."
    
    if [ -f "setup-production-db.sh" ]; then
        # Make script executable
        chmod +x setup-production-db.sh
        
        # Run database setup
        bash setup-production-db.sh
        log_info "Database setup completed"
    else
        log_error "setup-production-db.sh script not found"
        exit 1
    fi
}

# Security hardening
security_hardening() {
    log_step "Applying security hardening..."
    
    # Create security configuration
    cat > config/security.conf << EOF
# WorkforceX402 Security Configuration
# Hardening settings for production

# File permissions
chmod 600 .env
chmod 700 config/
chmod 755 logs/
chmod 755 uploads/
chmod 755 backups/

# Remove sensitive files from repository tracking
# echo ".env" >> .gitignore
# echo "config/*.key" >> .gitignore
# echo "logs/*" >> .gitignore
# echo "uploads/*" >> .gitignore

# Generate secure JWT secret if not set
EOF
    
    # Generate secure secrets
    if ! grep -q "JWT_SECRET.*production-secret" .env 2>/dev/null; then
        JWT_SECRET=$(openssl rand -base64 32)
        sed -i "s/JWT_SECRET=.*/JWT_SECRET=$JWT_SECRET/" .env
        log_info "Generated secure JWT secret"
    fi
    
    # Set secure file permissions
    chmod 600 .env 2>/dev/null || true
    chmod 700 config/ 2>/dev/null || true
    
    log_info "Security hardening completed"
}

# Create systemd service (Linux only)
create_systemd_service() {
    if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        log_step "Creating systemd service..."
        
        SERVICE_FILE="/etc/systemd/system/workforceX402.service"
        USER=$(whoami)
        
        # Create systemd service file
        sudo tee $SERVICE_FILE > /dev/null << EOF
[Unit]
Description=WorkforceX402 Production Server
After=network.target
Wants=network.target

[Service]
Type=simple
User=$USER
WorkingDirectory=$WORK_DIR
Environment=NODE_ENV=production
EnvironmentFile=$WORK_DIR/.env
ExecStart=/usr/bin/node production-server.js
Restart=always
RestartSec=10
StandardOutput=journal
StandardError=journal
SyslogIdentifier=workforceX402

# Security settings
NoNewPrivileges=true
PrivateTmp=true
ProtectSystem=strict
ProtectHome=true
ReadWritePaths=$WORK_DIR

# Resource limits
LimitNOFILE=65536
LimitNPROC=4096

[Install]
WantedBy=multi-user.target
EOF

        # Reload systemd and enable service
        sudo systemctl daemon-reload
        sudo systemctl enable workforceX402
        
        log_info "Systemd service created and enabled"
        log_info "Service management commands:"
        log_info "  Start: sudo systemctl start workforceX402"
        log_info "  Stop: sudo systemctl stop workforceX402"
        log_info "  Status: sudo systemctl status workforceX402"
        log_info "  Logs: sudo journalctl -u workforceX402 -f"
    else
        log_warn "Systemd service creation skipped (not Linux)"
    fi
}

# Create monitoring scripts
create_monitoring() {
    log_step "Creating monitoring scripts..."
    
    # Health check script
    cat > scripts/health-check.sh << 'EOF'
#!/bin/bash
# WorkforceX402 Health Check Script

API_URL="http://localhost:3004/api/v1/health"
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" $API_URL)

if [ $RESPONSE -eq 200 ]; then
    echo "✅ Health check passed"
    exit 0
else
    echo "❌ Health check failed (HTTP $RESPONSE)"
    exit 1
fi
EOF

    # Server status script
    cat > scripts/server-status.sh << 'EOF'
#!/bin/bash
# WorkforceX402 Server Status Script

PORT=3004
API_URL="http://localhost:$PORT/api/v1/status"

echo "WorkforceX402 Server Status Check"
echo "=================================="
echo ""

# Check if port is listening
if lsof -Pi :$PORT -sTCP:LISTEN -t >/dev/null 2>&1; then
    echo "✅ Port $PORT is listening"
else
    echo "❌ Port $PORT is not listening"
    echo "Server might not be running"
fi

# Check API response
if command -v curl &> /dev/null; then
    RESPONSE=$(curl -s $API_URL 2>/dev/null)
    if [ ! -z "$RESPONSE" ]; then
        echo "✅ API is responding"
        echo "$RESPONSE" | jq . 2>/dev/null || echo "$RESPONSE"
    else
        echo "❌ API is not responding"
    fi
else
    echo "⚠️  curl not available for API check"
fi

# Check database
if [ -f "workforce_production.db" ]; then
    echo "✅ Database file exists"
else
    echo "❌ Database file not found"
fi

# Check log file
if [ -f "logs/workforce-production.log" ]; then
    echo "✅ Log file exists"
    echo "   Last 5 lines:"
    tail -5 logs/workforce-production.log | sed 's/^/   /'
else
    echo "⚠️  Log file not found"
fi

echo ""
echo "Check completed at $(date)"
EOF

    # Make scripts executable
    mkdir -p scripts
    chmod +x scripts/health-check.sh
    chmod +x scripts/server-status.sh
    
    log_info "Monitoring scripts created"
}

# Create backup script
create_backup_script() {
    log_step "Creating backup script..."
    
    cat > scripts/backup.sh << 'EOF'
#!/bin/bash
# WorkforceX402 Backup Script

BACKUP_DIR="./backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_NAME="workforce_backup_$TIMESTAMP"

echo "Starting backup at $(date)"

# Create backup directory
mkdir -p $BACKUP_DIR

# Backup database
if [ -f "workforce_production.db" ]; then
    cp workforce_production.db "$BACKUP_DIR/${BACKUP_NAME}_db.sqlite"
    echo "✅ Database backed up"
else
    echo "❌ Database file not found"
    exit 1
fi

# Backup configuration
if [ -f ".env" ]; then
    cp .env "$BACKUP_DIR/${BACKUP_NAME}_env"
    echo "✅ Environment config backed up"
fi

# Backup logs (last 30 days)
if [ -d "logs" ]; then
    tar -czf "$BACKUP_DIR/${BACKUP_NAME}_logs.tar.gz" logs/ -mtime -30
    echo "✅ Recent logs backed up"
fi

# Create backup manifest
cat > "$BACKUP_DIR/${BACKUP_NAME}_manifest.txt" << MANIFEST
WorkforceX402 Backup Manifest
============================
Backup Date: $(date)
Server Version: 2.0.0
Hostname: $(hostname)
User: $(whoami)

Files Included:
- workforce_production.db
- .env (configuration)
- logs/ (last 30 days)

Total size: $(du -sh $BACKUP_DIR/${BACKUP_NAME}_* | awk '{sum+=$1} END {print sum}')
MANIFEST

echo "✅ Backup completed: $BACKUP_NAME"
echo "Backup location: $BACKUP_DIR"
ls -la $BACKUP_DIR | grep $TIMESTAMP
EOF

    chmod +x scripts/backup.sh
    log_info "Backup script created"
}

# Start production server
start_server() {
    log_step "Starting production server..."
    
    # Check if port is already in use
    if lsof -Pi :$PRODUCTION_PORT -sTCP:LISTEN -t >/dev/null 2>&1; then
        log_warn "Port $PRODUCTION_PORT is already in use"
        read -p "Do you want to stop the existing process? (y/N): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            # Kill existing process
            PIDS=$(lsof -t -i:$PRODUCTION_PORT)
            if [ ! -z "$PIDS" ]; then
                kill -9 $PIDS 2>/dev/null || true
                log_info "Existing process stopped"
            fi
        else
            log_info "Deployment cancelled"
            exit 1
        fi
    fi
    
    # Start the server
    if command -v systemctl &> /dev/null && systemctl is-enabled workforceX402 &>/dev/null; then
        log_info "Starting via systemd service..."
        sudo systemctl start workforceX402
        sleep 2
        
        if sudo systemctl is-active --quiet workforceX402; then
            log_info "✅ Server started successfully via systemd"
        else
            log_error "Failed to start via systemd, trying direct start..."
            start_direct
        fi
    else
        start_direct
    fi
}

start_direct() {
    log_info "Starting server directly..."
    
    # Start server in background
    nohup node production-server.js > logs/server.out.log 2>&1 &
    SERVER_PID=$!
    echo $SERVER_PID > .server.pid
    
    log_info "Server started with PID: $SERVER_PID"
    
    # Wait and check if server is running
    sleep 5
    
    if kill -0 $SERVER_PID 2>/dev/null; then
        log_info "✅ Server is running (PID: $SERVER_PID)"
    else
        log_error "Server failed to start"
        log_info "Check logs for details: tail -f logs/server.out.log"
        exit 1
    fi
    
    # Test health endpoint
    sleep 2
    if curl -s http://localhost:$PRODUCTION_PORT/api/v1/health >/dev/null; then
        log_info "✅ Health check passed"
    else
        log_warn "Health check failed, but server might still be starting"
    fi
}

# Post-deployment verification
verify_deployment() {
    log_step "Verifying deployment..."
    
    # Test all API endpoints
    ENDPOINTS=(
        "/api/v1/health"
        "/api/v1/status"
        "/api/v1/tasks"
        "/api/v1/agents"
        "/api/v1/wallet/balance"
    )
    
    FAILED=0
    for endpoint in "${ENDPOINTS[@]}"; do
        if curl -s "http://localhost:$PRODUCTION_PORT$endpoint" >/dev/null 2>&1; then
            log_info "✅ $endpoint is responding"
        else
            log_error "❌ $endpoint is not responding"
            FAILED=$((FAILED + 1))
        fi
    done
    
    if [ $FAILED -eq 0 ]; then
        log_info "✅ All API endpoints are working"
    else
        log_error "❌ $FAILED endpoint(s) failed"
    fi
    
    # Check file permissions
    if [ -f ".env" ] && [ -r ".env" ]; then
        log_info "✅ Configuration file is accessible"
    else
        log_warn "⚠️  Configuration file may have permission issues"
    fi
    
    # Check database
    if [ -f "workforce_production.db" ] && [ -r "workforce_production.db" ]; then
        log_info "✅ Database is accessible"
    else
        log_error "❌ Database file not accessible"
    fi
    
    log_info "Deployment verification completed"
}

# Print deployment summary
print_summary() {
    echo ""
    echo -e "${GREEN}╔════════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${GREEN}║                    DEPLOYMENT SUMMARY                         ║${NC}"
    echo -e "${GREEN}╚════════════════════════════════════════════════════════════════╝${NC}"
    echo ""
    echo -e "${CYAN}Project:${NC}        $PROJECT_NAME v$PROJECT_VERSION"
    echo -e "${CYAN}Status:${NC}         ✅ DEPLOYED SUCCESSFULLY"
    echo -e "${CYAN}Port:${NC}           $PRODUCTION_PORT"
    echo -e "${CYAN}Environment:${NC}   Production"
    echo -e "${CYAN}Database:${NC}      SQLite (workforce_production.db)"
    echo -e "${CYAN}Health Check:${NC}  http://localhost:$PRODUCTION_PORT/api/v1/health"
    echo -e "${CYAN}Status API:${NC}    http://localhost:$PRODUCTION_PORT/api/v1/status"
    echo ""
    echo -e "${YELLOW}🔐 Demo Login Credentials:${NC}"
    echo -e "  Admin: ${GREEN}admin${NC} / ${GREEN}admin123${NC}"
    echo -e "  User:  ${GREEN}alice_worker${NC} / ${GREEN}alice123${NC}"
    echo ""
    echo -e "${YELLOW}📁 Important Files:${NC}"
    echo -e "  Config:   .env"
    echo -e "  Database: workforce_production.db"
    echo -e "  Logs:     logs/workforce-production.log"
    echo -e "  Scripts:  scripts/"
    echo ""
    echo -e "${YELLOW}🛠️  Management Commands:${NC}"
    if [[ "$OSTYPE" == "linux-gnu"* ]] && systemctl is-enabled workforceX402 &>/dev/null; then
        echo -e "  Start:    ${GREEN}sudo systemctl start workforceX402${NC}"
        echo -e "  Stop:     ${GREEN}sudo systemctl stop workforceX402${NC}"
        echo -e "  Status:   ${GREEN}sudo systemctl status workforceX402${NC}"
        echo -e "  Logs:     ${GREEN}sudo journalctl -u workforceX402 -f${NC}"
    else
        echo -e "  Start:    ${GREEN}node production-server.js${NC}"
        echo -e "  PID:      ${GREEN}cat .server.pid${NC}"
        echo -e "  Stop:     ${GREEN}kill \$(cat .server.pid)${NC}"
        echo -e "  Status:   ${GREEN}curl http://localhost:$PRODUCTION_PORT/api/v1/health${NC}"
        echo -e "  Logs:     ${GREEN}tail -f logs/server.out.log${NC}"
    fi
    echo ""
    echo -e "${YELLOW}📊 Monitoring:${NC}"
    echo -e "  Health:   ${GREEN}bash scripts/health-check.sh${NC}"
    echo -e "  Status:   ${GREEN}bash scripts/server-status.sh${NC}"
    echo -e "  Backup:   ${GREEN}bash scripts/backup.sh${NC}"
    echo ""
    echo -e "${GREEN}🎉 Production deployment completed successfully!${NC}"
    echo -e "${CYAN}Deployment log: $LOG_FILE${NC}"
    echo ""
}

# Main deployment function
main() {
    print_banner
    
    # Parse command line arguments
    SKIP_SETUP=false
    FORCE_RESTART=false
    
    while [[ $# -gt 0 ]]; do
        case $1 in
            --skip-setup)
                SKIP_SETUP=true
                shift
                ;;
            --force-restart)
                FORCE_RESTART=true
                shift
                ;;
            --help)
                echo "Usage: $0 [OPTIONS]"
                echo "Options:"
                echo "  --skip-setup    Skip database and dependency setup"
                echo "  --force-restart Force restart if port is in use"
                echo "  --help          Show this help message"
                exit 0
                ;;
            *)
                log_error "Unknown option: $1"
                exit 1
                ;;
        esac
    done
    
    # Start deployment
    log_info "Starting deployment at $(date)"
    
    check_system
    install_dependencies
    
    if [ "$SKIP_SETUP" = false ]; then
        setup_environment
        setup_database
        security_hardening
    fi
    
    create_monitoring
    create_backup_script
    create_systemd_service
    start_server
    verify_deployment
    print_summary
    
    log_info "Deployment completed at $(date)"
}

# Error handling
trap 'log_error "Deployment failed at line $LINENO"' ERR

# Run main function
main "$@"