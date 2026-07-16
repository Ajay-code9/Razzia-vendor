import { motion, AnimatePresence } from 'framer-motion';

export interface Reaction {
  id: string;
  emoji: string;
  left: number; // horizontal alignment percentage
  color: string;
}

interface FloatingReactionsProps {
  reactions: Reaction[];
}

export default function FloatingReactions({ reactions }: FloatingReactionsProps) {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
      <AnimatePresence>
        {reactions.map((r) => (
          <motion.div
            key={r.id}
            initial={{ opacity: 0, y: '80%', scale: 0.5, x: 0 }}
            animate={{ 
              opacity: [0, 1, 1, 0],
              y: '10%',
              scale: [0.5, 1.2, 1, 0.8],
              x: [0, (r.left % 2 === 0 ? 15 : -15), (r.left % 2 === 0 ? -10 : 10), 0]
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2.2, ease: 'easeOut' }}
            className="absolute bottom-10 select-none"
            style={{ left: `${r.left}%` }}
          >
            <span style={{ textShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>
              {r.emoji}
            </span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
