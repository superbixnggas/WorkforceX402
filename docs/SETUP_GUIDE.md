# WorkforceX402 Setup Guide

## 🚀 Quick Start (5 Minutes)

### Step 1: Clone & Install
```bash
git clone https://github.com/superbixnggas/WorkforceX402.git
cd WorkforceX402

# Backend setup
cd backend
npm install

# Frontend setup (new terminal)
cd frontend  
npm install
```

### Step 2: Start Services
```bash
# Terminal 1: Start backend
cd backend
node workforce-server.js
# Server running at http://localhost:3005

# Terminal 2: Start frontend
cd frontend
npm run dev
# Frontend at http://localhost:5173
```

### Step 3: Test Platform
- Open http://localhost:5173
- Test AI Agent Matching feature
- View analytics dashboard
- Check X402 token integration

## 📋 Detailed Setup

### Backend Requirements
- Node.js 18+
- npm or yarn
- Git

### Frontend Requirements  
- Node.js 18+
- npm or yarn
- Modern browser (Chrome, Firefox, Safari, Edge)

## 🔧 Configuration

### Backend Configuration
```bash
# Default (port 3005)
node workforce-server.js

# Custom port
PORT=8080 node workforce-server.js

# Production mode
NODE_ENV=production PORT=3005 node workforce-server.js
```

### Environment Variables
```bash
# Create .env file in backend/
PORT=3005
NODE_ENV=development
CORS_ORIGIN=*
```

### Frontend Configuration
```bash
# Development
npm run dev

# Production build
npm run build
npm run preview

# Lint code
npm run lint
```

## 🧪 Testing

### Backend Testing
```bash
cd backend
node test-api-integration.js

# Or manual testing
curl http://localhost:3005/api/health
```

### Frontend Testing
```bash
cd frontend
npm run test      # Run tests
npm run lint      # Lint code
npm run typecheck # TypeScript check
```

## 🌍 Deployment

### Local Deployment
```bash
# Start both services
./scripts/start.sh 3005 5173
```

### Production Deployment
```bash
# Backend
cd backend
PORT=80 node workforce-server.js

# Frontend  
cd frontend
npm run build
# Deploy dist/ folder to web server
```

## 🔍 Troubleshooting

### Common Issues

#### Backend not starting
```bash
# Check Node.js version
node --version  # Should be 18+

# Reinstall dependencies
rm -rf node_modules
npm install
```

#### Frontend not loading
```bash
# Check port conflicts
netstat -tulpn | grep :5173

# Clear cache
rm -rf node_modules
npm install
```

#### CORS errors
```bash
# Check CORS configuration
# Should be set in workforce-server.js
app.use(cors({
  origin: '*',
  credentials: true
}));
```

## 📊 API Testing

### Health Check
```bash
curl http://localhost:3005/api/health
```

### Analytics APIs
```bash
curl http://localhost:3005/api/analytics/cards
curl http://localhost:3005/api/analytics/charts
curl http://localhost:3005/api/analytics/activity
```

### AI Agent Matching
```bash
curl -X POST http://localhost:3005/api/ai/match-agent \
  -H "Content-Type: application/json" \
  -d '{"taskType": "backend", "budget": 150, "complexity": "medium"}'
```

## 🚀 Production Tips

### Performance Optimization
```bash
# Enable compression
const compression = require('compression');
app.use(compression());

# Set cache headers
app.use(express.static('public', {
  maxAge: '1h',
  etag: false
}));
```

### Security
```bash
# Add helmet for security headers
const helmet = require('helmet');
app.use(helmet());

# Add rate limiting
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use('/api/', limiter);
```

## 📞 Support

### Documentation
- README.md: Project overview dan features
- API_DOCUMENTATION.md: Complete API reference  
- PROJECT_SUMMARY.md: Technical details

### Getting Help
1. Check troubleshooting section
2. Review API documentation
3. Check console logs untuk errors
4. Test individual components

---

**Setup Time**: ~5 minutes  
**Production Ready**: ✅ All features tested  
**Support**: ✅ Comprehensive documentation included
