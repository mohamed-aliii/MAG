import { useRef, useEffect, useState } from 'react';
import { motion, useAnimationControls } from 'motion/react';
import { Award, ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react';

const certifications = [
  {
    title: "Agentic AI",
    issuer: "DeepLearning.AI",
    year: "2026",
    link: "#"
  },
  {
    title: "MLOps Specialization",
    issuer: "DeepLearning.AI",
    year: "2025",
    link: "#"
  },
  {
    title: "NLP Specialization",
    issuer: "DeepLearning.AI",
    year: "2025",
    link: "#"
  },
  {
    title: "Deep Learning Specialization",
    issuer: "DeepLearning.AI",
    year: "2024",
    link: "#"
  },
  {
    title: "ML Specialization",
    issuer: "DeepLearning.AI",
    year: "2023",
    link: "#"
  },
  {
    title: "AWS Cloud Foundations",
    issuer: "Amazon Web Services",
    year: "2023",
    link: "#"
  }
];

export default function Certifications() {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);

  const scroll = (direction: 'left' | 'right') => {
    if (sliderRef.current) {
      const scrollAmount = window.innerWidth < 768 ? 300 : 400;
      const maxScroll = sliderRef.current.scrollWidth - sliderRef.current.clientWidth;
      
      let targetScroll = direction === 'right' 
        ? sliderRef.current.scrollLeft + scrollAmount 
        : sliderRef.current.scrollLeft - scrollAmount;

      // Handle looping
      if (direction === 'right' && sliderRef.current.scrollLeft >= maxScroll - 10) {
        targetScroll = 0;
      } else if (direction === 'left' && sliderRef.current.scrollLeft <= 10) {
        targetScroll = maxScroll;
      }

      sliderRef.current.scrollTo({
        left: targetScroll,
        behavior: 'smooth'
      });
    }
  };

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      scroll('right');
    }, 3000); // Increased to 3s for better readability

    return () => clearInterval(interval);
  }, [isPaused]);

  return (
    <section 
      id="certifications" 
      className="py-20 md:py-32 px-6 overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Professional <span className="text-emerald-500">Certifications</span></h2>
          <p className="text-slate-400">Specialized training and industry recognition</p>
        </motion.div>
        
        <div className="relative">
          <div 
            ref={sliderRef}
            className="flex overflow-x-auto gap-6 pb-8 snap-x snap-mandatory no-scrollbar scroll-smooth"
          >
            {certifications.map((cert, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="min-w-[280px] md:min-w-[350px] snap-center glass p-8 rounded-3xl border-t border-t-emerald-500/20 flex flex-col justify-between h-64"
              >
                <div>
                  <div className="w-10 h-10 bg-emerald-500/10 rounded-lg flex items-center justify-center text-emerald-500 mb-4">
                    <Award className="w-5 h-5" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{cert.title}</h3>
                  <p className="text-slate-400 text-sm">{cert.issuer}</p>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-emerald-500 font-bold">{cert.year}</span>
                  <a href={cert.link} className="hover:text-emerald-500 transition-colors">
                    <ExternalLink className="w-4 h-4 text-slate-500" />
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
          
          <div className="flex justify-center gap-4 mt-8">
            <button 
              onClick={() => scroll('left')}
              className="w-12 h-12 glass rounded-full flex items-center justify-center text-white hover:bg-emerald-500 hover:text-slate-950 transition-all"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button 
              onClick={() => scroll('right')}
              className="w-12 h-12 glass rounded-full flex items-center justify-center text-white hover:bg-emerald-500 hover:text-slate-950 transition-all"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
