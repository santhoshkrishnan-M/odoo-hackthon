/**
 * BUDGET PAGE
 * Track and manage trip budget with animated progress bars
 */

'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import MainLayout from '@/components/layout/MainLayout';
import Card from '@/components/ui/Card';
import { mockBudgetCategories } from '@/lib/mockData';
import { Wallet, TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

// Number count-up animation hook
const useCountUp = (end: number, duration: number = 1.5) => {
  const [count, setCount] = useState(0);
  const countRef = useRef({ value: 0 });

  useEffect(() => {
    gsap.to(countRef.current, {
      value: end,
      duration,
      ease: 'power2.out',
      onUpdate: () => {
        setCount(Math.floor(countRef.current.value));
      },
    });
  }, [end, duration]);

  return count;
};

export default function BudgetPage() {
  const progressRef = useRef<HTMLDivElement>(null);
  const [animate, setAnimate] = useState(false);

  const totalAllocated = mockBudgetCategories.reduce((sum, cat) => sum + cat.allocated, 0);
  const totalSpent = mockBudgetCategories.reduce((sum, cat) => sum + cat.spent, 0);
  const remaining = totalAllocated - totalSpent;
  const percentageSpent = (totalSpent / totalAllocated) * 100;

  // Animated counts
  const animatedAllocated = useCountUp(animate ? totalAllocated : 0, 1.2);
  const animatedSpent = useCountUp(animate ? totalSpent : 0, 1.2);
  const animatedRemaining = useCountUp(animate ? Math.abs(remaining) : 0, 1.2);

  useEffect(() => {
    // Start number animations
    setAnimate(true);

    if (progressRef.current) {
      const ctx = gsap.context(() => {
        // Animate progress bars with ScrollTrigger
        gsap.utils.toArray('.budget-bar').forEach((bar: any, index: number) => {
          const targetWidth = bar.getAttribute('data-width');
          gsap.fromTo(
            bar,
            { width: '0%' },
            {
              width: targetWidth,
              duration: 1.2,
              delay: index * 0.1,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: bar,
                start: 'top 85%',
                toggleActions: 'play none none reverse',
              },
            }
          );
        });

        // Animate category cards
        gsap.from('.category-card', {
          scrollTrigger: {
            trigger: '.category-card',
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
          opacity: 0,
          y: 30,
          duration: 0.6,
          stagger: 0.1,
          ease: 'power2.out',
        });
      }, progressRef);

      return () => ctx.revert();
    }
  }, []);

  return (
    <MainLayout>
      <div className="p-8">
        <h1 className="section-title mb-8">Budget Overview</h1>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-full bg-gradient-neon flex items-center justify-center">
                <Wallet className="w-6 h-6 text-black" />
              </div>
              <div>
                <p className="text-sm text-[var(--text-secondary)]">Total Budget</p>
                <p className="text-2xl font-bold">₹{animatedAllocated.toLocaleString()}</p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-full bg-gradient-blue flex items-center justify-center">
                <TrendingDown className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-[var(--text-secondary)]">Total Spent</p>
                <p className="text-2xl font-bold">₹{animatedSpent.toLocaleString()}</p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center gap-3 mb-2">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  remaining >= 0 ? 'bg-green-500/20' : 'bg-red-500/20'
                }`}
              >
                {remaining >= 0 ? (
                  <TrendingUp className="w-6 h-6 text-green-400" />
                ) : (
                  <AlertTriangle className="w-6 h-6 text-red-400" />
                )}
              </div>
              <div>
                <p className="text-sm text-[var(--text-secondary)]">
                  {remaining >= 0 ? 'Remaining' : 'Over Budget'}
                </p>
                <p className={`text-2xl font-bold ${remaining >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  ₹{animatedRemaining.toLocaleString()}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Overall Progress */}
        <Card className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Overall Budget Progress</h2>
            <span className="text-2xl font-bold neon-text">{percentageSpent.toFixed(1)}%</span>
          </div>
          <div className="h-4 bg-[var(--bg-elevated)] rounded-full overflow-hidden">
            <div
              className={`budget-bar h-full transition-all ${
                percentageSpent > 100 ? 'bg-red-500' : 'bg-gradient-neon'
              }`}
              data-width={`${Math.min(percentageSpent, 100)}%`}
              style={{ width: '0%' }}
            />
          </div>
          {percentageSpent > 90 && (
            <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-yellow-400" />
              <p className="text-sm text-yellow-400">
                {percentageSpent > 100
                  ? 'You have exceeded your budget!'
                  : 'Warning: You are approaching your budget limit!'}
              </p>
            </div>
          )}
        </Card>

        {/* Category Breakdown */}
        <div>
          <h2 className="text-xl font-bold mb-6">Budget Breakdown by Category</h2>
          <div className="space-y-4" ref={progressRef}>
            {mockBudgetCategories.map((category) => {
              const percentage = (category.spent / category.allocated) * 100;
              const isOverBudget = category.spent > category.allocated;

              return (
                <Card key={category.name} className="category-card relative overflow-hidden">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-lg">{category.name}</h3>
                    <div className="text-right">
                      <p className="font-bold">
                        ₹{category.spent.toLocaleString()} / ₹{category.allocated.toLocaleString()}
                      </p>
                      <p className="text-sm text-[var(--text-secondary)]">{percentage.toFixed(1)}%</p>
                    </div>
                  </div>

                  <div className="h-3 bg-[var(--bg-elevated)] rounded-full overflow-hidden relative">
                    <div
                      className={`budget-bar h-full ${isOverBudget ? 'bg-red-500' : ''}`}
                      data-width={`${Math.min(percentage, 100)}%`}
                      style={{
                        width: '0%',
                        background: isOverBudget ? undefined : category.color,
                      }}
                    />
                  </div>
                  </div>

                  {isOverBudget && (
                    <p className="mt-2 text-sm text-red-400 flex items-center gap-1">
                      <AlertTriangle className="w-4 h-4" />
                      Over budget by ₹{(category.spent - category.allocated).toLocaleString()}
                    </p>
                  )}
                </Card>
              );
            })}
          </div>
        </div>

        {/* Tips */}
        <Card className="mt-8 bg-gradient-to-br from-[var(--accent-blue)]/10 to-transparent">
          <h3 className="font-bold mb-3 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-[var(--accent-blue)]" />
            Budget Tips
          </h3>
          <ul className="space-y-2 text-sm text-[var(--text-secondary)]">
            <li>• Book flights and accommodation in advance for better deals</li>
            <li>• Consider staying in hostels or Airbnb to save on accommodation</li>
            <li>• Try local street food for authentic and budget-friendly meals</li>
            <li>• Use public transportation instead of taxis</li>
            <li>• Look for free walking tours and attractions</li>
          </ul>
        </Card>
      </div>
    </MainLayout>
  );
}
