import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Star, Moon, Heart } from 'lucide-react';

const ANALYZING_MESSAGES = [
  { text: "Aunty is analyzing your stars...", icon: Star },
  { text: "Reading your cosmic blueprint...", icon: Moon },
  { text: "Calculating your Nakshatra...", icon: Sparkles },
  { text: "Finding your perfect matches...", icon: Heart },
];

interface AnalyzingScreenProps {
  onComplete: () => void;
}

export function AnalyzingScreen({ onComplete }: AnalyzingScreenProps) {
  const [messageIndex, setMessageIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const messageInterval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % ANALYZING_MESSAGES.length);
    }, 2000);

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          clearInterval(messageInterval);
          setTimeout(onComplete, 500);
          return 100;
        }
        return prev + 2;
      });
    }, 80);

    return () => {
      clearInterval(messageInterval);
      clearInterval(progressInterval);
    };
  }, [onComplete]);

  const CurrentIcon = ANALYZING_MESSAGES[messageIndex].icon;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-8">
      <div className="max-w-md w-full text-center space-y-8">
        {/* Animated cosmic circle */}
        <div className="relative mx-auto w-40 h-40">
          {/* Outer rotating ring */}
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-primary/20"
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          />
          
          {/* Middle pulsing ring */}
          <motion.div
            className="absolute inset-4 rounded-full border-2 border-primary/40"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
          
          {/* Inner glowing core */}
          <motion.div
            className="absolute inset-8 rounded-full bg-gradient-to-br from-primary/30 to-secondary/30 flex items-center justify-center"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={messageIndex}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3 }}
              >
                <CurrentIcon className="h-10 w-10 text-primary" />
              </motion.div>
            </AnimatePresence>
          </motion.div>

          {/* Floating stars */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-aunty-gold rounded-full"
              style={{
                top: `${20 + Math.sin(i * 60 * Math.PI / 180) * 35}%`,
                left: `${50 + Math.cos(i * 60 * Math.PI / 180) * 45}%`,
              }}
              animate={{
                opacity: [0.3, 1, 0.3],
                scale: [0.8, 1.2, 0.8],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.3,
              }}
            />
          ))}
        </div>

        {/* Message */}
        <AnimatePresence mode="wait">
          <motion.h2
            key={messageIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="text-xl font-medium text-foreground"
          >
            {ANALYZING_MESSAGES[messageIndex].text}
          </motion.h2>
        </AnimatePresence>

        {/* Progress bar */}
        <div className="space-y-2">
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.1 }}
            />
          </div>
          <p className="text-sm text-muted-foreground">{progress}% complete</p>
        </div>

        {/* Aunty quote */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-sm text-muted-foreground italic"
        >
          "Beta, the stars have so much to tell about you!"
        </motion.p>
      </div>
    </div>
  );
}
