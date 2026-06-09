import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Database,
  Leaf,
  Microscope,
  Move3D,
  Rotate3D,
  Server,
  ShieldAlert,
} from 'lucide-react';
import TomatoThreeViewer from '../components/TomatoThreeViewer';

type TomatoStageId =
  | 'sowing'
  | 'germination'
  | 'seedling'
  | 'growth'
  | 'flowering'
  | 'fruiting'
  | 'ripening'
  | 'senescence';

type DiseaseId = 'normal' | 'late-blight' | 'gray-mold' | 'leaf-mold' | 'virus' | 'deficiency';
type Severity = 'mild' | 'moderate' | 'severe';

interface TomatoStage {
  id: TomatoStageId;
  name: string;
  days: string;
  startDay: number;
  endDay: number;
  visual: string;
  care: string;
  modelState: string;
}

interface TomatoDisease {
  id: DiseaseId;
  name: string;
  symptoms: string;
  cause: string;
  control: string;
  action: string;
  prevention: string;
  visualEffect: string;
}

const tomatoStages: TomatoStage[] = [
  {
    id: 'sowing',
    name: '播种期',
    days: '第0–4天',
    startDay: 0,
    endDay: 4,
    visual: '种子位于育苗基质中，土面保持湿润但不能积水。',
    care: '播前浸种或直接点播，覆土0.5–1cm，保持25–30°C。',
    modelState: 'seed',
  },
  {
    id: 'germination',
    name: '发芽期',
    days: '第5–10天',
    startDay: 5,
    endDay: 10,
    visual: '胚根伸出，子叶顶破土面，植株高度很低。',
    care: '出苗后逐步见光，避免高温闷湿造成徒长。',
    modelState: 'sprout',
  },
  {
    id: 'seedling',
    name: '幼苗期',
    days: '第11–30天',
    startDay: 11,
    endDay: 30,
    visual: '子叶展开，真叶逐渐出现，茎秆仍细嫩。',
    care: '保持充足散射光，3–5片真叶后炼苗，准备移栽。',
    modelState: 'seedling',
  },
  {
    id: 'growth',
    name: '营养生长期',
    days: '第31–55天',
    startDay: 31,
    endDay: 55,
    visual: '主茎快速伸长，复叶增多，需要支架或吊蔓。',
    care: '定植后搭架，去除过密侧芽，保持通风和稳定浇水。',
    modelState: 'vine',
  },
  {
    id: 'flowering',
    name: '开花期',
    days: '第56–70天',
    startDay: 56,
    endDay: 70,
    visual: '花序出现黄色小花，进入坐果关键阶段。',
    care: '避免高温和大水大肥，温室或阳台可轻敲花序辅助授粉。',
    modelState: 'flower',
  },
  {
    id: 'fruiting',
    name: '结果膨大期',
    days: '第71–95天',
    startDay: 71,
    endDay: 95,
    visual: '幼果由小绿果逐渐膨大，叶片承担主要光合供应。',
    care: '稳定供水，补钾补钙，预防裂果和脐腐。',
    modelState: 'green-fruit',
  },
  {
    id: 'ripening',
    name: '成熟采收期',
    days: '第96–120天',
    startDay: 96,
    endDay: 120,
    visual: '果实从绿转橙红，达到分批采收状态。',
    care: '转色后适当控水，果面变红后及时采收，继续去老叶病叶。',
    modelState: 'red-fruit',
  },
  {
    id: 'senescence',
    name: '衰老清园期',
    days: '第121天以后',
    startDay: 121,
    endDay: 150,
    visual: '下部叶片发黄，结果能力下降，病叶和老枝增多。',
    care: '采收末期清理病残体，停止无效追肥，准备换茬或清园。',
    modelState: 'aging',
  },
];

