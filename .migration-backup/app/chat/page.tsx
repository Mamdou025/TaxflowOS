import { redirect } from 'next/navigation';

// The assistant is the main page now — keep /chat working by redirecting to /.
export default function ChatPage() {
  redirect('/');
}
