export enum Identity {
  File = 'File',
  Directory = 'Directory',
}

export enum Channel {
  // NPM complicated
  Node = 'Node',
  // simple relative reference
  Relative = 'Relative',
  // simple absolute reference
  Absolute = 'Absolute',
  // preserve internal reference
  Internal = 'Internal',
  // fallback as exception
  Unknown = 'Unknown',
}
