/**
 * Escapes square brackets in URLs so they're safe for Openpay's API
 * (which uses bracket notation in query params, e.g. creation[gte]).
 */
export function escapeBrackets(url: string): string {
  let result = url.replace(/\[/g, encodeURI('['));
  result = result.replace(/\]/g, encodeURI(']'));
  return result;
}
