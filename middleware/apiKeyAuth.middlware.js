export const apiKeyAuth = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  
  if (!authHeader) {
    return res.status(401).json({ error: "Unauthorized!" });
  }

  const token = authHeader.split(" ")[1];
  
  if (token !== process.env.API_KEY) {
    return res.status(403).json({ error: "Invalid API key" });
  }

  next();
}
