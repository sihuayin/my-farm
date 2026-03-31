// GitHub OAuth 配置
export const GITHUB_CLIENT_ID = import.meta.env.VITE_GITHUB_CLIENT_ID || '';
export const GITHUB_REDIRECT_URI = import.meta.env.VITE_GITHUB_REDIRECT_URI ||
  `${window.location.origin}/auth/github/callback`;

// 获取存储的 token
export function getStoredToken(): string | null {
  return localStorage.getItem('github_token');
}

// 存储 token
export function storeToken(token: string): void {
  localStorage.setItem('github_token', token);
}

// 清除 token
export function clearToken(): void {
  localStorage.removeItem('github_token');
}

// 检查是否已认证
export function isAuthenticated(): boolean {
  return !!getStoredToken();
}

// 生成 GitHub OAuth 授权 URL
export function getGitHubAuthUrl(state?: string): string {
  const params = new URLSearchParams({
    client_id: GITHUB_CLIENT_ID,
    redirect_uri: GITHUB_REDIRECT_URI,
    scope: 'repo,read:user',
    ...(state && { state }),
  });
  return `https://github.com/login/oauth/authorize?${params}`;
}
