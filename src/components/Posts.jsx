import { useState, useEffect } from "react";
import { db } from "./firebase.jsx";
import {
  collection,
  addDoc,
  serverTimestamp,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  // Fetch posts and listen for changes in real-time
  useEffect(() => {
    const q = query(collection(db, "posts"), orderBy("timeofpost", "asc")); // Sort by time (ascending)

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const postsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPosts(postsData);
    });

    // Clean up the listener on unmount
    return () => unsubscribe();
  }, []);

  const handlePostSubmit = async () => {
    if (newMessage.trim() === "") return;

    try {
      await addDoc(collection(db, "posts"), {
        content: newMessage,
        timeofpost: serverTimestamp(),
      });
      setNewMessage(""); // Clear input after sending
    } catch (err) {
      console.error("Error posting message:", err);
    }
  };

  return (
    <div>
      {/* Display all posts */}
      {posts.map((post) => (
        <div key={post.id}>
          <h2>{post.name}</h2>
          <p>{post.timeofpost?.toDate().toLocaleString()}</p>
          <p>{post.content}</p>
        </div>
      ))}

      {/* Input field for new message */}
      <input
        type="text"
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        placeholder="Type a message..."
        style={{
          padding: "0.5rem",
          width: "70%",
          fontSize: "1rem",
          borderRadius: "4px",
          border: "1px solid #ccc",
          marginRight: "1rem",
        }}
      />
      <button
        onClick={handlePostSubmit}
        style={{
          padding: "0.5rem 1rem",
          fontSize: "1rem",
          borderRadius: "4px",
          backgroundColor: "#333",
          color: "#fff",
          border: "none",
          cursor: "pointer",
        }}
      >
        Send
      </button>
    </div>
  );
};

export default Posts;
