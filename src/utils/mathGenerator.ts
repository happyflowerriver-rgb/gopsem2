import { DifficultyLevel, DifficultyConfig, MathProblem, StepExplanation } from '../types/math';

export const DIFFICULTY_CONFIGS: Record<DifficultyLevel, DifficultyConfig> = {
  easy: {
    id: 'easy',
    name: '쉬움 (10의 배수 및 기본 곱셈)',
    shortName: '쉬움',
    levelBadge: 'Level 1',
    description: '한 수가 10, 20 등 10의 배수이거나 각 자리 계산이 쉬운 기본 두 자리 수 곱셈입니다.',
    sample: '24 × 10 = 240',
    explanation: '10을 곱하면 0이 하나 붙고, 20을 곱하면 2배 후 0을 붙이는 원리를 익힙니다.',
    carryNote: '10의 배수 및 기본 곱셈',
  },
  medium: {
    id: 'medium',
    name: '보통 (10~40 범위 기본 두 자리 수)',
    shortName: '보통',
    levelBadge: 'Level 2',
    description: '10~40 범위의 두 자리 수를 곱하는 기본 교과과정 세로셈 훈련입니다.',
    sample: '25 × 16 = 400',
    explanation: '일의 자리 곱과 십의 자리 곱을 구한 뒤 두 부분곱을 더하는 표준 곱셈법입니다.',
    carryNote: '10~40 표준 두 자리 수',
  },
  hard: {
    id: 'hard',
    name: '어려움 (50 이상 심화 두 자리 수)',
    shortName: '어려움',
    levelBadge: 'Level 3',
    description: '두 수 모두 50 이상인 큰 두 자리 수 곱셈으로 4자리 결과와 연속 올림을 연습합니다.',
    sample: '68 × 57 = 3876',
    explanation: '각 단계마다 큰 수의 곱과 올림이 발생하여 집중력과 정확한 연산력이 요구됩니다.',
    carryNote: '50 이상 큰 수 & 4자리 결과',
  },
  master: {
    id: 'master',
    name: '마스터 (전체 두 자리 수 종합)',
    shortName: '마스터',
    levelBadge: 'Level 4',
    description: '11부터 99까지 모든 두 자리 수 곱셈이 무작위로 출제되는 실전 마스터 모드입니다.',
    sample: '47 × 86 = 4042',
    explanation: '실전 시험 및 두 자리 수 곱셈 능력을 완성할 수 있는 종합 훈련 모드입니다.',
    carryNote: '11~99 무작위 출제',
  },
  decade: {
    id: 'decade',
    name: '암산 비법 (11의 곱셈 & 특수 비법)',
    shortName: '암산비법',
    levelBadge: 'Level 5',
    description: '11과의 곱셈 공식(앞뒤 수 합쳐 가운데 넣기) 및 20·30 근접 분해 등 빠른 곱셈 비법을 익힙니다.',
    sample: '35 × 11 = 385 / 24 × 19 = 456',
    explanation: '35 × 11은 3과 5 사이에 (3+5=8)을 넣어 385! 빠른 인도수학·베다수학 연산 테크닉입니다.',
    carryNote: '빠른 곱셈 비법 공식',
  },
};

