import { redirect } from '@/lib/router';

// The separate /home page was folded into Scope (the assistant on "/"): its
// launchpad elements (build · dashboard · run · recent work) now live in Scope's
// empty state. Keep /home working by redirecting to "/".
export default function HomePage() {
  redirect('/');
}
