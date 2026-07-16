import { motion } from 'framer-motion';

interface PageAnimateProps {
  children: React.ReactNode;
}

export default function PageAnimate({ children }: PageAnimateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.18, ease: 'easeOut' }}
      className="w-full"
    >
      {children}
    </motion.div>
  );
}
