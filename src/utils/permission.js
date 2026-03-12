export const hasPermission = (userPermissions = [], requiredPermission, role) => {
  if (role === "super-admin") return true;

  if (!requiredPermission) return true;

  return userPermissions.includes(requiredPermission);
};