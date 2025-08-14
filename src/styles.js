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
  width: fit-content;
  
  transition: width .5s ease-in-out;
  box-sizing: border-box;

  @media (max-width: 768px) {
    width: 100%;
    justify-content: center;
  }
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

  @media (max-width: 768px) {
    width: 78vw;
    height: 78vw;
    aspect-ratio: auto;
    
    img {
      object-position: center center;
    }
  }

`;

export const PhotoContainerAll = styled.div`
  height: 22vh;
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

  @media (max-width: 768px) {
    width: 78vw;
    height: 78vw;
    aspect-ratio: auto;
    
    img {
      object-position: center center;
    }
  }

`;



export const CursorTitle = styled.p`
  background-color: ${(props) => (props.$hovered ? props.$bgcolor : "")};
  color: ${(props) => (props.$hovered ? props.color : "black")};
  display: ${(props) => (props.isMobile ? "inline" : "inline")};
  font-size: ${(props) => props.fontSize || "inherit"};
  animation: ${fadeIn} 0.5s ease-out forwards;
  animation-delay: ${(props) => props.$delay}s;
  opacity: 0;
  padding-bottom: .1vh;
  margin: 0vh;


`;

export const MainCursorTitle = styled.p`
  background-color: ${(props) => (props.$hovered ? props.$bgcolor : "")};
  color: ${(props) => (props.$hovered ? props.color : "black")};
  display: ${(props) => (props.isMobile ? "inline" : "inline")};
  font-size: ${(props) => props.fontSize || "inherit"};
  animation: ${fadeIn} 0.5s ease-out forwards;
  animation-delay: ${(props) => props.$delay}s;
  opacity: 0;
  padding-bottom: .1vh;
  margin: 0vh;
`;
