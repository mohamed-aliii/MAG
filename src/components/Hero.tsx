import { useEffect, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { motion } from 'motion/react';

const phrases = ['Agentic AI', 'RAG Systems', 'Machine Learning' ,'MLOps', 'Computer Vision', 'Generative AI'];

export default function Hero() {
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentPhrase = phrases[phraseIndex];
    let typeSpeed = isDeleting ? 50 : 150;

    if (!isDeleting && charIndex === currentPhrase.length) {
      setTimeout(() => setIsDeleting(true), 2000);
    } else if (isDeleting && charIndex === 0) {
      setIsDeleting(false);
      setPhraseIndex((prev) => (prev + 1) % phrases.length);
      typeSpeed = 500;
    }

    const timeout = setTimeout(() => {
      setCharIndex((prev) => (isDeleting ? prev - 1 : prev + 1));
    }, typeSpeed);

    return () => clearTimeout(timeout);
  }, [charIndex, isDeleting, phraseIndex]);

  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-6 pt-20 relative">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-4xl text-center z-10"
      >
        <div className="inline-block px-4 py-1.5 mb-6 glass rounded-full border border-emerald-500/30 text-emerald-400 text-[10px] md:text-xs font-semibold tracking-widest uppercase">
          Junior AI/ML Engineer
        </div>
        <h1 className="text-4xl sm:text-6xl md:text-8xl font-bold mb-6 tracking-tight leading-tight md:leading-none">
          Mohamed Ali <span className="text-emerald-500">Ghoniem</span>
        </h1>
        <p className="text-lg md:text-2xl text-slate-400 mb-10 max-w-2xl mx-auto font-light px-4">
          Building intelligent systems with{' '}
          <span className="typing-text text-white font-medium">
            {phrases[phraseIndex].substring(0, charIndex)}
          </span>
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 px-4">
          <a
            href="#projects"
            className="px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl transition-all duration-300 transform hover:scale-105 w-full sm:w-auto text-center"
          >
            View Projects
          </a>
          <a
            href="#contact"
            className="px-8 py-4 glass hover:bg-white/10 text-white font-bold rounded-xl transition-all duration-300 w-full sm:w-auto text-center"
          >
            Get in Touch
          </a>
        </div>
      </motion.div>
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce text-slate-500 hidden sm:block">
        <ChevronDown className="w-6 h-6" />
      </div>
    </section>
  );
}
