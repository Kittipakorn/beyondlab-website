export const SAFE_RETURN_TO_PATHS = ["/", "/account", "/grader", "/ide"] as const;

export type SafeReturnTo = (typeof SAFE_RETURN_TO_PATHS)[number];

const safeReturnToSet = new Set<string>(SAFE_RETURN_TO_PATHS);

export function getSafeReturnTo(value: unknown, fallback: SafeReturnTo = "/"): SafeReturnTo {
  return typeof value === "string" && safeReturnToSet.has(value)
    ? (value as SafeReturnTo)
    : fallback;
}

export function getReturnToLabel(returnTo: SafeReturnTo) {
  if (returnTo === "/account") return "บัญชีของคุณ";
  if (returnTo === "/grader") return "BeyondLab Grader";
  if (returnTo === "/ide") return "IDE Playground";
  return "BeyondLab";
}
