import CanvasStore from "@/store/canvas.store";
import { PropsWithChildren } from "react";
import { inBounds } from "./utils";

export interface CanvasPosition {
  top: number;
  left: number;
  width: number;
  height: number;
}

export const Position = ({
  left,
  top,
  width,
  height,
  children,
}: PropsWithChildren<CanvasPosition>) => {
  const screen = CanvasStore.screen;
  if (
    inBounds(
      { left, top, height, width },
      {
        left: screen.x,
        top: screen.y,
        width: screen.width,
        height: screen.height,
      }
    )
  ) {
    return (
      <div
        className="absolute inline-block"
        style={{
          left: `${left - screen.x}px`,
          top: `${top - screen.y}px`,
        }}
      >
        {children}
      </div>
    );
  } else return null;
};