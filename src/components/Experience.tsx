import { motion } from 'motion/react';
import { Bot, Database, Cpu, MapPin } from 'lucide-react';

const experiences = [
  {
    title: "Agentic AI Engineer — Training Program",
    company: "Information Technology Institute (ITI)",
    location: "Alexandria, Egypt",
    period: "Jan 2026 – Feb 2026",
    icon: <Bot className="w-6 h-6 md:w-8 md:h-8" />,
    description: [
      "Engineered production-ready RAG pipelines with LangChain and FAISS, enabling context-aware Q&A over private documents.",
      "Fine-tuned open-source LLMs (Mistral, LLaMA) for agentic workflows, significantly reducing hallucination rates during validation.",
      "Developed multi-step agentic systems for autonomous task execution, validating reliability across 50+ test scenarios."
    ]
  },
  {
    title: "Big Data Associate — Training Program",
    company: "National Telecommunication Institute (NTI)",
    location: "Alexandria, Egypt",
    period: "May 2025 – Jul 2025",
    icon: <Database className="w-6 h-6 md:w-8 md:h-8" />,
    description: [
      "Deployed distributed storage and batch processing solutions using the Hadoop ecosystem (HDFS, MapReduce, Hive).",
      "Built data processing pipelines utilizing Apache Spark to manage high-throughput data ingestion.",
      "Implemented scalable search and analytics features using Elasticsearch across multi-node environments."
    ]
  },
  {
    title: "Machine Learning Engineer — Training Program",
    company: "Digital Egypt Pioneers Initiative (DEPI)",
    location: "Alexandria, Egypt",
    period: "Sep 2024 – Apr 2025",
    icon: <Cpu className="w-6 h-6 md:w-8 md:h-8" />,
    description: [
      "Engineered classification and regression models (CNNs, RNNs, XGBoost), boosting predictive accuracy by 15% via systematic hyperparameter tuning.",
      "Ensured production-level reliability by applying rigorous cross-validation, confusion matrix analysis, and A/B testing.",
      "Optimized preprocessing pipelines with Pandas and Scikit-learn, actively reducing model training time."
    ]
  }
];

export default function Experience() {
  return (
    <section id="experience" className="py-20 md:py-32 px-6 bg-slate-900/30">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Work <span className="text-emerald-500">Experience</span></h2>
          <p className="text-slate-400">Professional journey and contributions</p>
        </motion.div>

        <div className="space-y-6 md:space-y-8">
          {experiences.map((exp, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="glass p-6 md:p-10 rounded-[2rem] border-l-4 border-l-emerald-500"
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between mb-8 gap-4">
                <div className="flex items-start gap-4 md:gap-6">
                  <div className="w-12 h-12 md:w-16 md:h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500 border border-emerald-500/20 shrink-0">
                    {exp.icon}
                  </div>
                  <div>
                    <h3 className="text-xl md:text-2xl font-bold text-white mb-1">{exp.title}</h3>
                    <p className="text-emerald-500 font-medium text-lg">{exp.company}</p>
                    <p className="text-slate-500 text-sm mt-1 flex items-center gap-2">
                      <MapPin className="w-3 h-3" /> {exp.location}
                    </p>
                  </div>
                </div>
                <div className="px-4 py-1.5 bg-slate-800/50 rounded-full text-xs font-semibold text-emerald-400 border border-emerald-500/20 self-start md:self-auto">
                  {exp.period}
                </div>
              </div>
              <ul className="space-y-4 text-slate-400 text-sm md:text-base">
                {exp.description.map((item, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="text-emerald-500 mt-1.5">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
