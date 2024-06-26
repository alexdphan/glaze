import { useState, useRef, useEffect } from 'react';
import { Check, Copy } from 'lucide-react';

interface CopyTextProps {
  size?: number;
  text: string;
}

const CopyText: React.FC<CopyTextProps> = ({ size = 18, text }) => {
  const [showCheckIcon, setShowCheckIcon] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleIconClick = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setShowCheckIcon(true);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        setShowCheckIcon(false);
      }, 2000);
    } catch (error) {
      console.error('Failed to copy text:', error);
    }
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
