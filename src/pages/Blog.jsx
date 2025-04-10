import Posts from "../components/Posts";

export const Blog = ({ isMobile, playingGuest }) => {
  return (
    <div className="blog-container">
      <Posts isMobile={isMobile} playingGuest={playingGuest} />
    </div>
  );
};
