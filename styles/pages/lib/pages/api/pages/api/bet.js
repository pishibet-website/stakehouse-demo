import { placeBet } from "../../lib/store";

export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  const auth = req.headers.authorization || "";
  const token = auth.replace("Bearer ", "");
  const { selections, stake } = req.body || {};
  const result = placeBet({ token, selections, stake });
  if (!result.ok) {
    return res.status(400).json({ error: result.error });
  }
  res.status(200).json(result);
}
