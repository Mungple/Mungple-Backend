declare module '*.png' {
  const value: string | ImageURISource;
  export default value;
}

declare module '*.gif' {
  const content: string | ImageURISource;
  export default content;
}
