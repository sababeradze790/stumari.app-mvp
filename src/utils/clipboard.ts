/**
 * Safely copies text to the user's clipboard.
 * Uses navigator.clipboard.writeText when permitted, with a DOM textarea fallback
 * for restricted iframe/permissions-policy environments.
 * Returns true ONLY if copying succeeded, or false if both methods failed.
 */
export async function safeCopyToClipboard(text: string): Promise<boolean> {
  if (!text) return false;

  try {
    if (
      typeof navigator !== 'undefined' &&
      navigator.clipboard &&
      typeof navigator.clipboard.writeText === 'function'
    ) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // Fall through to execCommand fallback if Clipboard API is blocked by iframe policy
  }

  try {
    if (typeof document === 'undefined') return false;
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.setAttribute('readonly', '');
    textArea.style.position = 'fixed';
    textArea.style.top = '-9999px';
    textArea.style.left = '-9999px';
    textArea.style.opacity = '0';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    const ok = document.execCommand('copy');
    document.body.removeChild(textArea);
    return Boolean(ok);
  } catch {
    return false;
  }
}
