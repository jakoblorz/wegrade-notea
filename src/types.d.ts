type ThemeType = import("theme-ui").Theme;

declare module "typography-theme-*" {
  let Theme: Partial<ThemeType>;
  export default Theme;
}

declare module "*.mdx" {
  let MDXComponent: (props: any) => JSX.Element;
  export default MDXComponent;
}
declare module "@theme-ui/typography" {
  let toTheme: (partialTheme: Partial<ThemeType>) => ThemeType;
}
