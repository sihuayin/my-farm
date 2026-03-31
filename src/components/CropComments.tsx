import { useState, useEffect, useCallback } from 'react';
import { MessageSquare, Tag, Send, RefreshCw, ExternalLink, AlertCircle } from 'lucide-react';
import { githubAPI } from '../services/github';
import type { GitHubIssue, GitHubComment } from '../types/issue';
import { CROP_LABELS } from '../types/issue';

interface CropCommentsProps {
  cropName: string;
  cropId: string;
}

export default function CropComments({ cropName, cropId }: CropCommentsProps) {
  const [issues, setIssues] = useState<GitHubIssue[]>([]);
  const [comments, setComments] = useState<Map<number, GitHubComment[]>>(new Map());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newComment, setNewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState<GitHubIssue | null>(null);
  const [activeTab, setActiveTab] = useState<'comments' | 'labels'>('comments');

  // 加载与该作物相关的 Issues
  const loadIssues = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const foundIssues = await githubAPI.searchCropIssues(cropName);
      setIssues(foundIssues);

      // 如果有 issues，加载它们的评论
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
        // 默认选中第一个 issue
        setSelectedIssue(foundIssues[0]);
      } else {
        setSelectedIssue(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '加载评论失败');
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
      if (selectedIssue) {
        // 添加评论到现有 Issue
        await githubAPI.addComment(selectedIssue.number, newComment);
        // 刷新评论
        const updatedComments = await githubAPI.getIssueComments(selectedIssue.number);
        setComments((prev) => new Map(prev).set(selectedIssue.number, updatedComments));
      } else {
        // 创建新的 Issue
        const newIssue = await githubAPI.createCropIssue(cropName, cropId, newComment);
        setIssues((prev) => [newIssue, ...prev]);
        setSelectedIssue(newIssue);
        setComments((prev) => new Map(prev).set(newIssue.number, []));
      }
      setNewComment('');
    } catch (err) {
      setError(err instanceof Error ? err.message : '提交评论失败');
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
      // 刷新 issues
      await loadIssues();
    } catch (err) {
      setError(err instanceof Error ? err.message : '更新标签失败');
    }
  };

  const currentComments = selectedIssue
    ? comments.get(selectedIssue.number) || []
    : [];

  return (
    <section className="comments-section">
      <div className="comments-header">
        <h2 className="section-title">
          <MessageSquare size={20} /> 种植社区
        </h2>
        <button
          className="refresh-btn"
          onClick={loadIssues}
          disabled={loading}
          title="刷新评论"
        >
          <RefreshCw size={16} className={loading ? 'spin' : ''} />
        </button>
      </div>

      {error && (
        <div className="comments-error">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

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
          {/* Issue 列表 */}
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

          {/* 评论列表 */}
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

          {/* 发布评论 */}
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
        /* 标签管理 */
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
                  disabled={!selectedIssue}
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
    </section>
  );
}
