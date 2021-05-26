/** @jsx jsx */
import { jsx, Theme } from 'theme-ui'
import React from "react";

export type NoteProps = React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;

export const Note: React.FC<NoteProps> = props => (
  <aside
    {...props}
    sx={{
      // fontWeight: 'bold',
      padding: 3,
      bg: 'highlight',
      borderRadius: 4,
      borderLeft: (t: Theme) => `8px solid ${t.colors?.primary}`,
      p: {
        m: 0,
      },
    }}
  />
);

export default Note;
