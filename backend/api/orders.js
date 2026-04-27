import fs from "fs";
import path from "path";

export default function handler(req, res) {
  const filePath = path.join(process.cwd(), "backend", "data", "orders.json");

  if (req.method === "GET") {
    const data = fs.readFileSync(filePath, "utf-8");
    return res.status(200).json(JSON.parse(data));
  }

  if (req.method === "POST") {
    const orders = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    orders.push(req.body);

    fs.writeFileSync(filePath, JSON.stringify(orders, null, 2));

    return res.status(201).json({ message: "Order saved" });
  }
}
