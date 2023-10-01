export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
};
