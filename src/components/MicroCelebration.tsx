import { useEffect, useState } from 'react';

interface Props {
  show: boolean;
  xpEarned?: number;
  onComplete?: () => void;
}

export default function MicroCelebration({ show, xpEarned, onComplete }: Props) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!show) return;
    setVisible(true);
    const t = setTimeout(() => {
      setVisible(false);
      onComplete?.();
    }, 800);
    return () => clearTimeout(t);
  }, [show]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-50">
      <div className="animate-celebrate flex flex-col items-center gap-2">
        <div className="text-5xl">⚡</div>
        {xpEarned !== undefined && xpEarned > 0 && (
          <div className="font-mono text-forces text-xl font-semibold">+{xpEarned} XP</div>
        )}
      </div>
    </div>
  );
}
