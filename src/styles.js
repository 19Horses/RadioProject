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
  flex: ${(props) => (props.$selected ? "0" : "1")};
  transition: all 0.5s ease-in-out;
  &:hover {
    flex: ${(props) => props.$total};
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
  left: ${(props) =>
    props.$isLeft
      ? `-${props.$contents * props.$parentWidth}px`
      : `-${props.$contents * props.$parentWidth}px`};
  &:hover {
    cursor: pointer;
    ${(props) =>
      props.$isLeft ? "left: 0; right: 0;" : "right:0; left: -92%;"};
  }
`;

export const CursorTitle = styled.p`
  background-color: ${(props) => (props.hovered ? props.bgColor : "")};
  color: ${(props) => (props.hovered ? props.color : "black")};
  display: inline;
  font-size: ${(props) => props.fontSize || "inherit"};
  animation: ${(props) => (props.hovered ? fadeIn : "none")} 0.5s ease-out
    forwards;
  animation-delay: ${(props) => props.delay}s;
  opacity: 0;
  transform: translateY(100px);
`;
