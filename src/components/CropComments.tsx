import { useState, useEffect, useCallback } from 'react';
import { MessageSquare, Tag, Send, RefreshCw, ExternalLink, AlertCircle } from 'lucide-react';

// GitHub Icon SVG 组件
function GithubIcon({ size = 24, className = '' }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
    </svg>
  );
}
import { githubAPI, AuthRequiredError } from '../services/github';
import { getGitHubAuthUrl, getStoredToken } from '../services/auth';
import type { GitHubIssue, GitHubComment } from '../types/issue';
import { CROP_LABELS } from '../types/issue';

interface CropCommentsProps {
  cropName: string;
  cropId: string;
}

// OAuth 回调处理组件
function GitHubAuthCallback() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    const state = params.get('state');
    const storedState = sessionStorage.getItem('github_oauth_state');

    if (code && state === storedState) {
      sessionStorage.setItem('github_auth_code', code);
      sessionStorage.removeItem('github_oauth_state');

      const returnUrl = sessionStorage.getItem('github_auth_return_url') || '/';
      window.location.href = returnUrl;
    }
  }, []);

  return (
    <section className="comments-section">
      <div className="auth-callback">
        <p>正在处理 GitHub 授权...</p>
      </div>
    </section>
  );
}

export default function CropComments({ cropName, cropId }: CropCommentsProps) {
  const [issues, setIssues] = useState<GitHubIssue[]>([]);
  const [comments, setComments] = useState<Map<number, GitHubComment[]>>(new Map());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [authError, setAuthError] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState<GitHubIssue | null>(null);
  const [activeTab, setActiveTab] = useState<'comments' | 'labels'>('comments');
  const [githubConnected, setGithubConnected] = useState(false);

  // 处理 GitHub 认证
  const handleGitHubAuth = useCallback(() => {
    const state = crypto.randomUUID();
    sessionStorage.setItem('github_oauth_state', state);
    sessionStorage.setItem('github_auth_return_url', window.location.pathname);
    window.location.href = getGitHubAuthUrl(state);
  }, []);

  // 加载与该作物相关的 Issues
  const loadIssues = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      setAuthError(false);

      const hasToken = !!getStoredToken() || !!import.meta.env.VITE_GITHUB_TOKEN;
      setGithubConnected(hasToken);

      const foundIssues = await githubAPI.searchCropIssues(cropName);
      setIssues(foundIssues);

      if (foundIssues.length > 0) {
        const commentsMap = new Map<number, GitHubComment[]>();
        await Promise.all(
          foundIssues.map(async (issue) => {
            try {
              const issueComments = await githubAPI.getIssueComments(issue.number);
              commentsMap.set(issue.number, issueComments);
            } catch {
              commentsMap.set(issue.number, []);
            }
          })
        );
        setComments(commentsMap);
        setSelectedIssue(foundIssues[0]);
      } else {
        setSelectedIssue(null);
      }
    } catch (err) {
      if (err instanceof AuthRequiredError) {
        setAuthError(true);
        setError('需要 GitHub 授权才能发表评论');
      } else {
        setError(err instanceof Error ? err.message : '加载评论失败');
      }
    } finally {
      setLoading(false);
    }
  }, [cropName]);

  useEffect(() => {
    loadIssues();
  }, [loadIssues]);

  // 创建新评论
  const handleSubmitComment = async () => {
    if (!newComment.trim()) return;

    try {
      setSubmitting(true);
      setError(null);
      setAuthError(false);

      if (selectedIssue) {
        await githubAPI.addComment(selectedIssue.number, newComment);
        const updatedComments = await githubAPI.getIssueComments(selectedIssue.number);
        setComments((prev) => new Map(prev).set(selectedIssue.number, updatedComments));
      } else {
        const newIssue = await githubAPI.createCropIssue(cropName, cropId, newComment);
        setIssues((prev) => [newIssue, ...prev]);
        setSelectedIssue(newIssue);
        setComments((prev) => new Map(prev).set(newIssue.number, []));
      }
      setNewComment('');
      setGithubConnected(true);
    } catch (err) {
      if (err instanceof AuthRequiredError) {
        setAuthError(true);
        setError('需要 GitHub 授权才能发表评论');
      } else {
        setError(err instanceof Error ? err.message : '提交评论失败');
      }
    } finally {
      setSubmitting(false);
    }
  };

  // 切换 Issue 标签状态
  const toggleIssueLabel = async (issue: GitHubIssue, labelName: string) => {
    try {
      const hasLabel = issue.labels.some((l) => l.name === labelName);
      if (hasLabel) {
        await githubAPI.removeIssueLabel(issue.number, labelName);
      } else {
        await githubAPI.addIssueLabel(issue.number, [labelName]);
      }
      await loadIssues();
    } catch (err) {
      if (err instanceof AuthRequiredError) {
        setAuthError(true);
        setError('需要 GitHub 授权才能管理标签');
      } else {
        setError(err instanceof Error ? err.message : '更新标签失败');
      }
    }
  };

  const currentComments = selectedIssue
    ? comments.get(selectedIssue.number) || []
    : [];

  // GitHub 未连接时的提示
  const renderAuthPrompt = () => (
    <div className="auth-prompt">
      <div className="auth-prompt-content">
        <GithubIcon size={48} className="auth-icon" />
        <h3>连接 GitHub</h3>
        <p>
          登录 GitHub 账号后，你可以在此分享种植经验、提问并标记你正在种植的作物。
        </p>
        <button className="github-auth-btn" onClick={handleGitHubAuth}>
          <GithubIcon size={20} />
          使用 GitHub 登录
        </button>
      </div>
    </div>
  );

  return (
    <section className="comments-section">
      <div className="comments-header">
        <h2 className="section-title">
          <MessageSquare size={20} /> 种植社区
        </h2>
        <div className="header-actions">
          {githubConnected && (
            <span className="connected-badge">
              <GithubIcon size={14} />
              已连接
            </span>
          )}
          <button
            className="refresh-btn"
            onClick={loadIssues}
            disabled={loading}
            title="刷新评论"
          >
            <RefreshCw size={16} className={loading ? 'spin' : ''} />
          </button>
        </div>
      </div>

      {error && (
        <div className={`comments-error ${authError ? 'auth-required' : ''}`}>
          <AlertCircle size={16} />
          <span>{error}</span>
          {authError && (
            <button className="auth-error-btn" onClick={handleGitHubAuth}>
              去授权
            </button>
          )}
        </div>
      )}

      {!githubConnected && !loading && (
        renderAuthPrompt()
      )}

      {githubConnected && (
        <>
          <div className="comments-tabs">
            <button
              className={`tab-btn ${activeTab === 'comments' ? 'active' : ''}`}
              onClick={() => setActiveTab('comments')}
            >
              <MessageSquare size={16} />
              评论 ({issues.length})
            </button>
            <button
              className={`tab-btn ${activeTab === 'labels' ? 'active' : ''}`}
              onClick={() => setActiveTab('labels')}
            >
              <Tag size={16} />
              标记
            </button>
          </div>

          {activeTab === 'comments' ? (
            <>
              {issues.length > 0 && (
                <div className="issue-selector">
                  <select
                    value={selectedIssue?.number || ''}
                    onChange={(e) => {
                      const issue = issues.find((i) => i.number === Number(e.target.value));
                      setSelectedIssue(issue || null);
                    }}
                  >
                    {issues.map((issue) => (
                      <option key={issue.number} value={issue.number}>
                        #{issue.number} - {issue.title} ({issue.comments} 条评论)
                      </option>
                    ))}
                  </select>
                  <a
                    href={`https://github.com/${import.meta.env.VITE_GITHUB_OWNER || 'sihuayin'}/${import.meta.env.VITE_GITHUB_REPO || 'my-farm'}/issues/${selectedIssue?.number}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="github-link"
                    title="在 GitHub 上查看"
                  >
                    <ExternalLink size={16} />
                  </a>
                </div>
              )}

              {loading ? (
                <div className="comments-loading">加载中...</div>
              ) : currentComments.length > 0 ? (
                <div className="comments-list">
                  {currentComments.map((comment) => (
                    <div key={comment.id} className="comment-item">
                      <img
                        src={comment.user.avatar_url}
                        alt={comment.user.login}
                        className="comment-avatar"
                      />
                      <div className="comment-content">
                        <div className="comment-header">
                          <span className="comment-author">{comment.user.login}</span>
                          <span className="comment-date">
                            {new Date(comment.created_at).toLocaleDateString('zh-CN')}
                          </span>
                        </div>
                        <p className="comment-body">{comment.body}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="comments-empty">
                  还没有评论，来发表第一条评论吧！
                </div>
              )}

              <div className="comment-form">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder={
                    selectedIssue
                      ? '发表你的评论...'
                      : `这是关于 "${cropName}" 的第一个评论，开始讨论吧！`
                  }
                  rows={3}
                />
                <button
                  className="submit-btn"
                  onClick={handleSubmitComment}
                  disabled={submitting || !newComment.trim()}
                >
                  <Send size={16} />
                  {submitting ? '提交中...' : '发布'}
                </button>
              </div>
            </>
          ) : (
            <div className="labels-panel">
              <p className="labels-description">
                使用标签来标记你与这种作物的关系：
              </p>
              <div className="labels-list">
                {CROP_LABELS.map((label) => {
                  const isActive = selectedIssue?.labels.some((l) => l.name === label.name);
                  return (
                    <button
                      key={label.name}
                      className={`label-chip ${isActive ? 'active' : ''}`}
                      onClick={() => selectedIssue && toggleIssueLabel(selectedIssue, label.name)}
                      disabled={!selectedIssue || submitting}
                      style={{
                        '--label-color': `#${label.color}`,
                      } as React.CSSProperties}
                    >
                      <span
                        className="label-dot"
                        style={{ backgroundColor: `#${label.color}` }}
                      />
                      {label.name}
                    </button>
                  );
                })}
              </div>
              {!selectedIssue && issues.length === 0 && (
                <p className="labels-hint">
                  先发布一条评论后，就可以使用标签来标记作物状态了。
                </p>
              )}
            </div>
          )}
        </>
      )}
    </section>
  );
}

// 导出回调组件供路由使用
export { GitHubAuthCallback };
