"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const database_1 = __importDefault(require("./config/database"));
const migrate_1 = require("./config/migrate");
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const dashboardRoutes_1 = __importDefault(require("./routes/dashboardRoutes"));
const storeRoutes_1 = __importDefault(require("./routes/storeRoutes"));
const productRoutes_1 = __importDefault(require("./routes/productRoutes"));
const hampersRoutes_1 = __importDefault(require("./routes/hampersRoutes"));
const activityRoutes_1 = __importDefault(require("./routes/activityRoutes"));
const errorMiddleware_1 = require("./middlewares/errorMiddleware");
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
// CORS configuration
app.use((0, cors_1.default)({
    origin: '*', // Allow all or specific client URLs in development
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
// Body parser
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Serve static uploaded images
app.use('/uploads', express_1.default.static(path_1.default.join(process.cwd(), 'uploads')));
// Health check endpoint
app.get('/api/health', async (req, res) => {
    try {
        await database_1.default.query('SELECT 1');
        res.json({
            status: 'OK',
            message: 'Backend Kampung Keripik Tempe Sanan is healthy and running',
            database: 'Connected',
            timestamp: new Date().toISOString()
        });
    }
    catch (err) {
        res.status(500).json({
            status: 'ERROR',
            message: 'Database connection failed',
            error: err.message
        });
    }
});
// API Routes
app.use('/api/auth', authRoutes_1.default);
app.use('/api/dashboard', dashboardRoutes_1.default);
app.use('/api/stores', storeRoutes_1.default);
app.use('/api/products', productRoutes_1.default);
app.use('/api/hampers', hampersRoutes_1.default);
app.use('/api/activity', activityRoutes_1.default);
// 404 Route handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: `Route '${req.method} ${req.originalUrl}' tidak ditemukan`
    });
});
// Centralized error handling
app.use(errorMiddleware_1.errorHandler);
// Start server
async function startServer() {
    try {
        // Run migration checks
        await (0, migrate_1.migrate)();
        app.listen(PORT, () => {
            console.log(`=================================================`);
            console.log(`🚀 Sanan Tempe Backend Server is running!`);
            console.log(`📍 Port: http://localhost:${PORT}`);
            console.log(`🌐 Health Check: http://localhost:${PORT}/api/health`);
            console.log(`=================================================`);
        });
    }
    catch (err) {
        console.error('Failed to start server:', err);
        process.exit(1);
    }
}
startServer();
exports.default = app;
