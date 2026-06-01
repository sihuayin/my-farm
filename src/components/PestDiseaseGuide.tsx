import { AlertTriangle, Bug, Search, ShieldCheck, X } from 'lucide-react';
import { useState } from 'react';
import { problemTypeLabels, type CropProblem } from '../data/cropProblems';

interface Props {
  problems: CropProblem[];
}

const problemIcons = {
  disease: ShieldCheck,
  pest: Bug,
  care: AlertTriangle,
};

export default function PestDiseaseGuide({ problems }: Props) {
  const [query, setQuery] = useState('');

  if (problems.length === 0) return null;

  const normalizedQuery = query.trim().toLowerCase();
  const filteredProblems = normalizedQuery
    ? problems.filter((problem) =>
        [
          problem.name,
          problemTypeLabels[problem.type],
          problem.symptoms,
          problem.response,
          problem.prevention,
        ]
          .join(' ')
          .toLowerCase()
          .includes(normalizedQuery)
      )
    : problems;

  const symptomTags = ['叶片', '虫', '腐烂', '发黄', '徒长', '少花'];

  return (
    <section id="pests" className="pest-guide">
      <h2 className="section-title">
        <Bug size={20} />
        常见病虫害与应对
      </h2>
      <div className="pest-diagnosis">
        <div className="pest-search-box">
          <Search size={18} />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="输入状态表现，如叶片发黄、虫、腐烂..."
          />
          {query && (
            <button onClick={() => setQuery('')} title="清除症状">
              <X size={16} />
            </button>
          )}
        </div>
        <div className="symptom-tags">
          {symptomTags.map((tag) => (
            <button
              key={tag}
              className={query === tag ? 'active' : ''}
              onClick={() => setQuery(query === tag ? '' : tag)}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>
      <div className="pest-grid">
        {filteredProblems.map((problem) => {
          const Icon = problemIcons[problem.type];
          return (
            <article key={problem.name} className={`pest-card ${problem.type}`}>
              <div className="pest-card-header">
                <Icon size={20} />
                <div>
                  <span>{problemTypeLabels[problem.type]}</span>
                  <h3>{problem.name}</h3>
                </div>
              </div>
              <dl className="pest-detail-list">
                <div>
                  <dt>状态表现</dt>
                  <dd>{problem.symptoms}</dd>
                </div>
                <div>
                  <dt>应对方式</dt>
                  <dd>{problem.response}</dd>
                </div>
                <div>
                  <dt>预防重点</dt>
                  <dd>{problem.prevention}</dd>
                </div>
              </dl>
            </article>
          );
        })}
        {filteredProblems.length === 0 && (
          <div className="pest-empty">
            <p>没有匹配的症状记录</p>
          </div>
        )}
      </div>
    </section>
  );
}
