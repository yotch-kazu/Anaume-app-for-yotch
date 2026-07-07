import type { ProblemNavItem } from '../types';

type ProblemSidebarProps = {
  isOpen: boolean;
  items: ProblemNavItem[];
  activeSet: string;
  onClose: () => void;
  onSelectSet: (setPath: string) => void;
};

export function ProblemSidebar({ isOpen, items, activeSet, onClose, onSelectSet }: ProblemSidebarProps) {
  return (
    <>
      <div className={`sidebar-backdrop ${isOpen ? 'sidebar-backdrop-open' : ''}`} onClick={onClose} />
      <aside className={`problem-sidebar ${isOpen ? 'problem-sidebar-open' : ''}`} aria-label="問題セット一覧">
        <div className="sidebar-header">
          <h2>問題フォルダー</h2>
          <button className="sidebar-close-toggle" type="button" onClick={onClose} aria-label="サイドバーを隠す">
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
          </button>
        </div>
        <nav className="problem-nav">
          <NavItems items={items} activeSet={activeSet} onSelectSet={onSelectSet} />
        </nav>
      </aside>
    </>
  );
}

type NavItemsProps = {
  items: ProblemNavItem[];
  activeSet: string;
  onSelectSet: (setPath: string) => void;
};

function NavItems({ items, activeSet, onSelectSet }: NavItemsProps) {
  return (
    <ul className="nav-list">
      {items.map((item) => {
        if (item.type === 'folder') {
          return (
            <li className="nav-folder" key={item.title}>
              <details open>
                <summary>{item.title}</summary>
                <NavItems items={item.children} activeSet={activeSet} onSelectSet={onSelectSet} />
              </details>
            </li>
          );
        }

        const isActive = activeSet === item.path;

        return (
          <li key={item.path}>
            <button
              className={`nav-set ${isActive ? 'nav-set-active' : ''}`}
              type="button"
              onClick={() => onSelectSet(item.path)}
            >
              <span>{item.title}</span>
              {item.description ? <small>{item.description}</small> : null}
            </button>
          </li>
        );
      })}
    </ul>
  );
}
