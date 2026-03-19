export default function Footer() {
  return (
    <footer className="py-12 px-6 border-t border-white/5">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <p className="text-slate-500 text-sm text-center md:text-left">
          © {new Date().getFullYear()} Mohamed Ali Ghoniem. All rights reserved.
        </p>
        <div className="flex gap-8">
          <a href="#" className="text-slate-500 hover:text-emerald-500 text-sm transition-colors">Privacy Policy</a>
          <a href="#" className="text-slate-500 hover:text-emerald-500 text-sm transition-colors">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
}
