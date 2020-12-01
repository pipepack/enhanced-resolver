// package
import { Stats } from 'fs';

export interface FileSystem {
  stat(path: string): Promise<Stats>;
  readFile(path: string): Promise<Buffer>;
}