const tomatoDiseases: TomatoDisease[] = [
  {
    id: 'normal',
    name: '正常状态',
    symptoms: '叶片舒展浓绿，茎秆挺立，花果发育均衡。',
    cause: '光照、水分、温度、肥力和通风处于相对稳定范围。',
    control: '维持当前管理节奏，持续巡查叶背、花序和果面。',
    action: '按当前阶段执行浇水、搭架、整枝、授粉或采收任务。',
    prevention: '避免忽干忽湿、密植闷湿和长期不检查病叶。',
    visualEffect: 'healthy',
  },
  {
    id: 'late-blight',
    name: '晚疫病',
    symptoms: '叶片出现水浸状褐斑，潮湿时叶背有白霉，果实可出现硬褐斑。',
    cause: '低温高湿、连续阴雨、通风差和病残体传播。',
    control: '立即摘除病叶病果，降低湿度，必要时使用对症保护性杀菌剂。',
    action: '隔离病株，停止叶面喷水，雨后重点检查下部叶和果穗。',
    prevention: '避雨栽培、轮作、清园，浇水只浇根部。',
    visualEffect: 'dark-spots',
  },
  {
    id: 'gray-mold',
    name: '灰霉病',
    symptoms: '花瓣、果柄和果面出现灰色霉层，幼果易腐烂脱落。',
    cause: '花期湿度过高、残花不清理、通风差。',
    control: '剪除病花病果，清理残花，降低棚内或阳台局部湿度。',
    action: '花后及时清残花，病果袋装丢弃，避免接触健康果。',
    prevention: '控制夜间湿度，保持株间通风，减少花果表面长期潮湿。',
    visualEffect: 'gray-mold',
  },
  {
    id: 'leaf-mold',
    name: '叶霉病',
    symptoms: '叶面黄斑，叶背出现黄褐色或灰褐色霉层，主要危害叶片。',
    cause: '温室或阳台环境闷湿，叶片长期不干。',
    control: '摘除重病叶，拉开株距，加强通风，必要时喷施对症药剂。',
    action: '优先处理下部老叶和叶背病斑，保留健康功能叶。',
    prevention: '避免密植和叶面浇水，定期疏叶改善通风透光。',
    visualEffect: 'yellow-mold',
  },
  {
    id: 'virus',
    name: '病毒病',
    symptoms: '新叶皱缩卷曲、花叶斑驳，植株矮化，果实可能畸形。',
    cause: '带毒种苗、蚜虫或粉虱传播，高温干旱时更明显。',
    control: '疑似重病株应隔离或拔除，重点控制传毒昆虫。',
    action: '检查嫩梢和叶背虫害，避免用手接触病株后再碰健康株。',
    prevention: '使用健康种苗，防虫网隔离，及时清除杂草和传毒害虫。',
    visualEffect: 'curling',
  },
  {
    id: 'deficiency',
    name: '缺素症',
    symptoms: '叶片黄化、脉间失绿、果实脐部黑斑或生长缓慢。',
    cause: '肥力不足、根系吸收受阻、土壤过干过湿或钙钾供应不稳定。',
    control: '根据表现补充钙、钾或微量元素，同时恢复稳定水分。',
    action: '先排查浇水和根系，再少量多次补肥，不要一次重施。',
    prevention: '定植前配好基肥，结果期补钙补钾，避免忽干忽湿。',
    visualEffect: 'chlorosis',
  },
];

const severityLabels: Record<Severity, string> = {
  mild: '轻度',
  moderate: '中度',
  severe: '重度',
};

function getDefaultPlantingDateValue() {
  const date = new Date();
  date.setDate(date.getDate() - 20);
  return date.toISOString().slice(0, 10);
}

function getDaysAfterPlanting(startDate: string) {
  const start = new Date(`${startDate}T00:00:00`);
  const today = new Date();
  const diff = today.getTime() - start.getTime();
  return Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
}

function getCurrentStage(days: number) {
  return tomatoStages.find((stage) => days >= stage.startDay && days <= stage.endDay) || tomatoStages[tomatoStages.length - 1];
}

