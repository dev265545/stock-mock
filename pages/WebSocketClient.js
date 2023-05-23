import { useEffect, useState } from "react";

export default function WebSocketClient() {
  const [prices, setPrices] = useState([]);

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:3000");

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setPrices(data.reverse());
    };

    return () => {
      socket.close();
    };
  }, []);

  return (
    <div>
      <h1>Price Data</h1>
      <ul>
        {prices.map((price) => (
          <li key={price.id}>
            {price.symbol}: ${price.price} (Timestamp: {price.timestamp})
          </li>
        ))}
      </ul>
    </div>
  );
}
