import { useState, useRef, useEffect } from 'react';
import { Check, Copy, Link, Link2 } from 'lucide-react';

interface CopyLinkProps {
  size?: number;
}

const CopyLink: React.FC<CopyLinkProps> = ({ size = 18 }) => {
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
      className="plasmo-link-item-icon-copy rounded-xs pt-0.5"
      // style={{ transform: 'rotate(-45deg)' }}
    >
      {showCheckIcon ? (
        <Check size={size} style={{ animation: 'fadeIn 250ms ease-out' }} />
      ) : (
        <Link2 size={size} style={{ animation: 'fadeIn 250ms ease-out' }} />
      )}
    </button>
  );
};

export default CopyLink;
