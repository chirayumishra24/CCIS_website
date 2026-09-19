import { NormalizedValue } from './academicNormalizer';

export interface RequiredScoreInput {
  currentWeightedScore: number;
  targetScore: number;
  remainingWeight: number; // e.g. 0.30 or 30
}

export type RequiredScoreStatus =
  | 'TARGET_ACHIEVED'
  | 'REQUIRED_SCORE_CALCULATED'
  | 'TARGET_NOT_REACHABLE'
  | 'INSUFFICIENT_DATA';

export interface RequiredScoreResult {
  status: RequiredScoreStatus;
  requiredScore?: number;
  message: string;
}

/**
 * Formula: Required Score = (Target Final Score - Current Weighted Contribution) / Remaining Weight
 */
export function calculateRequiredScore(input: RequiredScoreInput): RequiredScoreResult {
  const { currentWeightedScore, targetScore, remainingWeight } = input;

  if (
    currentWeightedScore === undefined ||
    targetScore === undefined ||
    remainingWeight === undefined ||
    isNaN(currentWeightedScore) ||
    isNaN(targetScore) ||
    isNaN(remainingWeight)
  ) {
    return {
      status: 'INSUFFICIENT_DATA',
      message: 'Insufficient assessment weightage or performance data.',
    };
  }

  // Normalize weight if passed as percentage (e.g. 30 -> 0.30)
  const weightFraction = remainingWeight > 1 ? remainingWeight / 100 : remainingWeight;

  if (weightFraction <= 0 || weightFraction > 1) {
    return {
      status: 'INSUFFICIENT_DATA',
      message: 'Remaining assessment weight must be greater than 0 and up to 100%.',
    };
  }

  // If already at or above target
  if (currentWeightedScore >= targetScore) {
    return {
      status: 'TARGET_ACHIEVED',
      requiredScore: 0,
      message: 'Target has already been achieved with current weighted contribution.',
    };
  }

  const deficit = targetScore - currentWeightedScore;
  const required = deficit / weightFraction;
  const roundedRequired = Math.round(required * 10) / 10;

  if (roundedRequired > 100) {
    return {
      status: 'TARGET_NOT_REACHABLE',
      requiredScore: roundedRequired,
      message: `Mathematically requires ${roundedRequired}% in upcoming assessments, which exceeds 100%.`,
    };
  }

  return {
    status: 'REQUIRED_SCORE_CALCULATED',
    requiredScore: roundedRequired,
    message: `Need to score ${roundedRequired}% in remaining assessments to achieve ${targetScore}% final target.`,
  };
}

export interface TargetAnalysis {
  status: 'NOT_ASSIGNED' | 'ACHIEVED' | 'IN_PROGRESS' | 'RANGE_UNCERTAIN';
  gapPercentagePoints?: number;
  description: string;
}

export function evaluateTargetGap(
  current: NormalizedValue,
  target: NormalizedValue
): TargetAnalysis {
  if (target.type === 'empty' || target.type === 'invalid') {
    return {
      status: 'NOT_ASSIGNED',
      description: 'School target has not been assigned yet.',
    };
  }

  if (current.type === 'empty' || current.type === 'invalid') {
    return {
      status: 'IN_PROGRESS',
      description: 'Current performance pending assessment consolidation.',
    };
  }

  // Case 1: Both exact
  if (current.type === 'exact' && target.type === 'exact' && current.value !== undefined && target.value !== undefined) {
    const diff = target.value - current.value;
    const gap = Math.round(diff * 100) / 100;

    if (gap <= 0) {
      return {
        status: 'ACHIEVED',
        gapPercentagePoints: 0,
        description: `Target achieved (${Math.abs(gap).toFixed(1)} percentage points above target)`,
      };
    }

    return {
      status: 'IN_PROGRESS',
      gapPercentagePoints: gap,
      description: `${gap.toFixed(1)} percentage points to target`,
    };
  }

  // Case 2: Current is a range, Target is exact
  if (current.type === 'range' && target.type === 'exact' && current.min !== undefined && current.max !== undefined && target.value !== undefined) {
    if (current.min >= target.value) {
      return {
        status: 'ACHIEVED',
        description: `Target achieved (Current range ${current.displayValue} meets or exceeds ${target.displayValue})`,
      };
    }

    if (current.max < target.value) {
      const minGap = Math.round((target.value - current.max) * 10) / 10;
      const maxGap = Math.round((target.value - current.min) * 10) / 10;
      return {
        status: 'IN_PROGRESS',
        description: `Approx. ${minGap}–${maxGap} percentage points to target`,
      };
    }

    return {
      status: 'RANGE_UNCERTAIN',
      description: `Target is within current estimated range (${current.displayValue})`,
    };
  }

  // Case 3: Target is a range
  if (target.type === 'range' && target.min !== undefined) {
    if (current.type === 'exact' && current.value !== undefined) {
      if (current.value >= target.min) {
        return {
          status: 'ACHIEVED',
          description: `Current score (${current.displayValue}) reaches target band (${target.displayValue})`,
        };
      }
      const gap = Math.round((target.min - current.value) * 10) / 10;
      return {
        status: 'IN_PROGRESS',
        gapPercentagePoints: gap,
        description: `${gap.toFixed(1)} percentage points to target lower band`,
      };
    }
  }

  return {
    status: 'RANGE_UNCERTAIN',
    description: 'Target progress will be calculated once exact metrics are consolidated.',
  };
}

export function generateAcademicInsights(student: {
  currentPerformance: {
    overall: NormalizedValue;
    subjectList: Array<{ label: string; normalized: NormalizedValue }>;
  };
  schoolTarget: {
    overall: NormalizedValue;
  };
}): string[] {
  const insights: string[] = [];
  const subjects = student.currentPerformance.subjectList;

  // Find exact scored subjects
  const exactSubjects = subjects
    .filter((s) => s.normalized.type === 'exact' && s.normalized.value !== undefined)
    .map((s) => ({ label: s.label, score: s.normalized.value! }))
    .sort((a, b) => b.score - a.score);

  if (exactSubjects.length >= 2) {
    const highest = exactSubjects[0];
    const lowest = exactSubjects[exactSubjects.length - 1];

    if (highest.score >= 80) {
      insights.push(`Strongest subject is ${highest.label} with an outstanding score of ${highest.score}%.`);
    }

    if (lowest.score < 70 && highest.score - lowest.score >= 15) {
      insights.push(`Targeted focus recommended in ${lowest.label} (${lowest.score}%) to elevate overall aggregate.`);
    }
  }

  // Range-based feedback
  const rangeSubjects = subjects.filter((s) => s.normalized.type === 'range');
  if (rangeSubjects.length > 0) {
    insights.push(
      `${rangeSubjects.length} subject${rangeSubjects.length > 1 ? 's' : ''} (${rangeSubjects.map((s) => s.label).join(', ')}) have estimated performance bands pending final assessment consolidation.`
    );
  }

  // Target comparison insight
  if (student.schoolTarget.overall.type === 'exact' && student.currentPerformance.overall.type === 'exact') {
    const targetVal = student.schoolTarget.overall.value!;
    const overallVal = student.currentPerformance.overall.value!;
    if (overallVal >= targetVal) {
      insights.push(`Academic milestone met: currently pacing at or above the school institutional target of ${targetVal}%.`);
    }
  }

  if (insights.length === 0) {
    insights.push('Academic performance tracking active. Complete term assessment metrics will consolidate here.');
  }

  return insights;
}
