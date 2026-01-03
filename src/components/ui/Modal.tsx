/**
 * MODAL COMPONENT
 * Animated modal overlay
 */

'use client';

import { ReactNode, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { X } from 'lucide-react';
import Button from './Button';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
}

export default function Modal({ isOpen, onClose, title, children }: ModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      
      gsap.to(overlayRef.current, {
        opacity: 1,
        duration: 0.3,
      });
      
      gsap.from(modalRef.current, {
        scale: 0.8,
        opacity: 0,
        y: 50,
        duration: 0.4,
        ease: 'power3.out',
      });
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm opacity-0"
      onClick={onClose}
    >
      <div
        ref={modalRef}
        className="glass-card max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-[var(--glass-border)]">
            <h2 className="text-2xl font-bold neon-text">{title}</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-[var(--bg-elevated)] rounded-full transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        )}
        <div>{children}</div>
      </div>
    </div>
  );
}
