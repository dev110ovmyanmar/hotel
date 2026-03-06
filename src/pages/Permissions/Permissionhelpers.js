export const getModule = (code) => {
  return code?.split(".")[0] || "";
};

export const getAction = (code) => {
  return code?.split(".")[1] || "";
};

export const formatDate = (date) => {
  if (!date) return "—";
  return new Date(date).toLocaleDateString();
};

export const generateUUID = () => {
  return crypto.randomUUID();
};
