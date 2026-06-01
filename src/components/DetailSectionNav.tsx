import { CalendarDays, ClipboardList, ShieldAlert, Sprout } from 'lucide-react';

const sectionLinks = [
  { href: '#today', label: '今日任务', Icon: Sprout },
  { href: '#calendar', label: '种植日历', Icon: CalendarDays },
  { href: '#risks', label: '新手避坑', Icon: ShieldAlert },
  { href: '#stage-actions', label: '阶段任务', Icon: ClipboardList },
  { href: '#pests', label: '病虫害', Icon: ShieldAlert },
];

export default function DetailSectionNav() {
  return (
    <nav className="detail-section-nav" aria-label="详情页快捷导航">
      {sectionLinks.map(({ href, label, Icon }) => (
        <a key={href} href={href}>
          <Icon size={16} />
          {label}
        </a>
      ))}
    </nav>
  );
}
