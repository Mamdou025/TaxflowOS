import { type ReactNode, useEffect, useState } from 'react';
import { GitHubStarsProvider } from '@/components/github-stars-provider';

const GITHUB_REPO = 'vercel-labs/workflow-builder-template';

export function GitHubStarsLoader({ children }: { children: ReactNode }) {
  const [stars, setStars] = useState<number | null>(null);

  useEffect(() => {
    fetch(`https://api.github.com/repos/${GITHUB_REPO}`, {
      headers: { Accept: 'application/vnd.github.v3+json' },
    })
      .then((r) => r.ok ? r.json() : null)
      .then((d) => d && setStars(d.stargazers_count))
      .catch(() => null);
  }, []);

  return <GitHubStarsProvider stars={stars}>{children}</GitHubStarsProvider>;
}
