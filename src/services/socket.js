/**
 * Socket.IO Client Service
 * Manages real-time communication with the server
 */

import { io } from 'socket.io-client';

// Initialize socket connection
const socket = io('http://localhost:5000', {
  withCredentials: true,
  autoConnect: false // Don't connect automatically
});

// Connect socket
export const connectSocket = (userId) => {
  if (!socket.connected) {
    socket.connect();
    socket.emit('join', userId);
    console.log('🔌 Socket connected for user:', userId);
  }
};

// Disconnect socket
export const disconnectSocket = () => {
  if (socket.connected) {
    socket.disconnect();
    console.log('🔌 Socket disconnected');
  }
};

// Listen for notifications
export const onNotification = (callback) => {
  socket.on('notification', callback);
};

// Remove notification listener
export const offNotification = () => {
  socket.off('notification');
};

// Test notification
export const testNotification = () => {
  socket.emit('test-notification', { message: 'Test' });
};

export default socket;
