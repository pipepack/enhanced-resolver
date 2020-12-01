/**
 * @description - extract override with better type declaration, save type byte
 * @author - huang.jian <hjj491229492@hotmail.com>
 */

export function assign<T>(request: T, override: Partial<T>): T {
  return { ...request, ...override };
}
