import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ManualLayout } from '@/components/manual/layout/ManualLayout';
import { SectionHero } from '@/components/manual/sections/SectionHero';
import { Section01 } from '@/components/manual/sections/Section01';
import { Section02 } from '@/components/manual/sections/Section02';
import { SectionInteractive } from '@/components/manual/sections/SectionInteractive';
import { SectionFinal } from '@/components/manual/sections/SectionFinal';

export const FieldManual: React.FC = () => {
  const [currentSection, setCurrentSection] = useState(0);
  const [completedSections, setCompletedSections] = useState<number[]>([]);

  const sections = [
    { id: 0, component: SectionHero, title: "Welcome to Hell, Maggot" },
    { id: 1, component: Section01, title: "Training & Discipline" },
    { id: 2, component: Section02, title: "The Path of Obedience" },
    { id: 3, component: SectionInteractive, title: "Ritual of Submission" },
    { id: 4, component: SectionFinal, title: "Indoctrination Complete" }
  ];

  const handleSectionComplete = (sectionId: number) => {
    if (!completedSections.includes(sectionId)) {
      setCompletedSections([...completedSections, sectionId]);
    }
  };

  return (
    <ManualLayout 
      currentSection={currentSection}
      totalSections={sections.length}
      completedSections={completedSections}
      onSectionChange={setCurrentSection}
    >
      {sections.map(({ id, component: Component, title }) => (
        <Component 
          key={id}
          onComplete={() => handleSectionComplete(id)}
          isActive={currentSection === id}
        />
      ))}
    </ManualLayout>
  );
};
