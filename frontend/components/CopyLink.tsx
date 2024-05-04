import { useState, useRef, useEffect } from 'react';
import { Check, Link2 } from 'lucide-react';

interface CopyLinkProps {
  size?: number;
  link: string; // Link to be copied
}

const CopyLink: React.FC<CopyLinkProps> = ({ size = 18, link }) => {
  const [showCheckIcon, setShowCheckIcon] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleIconClick = async () => {
    try {
      await navigator.clipboard.writeText(link);
      setShowCheckIcon(true);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        setShowCheckIcon(false);
      }, 2000);
    } catch (error) {
      console.error('Failed to copy link:', error);
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
      className="plasmo-link-item-icon-copy rounded-xs "
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
