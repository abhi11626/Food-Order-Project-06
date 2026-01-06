import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import bodyParser from "body-parser";
import express from "express";

// Get the directory of the current file (app.js)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define absolute paths for data files
const DATA_DIR = path.join(__dirname, "data");
const MEALS_FILE = path.join(DATA_DIR, "available-meals.json");
const ORDERS_FILE = path.join(DATA_DIR, "orders.json");
const PUBLIC_DIR = path.join(__dirname, "public");

const app = express();

app.use(bodyParser.json());
app.use(express.static(PUBLIC_DIR));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});

app.get("/", (req, res) => {
  res.json({ message: "Food Order API is running" });
});

app.get("/meals", async (req, res) => {
  try {
    const meals = await fs.readFile(MEALS_FILE, "utf8");
    res.json(JSON.parse(meals));
  } catch (error) {
    console.error("Error reading meals file:", error);
    res.status(500).json({ message: "Failed to load meals" });
  }
});

app.post("/orders", async (req, res) => {
  const orderData = req.body.order;

  if (
    orderData === null ||
    orderData.items === null ||
    orderData.items.length === 0
  ) {
    return res.status(400).json({ message: "Missing data." });
  }

  if (
    orderData.customer.email === null ||
    !orderData.customer.email.includes("@") ||
    orderData.customer.name === null ||
    orderData.customer.name.trim() === "" ||
    orderData.customer.street === null ||
    orderData.customer.street.trim() === "" ||
    orderData.customer["postal-code"] === null ||
    orderData.customer["postal-code"].trim() === "" ||
    orderData.customer.city === null ||
    orderData.customer.city.trim() === ""
  ) {
    return res.status(400).json({
      message:
        "Missing data: Email, name, street, postal code or city is missing.",
    });
  }

  const newOrder = {
    ...orderData,
    id: (Math.random() * 1000).toString(),
  };
  
  try {
    // Note: This will fail on Vercel's read-only filesystem
    // For production, you'll need to use a database
    const orders = await fs.readFile(ORDERS_FILE, "utf8");
    const allOrders = JSON.parse(orders);
    allOrders.push(newOrder);
    await fs.writeFile(ORDERS_FILE, JSON.stringify(allOrders, null, 2));
    res.status(201).json({ message: "Order created!" });
  } catch (error) {
    console.error("Error writing order file:", error);
    // On Vercel, file writes will fail, but we'll still return success
    // In production, replace this with database operations
    if (error.code === "EROFS" || error.code === "EACCES") {
      console.warn("File system is read-only (expected on Vercel). Order not persisted.");
      res.status(201).json({ 
        message: "Order created! (Note: Not persisted - use database in production)" 
      });
    } else {
      res.status(500).json({ message: "Failed to save order" });
    }
  }
});

app.use((req, res) => {
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  res.status(404).json({ message: "Not found" });
});

// Only listen on port 3000 if running locally
if (process.env.NODE_ENV !== 'production') {
  app.listen(3000);
}

// Export the app for Vercel serverless functions
export default app;
