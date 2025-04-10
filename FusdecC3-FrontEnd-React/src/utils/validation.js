// Validate MongoDB ObjectId format
export const isValidObjectId = (id) => {
  if (!id) return false;
  // MongoDB ObjectId is a 24-character hex string
  return /^[0-9a-fA-F]{24}$/.test(id);
};
