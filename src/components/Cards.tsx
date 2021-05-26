/** @jsx jsx */
import { jsx } from 'theme-ui'
import React from "react";
import Tiles, { TilesProps } from './Tiles'

export type CardsProps = TilesProps;

export const Cards: React.FC<TilesProps> = (props) => (
  <Tiles
    {...props}
    sx={{
      p: {
        m: 0,
      },
      a: {
        variant: 'text.heading',
        display: 'block',
        fontWeight: 'bold',
        fontSize: 3,
        color: 'inherit',
        textDecoration: 'none',
        ':hover,:focus': {
          color: 'primary',
        },
      },
    }}
  />
);

export default Cards;
