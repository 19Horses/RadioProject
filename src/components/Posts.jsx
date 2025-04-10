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
  const [user, setUser] = useState("");

  const forbiddenWords = [
    "fuck",
    "shit",
    "bitch",
    "asshole",
    "cunt",
    "dick",
    "pussy",
    "twat",
    "motherfucker",
    "nigger", // racial slur — always filter
    "nigga", // variant — should also be filtered
    "rape",
    "rapist",
    "faggot",
    "fag",
    "whore",
    "slut",
    "bastard",
    "cock",
    "dildo",
    "bollocks",
    "wanker",
    "tit",
    "cum",
    "spunk",
    "Elisha Olunaike",
  ]; // Replace with your own list

  const isClean = (text) => {
    const lower = text.toLowerCase();
    return !forbiddenWords.some((word) => lower.includes(word));
  };
  const isAlphanumeric = (str) => /^[a-zA-Z0-9]+$/.test(str);

  const formatDateFancy = (date) => {
    const day = date.getDate();
    const month = date.toLocaleString("default", { month: "long" });
    const year = date.getFullYear();

    const getDaySuffix = (d) => {
      if (d > 3 && d < 21) return "th";
      switch (d % 10) {
        case 1:
          return "st";
        case 2:
          return "nd";
        case 3:
          return "rd";
        default:
          return "th";
      }
    };

    const suffix = getDaySuffix(day);

    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;

    return `${day}${suffix} ${month} ${year} ${hours}:${minutes}${ampm}`;
  };

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

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // Prevent the default Enter action (new line) in the textarea
      handlePostSubmit(); // Submit the message
    }
  };

  const handlePostSubmit = async () => {
    // if (user.trim().length < 3 || !isAlphanumeric(user)) {
    //   alert(
    //     "Username must be at least 3 characters and only contain letters and numbers."
    //   );
    //   return;
    // }

    if (newMessage.trim().length < 3) {
      alert("Message must be at least 3 characters.");
      return;
    }

    if (!isClean(newMessage)) {
      alert("Please keep it clean! 😇");
      return;
    }

    try {
      await addDoc(collection(db, "posts"), {
        name: user,
        content: newMessage,
        timeofpost: serverTimestamp(),
      });
      setNewMessage(""); // Clear input after sending
    } catch (err) {
      console.error("Error posting message:", err);
    }
  };

  return (
    <div
      className="blog-content-text__desktop"
      style={{
        display: "flex",
        flexDirection: "column",
        padding: "1rem",
        boxSizing: "border-box",
      }}
    >
      <div
        className="all-chats"
        style={{
          maxHeight: "auto",
          width: "100%",
          overflowY: "auto",
          padding: "1rem",
          borderRadius: "8px",
          marginBottom: "1rem",
          bottom: "0",
        }}
      >
        {/* Display all posts */}
        {posts.map((post) => (
          <tr key={post.id} style={{ lineHeight: ".1" }}>
            <td className="sender-item">
              <p style={{ color: "rgb(255, 0, 90)" }}>
                <b
                  style={{
                    fontWeight: "1000",
                    color:
                      post.name === "Elisha Olunaike"
                        ? "rgb(255, 255, 255)"
                        : "",
                    backgroundColor:
                      post.name === "Elisha Olunaike" ? "rgb(0, 0, 0)" : "",
                  }}
                >
                  {post.name}
                </b>
              </p>
            </td>
            <td>
              <p
                style={{
                  color: "rgb(137, 137, 137)",
                  fontWeight: "100",
                  fontSize: "2.5vh",
                }}
              >
                {post.timeofpost && formatDateFancy(post.timeofpost.toDate())}
              </p>
              <p>{post.content}</p>
            </td>
          </tr>
        ))}
      </div>

      {/* Input field for new message */}
      <div className="input-container">
        <input
          type="text"
          value={user}
          onChange={(e) => setUser(e.target.value)}
          placeholder="username"
          style={{
            fontSize: "1rem",
            marginRight: "1rem",
          }}
        />
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          style={{
            fontSize: "1rem",
            marginRight: "1rem",
          }}
        />
        <button
          onClick={handlePostSubmit}
          style={{
            fontSize: "1rem",
            cursor: "pointer",
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Posts;
