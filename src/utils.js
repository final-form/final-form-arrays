// @flow

// From MDN: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions#Escaping
export const escapeRegexTokens = (string: string): string =>
  string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') // $& means the whole matched string
