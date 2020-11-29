// internal
import { Terminal } from './interface/resolver';

export abstract class Resolver {
  abstract async resolve(m: Material): Promise<Terminal>;
}
