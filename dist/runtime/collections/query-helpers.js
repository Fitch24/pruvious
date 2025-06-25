export async function fetchSubsetRecords(query, operation, cache) {
  if (cache?.data[cache.key]) {
    return cache.data[cache.key];
  }
  const clone = query.clone().selectAll().clearGroup().unpopulate();
  if (operation === "create") {
    clone.clearWhere();
  }
  if (operation !== "read") {
    clone.clearOffset().clearLimit();
  }
  const records = await clone.all();
  if (cache) {
    cache.data[cache.key] = records;
  }
  return records;
}
