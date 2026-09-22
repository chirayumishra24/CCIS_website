import { NormalizedValue, EXAM_WEIGHTS, EXAM_ORDER, StudentRecord, ExamEntry } from './academicNormalizer';

// ─── Core Types ───

export interface RequiredScoreInput {
  currentWeightedScore: number;
  targetScore: number;
  remainingWeight: number;
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

  const weightFraction = remainingWeight > 1 ? remainingWeight / 100 : remainingWeight;

  if (weightFraction <= 0 || weightFraction > 1) {
    return {
      status: 'INSUFFICIENT_DATA',
      message: 'Remaining assessment weight must be greater than 0 and up to 100%.',
    };
  }

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

// ─── Target Gap Analysis ───

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

// ─── Academic Insights ───

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

  const rangeSubjects = subjects.filter((s) => s.normalized.type === 'range');
  if (rangeSubjects.length > 0) {
    insights.push(
      `${rangeSubjects.length} subject${rangeSubjects.length > 1 ? 's' : ''} (${rangeSubjects.map((s) => s.label).join(', ')}) have estimated performance bands pending final assessment consolidation.`
    );
  }

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

// ─── Target Score Calculator (Weighted) — 4-Exam Model ───

export type RequiredScoreStatusTag =
  | 'ACHIEVED'
  | 'ON_TRACK'
  | 'NEEDS_FOCUS'
  | 'AT_RISK'
  | 'NOT_REACHABLE'
  | 'EXEMPT'
  | 'INSUFFICIENT_DATA';

export interface ExamScoreEntry {
  examId: string;
  label: string;
  shortLabel: string;
  weight: number;
  maxMarks: number;
  rawScore: number | null;       // actual marks scored (null = not taken yet)
  normalizedPct: number | null;  // score as percentage
  isCompleted: boolean;
  isPredicted: boolean;
  predictedPct: number | null;   // predicted percentage for future exams
  predictedRawMarks: number | null; // predicted raw marks (e.g., 62/80)
  confidence: 'high' | 'medium' | 'low' | null;
}

export interface SubjectRequiredScore {
  subjectKey: string;
  subjectLabel: string;
  subjectCode: string;
  examScores: ExamScoreEntry[];
  targetScore: number | null;       // per-subject target %
  targetDisplayValue: string;
  weightedContribution: number;     // sum of (score% × weight) for completed exams
  completedWeight: number;          // sum of weights for completed exams
  remainingWeight: number;          // sum of weights for uncompleted exams
  requiredInRemaining: number | null;
  status: RequiredScoreStatusTag;
  gap: number | null;               // target - current weighted projection
}

export interface TargetCalculatorResult {
  subjects: SubjectRequiredScore[];
  overall: SubjectRequiredScore;
  completedExams: string[];
  pendingExams: string[];
}

/**
 * Normalizes a raw exam score to percentage.
 */
function normalizeToPercent(rawScore: number | null, maxMarks: number): number | null {
  if (rawScore === null || rawScore === undefined) return null;
  if (maxMarks === 100) return rawScore;
  return Math.round((rawScore / maxMarks) * 10000) / 100;
}

/**
 * Extracts subject score from a student's exam entry.
 */
function getSubjectExamScore(
  examEntry: ExamEntry,
  subjectKey: string,
  maxMarks: number
): { raw: number | null; pct: number | null } {
  if (!examEntry) return { raw: null, pct: null };

  const subj = (examEntry as any).subjects?.[subjectKey] as NormalizedValue | undefined;
  if (!subj) return { raw: null, pct: null };

  if (subj.type === 'exempt') return { raw: null, pct: null };

  if (subj.displayValue === 'Absent (AB)' || subj.statusNote?.includes('Absent')) {
    return { raw: 0, pct: 0 };
  }

  if (subj.type === 'exact' && subj.value !== undefined) {
    const raw = subj.value;
    // If unit is marks, the value is raw marks → normalize to %
    // If unit is percent, the value is already %
    const pct = subj.unit === 'marks' ? normalizeToPercent(raw, maxMarks) : raw;
    return { raw, pct };
  }

  if (subj.type === 'range' && subj.min !== undefined && subj.max !== undefined) {
    const mid = (subj.min + subj.max) / 2;
    const pct = subj.unit === 'marks' ? normalizeToPercent(mid, maxMarks) : mid;
    return { raw: mid, pct };
  }

  return { raw: null, pct: null };
}

/**
 * Extracts target score for a subject from schoolTarget.subjects or falls back to currentPerformance.
 */
function getSubjectTarget(
  student: StudentRecord,
  subjectKey: string
): { value: number | null; displayValue: string } {
  // First try schoolTarget.subjects
  const targetSubjects = student.schoolTarget?.subjects;
  if (targetSubjects) {
    const target = targetSubjects[subjectKey as keyof typeof targetSubjects] as NormalizedValue | undefined;
    if (target) {
      if (target.type === 'exact' && target.value !== undefined) {
        return { value: target.value, displayValue: target.displayValue };
      }
      if (target.type === 'range' && target.min !== undefined && target.max !== undefined) {
        return { value: (target.min + target.max) / 2, displayValue: target.displayValue };
      }
      if (target.type === 'exempt') {
        return { value: null, displayValue: 'Exempt' };
      }
      return { value: null, displayValue: target.displayValue || 'N/A' };
    }
  }

  // Fall back to currentPerformance subjects (legacy: these ARE the targets from target sheet)
  const perfSubjects = student.currentPerformance?.subjects;
  const perf = perfSubjects?.[subjectKey as keyof typeof perfSubjects] as NormalizedValue | undefined;
  if (!perf) return { value: null, displayValue: 'N/A' };

  if (perf.type === 'exact' && perf.value !== undefined) {
    return { value: perf.value, displayValue: perf.displayValue };
  }
  if (perf.type === 'range' && perf.min !== undefined && perf.max !== undefined) {
    return { value: (perf.min + perf.max) / 2, displayValue: perf.displayValue };
  }
  return { value: null, displayValue: perf.displayValue || 'N/A' };
}

const SUBJECT_META: { key: string; code: string; label: string }[] = [
  { key: 'english', code: 'ENG', label: 'English Language & Lit' },
  { key: 'secondLanguage', code: 'LANG', label: '2nd Language' },
  { key: 'maths', code: 'MATH', label: 'Mathematics' },
  { key: 'science', code: 'SCI', label: 'General Science' },
  { key: 'socialScience', code: 'S.ST', label: 'Social Science' },
  { key: 'it', code: 'IT', label: 'Information Technology' },
];

/** Realistic prediction ceiling — no student is predicted above 95% */
const PREDICTION_CEILING = 95;

/**
 * Distributes the required average across pending exams using momentum-adjusted weighting.
 * Earlier pending exams get a slightly lower prediction (student improves over time).
 * @param momentumBoost - adaptive offset from comparing actual vs predicted in completed exams
 */
function distributePredictions(
  requiredAvg: number,
  pendingExamIds: string[],
  currentAvg: number | null,
  momentumBoost: number = 0
): Map<string, { pct: number; confidence: 'high' | 'medium' | 'low' }> {
  const predictions = new Map<string, { pct: number; confidence: 'high' | 'medium' | 'low' }>();

  if (pendingExamIds.length === 0) return predictions;

  // Apply momentum boost (positive if beating predictions, negative if missing)
  const boosted = requiredAvg + momentumBoost;
  const capped = Math.min(boosted, PREDICTION_CEILING);
  const isUnreachable = requiredAvg > 100;

  if (pendingExamIds.length === 1) {
    const conf = isUnreachable ? 'low' : capped <= 75 ? 'high' : capped <= 90 ? 'medium' : 'low';
    predictions.set(pendingExamIds[0], { pct: Math.round(capped * 10) / 10, confidence: conf });
    return predictions;
  }

  // Momentum: student should improve gradually — distribute with a slight upward ramp
  const rampFactor = 0.08;
  const rampStep = (capped * rampFactor) / (pendingExamIds.length - 1);
  const baseOffset = -(capped * rampFactor) / 2;

  for (let i = 0; i < pendingExamIds.length; i++) {
    let predicted = capped + baseOffset + rampStep * i;

    if (currentAvg !== null && predicted > currentAvg + 20) {
      const realisticCeiling = currentAvg + 20;
      predicted = predicted * 0.6 + realisticCeiling * 0.4;
    }

    predicted = Math.max(0, Math.min(PREDICTION_CEILING, predicted));
    predicted = Math.round(predicted * 10) / 10;

    const conf: 'high' | 'medium' | 'low' = isUnreachable
      ? 'low'
      : predicted <= 75
      ? 'high'
      : predicted <= 90
      ? 'medium'
      : 'low';

    predictions.set(pendingExamIds[i], { pct: predicted, confidence: conf });
  }

  return predictions;
}

export function calculateRequiredScoresPerSubject(
  student: StudentRecord
): TargetCalculatorResult {
  const completedExams: string[] = [];
  const pendingExams: string[] = [];

  for (const examId of EXAM_ORDER) {
    if (student.exams?.[examId] && !student.exams[examId].isPredicted) {
      completedExams.push(examId);
    } else {
      pendingExams.push(examId);
    }
  }

  const lang2 = student.secondLanguage || 'Hindi';
  const lang2Code = lang2.slice(0, 3).toUpperCase();

  const subjectResults: SubjectRequiredScore[] = SUBJECT_META.map((meta) => {
    const code = meta.key === 'secondLanguage' ? lang2Code : meta.code;
    const label = meta.key === 'secondLanguage' ? `2nd Lang: ${lang2}` : meta.label;

    // Check if subject is exempt in all completed exams
    const allExempt = completedExams.length > 0 && completedExams.every((eid) => {
      const exam = student.exams?.[eid];
      if (!exam) return false;
      const subj = (exam as any).subjects?.[meta.key] as NormalizedValue | undefined;
      return subj?.type === 'exempt';
    });

    // Build exam scores array
    const examScores: ExamScoreEntry[] = EXAM_ORDER.map((examId) => {
      const w = EXAM_WEIGHTS[examId];
      const exam = student.exams?.[examId];
      const { raw, pct } = exam
        ? getSubjectExamScore(exam as any, meta.key, w.maxMarks)
        : { raw: null, pct: null };

      return {
        examId,
        label: w.label,
        shortLabel: w.shortLabel,
        weight: w.weight,
        maxMarks: w.maxMarks,
        rawScore: raw,
        normalizedPct: pct,
        isCompleted: exam !== undefined && !exam.isPredicted && raw !== null,
        isPredicted: false,
        predictedPct: null,
        predictedRawMarks: null,
        confidence: null,
      };
    });

    if (allExempt) {
      return {
        subjectKey: meta.key,
        subjectLabel: label,
        subjectCode: code,
        examScores,
        targetScore: null,
        targetDisplayValue: 'Exempt',
        weightedContribution: 0,
        completedWeight: 0,
        remainingWeight: 0,
        requiredInRemaining: null,
        status: 'EXEMPT' as RequiredScoreStatusTag,
        gap: null,
      };
    }

    // Calculate weighted contribution from completed exams
    let weightedContribution = 0;
    let completedWeight = 0;

    for (const es of examScores) {
      if (es.isCompleted && es.normalizedPct !== null) {
        weightedContribution += es.normalizedPct * es.weight;
        completedWeight += es.weight;
      }
    }

    const remainingWeight = 1.0 - completedWeight;

    // Get target
    const target = getSubjectTarget(student, meta.key);

    let requiredInRemaining: number | null = null;
    let status: RequiredScoreStatusTag = 'INSUFFICIENT_DATA';
    let gap: number | null = null;

    // Current average from completed exams
    const currentAvg = completedWeight > 0 ? weightedContribution / completedWeight : null;

    if (target.value !== null && completedWeight > 0) {
      const targetTotal = target.value;
      const deficit = targetTotal - weightedContribution;

      if (deficit <= 0) {
        requiredInRemaining = 0;
        status = 'ACHIEVED';
        gap = 0;
      } else if (remainingWeight > 0) {
        requiredInRemaining = Math.round((deficit / remainingWeight) * 10) / 10;
        gap = currentAvg !== null ? Math.round((targetTotal - currentAvg) * 10) / 10 : null;

        if (requiredInRemaining <= 0) status = 'ACHIEVED';
        else if (requiredInRemaining <= 75) status = 'ON_TRACK';
        else if (requiredInRemaining <= 90) status = 'NEEDS_FOCUS';
        else if (requiredInRemaining <= 100) status = 'AT_RISK';
        else status = 'NOT_REACHABLE';
      } else {
        status = deficit <= 0 ? 'ACHIEVED' : 'NOT_REACHABLE';
        requiredInRemaining = deficit <= 0 ? 0 : null;
        gap = deficit;
      }

      // Generate predictions for pending exams
      if (remainingWeight > 0 && requiredInRemaining !== null) {
        const pendingIds = examScores.filter((es) => !es.isCompleted).map((es) => es.examId);
        const predictions = distributePredictions(requiredInRemaining, pendingIds, currentAvg);

        for (const es of examScores) {
          const pred = predictions.get(es.examId);
          if (pred) {
            es.isPredicted = true;
            es.predictedPct = pred.pct;
            es.predictedRawMarks = Math.round((pred.pct / 100) * es.maxMarks * 10) / 10;
            es.confidence = pred.confidence;
          }
        }
      }
    }

    return {
      subjectKey: meta.key,
      subjectLabel: label,
      subjectCode: code,
      examScores,
      targetScore: target.value,
      targetDisplayValue: target.displayValue,
      weightedContribution: Math.round(weightedContribution * 100) / 100,
      completedWeight: Math.round(completedWeight * 100) / 100,
      remainingWeight: Math.round(remainingWeight * 100) / 100,
      requiredInRemaining,
      status,
      gap,
    };
  });

  // ─── Overall calculation ───
  const nonExemptSubjects = subjectResults.filter((s) => s.status !== 'EXEMPT');
  const overallTarget = student.schoolTarget?.overall;
  let overallTargetVal: number | null = null;
  let overallTargetDisplay = 'N/A';

  if (overallTarget?.type === 'exact' && overallTarget.value !== undefined) {
    overallTargetVal = overallTarget.value;
    overallTargetDisplay = overallTarget.displayValue;
  } else if (overallTarget?.type === 'range' && overallTarget.min !== undefined && overallTarget.max !== undefined) {
    overallTargetVal = (overallTarget.min + overallTarget.max) / 2;
    overallTargetDisplay = overallTarget.displayValue;
  }

  const totalWeightedContrib = nonExemptSubjects.reduce((sum, s) => sum + s.weightedContribution, 0);
  const avgWeightedContrib = nonExemptSubjects.length > 0 ? totalWeightedContrib / nonExemptSubjects.length : 0;
  const overallCompletedWeight = nonExemptSubjects.length > 0 ? nonExemptSubjects[0].completedWeight : 0;
  const overallRemainingWeight = nonExemptSubjects.length > 0 ? nonExemptSubjects[0].remainingWeight : 1;

  let overallRequired: number | null = null;
  let overallStatus: RequiredScoreStatusTag = 'INSUFFICIENT_DATA';
  let overallGap: number | null = null;

  if (overallTargetVal !== null && overallCompletedWeight > 0) {
    const deficit = overallTargetVal - avgWeightedContrib;
    if (deficit <= 0) {
      overallRequired = 0;
      overallStatus = 'ACHIEVED';
      overallGap = 0;
    } else if (overallRemainingWeight > 0) {
      overallRequired = Math.round((deficit / overallRemainingWeight) * 10) / 10;
      const currentAvg = avgWeightedContrib / overallCompletedWeight;
      overallGap = Math.round((overallTargetVal - currentAvg) * 10) / 10;

      if (overallRequired <= 0) overallStatus = 'ACHIEVED';
      else if (overallRequired <= 75) overallStatus = 'ON_TRACK';
      else if (overallRequired <= 90) overallStatus = 'NEEDS_FOCUS';
      else if (overallRequired <= 100) overallStatus = 'AT_RISK';
      else overallStatus = 'NOT_REACHABLE';
    }
  }

  const overallCurrentAvg = overallCompletedWeight > 0 ? avgWeightedContrib / overallCompletedWeight : null;

  const overallExamScores: ExamScoreEntry[] = EXAM_ORDER.map((examId) => {
    const w = EXAM_WEIGHTS[examId];
    const exam = student.exams?.[examId];
    const overallNorm = exam ? (exam as any).overall as NormalizedValue | undefined : undefined;
    let pct: number | null = null;
    if (overallNorm?.type === 'exact' && overallNorm.value !== undefined) pct = overallNorm.value;

    const isComp = exam !== undefined && !exam.isPredicted && pct !== null;

    return {
      examId,
      label: w.label,
      shortLabel: w.shortLabel,
      weight: w.weight,
      maxMarks: w.maxMarks,
      rawScore: pct,
      normalizedPct: pct,
      isCompleted: isComp,
      isPredicted: false,
      predictedPct: null,
      predictedRawMarks: null,
      confidence: null,
    };
  });

  // Generate overall predictions
  if (overallRemainingWeight > 0 && overallRequired !== null && overallRequired > 0) {
    const pendingIds = overallExamScores.filter((es) => !es.isCompleted).map((es) => es.examId);
    const predictions = distributePredictions(overallRequired, pendingIds, overallCurrentAvg);

    for (const es of overallExamScores) {
      const pred = predictions.get(es.examId);
      if (pred) {
        es.isPredicted = true;
        es.predictedPct = pred.pct;
        es.predictedRawMarks = Math.round((pred.pct / 100) * es.maxMarks * 10) / 10;
        es.confidence = pred.confidence;
      }
    }
  }

  const overall: SubjectRequiredScore = {
    subjectKey: 'overall',
    subjectLabel: 'Overall Aggregate',
    subjectCode: 'ALL',
    examScores: overallExamScores,
    targetScore: overallTargetVal,
    targetDisplayValue: overallTargetDisplay,
    weightedContribution: Math.round(avgWeightedContrib * 100) / 100,
    completedWeight: overallCompletedWeight,
    remainingWeight: overallRemainingWeight,
    requiredInRemaining: overallRequired,
    status: overallStatus,
    gap: overallGap,
  };

  return { subjects: subjectResults, overall, completedExams, pendingExams };
}

// ─── Achievement Detail Types ───

export interface AchievementDetail {
  subjectKey: string;
  examId: string;
  predicted: number | null;
  actual: number | null;
  delta: number | null;       // actual - predicted (positive = beat prediction)
  verdict: 'ABOVE' | 'BELOW' | 'MATCH' | 'PENDING';
  targetAchieved: boolean;    // overall target met for this subject?
}

/**
 * Compares actual exam scores against prior predictions for each completed exam.
 * Powers the "Target Achieved" / "Above/Below Prediction" badges in the TargetScoreTable.
 */
export function compareActualVsPredicted(
  student: StudentRecord
): AchievementDetail[] {
  const results: AchievementDetail[] = [];
  if (!student.exams) return results;

  const completedExamIds = EXAM_ORDER.filter((eid) =>
    student.exams?.[eid] && !student.exams[eid].isPredicted
  );

  const calcResult = calculateRequiredScoresPerSubject(student);

  for (const meta of SUBJECT_META) {
    const subjResult = calcResult.subjects.find((s) => s.subjectKey === meta.key);
    const targetAchieved = subjResult?.status === 'ACHIEVED';

    for (const examId of completedExamIds) {
      const exam = student.exams?.[examId];
      if (!exam) continue;

      const w = EXAM_WEIGHTS[examId];
      const subj = (exam as any).subjects?.[meta.key] as NormalizedValue | undefined;
      if (!subj || subj.type !== 'exact' || subj.value === undefined) {
        results.push({
          subjectKey: meta.key,
          examId,
          predicted: null,
          actual: null,
          delta: null,
          verdict: 'PENDING',
          targetAchieved,
        });
        continue;
      }

      const actualPct = subj.unit === 'marks'
        ? (subj.value / w.maxMarks) * 100
        : subj.value;

      // Check if there was a prediction stored for this exam
      const predictedPct = exam.predictedScores?.[meta.key]?.predictedPct ?? null;

      if (predictedPct === null) {
        // No prediction existed (e.g., first exam) — just report actual
        results.push({
          subjectKey: meta.key,
          examId,
          predicted: null,
          actual: Math.round(actualPct * 10) / 10,
          delta: null,
          verdict: 'PENDING',
          targetAchieved,
        });
        continue;
      }

      const delta = Math.round((actualPct - predictedPct) * 10) / 10;
      const verdict: 'ABOVE' | 'BELOW' | 'MATCH' =
        delta > 2 ? 'ABOVE' : delta < -2 ? 'BELOW' : 'MATCH';

      results.push({
        subjectKey: meta.key,
        examId,
        predicted: predictedPct,
        actual: Math.round(actualPct * 10) / 10,
        delta,
        verdict,
        targetAchieved,
      });
    }
  }

  return results;
}
