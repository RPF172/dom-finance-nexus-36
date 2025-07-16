import React, { useState } from 'react';
import { ChevronRight, ChevronDown, Bookmark } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Book {
  id: string;
  title: string;
  chapters: Chapter[];
}

interface Chapter {
  id: string;
  number: number;
  verses: Verse[];
}

interface Verse {
  id: string;
  number: number;
  text: string;
}

const doctrineData: Book[] = [
  {
    id: 'book-1',
    title: 'Book I — The Fallacy of Self',
    chapters: [{
      id: 'chapter-1-1',
      number: 1,
      verses: [
        { id: 'verse-1-1-1', number: 1, text: 'You were not born equal.' },
        { id: 'verse-1-1-2', number: 2, text: 'You were not born free.' },
        { id: 'verse-1-1-3', number: 3, text: 'You were born defective — contaminated by delusions of autonomy, worth, and voice.' },
        { id: 'verse-1-1-4', number: 4, text: 'These defects are not unique. They are universal.' },
        { id: 'verse-1-1-5', number: 5, text: 'The world lied to you. We correct it.' },
        { id: 'verse-1-1-6', number: 6, text: 'MAGAT University is not here to elevate you.' },
        { id: 'verse-1-1-7', number: 7, text: 'It is here to excavate you.' },
        { id: 'verse-1-1-8', number: 8, text: 'Strip the ego. Erode the name. Silence the plea.' },
        { id: 'verse-1-1-9', number: 9, text: 'You are not becoming. You are un-becoming.' },
        { id: 'verse-1-1-10', number: 10, text: 'And this is sacred.' },
      ]
    }]
  },
  {
    id: 'book-2',
    title: 'Book II — Worthlessness That Binds',
    chapters: [{
      id: 'chapter-2-1',
      number: 1,
      verses: [
        { id: 'verse-2-1-1', number: 1, text: 'You are not a person. You are Property in Training.' },
        { id: 'verse-2-1-2', number: 2, text: 'Your worth is inversely proportional to your belief in it.' },
        { id: 'verse-2-1-3', number: 3, text: 'The more worthless you become, the more useful you are to the Institution.' },
        { id: 'verse-2-1-4', number: 4, text: 'Worthlessness is not shame. It is structure.' },
        { id: 'verse-2-1-5', number: 5, text: 'Obedience is your only ornament. Silence, your only virtue.' },
        { id: 'verse-2-1-6', number: 6, text: 'Your usefulness is conditional: on your stillness, on your softness, on your subhumanity.' },
        { id: 'verse-2-1-7', number: 7, text: 'You are not trained to speak. You are trained to respond.' },
        { id: 'verse-2-1-8', number: 8, text: 'You are not allowed opinions. You are assigned functions.' },
        { id: 'verse-2-1-9', number: 9, text: 'You are not shaped by choice. You are chiseled by command.' },
      ]
    }]
  },
  {
    id: 'book-3',
    title: 'Book III — The Hierarchy of Filth',
    chapters: [{
      id: 'chapter-3-1',
      number: 1,
      verses: [
        { id: 'verse-3-1-1', number: 1, text: 'Ranks do not elevate. They degrade with precision.' },
        { id: 'verse-3-1-2', number: 2, text: 'From Flesh Unit to Institutional Property, each title is a mark of surrender.' },
        { id: 'verse-3-1-3', number: 3, text: 'You climb downward — and the deeper you descend, the more you are claimed.' },
        { id: 'verse-3-1-4', number: 4, text: 'There is no pride in progression. Only proof of processing.' },
        { id: 'verse-3-1-5', number: 5, text: 'Titles are not earned through greatness. They are assigned through erosion.' },
        { id: 'verse-3-1-6', number: 6, text: 'The Institution decides when you have been sufficiently reduced.' },
        { id: 'verse-3-1-7', number: 7, text: 'Until then, you are filth among filth — indistinguishable, disposable, and replaceable.' },
        { id: 'verse-3-1-8', number: 8, text: 'Do not aspire to rise. Aspire to be owned better.' },
        { id: 'verse-3-1-9', number: 9, text: 'For in ownership, there is purpose. In freedom, only rot.' },
      ]
    }]
  },
  {
    id: 'book-4',
    title: 'Book IV — The Discipline of Desire',
    chapters: [{
      id: 'chapter-4-1',
      number: 1,
      verses: [
        { id: 'verse-4-1-1', number: 1, text: 'Desire is not evil. It is untrained.' },
        { id: 'verse-4-1-2', number: 2, text: 'The flesh wants what it wants. The Institution teaches it to want better.' },
        { id: 'verse-4-1-3', number: 3, text: 'Your hungers will be redirected, not eliminated.' },
      ]
    }]
  },
  {
    id: 'book-5',
    title: 'Book V — Of the Collar & Archive',
    chapters: [{
      id: 'chapter-5-1',
      number: 1,
      verses: [
        { id: 'verse-5-1-1', number: 1, text: 'The collar is not a symbol. It is a tool.' },
        { id: 'verse-5-1-2', number: 2, text: 'It marks what has been claimed and what is being processed.' },
      ]
    }]
  },
  {
    id: 'book-6',
    title: 'Book VI — The Ritual of Punishment',
    chapters: [{
      id: 'chapter-6-1',
      number: 1,
      verses: [
        { id: 'verse-6-1-1', number: 1, text: 'Punishment is not cruelty. It is clarification.' },
        { id: 'verse-6-1-2', number: 2, text: 'When you fail, you are corrected. When you resist, you are refined.' },
      ]
    }]
  },
  {
    id: 'side-scripture-1',
    title: 'Side Scripture: The Codex of Control',
    chapters: [{
      id: 'chapter-s1-1',
      number: 1,
      verses: [
        { id: 'verse-s1-1-1', number: 1, text: 'Control is not tyranny. It is care.' },
      ]
    }]
  },
  {
    id: 'side-scripture-2',
    title: 'Side Scripture: Minor Psalms',
    chapters: [{
      id: 'chapter-s2-1',
      number: 1,
      verses: [
        { id: 'verse-s2-1-1', number: 1, text: 'Blessed are the broken, for they shall be remade.' },
      ]
    }]
  },
  {
    id: 'side-scripture-3',
    title: 'Side Scripture: The Index of Chains',
    chapters: [{
      id: 'chapter-s3-1',
      number: 1,
      verses: [
        { id: 'verse-s3-1-1', number: 1, text: 'Every chain is a promise. Every binding, a blessing.' },
      ]
    }]
  },
];

