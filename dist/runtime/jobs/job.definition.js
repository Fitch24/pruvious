export function defineJob(definition) {
  return {
    name: definition.name,
    callback: definition.callback,
    priority: definition.priority ?? 10,
    interval: definition.interval ?? false,
    beforeProcess: definition.beforeProcess,
    afterProcess: definition.afterProcess
  };
}
