
import { AREAS } from "./constants/areas";
import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import animalRoutes from "./routes/animals";
import { MigrationRunner } from "./database/migrationRunner";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware setup
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

// Root endpoint with API information
app.get("/", (req, res) => {
    res.json({
        message: "Fauna Research Engine API",
        version: "2.0.0",
        endpoints: {
            research: "/api/animals/research",
            cards: "/api/animals/cards",
            batch: "/api/animals/research/batch",
            stats: "/api/animals/stats",
            areas: "/api/areas"
        },
        documentation: "Use POST /api/animals/research with {animalName, scientificName?} to research animals"
    });
});

// API routes
app.use("/api/animals", animalRoutes);

// Get available game areas
app.get("/api/areas", (req, res) => {
    res.json({
        success: true,
        data: {
            areas: AREAS,
            total: AREAS.length
        }
    });
});

// Start server with database initialization
async function startServer() {
    try {
        // Initialize database and run migrations
        const migrationRunner = new MigrationRunner();
        const dbSetup = await migrationRunner.checkDatabaseSetup();
        
        if (!dbSetup) {
            console.error('❌ Failed to initialize database. Server startup aborted.');
            process.exit(1);
        }

        // Start the HTTP server
        app.listen(PORT, () => {
            console.log(`✅ Game areas loaded: ${AREAS.length}`);
            console.log(`✅ Database initialized and ready`);
            console.log(`🚀 Fauna Research Engine running on PORT ${PORT}`);
            console.log(`📍 Access the API at: http://localhost:${PORT}`);
            console.log(`🧪 Test with: curl -X POST http://localhost:${PORT}/api/animals/research -H "Content-Type: application/json" -d '{"animalName": "Snow Leopard"}'`);
        });
    } catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
}

// Start the server
startServer();