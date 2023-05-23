
import profileResponse from "../../../mocks/profile.json"
export default function handler(req, res) {
  if (req.method === "GET") {
    console.log(req.url);
    res.status(200).json(profileResponse);
    
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
