/** Block obvious external links in survivor comments (MVP). */
export function commentContainsBlockedPattern(text: string): boolean {
  return /https?:\/\/|www\./i.test(text);
}
