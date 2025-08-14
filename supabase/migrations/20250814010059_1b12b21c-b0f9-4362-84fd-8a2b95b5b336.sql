-- Add some sample quizzes for the existing lessons
INSERT INTO public.quizzes (lesson_id, question, type, options, answer, explanation, order_index) 
SELECT 
  l.id,
  'What is the main topic of this lesson: ' || l.title || '?',
  'multiple_choice',
  ARRAY['Learning fundamentals', 'Advanced techniques', 'Basic concepts', 'Practical applications'],
  'Learning fundamentals',
  'This question tests understanding of the lesson''s core focus.',
  0
FROM public.lessons l 
WHERE l.published = true
ON CONFLICT DO NOTHING;

-- Add a second quiz question for each lesson
INSERT INTO public.quizzes (lesson_id, question, type, options, answer, explanation, order_index)
SELECT 
  l.id,
  'Which approach is recommended for studying ' || l.title || '?',
  'multiple_choice', 
  ARRAY['Passive reading only', 'Active engagement with material', 'Memorization alone', 'Speed reading'],
  'Active engagement with material',
  'Active learning techniques improve retention and understanding.',
  1
FROM public.lessons l
WHERE l.published = true
ON CONFLICT DO NOTHING;