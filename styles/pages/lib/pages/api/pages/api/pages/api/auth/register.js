import { registerUser } from "../../../lib/store";

export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  const { name, email, password } = req.body || {};
  const result = registerUser({ name, email, password });
  if (!result.ok) {
    return res.status(400).json({ error: result.error });
  }
  res.status(200).json(result);
}
