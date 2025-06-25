export function getCapabilities(user) {
  return user ? Object.fromEntries(
    [...user.capabilities, ...user.role?.capabilities ?? []].map((capability) => [capability, true])
  ) : {};
}
export function hasCapability(user, capability, ...capabilities) {
  const userCapabilities = getCapabilities(user);
  return [capability, ...capabilities].every((c) => userCapabilities[c]);
}
