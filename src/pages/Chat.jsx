import Posts from "../components/forms/Posts";

export const Chat = ({
  isMobile,
  playingGuest,
  setChatUser,
  chatUser,
  hasSetUser,
  setHasSetUser,
}) => {
  return (
    <div className="blog-container">
      <Posts
        isMobile={isMobile}
        playingGuest={playingGuest}
        setChatUser={setChatUser}
        chatUser={chatUser}
        hasSetUser={hasSetUser}
        setHasSetUser={setHasSetUser}
      />
    </div>
  );
};
