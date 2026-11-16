import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import {
  SiReact, SiNodedotjs, SiTypescript, SiMongodb, SiPostgresql,
  SiDocker, SiCloudflare, SiGit, SiPython, SiGraphql,
  SiNextdotjs, SiTailwindcss, SiFramer, SiRedux, SiExpress,
  SiJest, SiGithub, SiThreedotjs, SiPrisma, SiSocketdotio,
} from 'react-icons/si';

const BRANDS = [
  { Icon: SiReact, color: '#61dafb' },
  { Icon: SiNodedotjs, color: '#339933' },
  { Icon: SiTypescript, color: '#3178c6' },
  { Icon: SiMongodb, color: '#47a248' },
  { Icon: SiPostgresql, color: '#4169e1' },
  { Icon: SiDocker, color: '#2496ed' },
  { Icon: SiCloudflare, color: '#f38020' },
  { Icon: SiGit, color: '#f05032' },
  { Icon: SiPython, color: '#3776ab' },
  { Icon: SiGraphql, color: '#e10098' },
  { Icon: SiNextdotjs, color: '#ffffff' },
  { Icon: SiTailwindcss, color: '#06b6d4' },
  { Icon: SiFramer, color: '#0055ff' },
  { Icon: SiRedux, color: '#764abc' },
  { Icon: SiExpress, color: '#ffffff' },
  { Icon: SiJest, color: '#c21325' },
  { Icon: SiGithub, color: '#f5f5f5' },
  { Icon: SiThreedotjs, color: '#ffffff' },
  { Icon: SiPrisma, color: '#60a5fa' },
  { Icon: SiSocketdotio, color: '#e2e8f0' },
];

const FloatingTechIcons = ({ className = '' }) => {
  const [icons, setIcons] = useState([]);

  useEffect(() => {
    const shuffled = [...BRANDS].sort(() => Math.random() - 0.5);
    const used = [];
    const placed = shuffled.map((brand, i) => {
      let x, y, attempts = 0;
      do {
        x = 4 + Math.random() * 88;
        y = 4 + Math.random() * 88;
        attempts++;
      } while (
        attempts < 30 &&
        used.some((p) => Math.abs(p.x - x) < 12 && Math.abs(p.y - y) < 12)
      );
      used.push({ x, y });
      return {
        id: i,
        Icon: brand.Icon,
        color: brand.color,
        x,
        y,
        size: 20 + Math.random() * 16,
        duration: 20 + Math.random() * 20,
        animIdx: Math.floor(Math.random() * 5),
      };
    });
    setIcons(placed);
  }, []);

  return (
    <motion.div
      aria-hidden="true"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.1, delay: 0.4, ease: 'easeOut' }}
      className={`absolute inset-0 w-full h-full overflow-hidden pointer-events-none ${className}`}
    >
      {icons.map(({ id, Icon, color, x, y, size, duration, animIdx }) => (
        <div
          key={id}
          className="absolute"
          style={{
            left: `${x}%`,
            top: `${y}%`,
            animation: `fi-drift-${animIdx} ${duration}s ease-in-out infinite`,
          }}
          onMouseEnter={(e) => {
            const el = e.currentTarget.querySelector('svg');
            if (el) {
              el.style.color = color;
              el.style.filter = `drop-shadow(0 0 10px ${color})`;
              el.style.transform = 'scale(1.5)';
            }
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget.querySelector('svg');
            if (el) {
              el.style.color = 'rgba(255,255,255,0.3)';
              el.style.filter = 'none';
              el.style.transform = 'scale(1)';
            }
          }}
        >
          <Icon
            size={size}
            aria-hidden="true"
            focusable="false"
            style={{
              color: 'rgba(255,255,255,0.3)',
              transition: 'color 0.3s, filter 0.3s, transform 0.3s',
              pointerEvents: 'auto',
            }}
          />
        </div>
      ))}
      <style>{`
        ${Array.from({ length: 5 }, (_, i) => {
          const tx = [20, -15, 25, -12, 18][i];
          const ty = [-12, 18, -10, 15, -14][i];
          return `@keyframes fi-drift-${i}{0%,100%{transform:translate(0,0)}50%{transform:translate(${tx}px,${ty}px)}}`;
        }).join('')}
      `}</style>
    </motion.div>
  );
};

export default FloatingTechIcons;
