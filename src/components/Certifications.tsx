import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Award, ExternalLink, Calendar, Building2, BookOpen } from 'lucide-react';

const certifications = [
  {
    title: 'Microsoft Machine Learning Engineering',
    issuer: 'Digital Egypt Pioneers Initiative',
    date: 'May 2025',
    image: '/certs/depi m.jpg',
    link: '#',
  },
  {
    title: 'Huawei Big Data Associate',
    issuer: 'Huawei-NTI',
    date: 'July 2025',
    image: '/certs/nti big.jpg',
    link: '#',
  },
  {
    title: 'AWS Foundations',
    issuer: 'AWS',
    date: 'October 2024',
    image: '/certs/AWS FOUNDATION.jpg',
    link: '#',
  },
  {
    title: 'Machine Learning Specialization',
    issuer: 'DeepLearning.AI',
    date: 'December 2023',
    image: '/certs/ML.jpg',
    link: '#',
  },
  {
    title: 'Deep Learning Specialization',
    issuer: 'DeepLearning.AI',
    date: 'April 2024',
    image: '/certs/DL.jpg',
    link: '#',
  },
  {
    title: 'Tensorflow Developer',
    issuer: 'DeepLearning.AI',
    date: 'November 2025',
    image: '/certs/dltf.png',
    link: '#',
  },

  {
    title: 'MLOps Specialization',
    issuer: 'DeepLearning.AI',
    date: 'December 2025',
    image: '/certs/mlops.png',
    link: '#',
  },
  {
    title: 'SWE',
    issuer: 'Fuzetek',
    date: 'October 2025',
    image: '/certs/fuze.jpg',
    link: '#',
  },
  {
    title: 'Computer vision',
    issuer: 'Cellula Technologies',
    date: 'August 2025',
    image: '/certs/ccv.jpg',
    link: '#',
  },
  {
    title: 'Research internship',
    issuer: 'Nile University',
    date: 'August 2025',
    image: '/certs/nile.jpg',
    link: '#',
  },
    {
    title: 'Deep Learning',
    issuer: 'Nvidea',
    date: 'September 2025',
    image: '/certs/ndl.png',
    link: '#',
  },
  {
    title: 'Building LLM Applications with Prompt Engineering',
    issuer: 'Nvidea',
    date: 'September 2025',
    image: '/certs/nllm.jpg',
    link: '#',
  },
];

// Duplicate items to create seamless infinite loop
const items = [...certifications, ...certifications];

interface CertCardProps {
  cert: typeof certifications[number];
}

function CertCard({ cert }: CertCardProps) {
  const [hovered, setHovered] = useState(false);
  const [imgError, setImgError] = useState(false);

  return (
    <div
      className="relative shrink-0 rounded-2xl overflow-hidden cursor-pointer"
      style={{
        width: '340px',
        boxShadow: '0 0 0 1px rgba(255,255,255,0.07)',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Certificate image / placeholder */}
      {!imgError ? (
        <img
          src={cert.image}
          alt={cert.title}
          onError={() => setImgError(true)}
          className="w-full h-auto object-cover block"
          draggable={false}
        />
      ) : (
        <div
          className="w-full flex flex-col items-center justify-center gap-3 bg-slate-900 border border-slate-800"
          style={{ height: '220px' }}
        >
          <Award className="w-10 h-10 text-emerald-500 opacity-50" />
          <div className="text-center px-4">
            <p className="text-white font-bold text-sm leading-snug">{cert.title}</p>
            <p className="text-slate-500 text-xs mt-1">{cert.issuer}</p>
          </div>
          <p className="text-xs text-slate-600 px-4 text-center">
            <code className="text-emerald-600">{cert.image}</code>
          </p>
        </div>
      )}

      {/* Hover overlay */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 flex flex-col justify-end"
            style={{
              background:
                'linear-gradient(to top, rgba(3,7,18,0.97) 0%, rgba(3,7,18,0.75) 50%, rgba(3,7,18,0.10) 100%)',
            }}
          >
            {/* External link */}
            <a
              href={cert.link}
              target="_blank"
              rel="noopener noreferrer"
              onClick={e => e.stopPropagation()}
              className="absolute top-3 right-3 w-8 h-8 rounded-full bg-slate-900/80 border border-slate-700 flex items-center justify-center text-slate-300 hover:text-emerald-400 hover:border-emerald-500/50 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <div className="p-4 space-y-2">
              <div className="flex items-start gap-2">
                <BookOpen className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                <p className="text-white font-bold text-sm leading-snug">{cert.title}</p>
              </div>
              <div className="flex items-center gap-2">
                <Building2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <p className="text-slate-300 text-xs">{cert.issuer}</p>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <p className="text-slate-300 text-xs">{cert.date}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Border glow on hover */}
      <motion.div
        className="absolute inset-0 rounded-2xl pointer-events-none"
        animate={{
          boxShadow: hovered
            ? '0 0 0 2px rgba(16,185,129,0.55), 0 8px 32px rgba(16,185,129,0.12)'
            : '0 0 0 1px rgba(255,255,255,0.07)',
        }}
        transition={{ duration: 0.2 }}
      />
    </div>
  );
}

export default function Certifications() {
  const [paused, setPaused] = useState(false);

  return (
    <section id="certifications" className="py-20 md:py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Professional <span className="text-emerald-500">Certifications</span>
          </h2>
          <p className="text-slate-400">Specialized training and industry recognition</p>
        </motion.div>
      </div>

      {/* Infinite marquee strip */}
      <div
        className="relative"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {/* Left fade */}
        <div
          className="absolute left-0 top-0 bottom-0 w-32 z-10 pointer-events-none"
          style={{
            background: 'linear-gradient(to right, #030712 0%, transparent 100%)',
          }}
        />
        {/* Right fade */}
        <div
          className="absolute right-0 top-0 bottom-0 w-32 z-10 pointer-events-none"
          style={{
            background: 'linear-gradient(to left, #030712 0%, transparent 100%)',
          }}
        />

        <div
          className="flex gap-5 pb-3"
          style={{
            animation: `marquee 32s linear infinite`,
            animationPlayState: paused ? 'paused' : 'running',
            width: 'max-content',
          }}
        >
          {items.map((cert, i) => (
            <CertCard key={`${cert.title}-${i}`} cert={cert} />
          ))}
        </div>
      </div>

      {/* Keyframe injected via style tag */}
      <style>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
      `}</style>
    </section>
  );
}
