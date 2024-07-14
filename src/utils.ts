export const omit = <T extends Record<string, any>, K extends keyof T>(
  obj: T,
  ...keys: K[]
): Omit<T, K> => {
  const res: any = {}
  for (const key in obj) {
    if (!keys.includes(key as any as K)) {
      res[key] = obj[key]
    }
  }
  return res
}

export const printPort = (port: string[]) => {
  console.log("Port mapping", Array.isArray(port) ? port.join(", ") : port)
}
