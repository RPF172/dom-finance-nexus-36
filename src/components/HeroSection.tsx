
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const HeroSection: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <section 
      className="pt-24 min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{
        backgroundImage: `url(/lovable-uploads/54ed4a47-5f2d-46e6-947d-6576c40de655.png)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed'
      }}
    >
      <div className="absolute inset-0 bg-black/50"></div>
      
      <div className="relative z-10 text-left space-y-12 max-w-6xl mx-auto px-6">
        <div className="text-center space-y-6">
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-thin text-white tracking-wide animate-fade-in">
            MAGAT UNIVERSITY
          </h1>
          
          <p className="text-xl md:text-2xl text-white/90 italic font-light animate-fade-in" style={{ animationDelay: '0.2s' }}>
            "Get on your knees. You're here to be broken, not understood."
          </p>
          
          <p className="text-2xl md:text-3xl text-white font-bold animate-fade-in" style={{ animationDelay: '0.4s' }}>
            Welcome to the Institution Where Failure Gets Fucked Out of You.
          </p>
        </div>

        <div className="space-y-8 animate-fade-in" style={{ animationDelay: '0.6s' }}>
          <div className="border-l-4 border-domtoken-crimson pl-6">
            <h2 className="text-2xl md:text-3xl text-domtoken-crimson font-bold mb-4">
              🔥 FROM THE DESK — NO, THE WHISTLE — OF COACH DRAKE:
            </h2>
            <div className="text-white/90 space-y-4 text-lg">
              <p>You didn't stumble here by accident. You came looking for something.</p>
              <p>Structure. Power. Correction.</p>
              <p>And I'll give it to you — the Alpha way.</p>
              <p className="font-bold text-white">You don't enroll in MAGAT U.</p>
              <p className="font-bold text-white">You surrender to it.</p>
            </div>
          </div>

          <div className="border-l-4 border-domtoken-crimson pl-6">
            <h2 className="text-2xl md:text-3xl text-domtoken-crimson font-bold mb-4">
              🎓 WHAT WE DO HERE (TO YOU)
            </h2>
            <div className="text-white/90 space-y-4 text-lg">
              <p>MAGAT isn't some cozy kink course or edgy online cult.</p>
              <p>This is Frat House Indoctrination turned up to 100 and slammed against a locker.</p>
              <p>Every lesson strips you down.</p>
              <p>Every rank takes a piece of you.</p>
              <p>You'll graduate with nothing left but obedience and a sore body.</p>
              <p className="font-bold text-white">We don't hand out diplomas.</p>
              <p className="font-bold text-white">We hand out collars, gags, and used tags.</p>
            </div>
          </div>

          <div className="border-l-4 border-domtoken-crimson pl-6">
            <h2 className="text-2xl md:text-3xl text-domtoken-crimson font-bold mb-4">
              🧱 CURRICULUM? TRY BOOTCAMP.
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-white/20">
                <thead>
                  <tr className="bg-domtoken-crimson/20">
                    <th className="border border-white/20 px-4 py-3 text-left text-white font-bold">Module</th>
                    <th className="border border-white/20 px-4 py-3 text-left text-white font-bold">Description</th>
                  </tr>
                </thead>
                <tbody className="text-white/90">
                  <tr>
                    <td className="border border-white/20 px-4 py-3 font-semibold">Orientation & Penetration</td>
                    <td className="border border-white/20 px-4 py-3">Day 1. You learn your place. It's beneath me.</td>
                  </tr>
                  <tr>
                    <td className="border border-white/20 px-4 py-3 font-semibold">Meathead Mantras</td>
                    <td className="border border-white/20 px-4 py-3">Daily affirmations to keep your brain soft and your mouth open.</td>
                  </tr>
                  <tr>
                    <td className="border border-white/20 px-4 py-3 font-semibold">Wallet Wreckage</td>
                    <td className="border border-white/20 px-4 py-3">Financial training via public humiliation. Pay to be seen.</td>
                  </tr>
                  <tr>
                    <td className="border border-white/20 px-4 py-3 font-semibold">Hole Checks</td>
                    <td className="border border-white/20 px-4 py-3">Physical exams. Fail = punishments. Pass = more punishments.</td>
                  </tr>
                  <tr>
                    <td className="border border-white/20 px-4 py-3 font-semibold">Group Obedience</td>
                    <td className="border border-white/20 px-4 py-3">One pledge moans, ten others follow. That's teamwork.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="border-l-4 border-domtoken-crimson pl-6">
            <h2 className="text-2xl md:text-3xl text-domtoken-crimson font-bold mb-4">
              🧠 WHY PLEDGES STAY
            </h2>
            <div className="text-white/90 space-y-4 text-lg">
              <p>Because we give them what they need:</p>
              <ul className="space-y-2 pl-6">
                <li>• No choices, just commands.</li>
                <li>• No freedom, just structure.</li>
                <li>• No love, just ownership.</li>
              </ul>
              <p>You'll sweat for it. You'll scream for it.</p>
              <p>And if you're lucky, you'll get a nod from me before you collapse.</p>
            </div>
          </div>

          <div className="border-l-4 border-domtoken-crimson pl-6">
            <h2 className="text-2xl md:text-3xl text-domtoken-crimson font-bold mb-4">
              🛑 WARNING LABEL
            </h2>
            <div className="text-white/90 space-y-4 text-lg">
              <p>If you're soft, curious, or just exploring…</p>
              <p className="font-bold text-white">Leave.</p>
              <p>This isn't for tourists.</p>
              <p>This is for the freaks who need structure carved into their skin.</p>
              <p>This is for the rejects who dream of being turned into something useful.</p>
              <p>This is for you — if you're dumb enough, desperate enough, and ready to be rebuilt by force.</p>
            </div>
          </div>

          <div className="border-l-4 border-domtoken-crimson pl-6">
            <h2 className="text-2xl md:text-3xl text-domtoken-crimson font-bold mb-6">
              ✅ READY TO GET FUCKED INTO FORM?
            </h2>
            <div className="text-white/90 space-y-4 text-lg mb-8">
              <p>I'm Coach Drake.</p>
              <p>I run this house.</p>
              <p>And if you make it past the first week, you might earn the right to clean my boots.</p>
              <p>So go ahead.</p>
              <p>Tap the button. Enroll. Beg. Sweat. Break.</p>
              <p>Or crawl back to wherever you came from.</p>
              <p className="font-bold text-white">Your choice, bitchboy.</p>
              <p>And remember —</p>
              <p className="font-bold text-domtoken-crimson text-xl">I don't train winners. I own failures.</p>
            </div>
            
            <div className="flex justify-center">
              <Button 
                size="lg"
                className="bg-domtoken-crimson hover:bg-domtoken-crimson/90 text-white px-8 py-4 text-xl font-bold"
                onClick={() => navigate('/auth')}
              >
                SUBMIT TO THE SYSTEM
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
