import { useState, useEffect, useRef } from "react";
import { db } from "./firebase.jsx";
import {
  collection,
  addDoc,
  serverTimestamp,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";

export default function Posts({ isMobile, playingGuest }) {
  const [posts, setPosts] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [user, setUser] = useState("");
  const [reply, setReply] = useState("");
  const [replyPostId, setReplyPostId] = useState(null);

  const postsEndRef = useRef(null); // Ref to scroll to the bottom

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

    return `${hours}:${minutes}${ampm}`;
  };

  // Fetch posts and listen for changes in real-time
  useEffect(() => {
    const q = query(collection(db, "posts"), orderBy("timeofpost", "desc")); // Sort by time (ascending)

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

  // Scroll to the bottom whenever posts are updated
  useEffect(() => {
    if (postsEndRef.current) {
      postsEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [posts]); // This effect will run whenever the posts are updated

  const handlePostSubmit = async () => {
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
        reply: reply,
        name: user,
        content: newMessage,
        timeofpost: serverTimestamp(),
      });
      setNewMessage(""); // Clear input after sending
      setReply(""); // Clear reply after sending
      setReplyPostId(null); // Clear reply post ID after sending
      postsEndRef.current?.scrollIntoView({ behavior: "smooth" });
    } catch (err) {
      console.error("Error posting message:", err);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // Prevent the default Enter action (new line) in the textarea
      handlePostSubmit(); // Submit the message
    }
  };

  return (
    <div
      className="blog-content-text__desktop"
      style={{
        marginBottom:
          playingGuest && isMobile === true
            ? "11%"
            : playingGuest == null && isMobile === true
            ? "3%"
            : "3%",
      }}
    >
      <div
        className="all-chats"
        style={{ width: playingGuest ? "75%" : "90%", paddingTop: "10%" }}
      >
        {/* Display all posts */}
        {posts.map((post) => (
          <div
            style={{
              height: "auto",
              width: "90%",
              paddingBottom: "2vh",
            }}
            key={post.id}
          >
            <p
              style={{
                color: "rgb(255, 0, 90)",
                lineHeight: "1vh",
                marginBottom: "1vh",
              }}
            >
              <b
                style={{
                  fontWeight: "1000",
                  color: "rgb(255, 255, 255)",
                  backgroundColor: "rgb(0, 0, 0)",
                  fontSize: isMobile ? "2vh" : "2.5vh",
                }}
              >
                {post.name} {post?.reply?.name && " → " + post.reply.name}
              </b>
              <p
                style={{
                  color: "rgb(137, 137, 137)",
                  fontWeight: "100",
                  fontSize: isMobile ? "1.3vh" : "2.5vh",
                  display: "inline", // Added inline style here
                  marginLeft: ".5vh", // Added margin for spacing between name and date
                }}
              >
                {post.timeofpost && formatDateFancy(post.timeofpost.toDate())}
              </p>

              <p
                style={{
                  color: "rgb(0, 0, 0)",
                  fontWeight: "100",
                  fontSize: isMobile ? "1.3vh" : "2.5vh",
                  display: "inline", // Added inline style here
                  marginLeft: "1vh", // Added margin for spacing between name and date
                  cursor: "pointer",
                }}
                onClick={() => {
                  setReply(post);
                  setReplyPostId(replyPostId === post.id ? null : post.id);
                }}
              >
                {replyPostId === post.id ? "Cancel" : "REPLY"}
              </p>
            </p>
            {post?.reply && (
              <p
                style={{
                  fontSize: isMobile ? "1vh" : "1.5vh",
                  fontStyle: "italic",
                  margin: "0",
                  marginBottom: ".5vh",
                  color: "rgb(255, 103, 156)",
                }}
              >
                {post?.reply?.name + ": '" + post?.reply?.content + "'"}
              </p>
            )}
            <p
              style={{
                fontWeight: "100",
                fontSize: isMobile ? "2vh" : "2.5vh",
                display: "inline",
                marginLeft: post?.reply?.name ? "1vw" : "", // Added margin for spacing between name and date
              }}
            >
              {post?.reply?.name && "↪ "}
              {post.content}
            </p>
          </div>
        ))}
      </div>

      <div ref={postsEndRef} />
      {/* Input field for new message */}
      <div
        className="input-container"
        style={{
          width: playingGuest && isMobile != null ? "90%" : "97%",
        }}
      >
        <input
          type="text"
          value={user}
          onChange={(e) => setUser(e.target.value)}
          placeholder="Name"
          style={{}}
        />
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message"
          style={{
            display: "block",
          }}
        />
        <button
          onClick={handlePostSubmit}
          style={{
            fontSize: "2vh",
            cursor: "pointer",
          }}
        >
          {reply ? "Reply" : "Send"}
        </button>
      </div>
    </div>
  );
}
