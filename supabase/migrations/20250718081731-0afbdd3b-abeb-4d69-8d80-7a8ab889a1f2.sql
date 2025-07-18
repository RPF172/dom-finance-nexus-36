-- Update the first lesson (order_index = 1) with Chapter One content
UPDATE public.lessons 
SET 
  title = 'Chapter One: You Showed Up Cocky',
  body_text = '---

You didn''t think it would be like this.
Sure, you knew it was a frat. Knew there''d be hazing. Maybe even some shirtless plank challenges and push-up contests while the seniors watched.

But this?

This was a different level.

---

The minute you walked into House DOMINATVS, the door slammed behind you and the sound of a whistle cut the air.

> "Strip."

One word. That''s all it took from Coach Drake — the mountain of a man standing at the end of the hallway. Arms crossed. Black tank top clinging to his chest like it feared him. Camouflage pants. Boots polished to a shine. And a smirk that told you: he already owned you.

> "What? Shy?"
"You''ll sweat through your pride soon enough. Off."

---

By the time your shirt hit the floor, there were five upperclassmen circling you — all wearing matching gray shorts and nothing else. One of them — big, blond, the one they called "Vice" — leaned in close and whispered:

> "Welcome to the house. You moan, you lose."

You didn''t ask what the game was. You just felt your cock twitch — and someone noticed.

---

🔒 THE INITIATION DRILL

You''re placed front and center in the common room, knees spread wide on the cold stone floor. Twenty pledges line up behind you, all stripped to shorts or less, each one of them watching you to see if you''ll crack first.

Coach Drake circles slowly, barking:

> "Obedience. That''s what we test first. Not strength. Not speed. Just how long it takes before you beg to be used."

Then comes the first order.

> "Say it."
"I''m not a man."
"I''m property in training."

You say it. Voice shaking.
They laugh.
You get hard.
They notice.
You''re rewarded.

---

🔥 FRAT BONDS ARE MADE THROUGH BARE SKIN

By the third night, your bunkmates are no longer strangers — they''re teammates in submission. Every morning, you line up side by side, kneeling for inspection. Eye contact is dangerous. So is enjoying it too much. But that''s the thrill.

Vice pins you against the dorm lockers.
Says nothing.
Just lifts your chin and says:

> "Don''t forget who made you bark first."

He walks away.

You realize you''re leaking through your jock.

You realize someone''s watching.

You realize… you like it.

---

🛏️ HOUSE RULES

- Shirts off after sundown
- No moaning unless ordered
- Hard? You log it.
- Obedience Score under 60%? You get put in the Public Drill Pool

You learn fast. Not just because you want to survive — but because you want to impress them.
The Alphas.
Coach.
Vice.
Even the watchers behind the mirrors.

---

By the end of the week, you''re no longer asking if you''re a pledge.
You''re wondering when you''ll be collared for good.',
  assignment_text = 'Write a 500-word reflection on your first experience with authority and submission. Describe a moment when you felt completely vulnerable and how it affected you.',
  ritual_text = 'Before sleeping tonight, kneel beside your bed for 5 minutes in silence. Reflect on the concepts of obedience and surrender. Record your thoughts in your journal.',
  objective = 'Understand the psychology of initial submission and the dynamics of power exchange in institutional settings.'
WHERE order_index = 1
  AND published = true;