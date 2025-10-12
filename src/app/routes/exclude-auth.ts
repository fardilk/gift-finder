export const EXCLUDE_AUTH_PATHS = ['/login', '/register', '/forgot-password'];

export function isPublicPath(pathname: string) {
  return EXCLUDE_AUTH_PATHS.some((p) => pathname.startsWith(p));
}
