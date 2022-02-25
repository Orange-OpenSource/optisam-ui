import { PROHIBIT_SCOPES } from "./constants";

export function allowedScopes(): boolean {
  const currentScope: string = localStorage.getItem("scopeType") || "";
  const prohibitedScopes: Array<string> = PROHIBIT_SCOPES || []; // prohibition list
  if (!prohibitedScopes.length) return true; // Blank array([]) means no prohibition is set and we can pass true.
  return !prohibitedScopes.includes(currentScope); // If the current scope is present in the prohibition list then we can return false.
}

export function _dateUTC(date: Date) {
  return new Date(
    date.setMinutes(date.getMinutes() + date.getTimezoneOffset())
  );
}
