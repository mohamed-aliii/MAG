import { Award } from 'lucide-react';
import { motion } from 'motion/react';

export default function About() {
  return (
    <section id="about" className="py-20 md:py-32 px-6 relative">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 md:gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-8">
              About <span className="text-emerald-500">Me</span>
            </h2>
            <p className="text-base md:text-lg text-slate-400 mb-6 leading-relaxed">
              Junior AI/ML Engineer with hands-on training across RAG systems, computer vision, data pipelines, and
              MLOps deployment. Delivered production-grade projects using FastAPI, LangChain, PyTorch, and Docker,
              backed by DeepLearning.AI specializations and an AWS certification.
            </p>
            <p className="text-base md:text-lg text-slate-400 mb-8 leading-relaxed">
              Seeking an internship to apply practical ML engineering skills in building scalable, real-world AI
              solutions. Currently pursuing a Bachelor of Computer and Data Science at Alexandria University.
            </p>
            <div className="grid grid-cols-2 gap-4 md:gap-6">
              <div className="glass p-4 md:p-6 rounded-2xl">
                <h4 className="text-emerald-500 font-bold text-xl md:text-3xl mb-1">3.7</h4>
                <p className="text-[10px] md:text-xs text-slate-500 uppercase tracking-wider">CGPA / 4.0</p>
              </div>
              <div className="glass p-4 md:p-6 rounded-2xl">
                <h4 className="text-emerald-500 font-bold text-xl md:text-3xl mb-1">2026</h4>
                <p className="text-[10px] md:text-xs text-slate-500 uppercase tracking-wider">Expected Graduation</p>
              </div>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative order-first lg:order-last"
          >
            <div className="aspect-square rounded-3xl overflow-hidden glass p-2 max-w-md mx-auto">
              <img
                src="https://picsum.photos/seed/tech/800/800"
                alt="Mohamed Ali Ghoniem"
                className="w-full h-full object-cover rounded-2xl grayscale hover:grayscale-0 transition-all duration-700"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="absolute -bottom-4 -right-4 glass p-4 md:p-6 rounded-2xl border-emerald-500/30 hidden sm:block">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-emerald-500 rounded-full flex items-center justify-center text-slate-950">
                  <Award className="w-5 h-5 md:w-6 md:h-6" />
                </div>
                <div>
                  <p className="text-xs md:text-sm font-bold text-white">AI/ML Specialist</p>
                  <p className="text-[10px] md:text-xs text-slate-500">Certified Developer</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
