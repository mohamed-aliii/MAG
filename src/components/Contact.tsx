import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Phone, MapPin, Linkedin, Github, Loader2, CheckCircle2, XCircle } from 'lucide-react';

// ⬇️ Paste your Web3Forms access key here (get one free at https://web3forms.com)
const ACCESS_KEY = 'cbead54b-7e6a-4e44-a785-7d0c97c94b58';

export default function Contact() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('loading');

    const form = e.target as HTMLFormElement;
    const data = new FormData(form);
    data.append('access_key', ACCESS_KEY);

    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: data,
      });
      const json = await res.json();
      if (json.success) {
        setStatus('success');
        form.reset();
        setTimeout(() => setStatus('idle'), 4000);
      } else {
        setStatus('error');
        setTimeout(() => setStatus('idle'), 4000);
      }
    } catch {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 4000);
    }
  };

  return (
    <section id="contact" className="py-20 md:py-32 px-6 relative">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass rounded-[2rem] md:rounded-[40px] overflow-hidden"
        >
          <div className="grid lg:grid-cols-2">
            <div className="p-8 md:p-16 bg-emerald-500 text-slate-950">
              <h2 className="text-3xl md:text-5xl font-bold mb-8">Let's <span className="text-slate-900/30">Connect</span></h2>
              <p className="text-slate-900 font-medium mb-12 text-base md:text-lg">
                I'm always open to discussing new AI projects, creative ideas or opportunities to be part of your visions.
              </p>
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-slate-950/10 rounded-xl flex items-center justify-center">
                    <Mail className="w-5 h-5 md:w-6 md:h-6" />
                  </div>
                  <span className="font-bold text-sm md:text-base break-all">mohamed.ali.ghonam@gmail.com</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-slate-950/10 rounded-xl flex items-center justify-center">
                    <Phone className="w-5 h-5 md:w-6 md:h-6" />
                  </div>
                  <span className="font-bold text-sm md:text-base">+20 106 466 1765</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-slate-950/10 rounded-xl flex items-center justify-center">
                    <MapPin className="w-5 h-5 md:w-6 md:h-6" />
                  </div>
                  <span className="font-bold text-sm md:text-base">Alexandria, Egypt</span>
                </div>
              </div>
              <div className="flex gap-4 mt-12">
                <a
                  href="https://www.linkedin.com/in/mohammed-ghoneim/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 bg-slate-950 text-white rounded-xl flex items-center justify-center hover:scale-110 transition-transform"
                >
                  <Linkedin className="w-6 h-6" />
                </a>
                <a
                  href="https://github.com/mohamed-aliii"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 bg-slate-950 text-white rounded-xl flex items-center justify-center hover:scale-110 transition-transform"
                >
                  <Github className="w-6 h-6" />
                </a>
              </div>
            </div>
            <div className="p-8 md:p-16">
              <form onSubmit={handleSubmit} className="space-y-6">
                <input type="hidden" name="subject" value="New message from MAG portfolio" />
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      required
                      className="w-full bg-slate-800/50 border border-white/10 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      required
                      className="w-full bg-slate-800/50 border border-white/10 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">Message</label>
                  <textarea
                    rows={4}
                    name="message"
                    required
                    className="w-full bg-slate-800/50 border border-white/10 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                    placeholder="How can I help you?"
                  />
                </div>
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className={`w-full py-4 font-bold rounded-xl transition-all duration-300 transform hover:scale-[1.01] flex items-center justify-center gap-2 ${status === 'success'
                      ? 'bg-emerald-400 text-slate-950'
                      : status === 'error'
                        ? 'bg-red-500 text-white'
                        : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950'
                    }`}
                >
                  {status === 'loading' && <><Loader2 className="w-5 h-5 animate-spin" /> Sending...</>}
                  {status === 'success' && <><CheckCircle2 className="w-5 h-5" /> Message Sent!</>}
                  {status === 'error' && <><XCircle className="w-5 h-5" /> Failed — Try Again</>}
                  {status === 'idle' && 'Send Message'}
                </button>
              </form>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
