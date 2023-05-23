
import placeOrderResponse from "../../../mock/order_placed.json";

export default function handler(req, res) {
  if (req.method === "POST") {
  
      res.status(200).json(placeOrderResponse);
   
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