export default function TomatoVisualization() {
  const [plantingDate, setPlantingDate] = useState(getDefaultPlantingDateValue);
  const [selectedStageId, setSelectedStageId] = useState<TomatoStageId | null>(null);
  const [selectedDiseaseId, setSelectedDiseaseId] = useState<DiseaseId>('normal');
  const [severity, setSeverity] = useState<Severity>('mild');
  const [compareNormal, setCompareNormal] = useState(true);

  const daysAfterPlanting = useMemo(() => getDaysAfterPlanting(plantingDate), [plantingDate]);
  const autoStage = getCurrentStage(daysAfterPlanting);
  const activeStage = tomatoStages.find((stage) => stage.id === selectedStageId) || autoStage;
  const activeDisease = tomatoDiseases.find((disease) => disease.id === selectedDiseaseId) || tomatoDiseases[0];
  const progress = Math.min(100, Math.round((Math.min(daysAfterPlanting, 150) / 150) * 100));

  return (
    <div className="tomato-visual-page">
      <section className="tomato-visual-hero">
        <div>
          <Link to="/crop/tomato" className="back-link tomato-back-link">
            <ArrowLeft size={18} /> 返回番茄详情
          </Link>
          <span className="tomato-visual-eyebrow">单一植物 · 番茄</span>
          <h1>番茄种植全周期可视化系统</h1>
          <p>
            以番茄为唯一对象，把播种、发芽、幼苗、生长、开花、结果、成熟和衰老串成可交互展示，用于农业科普、种植培训、教学演示和智慧农业展厅。
          </p>
        </div>
        <div className="tomato-visual-hero-metrics" aria-label="系统能力">
          <span><CalendarDays size={18} /> 时间驱动</span>
          <span><Move3D size={18} /> 3D查看</span>
          <span><ShieldAlert size={18} /> 病害模拟</span>
        </div>
      </section>

      <section className="tomato-workbench" aria-label="番茄3D交互原型">
        <div className="tomato-viewer">
          <div className="viewer-toolbar">
            <span><Rotate3D size={16} /> 真实番茄3D模型</span>
            <strong>{activeStage.name}</strong>
          </div>
          <div className="real-model-stage">
            <TomatoThreeViewer modelState={activeStage.modelState} diseaseEffect={activeDisease.visualEffect} severity={severity} />
            {selectedDiseaseId !== 'normal' && (
              <div className="model-disease-note">
                <span>{activeDisease.name} · {severityLabels[severity]}</span>
                <p>{activeDisease.symptoms}</p>
              </div>
            )}
          </div>
          <div className="real-model-meta">
            <span>本地 Three.js 渲染番茄幼苗与结果期 GLB 模型，可旋转、缩放、拖拽查看叶片、茎、果实、盆土和病害表现。</span>
            <strong>本地多阶段GLB模型 · 不依赖外部 iframe</strong>
          </div>
        </div>

        <div className="tomato-control-panel">
          <div className="control-block">
            <h2><CalendarDays size={18} /> 种植日期驱动</h2>
            <input type="date" value={plantingDate} onChange={(event) => setPlantingDate(event.target.value)} />
            <div className="growth-progress">
              <span style={{ width: `${progress}%` }} />
            </div>
            <p>播种后第 <strong>{daysAfterPlanting}</strong> 天，系统自动判断为 <strong>{autoStage.name}</strong>。</p>
          </div>

          <div className="stage-chip-grid" aria-label="生命周期阶段">
            {tomatoStages.map((stage) => (
              <button
                key={stage.id}
                type="button"
                className={activeStage.id === stage.id ? 'active' : ''}
                onClick={() => setSelectedStageId(stage.id)}
              >
                <span>{stage.name}</span>
                <small>{stage.days}</small>
              </button>
            ))}
          </div>

          <div className="control-block">
            <h2><Microscope size={18} /> 病害状态</h2>
            <div className="disease-selector">
              {tomatoDiseases.map((disease) => (
                <button
                  key={disease.id}
                  type="button"
                  className={activeDisease.id === disease.id ? 'active' : ''}
                  onClick={() => setSelectedDiseaseId(disease.id)}
                >
                  {disease.name}
                </button>
              ))}
            </div>
            <div className="severity-selector" aria-label="病害严重程度">
              {(Object.keys(severityLabels) as Severity[]).map((item) => (
                <button key={item} type="button" className={severity === item ? 'active' : ''} onClick={() => setSeverity(item)}>
                  {severityLabels[item]}
                </button>
              ))}
            </div>
            <label className="compare-toggle">
              <input type="checkbox" checked={compareNormal} onChange={(event) => setCompareNormal(event.target.checked)} />
              保留正常状态对比说明
            </label>
            {compareNormal && selectedDiseaseId !== 'normal' && (
              <p className="compare-note">当前真实模型作为健康植株参照；病害形态通过症状说明和后续病害模型资源位展示。</p>
            )}
          </div>
        </div>
      </section>

      <section className="tomato-info-grid">
        <article>
          <h2>一、项目目标</h2>
          <p>
            构建番茄单株的全周期可视化展示系统，让用户能用种植日期定位当前阶段，用 3D 方式查看植株形态，并在病害模拟下理解症状、原因和处理措施。
          </p>
        </article>
        <article>
          <h2>二、核心功能</h2>
          <ul>
            <li>生命周期时间轴：播种到衰老 8 个阶段。</li>
            <li>3D查看：旋转、缩放、拖拽、视角切换、局部热点。</li>
            <li>病害模拟：正常、晚疫病、灰霉病、叶霉病、病毒病、缺素症。</li>
            <li>处理建议：症状、原因、防治方法、推荐措施、预防建议同步展示。</li>
          </ul>
        </article>
      </section>

      <section className="tomato-detail-section">
        <h2>三、页面与交互设计</h2>
        <div className="interaction-layout">
          <div>
            <h3>页面结构</h3>
            <ol>
              <li>顶部：番茄全周期系统标题、当前阶段、系统能力标签。</li>
              <li>主工作区：左侧 3D 植株，右侧种植日期、阶段、病害和严重程度控制。</li>
              <li>建议区：随病害选择更新症状、原因、防治和预防。</li>
              <li>方案区：技术架构、数据模型、MVP 和扩展方向。</li>
            </ol>
          </div>
          <div>
            <h3>核心交互流程</h3>
            <ol>
              <li>用户输入播种日期。</li>
              <li>系统计算播种后天数并定位阶段。</li>
              <li>3D模型切换为对应阶段形态。</li>
              <li>用户选择病害和严重程度。</li>
              <li>模型叠加症状材质，右侧展示处理建议。</li>
            </ol>
          </div>
        </div>
      </section>

      <section className="tomato-detail-section">
        <h2>番茄生命周期阶段表</h2>
        <div className="responsive-table">
          <table>
            <thead>
              <tr>
                <th>阶段</th>
                <th>天数范围</th>
                <th>可视化状态</th>
                <th>当前养护任务</th>
              </tr>
            </thead>
            <tbody>
              {tomatoStages.map((stage) => (
                <tr key={stage.id} className={activeStage.id === stage.id ? 'active-row' : ''}>
                  <td>{stage.name}</td>
                  <td>{stage.days}</td>
                  <td>{stage.visual}</td>
                  <td>{stage.care}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="tomato-detail-section disease-advice">
        <h2>四、病害处理建议展示</h2>
        <div className="advice-card">
          <div>
            <span className="advice-label">当前选择</span>
            <h3>{activeDisease.name} · {severityLabels[severity]}</h3>
            <p>{activeDisease.symptoms}</p>
          </div>
          <ul>
            <li><strong>产生原因：</strong>{activeDisease.cause}</li>
            <li><strong>防治方法：</strong>{activeDisease.control}</li>
            <li><strong>推荐处理：</strong>{activeDisease.action}</li>
            <li><strong>预防建议：</strong>{activeDisease.prevention}</li>
          </ul>
        </div>
        <div className="responsive-table">
          <table>
            <thead>
              <tr>
                <th>病害</th>
                <th>3D表现</th>
                <th>重点识别</th>
                <th>处理重点</th>
              </tr>
            </thead>
            <tbody>
              {tomatoDiseases.filter((disease) => disease.id !== 'normal').map((disease) => (
                <tr key={disease.id}>
                  <td>{disease.name}</td>
                  <td>{disease.visualEffect}</td>
                  <td>{disease.symptoms}</td>
                  <td>{disease.action}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="tomato-detail-section">
        <h2>四、技术架构</h2>
        <div className="architecture-grid">
          <TechCard icon={<Leaf size={20} />} title="前端技术栈" text="React + TypeScript + Vite，状态管理可用 Zustand，UI 保持当前项目风格；复杂教学动画可接 GSAP。" />
          <TechCard icon={<Move3D size={20} />} title="3D引擎" text="当前MVP使用本地 Three.js 程序化番茄模型；正式版可继续接入 GLB 扫描模型、GLTFLoader、材质叠加、热点标注和阶段动画混合。" />
          <TechCard icon={<Server size={20} />} title="后端技术栈" text="MVP 可纯前端静态数据；正式版建议 Node.js/NestJS 或 Python/FastAPI，提供阶段、病害、建议和模型资源接口。" />
          <TechCard icon={<Database size={20} />} title="数据库建议" text="PostgreSQL 存结构化阶段和病害知识，对象存储保存 GLB、贴图、缩略图；Redis 缓存展示配置。" />
        </div>
        <p className="tech-note">
          3D模型推荐使用 GLB/GLTF。每个阶段可使用一个模型文件，也可用同一模型的 morph target、骨骼动画和材质参数驱动高度、叶量、花果数量与衰老程度。
        </p>
      </section>

      <section className="tomato-detail-section">
        <h2>五、数据模型设计</h2>
        <pre className="data-model-code">{`type TomatoStage = {
  id: 'sowing' | 'germination' | 'seedling' | 'growth' | 'flowering' | 'fruiting' | 'ripening' | 'senescence';
  startDay: number;
  endDay: number;
  modelAsset: string;
  cameraPreset: string;
  hotspots: Array<{ id: string; label: string; target: 'leaf' | 'flower' | 'fruit' | 'stem' }>;
};

type DiseaseState = {
  diseaseId: 'late-blight' | 'gray-mold' | 'leaf-mold' | 'virus' | 'deficiency';
  severity: 1 | 2 | 3;
  affectedParts: Array<'leaf' | 'stem' | 'flower' | 'fruit'>;
  materialOverlay: string;
  adviceId: string;
};`}</pre>
        <p>
          时间驱动逻辑：`daysAfterPlanting = today - plantingDate`，用天数命中阶段区间；当用户手动点选阶段时，页面进入演示模式，仍保留自动阶段提示。
          病害状态作为覆盖层叠加到当前阶段模型，不改变生命周期阶段本身。
        </p>
      </section>

      <section className="tomato-detail-section">
        <h2>六、MVP最小可行版本建议</h2>
        <div className="mvp-list">
          <MvpItem title="第1版" text="完成当前页面：日期驱动阶段、本地Three.js番茄3D模型、病害建议联动、番茄详情入口。" />
          <MvpItem title="第2版" text="接入 8 个番茄 GLB 阶段模型，支持 OrbitControls、缩放、旋转和相机预设。" />
          <MvpItem title="第3版" text="为叶片、果实、花朵添加热点，点击后显示局部说明和该部位病害表现。" />
          <MvpItem title="第4版" text="加入正常/病害双视图对比、严重程度动画和教师演示模式。" />
        </div>
      </section>

      <section className="tomato-detail-section">
        <h2>七、后续扩展方向</h2>
        <ul className="extension-list">
          <li><CheckCircle2 size={16} /> 接入真实环境数据，让温度、湿度、光照影响阶段提示和病害风险。</li>
          <li><CheckCircle2 size={16} /> 增加病害诊断问答，根据用户看到的症状推荐可能原因。</li>
          <li><CheckCircle2 size={16} /> 支持教学脚本，一键播放“播种到采收”全过程。</li>
          <li><CheckCircle2 size={16} /> 支持农事记录，把浇水、施肥、用药和采收记录叠加到时间轴。</li>
        </ul>
      </section>
    </div>
  );
}

function TechCard({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return (
    <article className="tech-card">
      <div>{icon}</div>
      <h3>{title}</h3>
      <p>{text}</p>
    </article>
  );
}

function MvpItem({ title, text }: { title: string; text: string }) {
  return (
    <article>
      <span>{title}</span>
      <p>{text}</p>
    </article>
  );
}
