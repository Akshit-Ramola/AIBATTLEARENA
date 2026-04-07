import express from 'express';
import cors from 'cors';
import useGraph from "./services/graph.ai.service.js"

const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
})

app.post("/use-graph", async (req, res) => {
    try {
        const problem = req.body?.problem || "What is the capital of France? ";
        const result = await useGraph(problem);
        res.json(result);
    } catch (error: any) {
        console.error("Error in /use-graph:", error);
        res.status(500).json({ error: error.message || "An expected error occurred." });
    }
})
export default app;