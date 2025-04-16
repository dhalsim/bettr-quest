export const pages = {
  home: { name: "Home", location: "/" },
  explore: { name: "Explore", location: "/explore" },
  timeline: { name: "Timeline", location: "/timeline" },
  connect: { name: "Connect", location: "/connect" },
  coachDirectory: { name: "Coach Directory", location: "/coach-directory" },
  profile: { name: "Profile", location: "/profile" },
  myQuest: { name: "My Quest", location: "/my-quest" },
  createQuest: { name: "Create Quest", location: "/create-quest" },
  quest: { name: "Quest", location: "/quest", path: "/quest/:id" },
  notifications: { name: "Notifications", location: "/notifications" },
  registerCoach: { name: "Register Coach", location: "/register-coach" },
  verifyProof: { name: "Verify Proof", location: "/verify-proof", path: "/verify-proof/:id" },
  premium: { name: "Premium", location: "/premium" }
} as const;

export type PageKey = keyof typeof pages;

export const getPreviousPageName = (): string | null => {
  if (typeof window === 'undefined') return null;
  
  // Get the previous path from history state
  const previousPath = window.history.state?.previousPath;
  console.log('previousPath from state', previousPath);
  
  if (!previousPath) return null;

  // Find the previous page by exact match or by checking if the path starts with the page location
  // but also ensuring it's not just matching the root path
  const previousPage = Object.values(pages).find(page => {
    if (page.location === '/') {
      return previousPath === '/';
    }
    return previousPath.startsWith(page.location);
  });

  console.log('previousPage found', previousPage?.name);
  return previousPage?.name || null;
};
