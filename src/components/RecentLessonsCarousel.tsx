import React from 'react';

const images = [
  'https://ybefnvazeniezrwzpvtf.supabase.co/storage/v1/object/public/magat//VeniceAI_ucDotG8.webp',
  'https://ybefnvazeniezrwzpvtf.supabase.co/storage/v1/object/public/magat//VeniceAI_npMss7J.webp',
  'https://ybefnvazeniezrwzpvtf.supabase.co/storage/v1/object/public/magat//VeniceAI_N4qDcOX.webp',
  'https://ybefnvazeniezrwzpvtf.supabase.co/storage/v1/object/public/magat//VeniceAI_mod4Bn7.webp',
];

const lessons = [
  {
    title: 'The Path of Obedience',
    description: 'A lesson in humility and submission.',
    image: images[0],
  },
  {
    title: 'Sacred Suffering',
    description: 'Endure the trials of MAGAT University.',
    image: images[1],
  },
  {
    title: 'Structured Degradation',
    description: 'Embrace the institutional rigor.',
    image: images[2],
  },
  {
    title: 'Ownership & Degree',
    description: 'The final reward for the worthy.',
    image: images[3],
  },
];

export default function RecentLessonsCarousel() {
  const [current, setCurrent] = React.useState(0);

  const next = () => setCurrent((c) => (c + 1) % lessons.length);
  const prev = () => setCurrent((c) => (c - 1 + lessons.length) % lessons.length);

  return (
    <div className="w-full max-w-2xl mx-auto bg-card border border-border rounded-lg shadow-lg p-6 flex flex-col items-center">
      <div className="relative w-full h-64 flex items-center justify-center">
        <img
          src={lessons[current].image}
          alt={lessons[current].title}
          className="object-cover rounded-lg w-full h-full"
        />
        <button
          className="absolute left-2 top-1/2 -translate-y-1/2 bg-secondary text-secondary-foreground rounded-full p-2 shadow-md hover:bg-secondary/80"
          onClick={prev}
          aria-label="Previous"
        >
          &#8592;
        </button>
        <button
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-secondary text-secondary-foreground rounded-full p-2 shadow-md hover:bg-secondary/80"
          onClick={next}
          aria-label="Next"
        >
          &#8594;
        </button>
      </div>
      <div className="mt-6 text-center">
        <h3 className="text-2xl font-bold text-foreground mb-2">{lessons[current].title}</h3>
        <p className="text-muted-foreground">{lessons[current].description}</p>
      </div>
      <div className="flex gap-2 mt-4 justify-center">
        {lessons.map((_, idx) => (
          <span
            key={idx}
            className={`inline-block w-3 h-3 rounded-full ${idx === current ? 'bg-accent' : 'bg-muted'}`}
          />
        ))}
      </div>
    </div>
  );
}
