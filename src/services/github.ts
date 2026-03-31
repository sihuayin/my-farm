import type { GitHubIssue, GitHubComment, GitHubLabel } from '../types/issue';
import { ISSUE_TITLE_PREFIX } from '../types/issue';

// GitHub API 配置
// 可以通过环境变量配置，也可以在此设置默认值
const GITHUB_OWNER = import.meta.env.VITE_GITHUB_OWNER || 'sihuayin';
const GITHUB_REPO = import.meta.env.VITE_GITHUB_REPO || 'my-farm';
const GITHUB_TOKEN = import.meta.env.VITE_GITHUB_TOKEN || '';

const BASE_URL = 'https://api.github.com';

class GitHubAPI {
  private token: string;

  constructor(token?: string) {
    this.token = token || GITHUB_TOKEN;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const headers: HeadersInit = {
      Accept: 'application/vnd.github.v3+json',
      'Content-Type': 'application/json',
      ...(this.token && { Authorization: `Bearer ${this.token}` }),
      ...options.headers,
    };

    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(
        error.message || `GitHub API error: ${response.status}`
      );
    }

    return response.json();
  }

  // 获取仓库的 Labels
  async getLabels(): Promise<GitHubLabel[]> {
    return this.request<GitHubLabel[]>(
      `/repos/${GITHUB_OWNER}/${GITHUB_REPO}/labels?per_page=100`
    );
  }

  // 创建 Label
  async createLabel(label: {
    name: string;
    color: string;
    description: string;
  }): Promise<GitHubLabel> {
    return this.request<GitHubLabel>(
      `/repos/${GITHUB_OWNER}/${GITHUB_REPO}/labels`,
      {
        method: 'POST',
        body: JSON.stringify(label),
      }
    );
  }

  // 确保 Label 存在，不存在则创建
  async ensureLabel(label: {
    name: string;
    color: string;
    description: string;
  }): Promise<void> {
    try {
      await this.getLabels().then((labels) => {
        const exists = labels.some((l) => l.name === label.name);
        if (!exists) {
          return this.createLabel(label);
        }
      });
    } catch {
      // Label 可能已存在，忽略错误
    }
  }

  // 搜索与特定作物相关的 Issues
  async searchCropIssues(cropName: string): Promise<GitHubIssue[]> {
    const query = encodeURIComponent(
      `${ISSUE_TITLE_PREFIX}${cropName} in:title repo:${GITHUB_OWNER}/${GITHUB_REPO}`
    );
    const data = await this.request<{ items: GitHubIssue[] }>(
      `/search/issues?q=${query}`
    );
    return data.items;
  }

  // 获取单个 Issue
  async getIssue(issueNumber: number): Promise<GitHubIssue> {
    return this.request<GitHubIssue>(
      `/repos/${GITHUB_OWNER}/${GITHUB_REPO}/issues/${issueNumber}`
    );
  }

  // 创建新的作物评论 Issue
  async createCropIssue(
    cropName: string,
    cropId: string,
    content: string,
    labels: string[] = []
  ): Promise<GitHubIssue> {
    return this.request<GitHubIssue>(
      `/repos/${GITHUB_OWNER}/${GITHUB_REPO}/issues`,
      {
        method: 'POST',
        body: JSON.stringify({
          title: `${ISSUE_TITLE_PREFIX}${cropName}`,
          body: `## 作物信息\n- 作物名称: ${cropName}\n- 作物 ID: ${cropId}\n\n## 评论内容\n${content}`,
          labels,
        }),
      }
    );
  }

  // 获取 Issue 的评论
  async getIssueComments(issueNumber: number): Promise<GitHubComment[]> {
    return this.request<GitHubComment[]>(
      `/repos/${GITHUB_OWNER}/${GITHUB_REPO}/issues/${issueNumber}/comments?per_page=100`
    );
  }

  // 添加评论到 Issue
  async addComment(issueNumber: number, body: string): Promise<GitHubComment> {
    return this.request<GitHubComment>(
      `/repos/${GITHUB_OWNER}/${GITHUB_REPO}/issues/${issueNumber}/comments`,
      {
        method: 'POST',
        body: JSON.stringify({ body }),
      }
    );
  }

  // 更新 Issue（添加/移除 labels）
  async updateIssue(
    issueNumber: number,
    updates: {
      state?: 'open' | 'closed';
      labels?: string[];
    }
  ): Promise<GitHubIssue> {
    const body: Record<string, unknown> = {};
    if (updates.state) body.state = updates.state;
    if (updates.labels) body.labels = updates.labels;

    return this.request<GitHubIssue>(
      `/repos/${GITHUB_OWNER}/${GITHUB_REPO}/issues/${issueNumber}`,
      {
        method: 'PATCH',
        body: JSON.stringify(body),
      }
    );
  }

  // 添加 Label 到 Issue
  async addIssueLabel(
    issueNumber: number,
    labels: string[]
  ): Promise<GitHubLabel[]> {
    return this.request<GitHubLabel[]>(
      `/repos/${GITHUB_OWNER}/${GITHUB_REPO}/issues/${issueNumber}/labels`,
      {
        method: 'POST',
        body: JSON.stringify({ labels }),
      }
    );
  }

  // 移除 Issue 的 Label
  async removeIssueLabel(
    issueNumber: number,
    labelName: string
  ): Promise<GitHubLabel> {
    return this.request<GitHubLabel>(
      `/repos/${GITHUB_OWNER}/${GITHUB_REPO}/issues/${issueNumber}/labels/${encodeURIComponent(labelName)}`,
      {
        method: 'DELETE',
      }
    );
  }
}

// 导出单例
export const githubAPI = new GitHubAPI();

export default GitHubAPI;
