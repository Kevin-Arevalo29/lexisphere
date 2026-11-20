import { modulesData } from '../data/modulesData';

const STORAGE_KEY = 'lexisphere_progress_v1';

// Lee el progreso guardado; si no existe, inicia todo en 0
export function loadCourseProgress() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

// Guarda el resultado de una actividad resuelta
// key formato: `${moduleId}::${activityType}` (ej. "modulo-1::reading")
export function saveActivityProgress({ moduleId, activityType, score = 100, pending = false }) {
  const current = loadCourseProgress();
  const safeModId = String(moduleId || 'modulo-1').toLowerCase();
  const safeActType = String(activityType || 'reading').toLowerCase();
  const key = `${safeModId}::${safeActType}`;

  current[key] = {
    moduleId: safeModId,
    activityType: safeActType,
    completed: true,
    pending: Boolean(pending),
    score: pending ? null : Math.max(0, Math.min(100, Number(score) ?? 100)),
    updatedAt: Date.now()
  };

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
  } catch {
    // Ignora errores de cuota si ocurre en el navegador
  }

  return current;
}

export function resetCourseProgress() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Ignora errores
  }
}

// Construye los datos de cada módulo iniciando en 0% y calculando según lo resuelto
export function buildEvaluationModules(progressMap = loadCourseProgress()) {
  const defaultActivityKeys = ['reading', 'listening', 'speaking', 'writing'];

  return modulesData.map((mod) => {
    const modIdLower = String(mod.id || '').toLowerCase();

    const actKeys =
      mod.activities && typeof mod.activities === 'object'
        ? Object.keys(mod.activities)
        : defaultActivityKeys;

    const tests = actKeys.map((actKey) => {
      const actObj = mod.activities?.[actKey];
      const label =
        actObj?.title || actKey.charAt(0).toUpperCase() + actKey.slice(1);

      // Busca coincidencia exacta o por prefijo del módulo
      const matchedEntry =
        progressMap[`${modIdLower}::${actKey.toLowerCase()}`] ||
        Object.values(progressMap).find(
          (item) =>
            item.activityType === actKey.toLowerCase() &&
            (item.moduleId === modIdLower || modIdLower.includes(item.moduleId))
        );

      if (!matchedEntry || !matchedEntry.completed) {
        return {
          key: actKey,
          name: label,
          completed: false,
          pending: false,
          percentage: 0
        };
      }

      if (matchedEntry.pending) {
        return {
          key: actKey,
          name: label,
          completed: true,
          pending: true,
          percentage: null
        };
      }

      const pct = Math.max(0, Math.min(100, Number(matchedEntry.score) || 0));
      return {
        key: actKey,
        name: label,
        completed: true,
        pending: false,
        percentage: pct
      };
    });

    // El porcentaje del módulo inicia en 0 y promedia las actividades calificadas
    const gradedTests = tests.filter((t) => t.completed && !t.pending && typeof t.percentage === 'number');
    const moduleScore =
      gradedTests.length > 0
        ? Math.round(
            gradedTests.reduce((sum, t) => sum + t.percentage, 0) / tests.length
          )
        : 0;

    const status = moduleScore >= 70 ? 'Passed' : 'In Progress';

    return {
      ...mod,
      score: moduleScore,
      status,
      tests
    };
  });
}