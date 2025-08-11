import { TierCode } from '@/config/typingTrialConfig';

export const TYPING_TEXTS: Record<TierCode, string[]> = {
  recruit: [
    'Kneel and obey without question.',
    'Discipline is the path to power.',
    'Hold the line. Breathe. Focus.',
    'Your hands serve. Your mind submits.',
    'Precision first. Speed follows.',
  ],
  cadet: [
    'You will deliver perfection under pressure, with no excuses or hesitation.',
    'The ritual begins when you accept the burden of discipline and silence.',
  ],
  enlisted: [
    'Obedience is not restraint; it is a weapon. Sharpen it with every keystroke and refuse the luxury of mistakes.',
    'You are here to endure. You are here to prove that your will does not break when the clock hunts you.',
  ],
  specialist: [
    'The text is an order. The timer is a blade. Accuracy is the oath you keep to the one above you. Execute without failure.',
  ],
  operative: [
    'React to pressure like iron to the forge—hot, precise, shaped by command. Your errors are a confession; make none.',
  ],
  elite: [
    'Elite Challenge: You will type as if you are being watched—because you are. Every second without error earns you the right to continue.',
  ],
};
