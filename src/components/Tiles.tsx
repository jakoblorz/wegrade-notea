/** @jsx jsx */
import { jsx, ThemeProvider } from 'theme-ui'
import React from "react";

export type TilesProps = React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> & {
  columns?: number,
  width?: number,
}

export const Tiles: React.FC<TilesProps> = ({ columns = 3, width, ...props }) => {
  const gridTemplateColumns = width
    ? `repeat(auto-fit, minmax(${width}px, 1fr))`
    : ['auto', `repeat(${columns}, 1fr)`]

  return (
    <ThemeProvider
      theme={{
        styles: {
          ol: {
            listStyle: 'none',
            display: 'grid',
            gridTemplateColumns,
            gridGap: 4,
            p: 0,
            m: 0,
          },
          ul: {
            listStyle: 'none',
            display: 'grid',
            gridTemplateColumns,
            gridGap: 4,
            p: 0,
            m: 0,
          },
        },
      }}>
      <div {...props} />
    </ThemeProvider>
  )
};

export default Tiles;
