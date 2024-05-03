import { useState, useRef, useEffect } from 'react';
import { Check, Copy, Link } from 'lucide-react';

interface CopyTextProps {
  size?: number;
}

const CopyText: React.FC<CopyTextProps> = ({ size = 18 }) => {
  const [showCheckIcon, setShowCheckIcon] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleIconClick = () => {
    setShowCheckIcon(true);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      setShowCheckIcon(false);
    }, 1000);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <button
      onClick={handleIconClick}
      className="plasmo-link-item-icon-copy rounded-xs p-1 mb-1"
    >
      {showCheckIcon ? (
        <Check
          size={size}
          style={{
            animation: 'fadeIn 250ms ease-out',
          }}
        />
      ) : (
        <Copy
          size={size}
          style={{
            transform: 'scaleX(-1)',
            animation: 'fadeIn 250ms ease-out',
          }}
        />
      )}
    </button>
  );
};

export default CopyText;
