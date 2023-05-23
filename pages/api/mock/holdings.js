import holdingsResponse from "../../../mocks/holdings.json"

export default function handler(req, res) {
  if (req.method === "GET") {
 
      res.status(200).json(holdingsResponse);
   
  }  else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
