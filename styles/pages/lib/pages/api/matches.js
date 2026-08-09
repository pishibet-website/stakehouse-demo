import { getMatches, getUserByToken } from "../../lib/store";

export default function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  const auth = req.headers.authorization || "";
  const token = auth.replace("Bearer ", "");
  const user = getUserByToken(token);
  res.status(200).json({ matches: getMatches(), balance: user ? user.balance : null });
}