function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function generateMathProblem(difficulty: DifficultyLevel): MathProblem {
  const id = `prob_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  let num1 = 12;
  let num2 = 10;
  let hintTip: string | undefined = undefined;

  switch (difficulty) {
    case 'easy': {
      // Either 10, 20, 30, 40, 50 times a number, or small 2-digit numbers
      const type = Math.random();
      if (type < 0.5) {
        // Multiples of 10
        const tensMul = [10, 20, 30, 40, 50][getRandomInt(0, 4)];
        const other = getRandomInt(11, 45);
        if (Math.random() > 0.5) {
          num1 = other;
          num2 = tensMul;
        } else {
          num1 = tensMul;
          num2 = other;
        }
      } else {
        // Small 2-digit numbers (11 to 25)
        num1 = getRandomInt(11, 25);
        num2 = getRandomInt(11, 19);
      }
      break;
    }

    case 'medium': {
      // 10 to 45 range
      num1 = getRandomInt(14, 45);
      num2 = getRandomInt(12, 38);
      break;
    }

    case 'hard': {
      // Large numbers (48 to 98)
      num1 = getRandomInt(48, 98);
      num2 = getRandomInt(45, 96);
      break;
    }

    case 'decade': {
      const trickType = Math.random();
      if (trickType < 0.45) {
        // 11 multiplication trick: XY * 11
        // Pick XY where X + Y < 10 for clean middle, or X + Y >= 10
        const tens = getRandomInt(1, 8);
        const ones = getRandomInt(1, Math.min(8, 9 - tens));
        const target = tens * 10 + ones;
        if (Math.random() > 0.5) {
          num1 = target;
          num2 = 11;
        } else {
          num1 = 11;
          num2 = target;
        }
        hintTip = `11의 곱셈 비법: ${target} × 11은 앞자리 ${tens}, 뒷자리 ${ones}, 가운데에 합(${tens}+${ones}=${tens + ones})을 넣어 바로 ${target * 11}이 됩니다!`;
      } else if (trickType < 0.75) {
        // Ending with 9 or 8 (e.g. 24 * 19 = 24 * 20 - 24)
        const roundBase = getRandomInt(2, 6) * 10; // 20, 30, 40, 50, 60
        const targetNum = roundBase - 1; // 19, 29, 39, 49, 59
        const otherNum = getRandomInt(12, 35);
        if (Math.random() > 0.5) {
          num1 = otherNum;
          num2 = targetNum;
        } else {
          num1 = targetNum;
          num2 = otherNum;
        }
        hintTip = `보수 곱셈 팁: ${otherNum} × ${targetNum}은 (${otherNum} × ${roundBase}) - ${otherNum} = ${otherNum * roundBase} - ${otherNum} = ${otherNum * targetNum}로 계산하면 훨씬 빠릅니다!`;
      } else {
        // Ending in 5 trick: e.g. 25 * 25 = (2 * 3)25 = 625, or 35 * 35 = 1225
        const tens = getRandomInt(1, 8);
        const target = tens * 10 + 5;
        num1 = target;
        num2 = target;
        const head = tens * (tens + 1);
        hintTip = `끝자리 5 제곱 비법: ${target} × ${target}은 앞부분(${tens} × ${tens + 1} = ${head}) 뒤에 25를 붙여 바로 ${head}25가 됩니다!`;
      }
      break;
    }

    case 'master':
    default: {
      // Fully random two-digit numbers
      num1 = getRandomInt(11, 99);
      num2 = getRandomInt(11, 99);
      break;
    }
  }

  const answer = num1 * num2;
  const ones1 = num1 % 10;
  const ones2 = num2 % 10;
  const carriesOnes = ones1 * ones2 >= 10;
  const carriesTens = answer >= 1000;

  return {
    id,
    num1,
    num2,
    answer,
    sum: answer, // Backward compatibility
    difficulty,
    carriesOnes,
    carriesTens,
    hintTip,
  };
}

export function getMultiplicationBreakdown(num1: number, num2: number): StepExplanation {
  const onesDigit2 = num2 % 10;
  const tensDigit2 = Math.floor(num2 / 10);
  const step1Product = num1 * onesDigit2;
  const step2Product = num1 * tensDigit2;
  const step2Value = step2Product * 10;
  const finalProduct = num1 * num2;

  return {
    num1,
    num2,
    onesDigit2,
    tensDigit2,
    step1Product,
    step2Product,
    step2Value,
    finalProduct,
  };
}

// Alias for backwards compatibility with any remaining references
export const getCarryingBreakdown = getMultiplicationBreakdown;
