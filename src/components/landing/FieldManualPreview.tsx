import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Shield, ChevronRight, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { hapticFeedback } from '@/components/ui/haptic-feedback';

export const FieldManualPreview: React.FC = () => {
  const navigate = useNavigate();

  const handleEnter = () => {
    hapticFeedback.medium();
    navigate('/field-manual');
  };

  return (
    <section className="relative py-24 overflow-hidden bg-[hsl(var(--alpha-black))]">
      {/* Background texture */}
      <div className="absolute inset-0 opacity-5 pointer-events-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxwYXRoIGQ9Ik0wIDBoMzAwdjMwMEgweiIgZmlsdGVyPSJ1cmwoI2EpIiBvcGFjaXR5PSIuMDUiLz48L3N2Zz4=')]" />
      
      {/* Ember particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 15 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-[hsl(var(--bronze))] rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${100 + Math.random() * 20}%`
            }}
            animate={{
              y: [-100, -window.innerHeight],
              opacity: [0, 1, 0],
              scale: [0, 1.5, 0]
            }}
            transition={{
              duration: 4 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 3,
              ease: "easeOut"
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Content */}
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            {/* Badge */}
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-[hsl(var(--ritual-khaki))]/20 border border-[hsl(var(--bronze))]/30 rounded">
              <FileText className="w-4 h-4 text-[hsl(var(--bronze))]" />
              <span className="font-mono text-[hsl(var(--bronze))] text-xs tracking-wider uppercase">
                Interactive Experience
              </span>
            </div>

            {/* Title */}
            <div>
              <motion.h2
                className="font-['Rakkas'] text-5xl md:text-6xl text-[hsl(var(--bronze))] uppercase tracking-wide mb-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                Field Manual
              </motion.h2>
              <p className="font-mono text-[hsl(var(--concrete-gray))] text-lg">
                A ritualized, scroll-driven indoctrination briefing
              </p>
            </div>

            {/* Description */}
            <div className="space-y-4 font-mono text-[hsl(var(--concrete-gray))] text-base leading-relaxed">
              <p>
                This is not a book. This is not a course. This is a{' '}
                <span className="text-[hsl(var(--bronze))] font-bold">ritual of transformation</span>.
              </p>
              <p>
                Experience our brutalist, military-themed digital magazine where each section 
                unfolds like a classified dossier—complete with interactive rituals, commanding 
                typography, and cinematic transitions.
              </p>
            </div>

            {/* Features */}
            <div className="space-y-3">
              {[
                'Scroll-driven narrative flow',
                'Interactive compliance rituals',
                'Military dossier aesthetics',
                'Cinematic section transitions'
              ].map((feature, index) => (
                <motion.div
                  key={feature}
                  className="flex items-center space-x-3"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                >
                  <div className="w-2 h-2 bg-[hsl(var(--shame-red))]" />
                  <span className="font-mono text-[hsl(var(--concrete-gray))] text-sm">
                    {feature}
                  </span>
                </motion.div>
              ))}
            </div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.8 }}
            >
              <Button
                onClick={handleEnter}
                size="lg"
                className="group bg-[hsl(var(--bronze))] hover:bg-[hsl(var(--bronze))]/90 text-[hsl(var(--alpha-black))] font-['Rakkas'] text-xl px-8 py-6"
              >
                <span>Enter the Manual</span>
                <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <p className="mt-3 font-mono text-[hsl(var(--concrete-gray))]/60 text-xs">
                Scroll to proceed. Obey to advance.
              </p>
            </motion.div>
          </motion.div>

          {/* Right: Visual Preview */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            {/* Main card with preview */}
            <div className="relative bg-[hsl(var(--ritual-khaki))] rounded-lg p-8 border-4 border-[hsl(var(--bronze))]/30">
              {/* Header mockup */}
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-[hsl(var(--bronze))]/20 pb-4">
                  <div className="text-[hsl(var(--bronze))] font-mono text-xs tracking-wider">
                    SEC 01
                  </div>
                  <div className="w-16 h-1 bg-[hsl(var(--bronze))]" />
                </div>

                <div>
                  <div className="font-['Rakkas'] text-4xl text-[hsl(var(--concrete-gray))] mb-3">
                    I
                  </div>
                  <div className="font-['Rakkas'] text-2xl text-[hsl(var(--alpha-black))] uppercase">
                    Training &<br />Discipline
                  </div>
                </div>

                <div className="space-y-2">
                  {[100, 80, 90, 70].map((width, i) => (
                    <div
                      key={i}
                      className="h-2 bg-[hsl(var(--alpha-black))]/20 rounded"
                      style={{ width: `${width}%` }}
                    />
                  ))}
                </div>
              </div>

              {/* Command Seal overlay */}
              <motion.div
                className="absolute -top-8 -right-8 w-32 h-32"
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <div className="w-full h-full rounded-full bg-gradient-to-br from-[hsl(var(--bronze))] to-[hsl(var(--shame-red))] flex items-center justify-center border-4 border-[hsl(var(--alpha-black))]">
                  <Shield className="w-16 h-16 text-[hsl(var(--alpha-black))]" />
                </div>
              </motion.div>

              {/* Decorative corner brackets */}
              <div className="absolute -top-4 -left-4 w-12 h-12 border-t-4 border-l-4 border-[hsl(var(--shame-red))]" />
              <div className="absolute -bottom-4 -right-4 w-12 h-12 border-b-4 border-r-4 border-[hsl(var(--shame-red))]" />
            </div>

            {/* Floating OBEYED stamp */}
            <motion.div
              className="absolute -bottom-4 -left-4 w-24 h-24 rounded-full border-4 border-[hsl(var(--shame-red))] bg-[hsl(var(--alpha-black))] flex items-center justify-center transform -rotate-12"
              animate={{ 
                rotate: [-12, -15, -12],
                scale: [1, 1.05, 1]
              }}
              transition={{ 
                duration: 3, 
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <div className="text-center">
                <div className="font-['Rakkas'] text-sm text-[hsl(var(--shame-red))]">
                  OBEYED
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
