export interface MarkResult {
  marksEarned: number;
  marksTotal: number;
  hitKeywords: string[];
  missedKeywords: string[];
  xpEarned: number;
  creditsEarned: number;
  speedBonus: boolean;
}

export function scoreKeywords(
  userText: string,
  markScheme: string[],
  baseXp: number,
  baseCredits: number,
  timeMs: number,
): MarkResult {
  const lower = userText.toLowerCase();
  const hit: string[] = [];
  const miss: string[] = [];

  for (const kw of markScheme) {
    const tokens = kw.toLowerCase().split(/[\s/]+/);
    const matched = tokens.some(t => lower.includes(t) && t.length > 2);
    if (matched) hit.push(kw);
    else miss.push(kw);
  }

  const marksEarned = hit.length;
  const marksTotal = markScheme.length;
  const speedBonus = timeMs < 10000 && marksEarned === marksTotal;

  const xpEarned = Math.round(baseXp * (marksEarned / marksTotal)) + (speedBonus ? 5 : 0);
  const creditsEarned = Math.round(baseCredits * (marksEarned / marksTotal));

  return { marksEarned, marksTotal, hitKeywords: hit, missedKeywords: miss, xpEarned, creditsEarned, speedBonus };
}

export function scoreCalculation(
  userEquation: string,
  userSubstitution: string,
  userAnswer: string,
  correctEquation: string,
  correctAnswer: { value: number; unit: string },
  baseXp: number,
  baseCredits: number,
  timeMs: number,
): MarkResult {
  const marks: boolean[] = [false, false, false];

  // Mark 1: correct equation (key terms present)
  const eqTokens = correctEquation.toLowerCase().replace(/\s/g, '').split(/[=/×÷*]/);
  const userEqLower = userEquation.toLowerCase().replace(/\s/g, '');
  marks[0] = eqTokens.every(t => t.length > 0 && userEqLower.includes(t));

  // Mark 2: substitution (numbers present)
  const numRegex = /\d+\.?\d*/g;
  const expectedNums = (correctEquation + ' ' + correctAnswer.value).match(numRegex) || [];
  const userNums = userSubstitution.match(numRegex) || [];
  marks[1] = expectedNums.some(n => userNums.includes(n));

  // Mark 3: answer + unit
  const userAnswerLower = userAnswer.toLowerCase().replace(/\s/g, '');
  const answerNum = String(correctAnswer.value);
  const unitLower = correctAnswer.unit.toLowerCase().replace(/\s/g, '');
  const hasNum = userAnswerLower.includes(answerNum);
  const hasUnit = userAnswerLower.includes(unitLower) || userAnswerLower.includes(unitLower.replace('/', ''));
  marks[2] = hasNum && hasUnit;

  // Unit-only error: has unit but wrong number → still gets equation + substitution marks
  const hit = marks.map((m, i) => m ? ['correct equation', 'correct substitution', 'answer with unit'][i] : null).filter(Boolean) as string[];
  const miss = marks.map((m, i) => !m ? ['correct equation', 'correct substitution', 'answer with unit'][i] : null).filter(Boolean) as string[];

  const marksEarned = marks.filter(Boolean).length;
  const marksTotal = 3;
  const speedBonus = timeMs < 15000 && marksEarned === marksTotal;

  const xpEarned = Math.round(baseXp * (marksEarned / marksTotal)) + (speedBonus ? 5 : 0);
  const creditsEarned = Math.round(baseCredits * (marksEarned / marksTotal));

  return { marksEarned, marksTotal, hitKeywords: hit, missedKeywords: miss, xpEarned, creditsEarned, speedBonus };
}

export function scoreOption(
  selectedOption: number,
  correctOption: number,
  baseXp: number,
  baseCredits: number,
  timeMs: number,
): MarkResult {
  const correct = selectedOption === correctOption;
  const speedBonus = correct && timeMs < 8000;
  return {
    marksEarned: correct ? 1 : 0,
    marksTotal: 1,
    hitKeywords: correct ? ['correct answer'] : [],
    missedKeywords: correct ? [] : ['correct answer'],
    xpEarned: correct ? baseXp + (speedBonus ? 5 : 0) : 0,
    creditsEarned: correct ? baseCredits : 0,
    speedBonus,
  };
}
