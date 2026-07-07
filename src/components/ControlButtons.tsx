type ControlButtonsProps = {
  onShowAll: () => void;
  onHideAll: () => void;
  onShuffle: () => void;
};

export function ControlButtons({ onShowAll, onHideAll, onShuffle }: ControlButtonsProps) {
  return (
    <div className="controls" aria-label="問題操作">
      <button type="button" onClick={onShowAll}>
        すべて表示
      </button>
      <button type="button" onClick={onHideAll}>
        すべて隠す
      </button>
      <button type="button" onClick={onShuffle}>
        段落をシャッフル
      </button>
    </div>
  );
}
