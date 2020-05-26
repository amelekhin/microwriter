import Microwriter, { MicrowriterOptions, MicrowriterInstance } from './Microwriter';

export { Microwriter, MicrowriterOptions, MicrowriterInstance };

// This wrapper function is added to make it possible move to function-based implementation in future
// without breaking the library interface and to make it compatible with 0.6 branch.
export default function microwriter(options: MicrowriterOptions): MicrowriterInstance {
  return new Microwriter(options);
}
