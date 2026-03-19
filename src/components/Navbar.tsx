import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const navLinks = [
  { name: 'About', href: '#about' },
  { name: 'Experience', href: '#experience' },
  { name: 'Projects', href: '#projects' },
  { name: 'Skills', href: '#skills' },
  { name: 'Contact', href: '#contact' },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 w-full z-50 px-4 md:px-6 transition-all duration-300 ${
          isScrolled ? 'py-2' : 'py-4'
        }`}
      >
        <div
          className={`max-w-7xl mx-auto flex justify-between items-center glass rounded-2xl px-4 md:px-6 transition-all duration-300 ${
            isScrolled ? 'py-2' : 'py-3'
          }`}
        >
          <motion.a 
            href="#" 
            className="relative text-2xl font-bold tracking-tighter text-white group"
            initial="initial"
            whileHover="hover"
          >
            <motion.span
              className="inline-block"
              variants={{
                initial: { x: 0 },
                hover: { x: -2 }
              }}
            >
              MAG
            </motion.span>
            <motion.span 
              className="text-emerald-500 inline-block"
              variants={{
                initial: { scale: 1, opacity: 1 },
                hover: { 
                  scale: [1, 1.5, 1],
                  opacity: [1, 0.5, 1],
                  transition: { repeat: Infinity, duration: 1 }
                }
              }}
            >
              .
            </motion.span>
            
            {/* Animated underline/shimmer effect */}
            <motion.div 
              className="absolute -bottom-1 left-0 h-[2px] bg-emerald-500"
              variants={{
                initial: { width: 0, opacity: 0 },
                hover: { width: '100%', opacity: 1 }
              }}
            />
            
            {/* Subtle glow on hover */}
            <motion.div 
              className="absolute inset-0 bg-emerald-500/20 blur-xl rounded-full -z-10"
              variants={{
                initial: { opacity: 0, scale: 0.5 },
                hover: { opacity: 1, scale: 1.2 }
              }}
            />
          </motion.a>
          <div className="hidden md:flex space-x-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="nav-link text-sm font-medium text-slate-300 hover:text-white"
              >
                {link.name}
              </a>
            ))}
          </div>
          <button
            className="md:hidden text-white p-2"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[60] bg-slate-950/98 backdrop-blur-2xl flex flex-col items-center justify-center space-y-8"
          >
            <button
              className="absolute top-8 right-8 text-white p-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <X className="w-8 h-8" />
            </button>
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-3xl font-bold text-white hover:text-emerald-500 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.name}
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
