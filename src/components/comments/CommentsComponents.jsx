import React from "react";
import "./CommentsComponents.css";

// Toggle comments button component
export const ToggleCommentsButton = ({
  isExpanded,
  onClick,
  commentsCount,
}) => {
  return (
    <button onClick={onClick} className="toggle-comments-button">
      {isExpanded
        ? `(-) hide [${commentsCount}] comment${commentsCount !== 1 ? "s" : ""}`
        : `(+) show [${commentsCount}] comment${
            commentsCount !== 1 ? "s" : ""
          }`}
    </button>
  );
};

// Gradient overlay for comments list (top)
export const CommentsGradientOverlay = () => {
  return <div className="comments-gradient-overlay" />;
};

// Gradient overlay for comments list (bottom)
export const CommentsBottomGradientOverlay = () => {
  return (
    <div className="comments-bottom-gradient-wrapper">
      <div className="comments-bottom-gradient" />
    </div>
  );
};

// Comment input form component
export const CommentInputForm = ({
  chatUser,
  usernameInput,
  setUsernameInput,
  handleUsernameKeyDown,
  handleSetUsername,
  selectedText,
  setSelectedText,
  itemType,
  replyingTo,
  setReplyingTo,
  isListeningToThisMix,
  liveTimestamp,
  formatTrackTime,
  newComment,
  setNewComment,
  handleKeyDown,
  handleSubmit,
  isSubmitting,
  inputRef,
  isMobile,
}) => {
  return (
    <div
      className="comment-input-form"
      onClick={(e) => e.stopPropagation()}
      style={{ padding: isMobile ? "0px 0px" : "0px 7px" }}
    >
      {!chatUser ? (
        <div
          className="username-input-container"
          onClick={(e) => e.stopPropagation()}
        >
          <input
            type="text"
            value={usernameInput}
            onChange={(e) => setUsernameInput(e.target.value)}
            onKeyDown={handleUsernameKeyDown}
            onClick={(e) => e.stopPropagation()}
            onTouchStart={(e) => e.stopPropagation()}
            placeholder="enter username to comment..."
            maxLength={20}
            className="username-input"
          />
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleSetUsername();
            }}
            onTouchStart={(e) => e.stopPropagation()}
            disabled={!usernameInput.trim()}
            className="set-username-button"
          >
            SET
          </button>
        </div>
      ) : (
        <>
          {((selectedText && itemType === "radiogram") || replyingTo) && (
            <div className="reply-quote-info">
              <span className="reply-quote-text">
                <span style={{ color: "rgb(255,0, 71)" }}>
                  {replyingTo ? "⚖" : "▧"}{" "}
                </span>
                {replyingTo && (
                  <>
                    <span
                      onClick={() => setReplyingTo(null)}
                      className="reply-link"
                    >
                      <span className="bold-text">
                        {chatUser?.toUpperCase()}
                      </span>{" "}
                      replies to{" "}
                      <span className="bold-text">
                        {replyingTo.author?.toUpperCase()}
                      </span>
                      {!(selectedText && itemType === "radiogram") && ""}
                    </span>
                    {selectedText && itemType === "radiogram" && (
                      <span className="quote-and-connector"> and </span>
                    )}
                  </>
                )}
                {selectedText && itemType === "radiogram" && (
                  <span
                    onClick={() => setSelectedText("")}
                    className="quote-link"
                  >
                    {!replyingTo && (
                      <>
                        <span className="bold-text">
                          {chatUser?.toUpperCase()}
                        </span>{" "}
                      </>
                    )}
                    quotes{" "}
                    <span className="bold-text-padding">
                      "
                      {selectedText.length > 60
                        ? selectedText.substring(0, 60) + "..."
                        : selectedText}
                      "
                    </span>
                    {!replyingTo &&
                      isListeningToThisMix &&
                      liveTimestamp !== null && (
                        <>
                          {" "}
                          @{" "}
                          <span className="bold-text">
                            {formatTrackTime(liveTimestamp)}
                          </span>
                        </>
                      )}
                  </span>
                )}
              </span>
            </div>
          )}
          {isListeningToThisMix &&
            liveTimestamp !== null &&
            !replyingTo &&
            !(selectedText && itemType === "radiogram") && (
              <div className="live-timestamp-display">
                <span
                  style={{
                    color: "rgb(255, 0, 71)",
                    WebkitBackgroundClip: "unset",
                    backgroundClip: "unset",
                    WebkitTextFillColor: "rgb(255, 0, 71)",
                  }}
                >
                  {!replyingTo && "▧\u00A0"}
                </span>
                <span className="bold-text-padding-right">
                  {chatUser?.toUpperCase()}
                </span>
                said @
                <span className="bold-text">
                  {" "}
                  {formatTrackTime(liveTimestamp)}
                </span>
                <span></span>
              </div>
            )}
          <div className="comment-input-container">
            <input
              ref={inputRef}
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onKeyDown={handleKeyDown}
              onClick={(e) => e.stopPropagation()}
              onTouchStart={(e) => e.stopPropagation()}
              placeholder={
                replyingTo
                  ? `reply to ${replyingTo.author?.toUpperCase()}...`
                  : `${chatUser?.toUpperCase()} says...`
              }
              className="comment-input"
            />
            <button
              onClick={handleSubmit}
              disabled={!newComment.trim() || isSubmitting}
              className="post-button"
            >
              {isSubmitting ? "..." : "POST"}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

// Comments list component
export const CommentsList = ({
  comments,
  isMobile,
  formatTime,
  formatTrackTime,
  seekToTimestamp,
  playingGuest,
  itemId,
  highlightTextInArticle,
  clearHighlights,
  setMenuOpen,
  chatUser,
  setReplyingTo,
  replyingTo,
  inputRef,
  commentsEndRef,
}) => {
  const filteredComments = comments.filter(
    (comment) => comment.author?.trim().toUpperCase() !== "RADIOPROJECT2047",
  );

  return (
    <div
      className={`comments-scroll ${
        isMobile ? "comments-scroll-mobile" : "comments-scroll-desktop"
      }`}
    >
      <div
        className={
          filteredComments.length === 0
            ? "comments-list-wrapper-empty"
            : "comments-list-wrapper"
        }
        style={{
          paddingBottom: isMobile ? "0px" : "",
        }}
      >
        {filteredComments.length === 0 ? (
          <div
            className="no-comments-message"
            style={{ padding: isMobile ? "0px 0px" : "7px 2px" }}
          >
            No comments yet... start the discourse!
          </div>
        ) : (
          filteredComments.map((comment, index) => {
              // Check if next comment is on a different day
              const getDateOnly = (timestamp) => {
                if (!timestamp) return null;
                const date = timestamp.toDate
                  ? timestamp.toDate()
                  : new Date(timestamp);
                return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
              };

              const currentDate = getDateOnly(comment.createdAt);
              const nextComment = filteredComments[index + 1];
              const nextDate = nextComment
                ? getDateOnly(nextComment.createdAt)
                : null;
              const isDifferentDay = nextDate && currentDate !== nextDate;

              return (
                <div
                  key={comment.id}
                  className={`comment-item${isDifferentDay ? " different-day" : ""}`}
                >
                  <div className="comment-header">
                    <span className="comment-author">
                      <span style={{ color: "rgb(255,0, 71)" }}>
                        {comment.replyToAuthor ? "⚖" : "▧"}{" "}
                      </span>
                      {comment.author}
                    </span>
                    {chatUser && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setReplyingTo({
                            id: comment.id,
                            author: comment.author,
                            content: comment.content,
                          });
                          inputRef.current?.focus();
                        }}
                        className={`reply-button ${
                          replyingTo?.id === comment.id
                            ? "reply-button-active"
                            : ""
                        }`}
                      >
                        REPLY
                      </button>
                    )}
                    <span className="comment-timestamp">
                      {formatTime(comment.createdAt)}
                    </span>
                  </div>
                  {comment.trackTimestamp !== undefined &&
                    comment.trackTimestamp !== null && (
                      <div
                        onClick={() => {
                          if (playingGuest?.url === itemId) {
                            seekToTimestamp(comment.trackTimestamp);
                          }
                        }}
                        className={`track-timestamp-link ${
                          playingGuest?.url === itemId
                            ? ""
                            : "track-timestamp-link-default"
                        }`}
                        title={
                          playingGuest?.url === itemId
                            ? "Click to jump to this moment"
                            : "Play this mix to jump to timestamp"
                        }
                      >
                        <span className="track-timestamp-text">
                          →{" "}
                          <span className="track-timestamp-bold">
                            said @{formatTrackTime(comment.trackTimestamp)}
                          </span>
                        </span>
                        {playingGuest?.url === itemId && (
                          <span className="jump-to-text">JUMP TO</span>
                        )}
                      </div>
                    )}
                  {comment.replyToAuthor && (
                    <span className="reply-to-info">
                      →{" "}
                      <span className="reply-to-author">
                        {comment.replyToAuthor?.toUpperCase()}
                      </span>
                      {comment.replyToContent && (
                        <span className="reply-to-content">
                          {" "}
                          {comment.replyToContent.length > 40
                            ? "said " +
                              comment.replyToContent.substring(0, 40) +
                              "..."
                            : "said '" + comment.replyToContent + "'"}
                        </span>
                      )}
                    </span>
                  )}
                  {comment.highlightedText && (
                    <div
                      className="highlighted-text-link"
                      onClick={() => {
                        highlightTextInArticle(comment.highlightedText);
                        if (isMobile && setMenuOpen) {
                          setMenuOpen(false);
                        }
                      }}
                      onMouseLeave={() => {
                        clearHighlights();
                      }}
                    >
                      <span className="highlighted-text-content">
                        → quotes{" "}
                        <span>
                          "
                          {comment.highlightedText.length > 120
                            ? comment.highlightedText.substring(0, 120) + "..."
                            : comment.highlightedText}
                          "
                        </span>
                      </span>
                      <span className="see-quote-text">SEE QUOTE</span>
                    </div>
                  )}
                  {/* actual comment content */}
                  <p className="comment-content">{comment.content}</p>
                </div>
              );
            })
        )}
        <div ref={commentsEndRef} />
      </div>
    </div>
  );
};
