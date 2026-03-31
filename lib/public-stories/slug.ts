export function slugifyStoryTitle(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
}

export function defaultStorySlug(storyId: string): string {
  return `story-${storyId.toLowerCase().replace(/[^a-z0-9]/g, "")}`;
}
