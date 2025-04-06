import { keyframes, styled } from "styled-components";

export const fadeIn = keyframes`
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
`;
export const fadeOut = keyframes`
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
`;

export const GridContainer = styled.div`
  position: relative;
  display: flex;
  transition: all 0.4s ease-in-out;
  width: ${(props) =>
    props.$selected || props.$hovered ? "30%" : "15%"};
  transition: width .5s ease-in-out;
  box-sizing: border-box;
`;



export const PhotoContainer = styled.div`
  height: 50vh;
  aspect-ratio: 1 / 1;
  overflow: hidden;
  position: relative;
  cursor: pointer;
  transition: all 0.4s ease-in-out;

  
  img {
    height: 100%;
    object-fit: cover;
    object-position: left center; /* key: anchor to the left */
    transform: translateX(0%);  /* show left half only */
    transition: all 0.4s ease-in-out;
  }

`;



export const CursorTitle = styled.p`
  background-color: ${(props) => (props.$hovered ? props.$bgcolor : "")};
  color: ${(props) => (props.$hovered ? props.color : "black")};
  display: inline;
  font-size: ${(props) => props.fontSize || "inherit"};
  animation: ${fadeIn} 0.5s ease-out forwards;
  animation-delay: ${(props) => props.$delay}s;
  opacity: 0;
  transform: translateY(100px);
`;
