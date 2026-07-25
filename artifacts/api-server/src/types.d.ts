// Extend Express.Request with the authenticated user ID.
// All requests are guaranteed to have a userId after the auth middleware
// in app.ts runs. Currently always "anonymous"; will be a real user ID
// when session-based auth is wired up.
declare namespace Express {
  interface Request {
    userId: string;
  }
}
