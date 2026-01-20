import { useState, useEffect, useRef } from "react";
import { db } from "../utils/Firebase.jsx";
import {
  collection,
  addDoc,
  serverTimestamp,
  onSnapshot,
  query,
  orderBy,
  where,
} from "firebase/firestore";
import { useAudio } from "../../AudioContext";
import {
  ToggleCommentsButton,
  CommentsGradientOverlay,
  CommentsBottomGradientOverlay,
  CommentInputForm,
  CommentsList,
} from "./CommentsComponents";
import "./CommentsComponents.css";

const Comments = ({
  itemId,
  itemType,
  chatUser,
  setChatUser,
  isMobile = false,
  playingGuest,
  menuOpen = false,
  setMenuOpen,
  bottomOffset = 243, // Height of elements below comments (title + summary + gaps)
}) => {
  const { audioRef } = useAudio();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [isExpanded, setIsExpanded] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [usernameInput, setUsernameInput] = useState("");
  const [isSettingUsername, setIsSettingUsername] = useState(false);
  const [liveTimestamp, setLiveTimestamp] = useState(null);
  const [replyingTo, setReplyingTo] = useState(null); // { id, author } of comment being replied to
  const [selectedText, setSelectedText] = useState(""); // Text selected from article
  const [commentsListVisible, setCommentsListVisible] = useState(!isMobile); // Delay on mobile
  const commentsEndRef = useRef(null);
  const inputRef = useRef(null);
  const highlightTimeoutRef = useRef(null);
  const highlightTouchListenerRef = useRef(null);

  // Capture selected text when user selects something on the page (only from article content)
  useEffect(() => {
    const handleSelectionChange = () => {
      const selection = window.getSelection();
      if (!selection || selection.rangeCount === 0) return;

      const text = selection.toString().trim();
      if (!text || text.length === 0 || text.length >= 500) return;

      // Check if selection is within article content (not bookmark/comments)
      const range = selection.getRangeAt(0);
      const container = range.commonAncestorContainer;

      // Find if the selection is inside an article area
      const articleSelectors = [
        ".article-scroll-container",
        ".article-content-description__mobile",
        ".radiogram-1",
        ".radiogram-2",
        '[class*="radiogram-"]',
      ];

      let isInArticle = false;
      let element =
        container.nodeType === Node.TEXT_NODE
          ? container.parentElement
          : container;

      while (element && element !== document.body) {
        for (const selector of articleSelectors) {
          if (element.matches && element.matches(selector)) {
            isInArticle = true;
            break;
          }
        }
        if (isInArticle) break;
        element = element.parentElement;
      }

      // Only capture if selection is from article content
      if (isInArticle) {
        setSelectedText(text);
      }
    };

    document.addEventListener("mouseup", handleSelectionChange);
    return () => document.removeEventListener("mouseup", handleSelectionChange);
  }, []);

  // Clear selected text when comment is submitted or panel closes
  useEffect(() => {
    if (!isExpanded) {
      setSelectedText("");
    }
  }, [isExpanded]);

  // Delay CommentsList rendering on mobile by 1 second, then fade/blur in
  useEffect(() => {
    if (isMobile) {
      const timer = setTimeout(() => {
        setCommentsListVisible(true);
      }, 200);
      return () => clearTimeout(timer);
    } else {
      setCommentsListVisible(true);
    }
  }, [isMobile]);

  // Scroll to bottom of comments list on mobile when it becomes visible or comments change
  useEffect(() => {
    if (isMobile && commentsListVisible) {
      // Small delay to ensure DOM is ready after fade-in animation
      const scrollTimer = setTimeout(() => {
        const scrollContainer = document.querySelector(
          ".comments-scroll-mobile"
        );
        if (scrollContainer) {
          scrollContainer.scrollTop = scrollContainer.scrollHeight;
        }
      }, 150);
      return () => clearTimeout(scrollTimer);
    }
  }, [isMobile, commentsListVisible, comments.length]);

  // Function to highlight text in the article
  const highlightTextInArticle = (text) => {
    if (!text) return;

    // Remove any existing highlights
    clearHighlights();

    // Try multiple selectors to find the article content
    const selectors = [
      ".article-scroll-container",
      ".article-content-description__mobile",
      ".radiogram-1",
      ".radiogram-2",
      '[class*="radiogram-"]',
    ];

    let articleContent = null;
    for (const selector of selectors) {
      articleContent = document.querySelector(selector);
      if (articleContent) break;
    }

    if (!articleContent) {
      return;
    }

    // Normalize search text - collapse multiple spaces to single space
    const searchText = text.trim().replace(/\s+/g, " ");
    const textNodes = [];

    const walker = document.createTreeWalker(
      articleContent,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode: (node) => {
          if (
            node.parentElement?.tagName === "SCRIPT" ||
            node.parentElement?.tagName === "STYLE" ||
            !node.textContent.trim()
          ) {
            return NodeFilter.FILTER_REJECT;
          }
          return NodeFilter.FILTER_ACCEPT;
        },
      }
    );

    let node;
    while ((node = walker.nextNode())) {
      textNodes.push(node);
    }

    // Helper to create highlight element
    const createHighlight = () => {
      const highlight = document.createElement("mark");
      highlight.className = "comment-highlight";
      highlight.style.cssText = `
          background: linear-gradient(90deg, rgb(255, 0, 90) 50%, transparent 50%);
          background-size: 200% 100%;
          background-position: 100% 0;
          color: rgb(255, 255, 255);
          animation: highlightSweep 0.5s ease-out forwards, highlightPulse 1.5s ease-in-out 0.5s infinite;
          padding: 5px 0px;
          line-height: 1.6;
          box-decoration-break: clone;
          -webkit-box-decoration-break: clone;
        `;

      if (!document.getElementById("highlight-animation-styles")) {
        const style = document.createElement("style");
        style.id = "highlight-animation-styles";
        style.textContent = `
          @keyframes highlightSweep {
            from { 
              background-position: 100% 0;
              color: inherit;
            }
            to { 
              background-position: 0% 0;
              color: #ececec;
            }
          }
          @keyframes highlightPulse {
            0%, 100% { 
              background-color: rgb(255, 0, 90);
              filter: brightness(1);
            }
            50% { 
              background-color: rgb(255, 60, 130);
              filter: brightness(1.2);
            }
          }
        `;
        document.head.appendChild(style);
      }
      return highlight;
    };

    // Helper to set up mobile auto-clear
    const setupMobileAutoClear = () => {
      if (isMobile) {
        // Clear after 4 seconds
        highlightTimeoutRef.current = setTimeout(() => {
          clearHighlights();
        }, 4000);

        // Clear on touch
        const touchHandler = () => {
          clearHighlights();
        };
        highlightTouchListenerRef.current = touchHandler;
        // Small delay to avoid immediate trigger from the tap that opened the quote
        setTimeout(() => {
          document.addEventListener("touchstart", touchHandler, { once: true });
        }, 100);
      }
    };

    // Try 1: Exact match in single text node
    for (const textNode of textNodes) {
      const nodeText = textNode.textContent;
      const index = nodeText.indexOf(searchText);

      if (index !== -1) {
        try {
          const range = document.createRange();
          range.setStart(textNode, index);
          range.setEnd(textNode, index + searchText.length);
          const highlight = createHighlight();
          range.surroundContents(highlight);
          setTimeout(
            () =>
              highlight.scrollIntoView({ behavior: "smooth", block: "center" }),
            100
          );
          setupMobileAutoClear();
          return;
        } catch (e) {
          continue;
        }
      }
    }

    // Try 2: Normalized match (collapse whitespace in both)
    for (const textNode of textNodes) {
      const normalizedNodeText = textNode.textContent.replace(/\s+/g, " ");
      const index = normalizedNodeText.indexOf(searchText);

      if (index !== -1) {
        // Find actual start position accounting for whitespace differences
        let actualStart = 0;
        let normalizedPos = 0;
        const originalText = textNode.textContent;

        while (normalizedPos < index && actualStart < originalText.length) {
          if (/\s/.test(originalText[actualStart])) {
            while (
              actualStart < originalText.length &&
              /\s/.test(originalText[actualStart])
            ) {
              actualStart++;
            }
            normalizedPos++;
          } else {
            actualStart++;
            normalizedPos++;
          }
        }

        try {
          const range = document.createRange();
          range.setStart(textNode, actualStart);
          range.setEnd(
            textNode,
            Math.min(actualStart + searchText.length + 10, originalText.length)
          );
          const highlight = createHighlight();
          range.surroundContents(highlight);
          setTimeout(
            () =>
              highlight.scrollIntoView({ behavior: "smooth", block: "center" }),
            100
          );
          setupMobileAutoClear();
          return;
        } catch (e) {
          continue;
        }
      }
    }

    // Try 3: Partial match (first 20 chars) for when text spans elements
    const partialSearch = searchText.substring(
      0,
      Math.min(20, searchText.length)
    );
    for (const textNode of textNodes) {
      const index = textNode.textContent.indexOf(partialSearch);
      if (index !== -1) {
        try {
          const range = document.createRange();
          range.setStart(textNode, index);
          range.setEnd(
            textNode,
            Math.min(index + searchText.length, textNode.textContent.length)
          );
          const highlight = createHighlight();
          range.surroundContents(highlight);
          setTimeout(
            () =>
              highlight.scrollIntoView({ behavior: "smooth", block: "center" }),
            100
          );
          setupMobileAutoClear();
          return;
        } catch (e) {
          continue;
        }
      }
    }
  };

  // Function to clear highlights
  const clearHighlights = () => {
    // Clear any existing timeout
    if (highlightTimeoutRef.current) {
      clearTimeout(highlightTimeoutRef.current);
      highlightTimeoutRef.current = null;
    }

    // Remove touch listener if exists
    if (highlightTouchListenerRef.current) {
      document.removeEventListener(
        "touchstart",
        highlightTouchListenerRef.current
      );
      highlightTouchListenerRef.current = null;
    }

    const highlights = document.querySelectorAll(".comment-highlight");
    highlights.forEach((highlight) => {
      const parent = highlight.parentNode;
      if (parent) {
        // Get all child nodes and move them to parent
        const fragment = document.createDocumentFragment();
        while (highlight.firstChild) {
          fragment.appendChild(highlight.firstChild);
        }
        parent.replaceChild(fragment, highlight);
        // Normalize to merge adjacent text nodes
        parent.normalize();
      }
    });
  };

  // Update live timestamp display when listening to this mix
  useEffect(() => {
    const isListening = itemType === "mix" && playingGuest?.url === itemId;

    if (isListening && isExpanded) {
      const updateTimestamp = () => {
        if (audioRef?.current) {
          setLiveTimestamp(Math.floor(audioRef.current.currentTime));
        }
      };

      updateTimestamp();
      const interval = setInterval(updateTimestamp, 1000);
      return () => clearInterval(interval);
    } else {
      setLiveTimestamp(null);
    }
  }, [itemType, playingGuest?.url, itemId, isExpanded, audioRef]);

  const forbiddenWords = [
    "nigger",
    "rape",
    "rapist",
    "faggot",
    "fag",
    "whore",
    "slut",
  ];

  const isClean = (text) => {
    const lower = text.toLowerCase();
    return !forbiddenWords.some((word) => lower.includes(word));
  };

  const containsLink = (text) => {
    const urlRegex = /https?:\/\/|www\./i;
    return urlRegex.test(text);
  };

  // Listen to comments for this specific item
  useEffect(() => {
    if (!itemId) return;

    const q = query(
      collection(db, "comments"),
      where("itemId", "==", itemId),
      orderBy("createdAt", "asc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const commentsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setComments(commentsData);
    });

    return () => unsubscribe();
  }, [itemId]);

  // Scroll to bottom when new comments arrive
  useEffect(() => {
    if (isExpanded && commentsEndRef.current) {
      commentsEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [comments, isExpanded]);

  const formatTime = (timestamp) => {
    if (!timestamp) return "";
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear().toString().slice(-2);
    return `${day}/${month}/${year} `;
  };

  // Format seconds to MM:SS for track timestamp
  const formatTrackTime = (seconds) => {
    if (seconds === null || seconds === undefined) return null;
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  // Check if currently listening to the same mix being commented on
  const isListeningToThisMix =
    itemType === "mix" && playingGuest?.url === itemId;

  // Get current playback time in seconds
  const getCurrentPlaybackTime = () => {
    if (isListeningToThisMix && audioRef?.current) {
      return Math.floor(audioRef.current.currentTime);
    }
    return null;
  };

  // Seek to timestamp when clicking on a timestamped comment
  const seekToTimestamp = (seconds) => {
    if (audioRef?.current && playingGuest?.url === itemId) {
      audioRef.current.currentTime = seconds;
    }
  };

  const handleSubmit = async () => {
    if (!newComment.trim() || !chatUser || isSubmitting) return;

    if (newComment.trim().length < 2) {
      alert("Comment must be at least 2 characters");
      return;
    }

    if (!isClean(newComment)) {
      alert("KEEP IT CLEAN");
      return;
    }

    if (containsLink(newComment)) {
      alert("NO LINKS ALLOWED");
      return;
    }

    setIsSubmitting(true);

    // Get current timestamp if listening to the same mix
    const trackTimestamp = getCurrentPlaybackTime();

    try {
      const commentData = {
        itemId,
        itemType,
        author: chatUser,
        content: newComment.trim(),
        createdAt: serverTimestamp(),
      };

      // Add track timestamp if listening to the same mix
      if (trackTimestamp !== null) {
        commentData.trackTimestamp = trackTimestamp;
      }

      // Add reply reference if replying to a comment
      if (replyingTo) {
        commentData.replyTo = replyingTo.id;
        commentData.replyToAuthor = replyingTo.author;
        commentData.replyToContent = replyingTo.content;
      }

      // Add highlighted text if there was a selection (for articles/radiograms)
      if (selectedText && itemType === "radiogram") {
        commentData.highlightedText = selectedText;
      }

      await addDoc(collection(db, "comments"), commentData);
      setNewComment("");
      setReplyingTo(null); // Clear reply state after posting
      setSelectedText(""); // Clear selected text after posting
    } catch (err) {
      console.error("Error posting comment:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleUsernameKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSetUsername();
    }
  };

  const handleSetUsername = () => {
    const trimmed = usernameInput.trim();
    if (trimmed.length < 2) {
      alert("Username must be at least 2 characters");
      return;
    }
    if (trimmed.length > 20) {
      alert("Username must be 20 characters or less");
      return;
    }
    if (!isClean(trimmed)) {
      alert("KEEP IT CLEAN");
      return;
    }
    if (containsLink(trimmed)) {
      alert("NO LINKS ALLOWED");
      return;
    }
    setChatUser(trimmed);
    setUsernameInput("");
    setIsSettingUsername(false);
  };

  return (
    <div
      style={{
        transition: "all 0.3s ease-out, opacity 0.3s ease",
        opacity: menuOpen && !isMobile ? 0 : 1,
        pointerEvents: menuOpen && !isMobile ? "none" : "auto",
        position: "relative",
        top: isMobile ? "" : "15px",
        width: "100%",
      }}
      onClick={(e) => e.stopPropagation()}
      onTouchStart={(e) => e.stopPropagation()}
    >
      {!isMobile && (
        <div
          style={{
            position: "absolute",
            top: "0px",
            left: 0,
            width: "auto",
            padding: 0,
            margin: 0,
            zIndex: 10,
          }}
        >
          <ToggleCommentsButton
            isExpanded={isExpanded}
            onClick={() => setIsExpanded(!isExpanded)}
            commentsCount={comments.length}
          />
        </div>
      )}
      {!isMobile && (
        <div
          style={{
            position: "absolute",
            top: "0px",
            left: 0,
            right: 0,
            zIndex: 1,
          }}
        >
          <CommentsGradientOverlay />
        </div>
      )}
      <div
        style={{
          height:
            isMobile && menuOpen
              ? "auto"
              : isMobile
              ? "340px"
              : isExpanded
              ? ""
              : "",
          maxHeight: isMobile && menuOpen ? "none" : isMobile ? "340px" : "",
          display: "relative",
          paddingTop: isMobile ? "" : "10px",
          overflow: isMobile && menuOpen ? "visible" : "visible",
          opacity: isMobile ? 1 : isExpanded ? 1 : 0,
          filter: isMobile
            ? "blur(0px)"
            : isExpanded
            ? "blur(0px)"
            : "blur(8px)",
          transition:
            isMobile && menuOpen
              ? "none"
              : "opacity 0.3s ease-out , filter 0.3s ease-out, height 0.3s ease-out, max-height 0.3s ease-out",
          pointerEvents: isMobile ? "auto" : isExpanded ? "auto" : "none",
        }}
        className="comments-container-wrapper"
      >
        <style>
          {`
            .comments-scroll::-webkit-scrollbar {
              display: none;
                      }
                    `}
        </style>
        {commentsListVisible ? (
          <div
            style={{
              opacity: 0,
              filter: "blur(10px)",
              animation: "fadeBlurIn 0.5s ease-in-out 0.25s forwards",
              marginBottom: isMobile ? "10px" : "0",
            }}
          >
            <CommentsList
              comments={comments}
              isMobile={isMobile}
              formatTime={formatTime}
              formatTrackTime={formatTrackTime}
              seekToTimestamp={seekToTimestamp}
              playingGuest={playingGuest}
              itemId={itemId}
              highlightTextInArticle={highlightTextInArticle}
              clearHighlights={clearHighlights}
              setMenuOpen={setMenuOpen}
              chatUser={chatUser}
              setReplyingTo={setReplyingTo}
              replyingTo={replyingTo}
              inputRef={inputRef}
              commentsEndRef={commentsEndRef}
            />
          </div>
        ) : null}

        {!isMobile && comments.length > 0 && <CommentsBottomGradientOverlay />}

        {isMobile ? (
          commentsListVisible ? (
            <div
              style={{
                opacity: 0,
                filter: "blur(10px)",
                animation: "fadeBlurIn 0.5s ease-in-out 0.2s forwards",
              }}
            >
              <CommentInputForm
                isMobile={isMobile}
                chatUser={chatUser}
                usernameInput={usernameInput}
                setUsernameInput={setUsernameInput}
                handleUsernameKeyDown={handleUsernameKeyDown}
                handleSetUsername={handleSetUsername}
                selectedText={selectedText}
                setSelectedText={setSelectedText}
                itemType={itemType}
                replyingTo={replyingTo}
                setReplyingTo={setReplyingTo}
                isListeningToThisMix={isListeningToThisMix}
                liveTimestamp={liveTimestamp}
                formatTrackTime={formatTrackTime}
                newComment={newComment}
                setNewComment={setNewComment}
                handleKeyDown={handleKeyDown}
                handleSubmit={handleSubmit}
                isSubmitting={isSubmitting}
                inputRef={inputRef}
              />
            </div>
          ) : null
        ) : (
          <CommentInputForm
            chatUser={chatUser}
            usernameInput={usernameInput}
            setUsernameInput={setUsernameInput}
            handleUsernameKeyDown={handleUsernameKeyDown}
            handleSetUsername={handleSetUsername}
            selectedText={selectedText}
            setSelectedText={setSelectedText}
            itemType={itemType}
            replyingTo={replyingTo}
            setReplyingTo={setReplyingTo}
            isListeningToThisMix={isListeningToThisMix}
            liveTimestamp={liveTimestamp}
            formatTrackTime={formatTrackTime}
            newComment={newComment}
            setNewComment={setNewComment}
            handleKeyDown={handleKeyDown}
            handleSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            inputRef={inputRef}
          />
        )}
      </div>
    </div>
  );
};

export default Comments;
