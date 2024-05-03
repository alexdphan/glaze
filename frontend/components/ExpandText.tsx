import { useState, useRef, useEffect } from 'react';
import { Check, Copy, Link, AlignJustify } from 'lucide-react';

interface ExpandTextProps {
  size?: number;
}

const ExpandText: React.FC<ExpandTextProps> = ({ size = 18 }) => {
  const [showText, setShowText] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleIconClick = () => {};

  return (
    <button
      onClick={handleIconClick}
      className="plasmo-link-item-icon-copy p-1 rounded-xs"
    >
      {showText ? <AlignJustify size={size} /> : <AlignJustify size={size} />}
    </button>
  );
};

export default ExpandText;
