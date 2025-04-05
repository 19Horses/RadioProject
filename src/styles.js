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
  overflow: hidden;
  opacity: ${(props) => (props.$selectedIndex !== null ? 1 : 0)};
  max-width: 100%;
  flex: ${(props) => (props.$selected ? "" :( props.$total / 4))};
  transition: all 0.5s ease-in-out;
  &:hover {
    flex: ${(props) => props.$total/2};
    z-index: 998;
  } 
  margin-left: 0.05vw;
  margin-right: 0.05vw;
  transition: all 0.5s ease-in-out;
  animation: ${(props) => (props.$selectedIndex !== null ? fadeOut : fadeIn)}
    0.5s ease-out forwards;
  animation-delay: ${(props) =>
    Math.abs(props.$contents - props.$total / 2) * 100}ms;
`;

export const PhotoContainer = styled.div`
  display: flex;
  position: absolute;
  min-width: 0; /* Ensures no Safari stretching */
  min-height: 0;
  width: ${(props) => (props.$isMobile ? "300px" : `500px`)};
  height: ${(props) => (props.$isMobile ? "300px" : `500px`)};
  transition: all 0.5s ease-in-out;
  left:0;
  /* &:hover {
    cursor: pointer;
    left: 0;
    right: 0;
  }; */
  
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
