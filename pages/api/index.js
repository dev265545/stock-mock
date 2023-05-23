import login from "./user/login";
import register from "./user/register";

export default function handler(req, res) {
  if (req.method === "POST") {
    if (req.url === "/api/user/login") {
      login(req, res);
    } else if (req.url === "/api/user/register") {
      register(req, res);
    } else {
      res.status(404).json({ error: "Not Found" });
    }
  } else {
    res.status(404).json({ error: "Not Found" });
  }
}
