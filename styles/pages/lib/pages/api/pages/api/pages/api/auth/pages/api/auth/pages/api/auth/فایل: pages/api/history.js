import { getHistoryByToken } from "../../lib/store";

export default function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  const auth = req.headers.authorization || "";
  const token = auth.replace("Bearer ", "");
  const history = getHistoryByToken(token);
  if (history === null) {
    return res.status(401).json({ error: "Not logged in" });
  }
  res.status(200).json({ history: history.reverse() });
}
