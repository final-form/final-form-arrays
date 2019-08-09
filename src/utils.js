// @flow
export const escapeRegexTokens = (str: string): string =>
  str.replace(/([.\-[])/g, '\\$1')
