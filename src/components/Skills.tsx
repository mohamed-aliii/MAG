import { motion } from 'motion/react';
import { Terminal, Brain, Sparkles, Eye, Database, Server } from 'lucide-react';

const skillGroups = [
  { 
    title: "Languages & Tools",
    icon: <Terminal />,
    skills: ["Python", "SQL", "Git", "GitHub", "Linux"]
  },
  {
    title: "ML & Deep Learning",
    icon: <Brain />,
    skills: ["PyTorch", "TensorFlow", "Scikit-learn", "Transformers"]
  },
  {
    title: "GenAI & NLP",
    icon: <Sparkles />,
    skills: ["LangChain", "RAG", "Agentic AI", "Prompt Engineering", "CrewAI", "FAISS"]
  },
  {
    title: "Computer Vision",
    icon: <Eye />,
    skills: ["OpenCV", "MediaPipe", "Object Detection", "Image Classification"]
  },
  {
    title: "Data Engineering",
    icon: <Database />,
    skills: ["Apache Spark", "Hadoop", "HDFS", "Hive", "Elasticsearch", "Kafka"]  
  },
  {
    title: "Deployment & MLOps",
    icon: <Server />,
    skills: ["FastAPI", "Docker", "CI/CD", "AWS", "Feature Store"]
  }
];

export default function Skills() {
  return (
    <section id="skills" className="py-20 md:py-32 px-6 bg-slate-900/30">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Technical <span className="text-emerald-500">Skills</span></h2>
          <p className="text-slate-400">Core competencies and technical stack</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {skillGroups.map((group, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="glass p-8 rounded-3xl border-t border-t-emerald-500/20"
            >
              <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-500 mb-6">
                {group.icon}
              </div>
              <h3 className="text-lg font-bold text-white mb-4">{group.title}</h3>
              <div className="flex flex-wrap gap-2">
                {group.skills.map((skill, i) => (
                  <span key={i} className="skill-tag">
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
