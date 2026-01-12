/**
 * Keyboard shortcuts utility
 */

export type ShortcutHandler = (e: KeyboardEvent) => void;

interface Shortcut {
  key: string;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  handler: ShortcutHandler;
}

class KeyboardShortcuts {
  private shortcuts: Shortcut[] = [];

  register(shortcut: Shortcut): () => void {
    this.shortcuts.push(shortcut);
    return () => {
      this.shortcuts = this.shortcuts.filter(s => s !== shortcut);
    };
  }

  handleKeyDown = (e: KeyboardEvent): void => {
    for (const shortcut of this.shortcuts) {
      const keyMatch = shortcut.key.toLowerCase() === e.key.toLowerCase();
      const ctrlMatch = shortcut.ctrl ? e.ctrlKey || e.metaKey : !e.ctrlKey && !e.metaKey;
      const shiftMatch = shortcut.shift ? e.shiftKey : !e.shiftKey;
      const altMatch = shortcut.alt ? e.altKey : !e.altKey;

      if (keyMatch && ctrlMatch && shiftMatch && altMatch) {
        e.preventDefault();
        shortcut.handler(e);
        break;
      }
    }
  };

  init(): void {
    if (typeof window === 'undefined') return;
    window.addEventListener('keydown', this.handleKeyDown);
  }

  destroy(): void {
    if (typeof window === 'undefined') return;
    window.removeEventListener('keydown', this.handleKeyDown);
  }
}

export const keyboardShortcuts = new KeyboardShortcuts();

// Initialize on module load
if (typeof window !== 'undefined') {
  keyboardShortcuts.init();
}
