export interface GitHubIssue {
  id: number;
  number: number;
  title: string;
  body: string;
  state: 'open' | 'closed';
  labels: GitHubLabel[];
  created_at: string;
  updated_at: string;
  comments: number;
  user: {
    login: string;
    avatar_url: string;
  };
}

export interface GitHubComment {
  id: number;
  body: string;
  created_at: string;
  updated_at: string;
  user: {
    login: string;
    avatar_url: string;
  };
}

export interface GitHubLabel {
  id: number;
  name: string;
  color: string;
  description: string;
}

// 作物评论的 Issue 标题格式
export const ISSUE_TITLE_PREFIX = '[作物评论]';

// 预定义的 Labels 用于标记作物状态
export const CROP_LABELS = [
  { name: '已种植', color: '22c55e', description: '已经在种植这种作物' },
  { name: '计划种植', color: '3b82f6', description: '计划种植这种作物' },
  { name: '经验分享', color: 'a855f7', description: '分享种植经验' },
  { name: '问题求助', color: 'ef4444', description: '种植中遇到问题' },
  { name: '收获记录', color: 'f59e0b', description: '记录收获情况' },
];
