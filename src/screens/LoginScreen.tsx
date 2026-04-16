import React from 'react';
import { toast } from 'sonner';
import { Icon } from '../components/Icon';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';

export const LoginScreen = () => {
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    toast.promise(new Promise((resolve) => setTimeout(resolve, 1500)), {
      loading: 'Authenticating credentials...',
      success: () => {
        navigate('/');
        return 'Login successful. Welcome back, Admin.';
      },
      error: 'Authentication failed. Please check your credentials.',
    });
  };

  const handleForgotPassword = (e: React.MouseEvent) => {
    e.preventDefault();
    toast.info('Password reset instructions have been sent to your registered email.');
  };

  const handleFooterLink = (e: React.MouseEvent, link: string) => {
    e.preventDefault();
    toast.info(`Navigating to ${link}...`);
  };

  return (
    <main className="min-h-screen flex flex-col md:flex-row overflow-hidden bg-surface-container-lowest">
      {/* Left Side: Visual Anchor */}
      <section className="hidden md:flex md:w-1/2 lg:w-[55%] relative flex-col justify-center items-center bg-secondary-container p-12 overflow-hidden">
        <div className="absolute inset-0 bg-clinical-pattern opacity-40"></div>
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 w-full max-w-lg"
        >
          <div className="mb-12">
            <span className="inline-block px-4 py-1 rounded-full bg-primary-container/10 text-primary-container text-xs font-bold tracking-widest uppercase mb-4">
              Clinical Systems
            </span>
            <h1 className="font-headline text-5xl lg:text-6xl text-primary font-extrabold tracking-tight leading-[1.1]">
              The Future of <br/>
              <span className="text-primary-container">Precision Health.</span>
            </h1>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-surface-container-lowest p-6 rounded-xl shadow-[0_12px_32px_rgba(101,0,11,0.04)]">
              <Icon name="clinical_notes" className="text-primary-container mb-3 text-3xl" />
              <h3 className="font-headline text-lg font-bold text-on-surface">Data Integrity</h3>
              <p className="text-on-surface-variant text-sm mt-2 leading-relaxed">Validated clinical records processed with architectural precision.</p>
            </div>
            <div className="bg-surface-container-lowest p-6 rounded-xl shadow-[0_12px_32px_rgba(101,0,11,0.04)] translate-y-8">
              <Icon name="shield_with_heart" fill className="text-primary-container mb-3 text-3xl" />
              <h3 className="font-headline text-lg font-bold text-on-surface">Secure Protocol</h3>
              <p className="text-on-surface-variant text-sm mt-2 leading-relaxed">End-to-end encrypted administrative access for healthcare providers.</p>
            </div>
          </div>
        </motion.div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-primary-container/5 rounded-full blur-3xl"></div>
      </section>

      {/* Right Side: Login Interaction */}
      <section className="flex-1 flex flex-col justify-center items-center p-6 md:p-12 lg:p-24 relative">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="w-full max-w-md"
        >
          <div className="mb-12 text-center md:text-left">
            <div className="flex items-center gap-2 mb-8 justify-center md:justify-start">
              <div className="w-10 h-10 bg-primary-container flex items-center justify-center rounded-lg">
                <Icon name="medical_services" className="text-on-primary" />
              </div>
              <span className="text-2xl font-headline font-extrabold text-primary-container tracking-tight">MediTrack</span>
            </div>
            <h2 className="font-headline text-3xl font-bold text-on-surface mb-2">Admin Portal</h2>
            <p className="text-on-surface-variant text-body-md">Secure login to manage healthcare system</p>
          </div>

          <form className="space-y-6" onSubmit={handleLogin}>
            <div className="space-y-4">
              <div className="group">
                <label className="block text-xs font-semibold text-on-surface-variant tracking-wider uppercase mb-1 ml-1" htmlFor="email">Email / Username</label>
                <div className="relative">
                  <Icon name="person" className="absolute left-3 top-1/2 -translate-y-1/2 text-outline-variant" />
                  <input 
                    className="w-full pl-10 pr-4 py-4 bg-surface-container-low border-b-2 border-outline-variant focus:border-primary-container outline-none transition-all duration-300 font-body text-on-surface rounded-t-lg" 
                    id="email" 
                    placeholder="Enter your email" 
                    type="text"
                    required
                  />
                </div>
              </div>
              <div className="group">
                <div className="flex justify-between items-center mb-1 ml-1">
                  <label className="block text-xs font-semibold text-on-surface-variant tracking-wider uppercase" htmlFor="password">Password</label>
                  <a 
                    className="text-xs font-semibold text-primary-container hover:underline transition-all" 
                    href="#"
                    onClick={handleForgotPassword}
                  >
                    Forgot Password?
                  </a>
                </div>
                <div className="relative">
                  <Icon name="lock" className="absolute left-3 top-1/2 -translate-y-1/2 text-outline-variant" />
                  <input 
                    className="w-full pl-10 pr-12 py-4 bg-surface-container-low border-b-2 border-outline-variant focus:border-primary-container outline-none transition-all duration-300 font-body text-on-surface rounded-t-lg" 
                    id="password" 
                    placeholder="••••••••" 
                    type="password"
                    required
                  />
                  <button 
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-outline-variant hover:text-on-surface-variant transition-colors" 
                    type="button"
                    onClick={() => toast.info('Password visibility toggled')}
                  >
                    <Icon name="visibility" />
                  </button>
                </div>
              </div>
            </div>
            <div className="flex items-center">
              <input 
                className="w-4 h-4 text-primary-container border-outline-variant rounded focus:ring-primary-container" 
                id="remember" 
                type="checkbox"
                onChange={(e) => toast.info(`Remember workstation: ${e.target.checked ? 'Enabled' : 'Disabled'}`)}
              />
              <label className="ml-2 text-sm text-on-surface-variant" htmlFor="remember">Remember this workstation for 30 days</label>
            </div>
            <button 
              className="w-full py-4 bg-primary-container text-on-primary font-headline font-bold rounded-xl shadow-[0_8px_24px_rgba(101,0,11,0.15)] hover:bg-primary transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-2" 
              type="submit"
            >
              <span>Login to Dashboard</span>
              <Icon name="arrow_forward" className="text-[20px]" />
            </button>
          </form>

          <div className="mt-12 flex items-center justify-center gap-2 py-3 px-4 bg-surface-container-low rounded-full border border-outline-variant/10">
            <Icon name="verified_user" fill className="text-primary-container text-[18px]" />
            <span className="text-xs font-semibold text-on-surface-variant uppercase tracking-widest">Authorized personnel only</span>
          </div>
        </motion.div>

        <footer className="absolute bottom-8 left-0 right-0 px-12 flex flex-col md:flex-row justify-between items-center gap-4 text-[11px] font-bold text-on-surface-variant uppercase tracking-widest opacity-60">
          <div className="flex gap-6">
            <a className="hover:text-primary-container transition-colors" href="#" onClick={(e) => handleFooterLink(e, 'Help Center')}>Help Center</a>
            <a className="hover:text-primary-container transition-colors" href="#" onClick={(e) => handleFooterLink(e, 'Contact Support')}>Contact Support</a>
            <a className="hover:text-primary-container transition-colors" href="#" onClick={(e) => handleFooterLink(e, 'Privacy Policy')}>Privacy Policy</a>
          </div>
          <div className="font-normal normal-case italic">
            © 2024 MediTrack Clinical Systems.
          </div>
        </footer>
      </section>
    </main>
  );
};