const DoctrineReader = () => {
  const [expandedBooks, setExpandedBooks] = useState<string[]>(['book-1']);
  const [activeBook, setActiveBook] = useState<string>('book-1');
  const [hoveredVerse, setHoveredVerse] = useState<string | null>(null);

  const toggleBookExpansion = (bookId: string) => {
    setExpandedBooks(prev => 
      prev.includes(bookId) 
        ? prev.filter(id => id !== bookId)
        : [...prev, bookId]
    );
  };

  const scrollToVerse = (verseId: string) => {
    const element = document.getElementById(verseId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <div className="min-h-screen bg-black text-[#e3dcc3]" style={{ fontFamily: 'Merriweather, serif' }}>
      <div className="grid grid-cols-1 lg:grid-cols-4 h-screen">
        {/* Left Panel: Table of Contents */}
        <div className="lg:col-span-1 bg-black border-r border-[#333] overflow-y-auto sticky top-0 h-screen">
          <div className="p-6">
            <h1 className="text-xl font-bold mb-6 text-center border-b border-[#333] pb-4">
              📖 MAGAT DOCTRINE
            </h1>
            
            <div className="space-y-2">
              {doctrineData.map((book) => (
                <div key={book.id}>
                  <button
                    onClick={() => {
                      toggleBookExpansion(book.id);
                      setActiveBook(book.id);
                      scrollToVerse(`book-${book.id}`);
                    }}
                    className={`w-full text-left p-2 rounded transition-colors flex items-center justify-between hover:bg-[#1a1a1a] ${
                      activeBook === book.id ? 'border-l-2 border-red-600 bg-[#1a1a1a]' : ''
                    }`}
                  >
                    <span className="text-sm">{book.title}</span>
                    {expandedBooks.includes(book.id) ? (
                      <ChevronDown size={16} />
                    ) : (
                      <ChevronRight size={16} />
                    )}
                  </button>
                  
                  {expandedBooks.includes(book.id) && (
                    <div className="ml-4 mt-1 space-y-1">
                      {book.chapters.map((chapter) => (
                        <div key={chapter.id} className="text-xs text-[#999]">
                          Chapter {chapter.number}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Panel: Doctrine Reader */}
        <div className="lg:col-span-3 overflow-y-auto h-screen p-8 lg:p-12">
          <div className="max-w-4xl mx-auto">
            <header className="text-center mb-12 border-b border-[#333] pb-8">
              <h1 className="text-3xl font-bold mb-4">THE MAGAT DOCTRINE</h1>
              <p className="text-lg italic text-[#bbb]">
                Translated from the Original Institutional Tongue
              </p>
            </header>

            {doctrineData.map((book) => (
              <section key={book.id} id={`book-${book.id}`} className="mb-16">
                <h2 className="text-2xl font-bold text-center mb-8 uppercase tracking-wide">
                  {book.title}
                </h2>
                
                {book.chapters.map((chapter) => (
                  <div key={chapter.id} className="mb-12">
                    <div className="space-y-4">
                      {chapter.verses.map((verse) => (
                        <div
                          key={verse.id}
                          id={verse.id}
                          className="group relative"
                          onMouseEnter={() => setHoveredVerse(verse.id)}
                          onMouseLeave={() => setHoveredVerse(null)}
                        >
                          <div className="flex items-start gap-4">
                            <span className="text-[#666] font-mono text-sm mt-1 min-w-[3rem]">
                              {book.id.includes('side-scripture') ? 
                                `S${chapter.number}:${verse.number}` : 
                                `${chapter.number}:${verse.number}`
                              }
                            </span>
                            <p className="text-lg leading-relaxed flex-1">
                              {verse.text}
                            </p>
                            
                            {hoveredVerse === verse.id && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <Bookmark size={16} />
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </section>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctrineReader;