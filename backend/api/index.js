// Import the Express app from the parent directory
// import app from '../app.js';

// Export as default for Vercel serverless function
// export default app;

import app from "../app.js";

export default function handler(req, res) {
  // Fix URL
  req.url = req.url.replace(/^\/api\/?/, "/");

  // Important: call app as a function
  return new Promise((resolve) => {
    app(req, res);
    res.on("finish", resolve);
  });
}
