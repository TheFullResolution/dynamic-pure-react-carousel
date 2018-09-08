export function force(arg: any) {
  if (arg === undefined) throw new Error('Undefined value when force used')
  return arg
}
