import { motion } from 'motion/react';
import { Github, ExternalLink, ArrowRight } from 'lucide-react';

const projects = [
  {
    title: "Medical Image Diagnosis System",
    description: "Multi-class classification system using Inception-V3 for 4 cancer types. Integrated a fine-tuned BERT model for auto-generating clinical diagnosis descriptions.",
    image: "https://picsum.photos/seed/medical/600/400",
    tags: ["Computer Vision & NLP"],
    tech: ["PT", "FA"],
    github: "#",
    link: "#"
  },
  {
    title: "Hand Gesture Recognition System",
    description: "Real-time gesture recognition pipeline using MediaPipe and Random Forest, achieving ~98% F1-score across 15 gesture classes at 20 FPS.",
    image: "https://picsum.photos/seed/gesture/600/400",
    tags: ["Real-time CV"],
    tech: ["DK", "ST"],
    github: "#",
    link: "#"
  }
];

export default function Projects() {
  return (
    <section id="projects" className="py-20 md:py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6"
        >
          <div>
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Featured <span className="text-emerald-500">Projects</span></h2>
            <p className="text-slate-400">Showcasing my technical expertise in AI/ML</p>
          </div>
          <a 
            href="https://github.com/mohamed-aliii" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-emerald-500 font-bold hover:text-emerald-400 transition-colors group"
          >
            View GitHub <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          </a>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-6 md:gap-8 max-w-5xl mx-auto">
          {projects.map((project, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="project-card glass rounded-3xl overflow-hidden group"
            >
              <div className="relative h-56 md:h-64 overflow-hidden">
                <img 
                  src={project.image} 
                  alt={project.title} 
                  className="project-img w-full h-full object-cover transition-transform duration-700" 
                  referrerPolicy="no-referrer" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent opacity-60"></div>
                <div className="absolute bottom-4 left-4 flex gap-2">
                  {project.tags.map((tag, i) => (
                    <span key={i} className="px-3 py-1 bg-emerald-500 text-slate-950 text-[10px] font-bold rounded-full uppercase tracking-tighter">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-3">{project.title}</h3>
                <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                  {project.description}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex gap-4 text-slate-500">
                    <a href={project.github} className="hover:text-emerald-500 transition-colors">
                      <Github className="w-5 h-5" />
                    </a>
                    <a href={project.link} className="hover:text-emerald-500 transition-colors">
                      <ExternalLink className="w-5 h-5" />
                    </a>
                  </div>
                  <div className="flex -space-x-2">
                    {project.tech.map((t, i) => (
                      <div 
                        key={i} 
                        className="w-8 h-8 rounded-full bg-slate-800 border-2 border-slate-900 flex items-center justify-center text-[10px] font-bold text-emerald-500"
                        title={t}
                      >
                        {t}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
