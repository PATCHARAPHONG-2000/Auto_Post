"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const tiktok_routes_1 = __importDefault(require("./routes/tiktok.routes"));
const facebook_routes_1 = __importDefault(require("./routes/facebook.routes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});
// API Routes
app.get('/api/v1', (req, res) => {
    res.json({
        message: 'Auto Content System API',
        version: '1.0.0',
        endpoints: {
            tiktok: '/api/v1/tiktok',
            facebook: '/api/v1/facebook',
            health: '/health'
        }
    });
});
// Platform routes
app.use('/api/v1/tiktok', tiktok_routes_1.default);
app.use('/api/v1/facebook', facebook_routes_1.default);
// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📍 Health check: http://localhost:${PORT}/health`);
    console.log(`📱 TikTok API: http://localhost:${PORT}/api/v1/tiktok`);
    console.log(`📘 Facebook API: http://localhost:${PORT}/api/v1/facebook`);
});
exports.default = app;
//# sourceMappingURL=index.js.map