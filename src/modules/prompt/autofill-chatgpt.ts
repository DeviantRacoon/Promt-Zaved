export type AutofillOpts = {
  selector?: string;
  autoSend?: boolean;
  value: string;
};

export function autofillChatGPT({
  selector = '#prompt-textarea,textarea[placeholder*="Message"],textarea[placeholder*="Escribe"],textarea:not([style*="display: none"])',
  autoSend = false,
  value,
}: AutofillOpts): void {
  const el = document.querySelector(selector) as HTMLTextAreaElement | HTMLElement | null;
  if (!el) {
    throw new Error('No se encontró el input de ChatGPT. Ajusta el selector por cambios en el DOM.');
  }

  if (el instanceof HTMLTextAreaElement) {
    el.focus();
    el.value = value;
    el.dispatchEvent(new Event('input', { bubbles: true }));
  } else {
    const anyEl = el as HTMLElement & { isContentEditable?: boolean };
    if (!anyEl.isContentEditable) {
      throw new Error('El elemento no es textarea ni contenteditable.');
    }
    anyEl.focus();
    anyEl.innerHTML = '';
    anyEl.appendChild(document.createTextNode(value));
    anyEl.dispatchEvent(
      new InputEvent('input', {
        bubbles: true,
        inputType: 'insertText',
        data: value,
        isComposing: false,
      }) as Event,
    );
  }

  if (autoSend) {
    const sendBtn = document.querySelector(
      'button[aria-label*="Send"],button[data-testid*="send"],button[aria-label*="Enviar"]',
    ) as HTMLButtonElement | null;
    if (sendBtn) sendBtn.click();
  }
}
