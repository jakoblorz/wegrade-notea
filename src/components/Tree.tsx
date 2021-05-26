/** @jsx jsx */
import { jsx } from "theme-ui";
import React, { useState, useRef, memo, useEffect, useMemo } from "react";
import { useSpring, animated } from "react-spring";

import styled from "@emotion/styled";
import { usePrevious } from "../hooks/usePrevious";
import ResizeObserver from "resize-observer-polyfill";

const BaseIcon: React.FC<{ d: string } & React.SVGProps<SVGSVGElement>> = (
  props
) => (
  <svg {...props} sx={{ color: "text" }} viewBox="64 -65 897 897">
    <g>
      <path d={props.d} />
    </g>
  </svg>
);

const Minus: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <BaseIcon
    {...props}
    d="M888 760v0v0v-753v0h-752v0v753v0h752zM888 832h-752q-30 0 -51 -21t-21 -51v-753q0 -29 21 -50.5t51 -21.5h753q29 0 50.5 21.5t21.5 50.5v753q0 30 -21.5 51t-51.5 21v0zM732 347h-442q-14 0 -25 10.5t-11 25.5v0q0 15 11 25.5t25 10.5h442q14 0 25 -10.5t11 -25.5v0
q0 -15 -11 -25.5t-25 -10.5z"
  />
);

const Plus: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <BaseIcon
    {...props}
    d="M888 760v0v0v-753v0h-752v0v753v0h752zM888 832h-752q-30 0 -51 -21t-21 -51v-753q0 -29 21 -50.5t51 -21.5h753q29 0 50.5 21.5t21.5 50.5v753q0 30 -21.5 51t-51.5 21v0zM732 420h-184v183q0 15 -10.5 25.5t-25.5 10.5v0q-14 0 -25 -10.5t-11 -25.5v-183h-184
q-15 0 -25.5 -11t-10.5 -25v0q0 -15 10.5 -25.5t25.5 -10.5h184v-183q0 -15 11 -25.5t25 -10.5v0q15 0 25.5 10.5t10.5 25.5v183h184q15 0 25.5 10.5t10.5 25.5v0q0 14 -10.5 25t-25.5 11z"
  />
);

const Close: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <BaseIcon
    {...props}
    d="M717.5 589.5q-10.5 10.5 -25.5 10.5t-26 -10l-154 -155l-154 155q-11 10 -26 10t-25.5 -10.5t-10.5 -25.5t11 -25l154 -155l-154 -155q-11 -10 -11 -25t10.5 -25.5t25.5 -10.5t26 10l154 155l154 -155q11 -10 26 -10t25.5 10.5t10.5 25t-11 25.5l-154 155l154 155
q11 10 11 25t-10.5 25.5zM888 760v0v0v-753v0h-752v0v753v0h752zM888 832h-752q-30 0 -51 -21t-21 -51v-753q0 -29 21 -50.5t51 -21.5h753q29 0 50.5 21.5t21.5 50.5v753q0 30 -21.5 51t-51.5 21v0z"
  />
);

const Frame = styled("div")`
  padding: 4px 0px 0px 0px;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow-x: hidden;
  vertical-align: middle;
`;

const Title = styled("span")`
  vertical-align: middle;
`;

const Content = styled(animated.div)`
  will-change: transform, opacity, height;
  margin-left: 6px;
  padding: 0px 0px 0px 14px;
  border-left: 1px dashed rgba(255, 255, 255, 0.4);
  overflow: hidden;
`;

const Icons = { Plus, Minus, Close };

const toggle = {
  width: "1em",
  height: "1em",
  marginRight: 10,
  cursor: "pointer",
  verticalAlign: "middle",
};

export type TreeProps = {
  children?: any;
  name: any;
  style?: any;
  defaultOpen?: boolean;
  selected?: boolean;
  onLoad?: () => void;
  onClick?: () => void;
  view?: (
    state: "open" | "close" | "disabled"
  ) => React.FC<React.SVGProps<SVGSVGElement>>;
};

const TreeComponent: React.FC<TreeProps> = ({
  children,
  name,
  style,
  defaultOpen = false,
  selected = false,
  onClick = () => {},
  onLoad = () => {},
  view = (state) => {
    switch (state) {
      case "close":
        return Icons.Minus;
      case "open":
        return Icons.Plus;
      case "disabled":
        return Icons.Close;
    }
  },
}) => {
  // Measure content sizes
  const ref = useRef<any>();
  const [{ height: viewHeight }, set] = useState({
    left: 0,
    top: 0,
    width: 0,
    height: 0,
  });
  const [ro] = useState(
    () => new ResizeObserver(([entry]) => set(entry.contentRect))
  );
  useEffect(() => {
    if (ref.current) ro.observe(ref.current);
    return () => ro.disconnect();
  }, [ro]);

  // Basic states
  const [isOpen, setOpen] = useState(selected || defaultOpen);
  useEffect(() => {
    if (isOpen) {
      onLoad();
    }
  }, [isOpen, onLoad]);
  const previous = usePrevious(isOpen);

  // Animation values
  const { height, opacity, transform } = useSpring({
    from: { height: 0, opacity: 0, transform: "translate3d(20px,0,0)" },
    to: {
      height: isOpen ? viewHeight : 0,
      opacity: isOpen ? 1 : 0,
      transform: `translate3d(${isOpen ? 0 : 20}px,0,0)`,
    },
  }) as any;

  const Icon = useMemo(
    (): React.FC<React.SVGProps<SVGSVGElement>> =>
      view(children ? (isOpen ? "close" : "open") : "disabled"),
    [children, isOpen, view]
  );
  return (
    <Frame>
      <Icon
        sx={{ color: "text" }}
        style={{ ...toggle, opacity: children ? 1 : 0.3 }}
        onClick={() => setOpen(!isOpen)}
      />
      <Title
        sx={{
          color: "text",
          cursor: "pointer",
          ...(selected
            ? {
                fontWeight: 600,
              }
            : {}),
        }}
        style={style}
        onClick={(e) =>
          void (e.preventDefault(),
          onLoad(),
          onClick(),
          !isOpen && setOpen(true))
        }
      >
        {name}
      </Title>
      <Content
        style={{
          opacity,
          height: isOpen && previous === isOpen ? "auto" : height,
        }}
      >
        <animated.div
          sx={{ color: "text" }}
          {...transform}
          ref={ref}
          children={children}
        />
      </Content>
    </Frame>
  );
};

export const Tree = memo(TreeComponent);
export default Tree;
