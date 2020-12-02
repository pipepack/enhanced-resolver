// internal
import { Material, NormalTerminal } from './interface/resolver';

export abstract class Resolver {
  abstract async resolve(m: Material): Promise<NormalTerminal>;
}
