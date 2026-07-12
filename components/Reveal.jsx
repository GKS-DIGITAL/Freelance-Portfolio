'use client';
import { motion } from 'framer-motion';
export default function Reveal({ children, delay = 0, className = '' }) { return <motion.div className={className} initial={{ opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .15 }} transition={{ duration: .65, delay, ease: [0.16, 1, .3, 1] }}>{children}</motion.div>; }
