import { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

interface OnboardingTimePickerProps {
  hour: string;
  minute: string;
  ampm: string;
  onHourChange: (value: string) => void;
  onMinuteChange: (value: string) => void;
  onAmPmChange: (value: string) => void;
}

export function OnboardingTimePicker({
  hour,
  minute,
  ampm,
  onHourChange,
  onMinuteChange,
  onAmPmChange,
}: OnboardingTimePickerProps) {
  const hours = Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, '0'));
  const minutes = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'));
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-center gap-4">
        {/* Hour picker */}
        <div className="flex flex-col items-center">
          <label className="text-xs text-muted-foreground mb-2">Hour</label>
          <div className="relative h-32 w-20 overflow-hidden rounded-xl bg-muted/50 border border-border">
            <div className="absolute inset-0 pointer-events-none z-10">
              <div className="absolute top-0 left-0 right-0 h-12 bg-gradient-to-b from-background to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-background to-transparent" />
            </div>
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-10 border-y border-aunty-pink/30 bg-aunty-pink/10 pointer-events-none z-5" />
            <div className="h-full overflow-y-auto scrollbar-hide py-11 snap-y snap-mandatory">
              {hours.map((h) => (
                <button
                  key={h}
                  type="button"
                  onClick={() => onHourChange(h)}
                  className={`w-full h-10 flex items-center justify-center text-xl font-bold snap-center transition-all ${
                    hour === h
                      ? 'text-primary scale-110'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {h}
                </button>
              ))}
            </div>
          </div>
        </div>

        <span className="text-3xl font-bold text-primary mt-6">:</span>

        {/* Minute picker */}
        <div className="flex flex-col items-center">
          <label className="text-xs text-muted-foreground mb-2">Min</label>
          <div className="relative h-32 w-20 overflow-hidden rounded-xl bg-muted/50 border border-border">
            <div className="absolute inset-0 pointer-events-none z-10">
              <div className="absolute top-0 left-0 right-0 h-12 bg-gradient-to-b from-background to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-background to-transparent" />
            </div>
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-10 border-y border-aunty-pink/30 bg-aunty-pink/10 pointer-events-none z-5" />
            <div className="h-full overflow-y-auto scrollbar-hide py-11 snap-y snap-mandatory">
              {minutes.map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => onMinuteChange(m)}
                  className={`w-full h-10 flex items-center justify-center text-xl font-bold snap-center transition-all ${
                    minute === m
                      ? 'text-primary scale-110'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* AM/PM picker */}
        <div className="flex flex-col items-center">
          <label className="text-xs text-muted-foreground mb-2">Period</label>
          <div className="flex flex-col gap-2">
            {['am', 'pm'].map((period) => (
              <motion.button
                key={period}
                type="button"
                onClick={() => onAmPmChange(period)}
                whileTap={{ scale: 0.95 }}
                className={`w-16 h-14 rounded-xl font-bold text-lg uppercase transition-all ${
                  ampm === period
                    ? 'bg-gradient-to-r from-aunty-pink to-aunty-purple text-white glow-pink'
                    : 'bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                {period}
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {hour && minute && ampm && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <p className="text-sm text-muted-foreground">
            Born at{' '}
            <span className="text-primary font-semibold">
              {hour}:{minute} {ampm.toUpperCase()}
            </span>
          </p>
        </motion.div>
      )}

      <p className="text-xs text-center text-muted-foreground italic">
        💡 Pro tip: Check your birth certificate or ask your parents!
      </p>
    </div>
  );
}
