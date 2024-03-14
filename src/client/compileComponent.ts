import type {CompiledComponent, Component} from '../types';

/**
 * Compiles component.
 * This client function should not use scope variables (except other client functions).
 */
export function compileComponent(compile: Component): CompiledComponent {
  void compile;

  return {} as CompiledComponent;
}
