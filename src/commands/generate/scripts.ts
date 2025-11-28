// JavaScript code for the generated dashboard

export function getScripts(): string {
  return String.raw`
    // Simple Markdown parser
    function parseMarkdown(md) {
      let html = md
        // Escape HTML
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        // Code blocks
        .replace(/\`\`\`(\w*)\n([\s\S]*?)\`\`\`/g, '<pre><code class="language-$1">$2</code></pre>')
        // Inline code
        .replace(/\`([^\`]+)\`/g, '<code>$1</code>')
        // Headers
        .replace(/^#### (.*)$/gm, '<h4>$1</h4>')
        .replace(/^### (.*)$/gm, '<h3>$1</h3>')
        .replace(/^## (.*)$/gm, '<h2>$1</h2>')
        .replace(/^# (.*)$/gm, '<h1>$1</h1>')
        // Bold and italic
        .replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.+?)\*/g, '<em>$1</em>')
        // Links
        .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>')
        // Images
        .replace(/!\[([^\]*?)\]\(([^)]+)\)/g, '<img src="$2" alt="$1">')
        // Blockquotes
        .replace(/^> (.*)$/gm, '<blockquote>$1</blockquote>')
        // Horizontal rule
        .replace(/^---$/gm, '<hr>')
        .replace(/^\*\*\*$/gm, '<hr>')
        // Unordered lists
        .replace(/^[\*\-] (.*)$/gm, '<li>$1</li>')
        // Ordered lists
        .replace(/^\d+\. (.*)$/gm, '<li>$1</li>')
        // Paragraphs
        .replace(/\n\n/g, '</p><p>')
        // Line breaks
        .replace(/\n/g, '<br>');

      // Wrap in paragraph
      html = '<p>' + html + '</p>';

      // Fix list wrapping
      html = html.replace(/(<li>.*<\/li>)/g, '<ul>$1</ul>');
      html = html.replace(/<\/ul><ul>/g, '');

      // Fix empty paragraphs
      html = html.replace(/<p><\/p>/g, '');
      html = html.replace(/<p>(<h[1-4]>)/g, '$1');
      html = html.replace(/(<\/h[1-4]>)<\/p>/g, '$1');
      html = html.replace(/<p>(<pre>)/g, '$1');
      html = html.replace(/(<\/pre>)<\/p>/g, '$1');
      html = html.replace(/<p>(<ul>)/g, '$1');
      html = html.replace(/(<\/ul>)<\/p>/g, '$1');
      html = html.replace(/<p>(<hr>)<\/p>/g, '$1');
      html = html.replace(/<p>(<blockquote>)/g, '$1');
      html = html.replace(/(<\/blockquote>)<\/p>/g, '$1');

      return html;
    }

    // Modal functionality
    const modal = document.getElementById('mdModal');
    const modalTitle = document.getElementById('mdModalTitle');
    const modalContent = document.getElementById('mdContent');
    const modalClose = document.getElementById('mdModalClose');

    // Close modal
    modalClose.addEventListener('click', () => {
      modal.classList.remove('active');
    });

    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('active');
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        modal.classList.remove('active');
      }
    });

    // MD links
    document.querySelectorAll('.md-link').forEach(link => {
      link.addEventListener('click', async (e) => {
        e.preventDefault();
        const path = link.dataset.path;
        const label = link.textContent;

        try {
          const response = await fetch(path);
          if (!response.ok) throw new Error('Failed to load file');
          const text = await response.text();

          modalTitle.textContent = label;
          modalContent.innerHTML = parseMarkdown(text);
          modal.classList.add('active');
        } catch (err) {
          alert('Nepodařilo se načíst soubor: ' + path);
        }
      });
    });

    // ========== INLINE EDITING ==========
    // Get project name from URL
    const pathParts = window.location.pathname.split('/').filter(Boolean);
    const projectName = pathParts[0] || '';

    // Current config cache
    let currentConfig = null;

    // Load config on start
    async function loadConfig() {
      if (!projectName) return;
      try {
        const res = await fetch('/__api/config/' + projectName);
        if (res.ok) {
          currentConfig = await res.json();
        }
      } catch (e) {
        console.error('Failed to load config:', e);
      }
    }

    // Save config
    async function saveConfig() {
      if (!projectName || !currentConfig) return;
      try {
        const res = await fetch('/__api/config/' + projectName, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(currentConfig)
        });
        if (res.ok) {
          showSaveIndicator();
        }
      } catch (e) {
        console.error('Failed to save config:', e);
      }
    }

    // Show save indicator
    function showSaveIndicator() {
      const indicator = document.getElementById('saveIndicator');
      indicator.classList.add('visible');
      setTimeout(() => indicator.classList.remove('visible'), 1500);
    }

    // Debounce helper
    function debounce(fn, delay) {
      let timer;
      return function(...args) {
        clearTimeout(timer);
        timer = setTimeout(() => fn.apply(this, args), delay);
      };
    }

    const debouncedSave = debounce(saveConfig, 500);

    // Handle title/description editing
    document.querySelectorAll('.editable[data-field]').forEach(el => {
      el.addEventListener('blur', () => {
        if (!currentConfig) return;
        const field = el.dataset.field;
        const value = el.textContent.trim();
        if (currentConfig[field] !== value) {
          currentConfig[field] = value || (field === 'title' ? 'Untitled' : '');
          debouncedSave();
        }
      });

      el.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          el.blur();
        }
      });
    });

    // Handle quick note editing
    function setupQuickNoteListeners() {
      document.querySelectorAll('.quick-note-text').forEach(el => {
        el.addEventListener('blur', () => {
          if (!currentConfig) return;
          const index = parseInt(el.dataset.noteIndex);
          const value = el.textContent.trim();
          if (!currentConfig.quickNotes) currentConfig.quickNotes = [];

          // Check if this is a TODO item (preserve checkbox prefix)
          const currentNote = currentConfig.quickNotes[index] || '';
          const todoMatch = currentNote.match(/^\[([ x])\]\s*/);
          const newValue = todoMatch ? todoMatch[0] + value : value;

          if (currentConfig.quickNotes[index] !== newValue) {
            currentConfig.quickNotes[index] = newValue;
            debouncedSave();
          }
        });

        el.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            el.blur();
          }
        });
      });

      // Handle TODO checkbox toggle
      document.querySelectorAll('.todo-checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', () => {
          if (!currentConfig) return;
          const index = parseInt(checkbox.dataset.noteIndex);
          if (!currentConfig.quickNotes) return;

          const currentNote = currentConfig.quickNotes[index] || '';
          const isChecked = checkbox.checked;

          // Toggle the checkbox state in the note text
          if (isChecked) {
            currentConfig.quickNotes[index] = currentNote.replace(/^\[ \]/, '[x]');
          } else {
            currentConfig.quickNotes[index] = currentNote.replace(/^\[x\]/, '[ ]');
          }

          // Toggle visual state
          checkbox.closest('.todo-item').classList.toggle('completed', isChecked);

          saveConfig();
        });
      });

      document.querySelectorAll('.quick-note-delete').forEach(btn => {
        btn.addEventListener('click', () => {
          if (!currentConfig) return;
          const index = parseInt(btn.dataset.noteIndex);
          if (!currentConfig.quickNotes) return;
          currentConfig.quickNotes.splice(index, 1);
          saveConfig();
          // Re-render will happen via live reload
        });
      });
    }

    // Add new note
    const addNoteBtn = document.getElementById('addNoteBtn');
    if (addNoteBtn) {
      addNoteBtn.addEventListener('click', () => {
        if (!currentConfig) return;
        if (!currentConfig.quickNotes) currentConfig.quickNotes = [];
        currentConfig.quickNotes.push('New note...');
        saveConfig();
        // Re-render will happen via live reload
      });
    }

    // Add new TODO
    const addTodoBtn = document.getElementById('addTodoBtn');
    if (addTodoBtn) {
      addTodoBtn.addEventListener('click', () => {
        if (!currentConfig) return;
        if (!currentConfig.quickNotes) currentConfig.quickNotes = [];
        currentConfig.quickNotes.push('[ ] New task...');
        saveConfig();
        // Re-render will happen via live reload
      });
    }

    // ========== DRAG & DROP ==========
    let draggedSection = null;

    function setupDragAndDrop() {
      const grid = document.getElementById('sectionsGrid');
      const cards = grid.querySelectorAll('.card[data-section]');

      cards.forEach(card => {
        // Drag start
        card.addEventListener('dragstart', (e) => {
          draggedSection = card;
          card.classList.add('dragging');
          e.dataTransfer.effectAllowed = 'move';
          e.dataTransfer.setData('text/plain', card.dataset.section);
        });

        // Drag end
        card.addEventListener('dragend', () => {
          card.classList.remove('dragging');
          draggedSection = null;
          // Remove all drag-over classes
          cards.forEach(c => c.classList.remove('drag-over'));
        });

        // Drag over
        card.addEventListener('dragover', (e) => {
          e.preventDefault();
          e.dataTransfer.dropEffect = 'move';
          if (card !== draggedSection) {
            card.classList.add('drag-over');
          }
        });

        // Drag leave
        card.addEventListener('dragleave', () => {
          card.classList.remove('drag-over');
        });

        // Drop
        card.addEventListener('drop', (e) => {
          e.preventDefault();
          card.classList.remove('drag-over');

          if (draggedSection && draggedSection !== card) {
            // Get current order from DOM
            const allCards = Array.from(grid.querySelectorAll('.card[data-section]'));
            const draggedIndex = allCards.indexOf(draggedSection);
            const targetIndex = allCards.indexOf(card);

            // Reorder in DOM
            if (draggedIndex < targetIndex) {
              card.parentNode.insertBefore(draggedSection, card.nextSibling);
            } else {
              card.parentNode.insertBefore(draggedSection, card);
            }

            // Save new order to config
            saveSectionOrder();
          }
        });
      });
    }

    function saveSectionOrder() {
      if (!currentConfig) return;
      const grid = document.getElementById('sectionsGrid');
      const cards = grid.querySelectorAll('.card[data-section]');
      const order = Array.from(cards).map(c => c.dataset.section);
      currentConfig.sectionOrder = order;
      saveConfig();
    }

    // Initialize
    loadConfig().then(() => {
      setupQuickNoteListeners();
      setupDragAndDrop();
    });
  `;
}
