import { useEffect, useState } from "react";
import { ref, onValue, onDisconnect, set, remove } from "firebase/database";
import { realtimeDb } from "../components/utils/Firebase";

export const useOnlineUsers = () => {
  const [onlineCount, setOnlineCount] = useState(0);

  useEffect(() => {
    // Generate a unique ID for this session
    const sessionId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const userRef = ref(realtimeDb, `online/${sessionId}`);
    const onlineRef = ref(realtimeDb, "online");

    // Set user as online
    set(userRef, {
      timestamp: Date.now(),
      lastSeen: Date.now(),
    });

    // Remove user when they disconnect
    onDisconnect(userRef).remove();

    // Update lastSeen every 30 seconds to keep connection alive
    const heartbeatInterval = setInterval(() => {
      set(userRef, {
        timestamp: Date.now(),
        lastSeen: Date.now(),
      });
    }, 30000);

    // Listen for changes in online users
    const unsubscribe = onValue(onlineRef, (snapshot) => {
      if (snapshot.exists()) {
        const users = snapshot.val();
        const now = Date.now();
        // Count users who were active in the last 60 seconds
        const activeUsers = Object.values(users).filter(
          (user) => now - user.lastSeen < 60000
        );
        setOnlineCount(activeUsers.length);
      } else {
        setOnlineCount(0);
      }
    });

    // Cleanup on unmount
    return () => {
      clearInterval(heartbeatInterval);
      unsubscribe();
      remove(userRef);
    };
  }, []);

  return onlineCount;
};

