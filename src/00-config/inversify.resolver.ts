import { Container } from 'inversify';
import { IResolver } from 'mediatr-ts';

class InversifyResolver implements IResolver {
  constructor(private container: Container) {}
  resolve<T>(name: string): T {
    return this.container.get(name);
  }

  add(name: string, instance: Function): void {
    this.container.bind(name).to(instance as any);
  }

  remove(name: string): void {
    // not necessary- can be blank, never called by the lib, for debugging / testing only
    this.container.unbind(name);
  }

  clear(): void {
    // not necessary- can be blank, never called by the lib, for debugging / testing only
    this.container.unbindAll();
  }
}
export default InversifyResolver;
