import { hooks } from "#pruvious/server";
export async function applyHooksBeforeCreate(collection, context) {
  await applyHooks(collection, "beforeCreate", context);
}
export async function applyHooksAfterCreate(collection, context) {
  await applyHooks(collection, "afterCreate", context);
}
export async function applyHooksBeforeRead(collection, context) {
  await applyHooks(collection, "beforeRead", context);
}
export async function applyHooksAfterRead(collection, context) {
  await applyHooks(collection, "afterRead", context);
}
export async function applyHooksBeforeUpdate(collection, context) {
  await applyHooks(collection, "beforeUpdate", context);
}
export async function applyHooksAfterUpdate(collection, context) {
  await applyHooks(collection, "afterUpdate", context);
}
export async function applyHooksBeforeDelete(collection, context) {
  await applyHooks(collection, "beforeDelete", context);
}
export async function applyHooksAfterDelete(collection, context) {
  await applyHooks(collection, "afterDelete", context);
}
export async function applyHooksBeforeReturnRecord(collection, context) {
  await applyHooks(collection, "beforeReturnRecord", context);
}
async function applyHooks(collection, action, context) {
  if (hooks[collection] && hooks[collection][action]) {
    for (const { callback } of hooks[collection][action]) {
      await callback(context);
    }
  }
}
