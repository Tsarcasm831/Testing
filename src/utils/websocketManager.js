/**
 * Basic WebSocket manager for future multiplayer support.
 */
class WebSocketManager {
  constructor(url) {
    this.socket = new WebSocket(url);
    this.socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      // Handle incoming data (placeholder)
      console.log('WS message', data);
    };
  }

  sendPlayerUpdate(position) {
    if (this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify({ type: 'playerUpdate', position }));
    }
  }
}

export default WebSocketManager;
