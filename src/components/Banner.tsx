/** @jsx jsx */
import { jsx, ThemeProvider, Container } from 'theme-ui'
import React from "react";

export const Banner: React.FC<{}> = ({ children }) => (
  <ThemeProvider
    theme={{
      styles: {
        p: {
          maxWidth: '40em',
          my: 4,
        },
        h1: {
          fontSize: [3, 3, 4],
          letterSpacing: '0',
          my: 4,
        },
        a: {
          variant: 'links.button',
          mr: 3,
          mb: 3,
        },
      },
    }}>
    <div
      sx={
        {
          pt: 4,
          pb: 4,
        }
      }>
      <Container>{children} </Container>
    </div>
  </ThemeProvider>
);

export default Banner;
