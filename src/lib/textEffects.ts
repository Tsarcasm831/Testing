export class TextScramble {
  private el: HTMLElement;
  private chars = '!<>-_/[]{}—=+*^?#________';
  private queue: Array<{ from: string; to: string; start: number; end: number; char?: string }>=[];
  private frame = 0;
  private frameRequest = 0;
  private resolve?: () => void;

  constructor(el: HTMLElement) {
    this.el = el;
    this.update = this.update.bind(this);
  }

  setText(newText: string) {
    const oldText = this.el.innerText;
    const length = Math.max(oldText.length, newText.length);
    this.queue = [];
    for (let i = 0; i < length; i++) {
      const from = oldText[i] || '';
      const to = newText[i] || '';
      const start = Math.floor(Math.random() * 20);
      const end = start + Math.floor(Math.random() * 20);
      this.queue.push({ from, to, start, end });
    }
    cancelAnimationFrame(this.frameRequest);
    this.frame = 0;
    const promise = new Promise<void>(resolve => (this.resolve = resolve));
    this.update();
    return promise;
  }

  private update() {
    let output = '';
    let complete = 0;
    for (const item of this.queue) {
      const { from, to, start, end } = item;
      let char = item.char;
      if (this.frame >= end) {
        complete++;
        output += to;
      } else if (this.frame >= start) {
        if (!char || Math.random() < 0.28) {
          char = this.randomChar();
          item.char = char;
        }
        output += `<span class="dud">${char}</span>`;
      } else {
        output += from;
      }
    }
    this.el.innerHTML = output;
    if (complete === this.queue.length) {
      this.resolve?.();
    } else {
      this.frameRequest = requestAnimationFrame(this.update);
      this.frame++;
    }
  }

  private randomChar() {
    return this.chars[Math.floor(Math.random() * this.chars.length)];
  }
}

export const typewriterEffect = (
  el: HTMLElement,
  text: string,
  speed = 30
) => {
  let index = 0;
  const write = () => {
    if (index <= text.length) {
      el.textContent = text.slice(0, index);
      index++;
      setTimeout(write, speed);
    } else {
      const cursor = document.createElement('span');
      cursor.className = 'cursor';
      cursor.textContent = ' ';
      el.appendChild(cursor);
    }
  };
  write();
};
