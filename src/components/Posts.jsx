import { useState, useEffect, useRef } from "react";
import { db } from "./Firebase.jsx";
import {
  collection,
  addDoc,
  serverTimestamp,
  onSnapshot,
  query,
  orderBy,
  limit,
} from "firebase/firestore";

export default function Posts({
  isMobile,
  playingGuest,
  chatUser,
  setChatUser,
  hasSetUser,
  setHasSetUser,
}) {
  const [posts, setPosts] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  // const [user, setUser] = useState("");
  const [reply, setReply] = useState("");
  const [replyPostId, setReplyPostId] = useState(null);
  // const [hasSetUser, setHasSetUser] = useState(false);

  const handleSetUser = () => {
    if (chatUser.trim().length < 2) {
      alert("USERNAME MUST HAVE AT LEAST 2 CHARACTERS");
      return;
    }
    setHasSetUser(true);
  };

  const postsEndRef = useRef(null); // Ref to scroll to the bottom

  const containsLink = (text) => {
    const urlRegex = /https?:\/\/|www\./i;
    return urlRegex.test(text);
  };

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
    "ElishaOlunaike",
    "RadioProject",
  ]; // Replace with your own list

  const isClean = (text) => {
    const lower = text.toLowerCase();
    return !forbiddenWords.some((word) => lower.includes(word));
  };

  const isAlphanumeric = (str) => /^[a-zA-Z0-9]+$/.test(str);

  const formatDateFancy = (date) => {
    const day = date.getDate();
    const month = date.getMonth() + 1; // getMonth() is zero-based
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");

    return `${day}/${month} ${hours}:${minutes}`;
  };

  // Fetch posts and listen for changes in real-time
  useEffect(() => {
    const q = query(
      collection(db, "posts"),
      orderBy("timeofpost", "desc"),
      limit(100)
    ); // Sort by time (ascending)

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
      alert("MESSAGE MUST HAVE AT LEAST 3 CHARACTERS LONG");
      return;
    }

    if (!isClean(newMessage)) {
      alert("KEEP IT CLEAN");
      return;
    }

    if (containsLink(newMessage)) {
      alert("NO LINKS ALLOWED");
      return;
    }

    try {
      await addDoc(collection(db, "posts"), {
        reply: reply,
        name: chatUser,
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
            ? "15%"
            : playingGuest == null && isMobile === true
            ? "5%"
            : "2%",
      }}
    >
      <div
        className="all-chats"
        style={{
          width:
            playingGuest && isMobile === true
              ? ""
              : playingGuest == null && isMobile === true
              ? "98%"
              : "75%",
          paddingTop: isMobile ? "" : "10%",
        }}
      >
        {/* Display all posts */}
        {posts.map((post) => (
          <div
            className="post"
            style={{
              height: "auto",
              width: "90%",
              paddingBottom: "1vh",
              transition: "all 3s",
            }}
            key={post.id}
          >
            <p
              style={{
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
                  fontSize: isMobile ? "1.4vh" : "2vh",
                  display: "inline", // Added inline style here
                  marginLeft: ".5vh", // Added margin for spacing between name and date
                }}
              >
                {post.timeofpost && formatDateFancy(post.timeofpost.toDate())}
              </p>
              {hasSetUser && (
                <p
                  className="reply-button"
                  style={{
                    fontWeight: "100",
                    fontSize: isMobile ? "1.4vh" : "2vh",
                    display: "inline", // Added inline style here
                    marginLeft: "1vh", // Added margin for spacing between name and date
                    cursor: "pointer",
                    color:
                      replyPostId === post.id
                        ? "rgb(255, 0, 90)"
                        : "rgb(0, 0, 0)",
                  }}
                  onClick={() => {
                    setReply(post);
                    if (replyPostId === post.id) {
                      setReplyPostId(null);
                    }
                    setReplyPostId(replyPostId === post.id ? null : post.id);
                  }}
                >
                  {replyPostId === post.id ? "Cancel" : "Reply"}
                </p>
              )}
            </p>
            {post?.reply && (
              <p
                style={{
                  fontSize: isMobile ? "1.9vh" : "2.4vh",
                  margin: "0",
                  marginBottom: ".5vh",
                  color: "rgb(255, 103, 156)",
                  fontWeight: "100",
                }}
              >
                {post?.reply?.name +
                  ' said... "' +
                  (post?.reply?.content.length > 50
                    ? post.reply.content.slice(0, 50) + "..."
                    : post.reply.content) +
                  '"'}
              </p>
            )}
            <p
              style={{
                fontWeight: "300",
                fontSize: isMobile ? "2vh" : "2.5vh",
                display: "inline",
                marginLeft: post?.reply?.name ? "1vw" : "", // Added margin for spacing between name and date
              }}
            >
              {post?.reply?.name && " →  "}
              {post.content}
            </p>
          </div>
        ))}
        <div
          style={{
            height: "auto",
            width: "90%",
            paddingBottom: "1vh",
          }}
        >
          <p
            style={{
              lineHeight: "1vh",
              marginBottom: "1vh",
            }}
          >
            <b
              style={{
                fontWeight: "1000",
                color: "rgb(247, 247, 247)",
                backgroundColor: "rgb(247, 247, 247)",
                fontSize: isMobile ? "2vh" : "2.5vh",
              }}
            >
              hi
            </b>
            <p
              style={{
                color: "rgb(247, 247, 247)",
                fontWeight: "100",
                fontSize: isMobile ? "1.3vh" : "2.5vh",
                display: "inline", // Added inline style here
                marginLeft: ".5vh", // Added margin for spacing between name and date
              }}
            >
              hi{" "}
            </p>
            {hasSetUser && (
              <p
                className="reply-button"
                style={{
                  fontWeight: "100",
                  fontSize: isMobile ? "1.4vh" : "2vh",
                  display: "inline", // Added inline style here
                  marginLeft: "1vh", // Added margin for spacing between name and date
                  cursor: "pointer",
                  color: "rgb(247, 247, 247)",
                  backgroundColor: "rgb(247, 247, 247)",
                }}
              >
                hi
              </p>
            )}
          </p>
          <p
            style={{
              fontSize: isMobile ? "5vh" : "1.5vh",
              fontStyle: "italic",
              margin: "0",
              marginBottom: ".5vh",
              color: "rgb(247, 247, 247)",
            }}
          >
            hi
          </p>
          <p
            style={{
              fontWeight: "100",
              fontSize: isMobile ? "5vh" : "2.5vh",
              display: "inline",
              color: "rgb(247, 247, 247)",
            }}
          >
            hi
          </p>
        </div>
      </div>

      <div ref={postsEndRef} />
      {/* Input field for new message */}
      <div
        className="input-container"
        style={{
          width: playingGuest && isMobile != null ? "90%" : "97%",
        }}
      >
        {!hasSetUser && (
          <div style={{ marginBottom: "1vh", width: isMobile ? "70%" : "50%" }}>
            <input
              type="text"
              value={chatUser}
              onChange={(e) => {
                // Get the input value
                const newValue = e.target.value;

                // Only allow alphanumeric characters and limit the length to 12
                if (/^[a-zA-Z0-9]*$/.test(newValue) && newValue.length <= 12) {
                  setChatUser(newValue); // Set the new value if it's valid
                }
              }}
              className={hasSetUser ? "" : "who-are-you"}
              placeholder="Enter name"
              style={{
                width: "auto",
                borderBottom: "0px solid black",
                paddingLeft: "0",
                fontWeight: "1000",
                backgroundColor: "transparent",
              }}
            />
            <button
              onClick={handleSetUser}
              style={{
                backgroundColor: "rgb(255, 0, 90)",
                color: "white",
                fontSize: "2vh",
                fontFamily: "Helvetica",
                cursor: "pointer",
              }}
            >
              <b>ENTER</b>
            </button>
          </div>
        )}
        {hasSetUser && (
          <>
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={
                replyPostId ? "→ respond to a message..." : "type a message..."
              }
              style={{
                display: "block",
                border: "1px solid black",
                marginTop: "auto",
                marginBottom: "auto",
                height: isMobile ? "2vh" : "3vh",
                width: isMobile ? "80%" : "30%",
              }}
            />
            <button
              onClick={handlePostSubmit}
              style={{
                fontSize: "2vh",
                cursor: "pointer",
                userSelect: "none",
                fontWeight: "bold",
              }}
            >
              {replyPostId ? "REPLY" : "SEND"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
