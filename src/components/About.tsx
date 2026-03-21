import { motion } from 'motion/react';
import NeuralPortrait from './NeuralPortrait';

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
              I'm an AI/ML engineer who thrives at the intersection of research and real-world impact. From
              publishing federated learning research to shipping computer vision systems in production, I chase
              the hardest problems I can find — and I don't stop until I've built something that actually works.
            </p>
            <p className="text-base md:text-lg text-slate-400 mb-6 leading-relaxed">
              What drives me is an obsession with learning. Every project I take on pushes me into unfamiliar
              territory — and that's exactly where I want to be. I've gone from classical ML to agentic AI
              pipelines, from big data architectures to medical imaging research, all within the span of a year,
              because I believe the best engineers never stop evolving.
            </p>
            <p className="text-base md:text-lg text-slate-400 mb-8 leading-relaxed">
              I'm currently finishing my Computer & Data Science degree at Alexandria University and actively
              seeking an opportunity where I can bring relentless curiosity, strong engineering instincts, and
              a genuine passion for AI to a team building something meaningful.
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
            className="order-first lg:order-last flex justify-center"
          >
            <NeuralPortrait />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
