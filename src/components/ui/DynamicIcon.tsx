/**
 * DYNAMIC ICON COMPONENT
 * Renders lucide-react icons dynamically from string names
 */

import * as Icons from 'lucide-react';

interface DynamicIconProps {
  name: string;
  className?: string;
  size?: number;
}

export default function DynamicIcon({ name, className = '', size = 24 }: DynamicIconProps) {
  // Get the icon component from lucide-react
  const IconComponent = (Icons as any)[name];
  
  // Fallback to Circle if icon not found
  if (!IconComponent) {
    return <Icons.Circle className={className} size={size} />;
  }
  
  return <IconComponent className={className} size={size} />;
}
