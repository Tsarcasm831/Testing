export class JournalInterface {
  constructor(room, npcManager) {
    this.room = room;
    this.npcManager = npcManager;
    this.isOpen = false;
    this.currentView = 'main'; // 'main', 'npc-memory', 'cast-management', 'cast-editor'
    this.selectedNPC = null;
    this.selectedCast = null;
    this.casts = {};
    
    /* @tweakable maximum number of casts that can be saved */
    this.maxCasts = 10;
    /* @tweakable maximum number of NPCs per cast */
    this.maxNPCsPerCast = 20;
    
    this.loadCastsFromStorage();
    this.setupUI();
    this.setupEventListeners();
  }
  
  setupUI() {
    this.journalButton = document.getElementById('journal-button');
    this.journalSidebar = document.getElementById('journal-sidebar');
    this.closeJournalBtn = document.getElementById('close-journal-btn');
    this.eventSummaryContent = document.getElementById('event-summary-content');
    this.journalNpcList = document.getElementById('journal-npc-list');
    this.npcMemorySection = document.getElementById('npc-memory-section');
    this.npcListSection = document.getElementById('npc-list-section');
    this.eventSummarySection = document.getElementById('event-summary-section');
    this.backToListBtn = document.getElementById('back-to-list-btn');
    this.selectedNpcName = document.getElementById('selected-npc-name');
    this.npcMemoryContent = document.getElementById('npc-memory-content');
    
    // Add cast management UI after existing sections
    this.addCastManagementUI();
  }
  
  addCastManagementUI() {
    const journalContent = document.getElementById('journal-content');
    
    // Cast management section
    const castSection = document.createElement('div');
    castSection.id = 'cast-management-section';
    castSection.innerHTML = `
      <h3>Character Casts</h3>
      <div id="cast-controls">
        <button id="save-current-cast-btn">Save Current Cast</button>
        <button id="create-new-cast-btn">Create New Cast</button>
        <button id="import-cast-btn">Import Cast</button>
      </div>
      <div id="cast-list"></div>
      <input type="file" id="cast-file-input" accept=".json" style="display: none;">
    `;
    
    // Cast editor section
    const castEditorSection = document.createElement('div');
    castEditorSection.id = 'cast-editor-section';
    castEditorSection.style.display = 'none';
    castEditorSection.innerHTML = `
      <div id="cast-editor-header">
        <button id="back-to-casts-btn">← Back to Casts</button>
        <h3 id="cast-editor-title">Cast Editor</h3>
      </div>
      <div id="cast-editor-content">
        <div class="cast-info-section">
          <label for="cast-name-input">Cast Name:</label>
          <input type="text" id="cast-name-input" placeholder="Enter cast name...">
          <label for="cast-description-input">Description:</label>
          <textarea id="cast-description-input" placeholder="Describe this cast..."></textarea>
          <label for="cast-summary-input">Town Summary:</label>
          <textarea id="cast-summary-input" placeholder="Overall setting and background..."></textarea>
        </div>
        <div class="cast-npcs-section">
          <h4>NPCs in Cast</h4>
          <button id="add-npc-to-cast-btn">Add New NPC</button>
          <div id="cast-npc-list"></div>
        </div>
        <div class="cast-actions">
          <button id="save-cast-btn">Save Cast</button>
          <button id="export-cast-btn">Export Cast</button>
          <button id="delete-cast-btn">Delete Cast</button>
        </div>
      </div>
    `;
    
    journalContent.appendChild(castSection);
    journalContent.appendChild(castEditorSection);
  }
  
  setupEventListeners() {
    this.journalButton.addEventListener('click', () => this.toggleJournal());
    this.closeJournalBtn.addEventListener('click', () => this.closeJournal());
    this.backToListBtn.addEventListener('click', () => this.showMainView());
    
    // Cast management event listeners
    document.getElementById('save-current-cast-btn').addEventListener('click', () => this.saveCurrentCast());
    document.getElementById('create-new-cast-btn').addEventListener('click', () => this.createNewCast());
    document.getElementById('import-cast-btn').addEventListener('click', () => this.importCast());
    document.getElementById('cast-file-input').addEventListener('change', (e) => this.handleFileImport(e));
    document.getElementById('back-to-casts-btn').addEventListener('click', () => this.showMainView());
    document.getElementById('add-npc-to-cast-btn').addEventListener('click', () => this.addNPCToCast());
    document.getElementById('save-cast-btn').addEventListener('click', () => this.saveCast());
    document.getElementById('export-cast-btn').addEventListener('click', () => this.exportCast());
    document.getElementById('delete-cast-btn').addEventListener('click', () => this.deleteCast());
    
    // Close journal when clicking outside
    document.addEventListener('click', (e) => {
      if (this.isOpen && 
          !this.journalSidebar.contains(e.target) && 
          !this.journalButton.contains(e.target)) {
        this.closeJournal();
      }
    });
  }
  
  loadCastsFromStorage() {
    try {
      const savedCasts = localStorage.getItem('npc-casts');
      if (savedCasts) {
        this.casts = JSON.parse(savedCasts);
      }
    } catch (error) {
      console.error('Error loading casts from storage:', error);
      this.casts = {};
    }
  }
  
  saveCastsToStorage() {
    try {
      localStorage.setItem('npc-casts', JSON.stringify(this.casts));
    } catch (error) {
      console.error('Error saving casts to storage:', error);
    }
  }
  
  async toggleJournal() {
    if (this.isOpen) {
      this.closeJournal();
    } else {
      await this.openJournal();
    }
  }
  
  async openJournal() {
    this.isOpen = true;
    this.journalSidebar.classList.add('open');
    this.showMainView();
    
    // Load content
    await this.loadEventSummary();
    this.loadNPCList();
    this.loadCastList();
  }
  
  closeJournal() {
    this.isOpen = false;
    this.journalSidebar.classList.remove('open');
  }
  
  showMainView() {
    this.currentView = 'main';
    this.npcMemorySection.style.display = 'none';
    this.npcListSection.style.display = 'block';
    this.eventSummarySection.style.display = 'block';
    document.getElementById('cast-management-section').style.display = 'block';
    document.getElementById('cast-editor-section').style.display = 'none';
  }
  
  showCastEditor(cast = null) {
    this.currentView = 'cast-editor';
    this.selectedCast = cast;
    this.npcMemorySection.style.display = 'none';
    this.npcListSection.style.display = 'none';
    this.eventSummarySection.style.display = 'none';
    document.getElementById('cast-management-section').style.display = 'none';
    document.getElementById('cast-editor-section').style.display = 'block';
    
    if (cast) {
      document.getElementById('cast-editor-title').textContent = `Edit Cast: ${cast.name}`;
      document.getElementById('cast-name-input').value = cast.name || '';
      document.getElementById('cast-description-input').value = cast.description || '';
      document.getElementById('cast-summary-input').value = cast.summary || '';
      this.loadCastNPCList(cast);
    } else {
      document.getElementById('cast-editor-title').textContent = 'Create New Cast';
      document.getElementById('cast-name-input').value = '';
      document.getElementById('cast-description-input').value = '';
      document.getElementById('cast-summary-input').value = '';
      this.loadCastNPCList({ npcs: [] });
    }
  }
  
  loadCastList() {
    const castList = document.getElementById('cast-list');
    castList.innerHTML = '';
    
    if (Object.keys(this.casts).length === 0) {
      castList.innerHTML = '<div style="padding: 15px; font-style: italic;">No casts saved yet.</div>';
      return;
    }
    
    for (const [castId, cast] of Object.entries(this.casts)) {
      const castItem = document.createElement('div');
      castItem.className = 'cast-item';
      castItem.innerHTML = `
        <div class="cast-info">
          <div class="cast-name">${cast.name}</div>
          <div class="cast-description">${cast.description || 'No description'}</div>
          <div class="cast-stats">${cast.npcs.length} NPCs</div>
        </div>
        <div class="cast-actions">
          <button onclick="window.journalInterface.loadCast('${castId}')">Load</button>
          <button onclick="window.journalInterface.showCastEditor(window.journalInterface.casts['${castId}'])">Edit</button>
          <button onclick="window.journalInterface.exportCastById('${castId}')">Export</button>
          <button onclick="window.journalInterface.deleteCastById('${castId}')" class="delete-btn">Delete</button>
        </div>
      `;
      castList.appendChild(castItem);
    }
  }
  
  loadCastNPCList(cast) {
    const castNPCList = document.getElementById('cast-npc-list');
    castNPCList.innerHTML = '';
    
    if (!cast.npcs || cast.npcs.length === 0) {
      castNPCList.innerHTML = '<div style="padding: 15px; font-style: italic;">No NPCs in this cast.</div>';
      return;
    }
    
    cast.npcs.forEach((npc, index) => {
      const npcItem = document.createElement('div');
      npcItem.className = 'cast-npc-item';
      npcItem.innerHTML = `
        <div class="npc-info">
          <div class="npc-name">${npc.name}</div>
          <div class="npc-personality">${(npc.personality || '').substring(0, 100)}...</div>
        </div>
        <div class="npc-actions">
          <button onclick="window.journalInterface.editCastNPC(${index})">Edit</button>
          <button onclick="window.journalInterface.removeCastNPC(${index})" class="delete-btn">Remove</button>
        </div>
      `;
      castNPCList.appendChild(npcItem);
    });
  }
  
  async saveCurrentCast() {
    if (!this.npcManager || !this.npcManager.npcs || this.npcManager.npcs.length === 0) {
      alert('No NPCs to save in current scene.');
      return;
    }
    
    if (Object.keys(this.casts).length >= this.maxCasts) {
      alert(`Maximum number of casts (${this.maxCasts}) reached. Delete some casts first.`);
      return;
    }
    
    const castName = prompt('Enter a name for this cast:');
    if (!castName) return;
    
    const cast = {
      id: Date.now().toString(),
      name: castName,
      description: '',
      summary: '',
      npcs: [],
      createdAt: new Date().toISOString()
    };
    
    // Convert current NPCs to cast format
    for (const npc of this.npcManager.npcs) {
      const npcData = {
        name: npc.data.name,
        personality: npc.data.personality,
        personalityDescription: npc.data.personalityDescription,
        dialogue: npc.data.dialogue,
        color: npc.data.color,
        height: npc.data.height,
        features: npc.data.features,
        headShape: npc.data.headShape,
        bodyType: npc.data.bodyType,
        modelCode: npc.data.modelCode,
        conversationHistory: npc.data.conversationHistory || [],
        npcConversations: npc.data.npcConversations || {}
      };
      cast.npcs.push(npcData);
    }
    
    this.casts[cast.id] = cast;
    this.saveCastsToStorage();
    this.loadCastList();
    
    alert(`Cast "${castName}" saved successfully!`);
  }
  
  createNewCast() {
    if (Object.keys(this.casts).length >= this.maxCasts) {
      alert(`Maximum number of casts (${this.maxCasts}) reached. Delete some casts first.`);
      return;
    }
    
    this.selectedCast = {
      id: Date.now().toString(),
      name: '',
      description: '',
      summary: '',
      npcs: [],
      createdAt: new Date().toISOString()
    };
    this.showCastEditor(this.selectedCast);
  }
  
  async loadCast(castId) {
    const cast = this.casts[castId];
    if (!cast) return;
    
    if (confirm(`Load cast "${cast.name}"? This will replace all current NPCs.`)) {
      // Clear current NPCs
      if (this.npcManager && this.npcManager.npcs) {
        for (const npc of [...this.npcManager.npcs]) {
          npc.remove();
          const index = this.npcManager.npcs.indexOf(npc);
          if (index > -1) {
            this.npcManager.npcs.splice(index, 1);
          }
        }
      }
      
      // Load NPCs from cast
      for (const npcData of cast.npcs) {
        try {
          await this.npcManager.createNPCFromPromptWithModel(
            npcData.personalityDescription || npcData.personality,
            npcData.modelCode
          );
          
          // Update the newly created NPC with saved data
          const newNPC = this.npcManager.npcs[this.npcManager.npcs.length - 1];
          if (newNPC) {
            Object.assign(newNPC.data, npcData);
            if (newNPC.interaction) {
              newNPC.interaction.conversationHistory = npcData.conversationHistory || [];
            }
          }
        } catch (error) {
          console.error('Error loading NPC from cast:', error);
        }
      }
      
      this.showNotification(`Cast "${cast.name}" loaded successfully!`);
      this.closeJournal();
    }
  }
  
  importCast() {
    document.getElementById('cast-file-input').click();
  }
  
  handleFileImport(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const castData = JSON.parse(e.target.result);
        
        // Validate cast data
        if (!castData.name || !Array.isArray(castData.npcs)) {
          alert('Invalid cast file format.');
          return;
        }
        
        if (Object.keys(this.casts).length >= this.maxCasts) {
          alert(`Maximum number of casts (${this.maxCasts}) reached. Delete some casts first.`);
          return;
        }
        
        // Generate new ID to avoid conflicts
        castData.id = Date.now().toString();
        castData.importedAt = new Date().toISOString();
        
        this.casts[castData.id] = castData;
        this.saveCastsToStorage();
        this.loadCastList();
        
        alert(`Cast "${castData.name}" imported successfully!`);
      } catch (error) {
        console.error('Error importing cast:', error);
        alert('Error importing cast file.');
      }
    };
    reader.readAsText(file);
    
    // Reset file input
    event.target.value = '';
  }
  
  exportCastById(castId) {
    const cast = this.casts[castId];
    if (!cast) return;
    
    this.downloadJSON(cast, `${cast.name.replace(/[^a-z0-9]/gi, '_')}_cast.json`);
  }
  
  exportCast() {
    if (!this.selectedCast) return;
    
    this.downloadJSON(this.selectedCast, `${this.selectedCast.name.replace(/[^a-z0-9]/gi, '_')}_cast.json`);
  }
  
  downloadJSON(data, filename) {
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(url);
  }
  
  deleteCastById(castId) {
    const cast = this.casts[castId];
    if (!cast) return;
    
    if (confirm(`Delete cast "${cast.name}"? This cannot be undone.`)) {
      delete this.casts[castId];
      this.saveCastsToStorage();
      this.loadCastList();
      alert(`Cast "${cast.name}" deleted.`);
    }
  }
  
  deleteCast() {
    if (!this.selectedCast) return;
    
    if (confirm(`Delete cast "${this.selectedCast.name}"? This cannot be undone.`)) {
      delete this.casts[this.selectedCast.id];
      this.saveCastsToStorage();
      this.showMainView();
      this.loadCastList();
      alert(`Cast "${this.selectedCast.name}" deleted.`);
    }
  }
  
  addNPCToCast() {
    if (!this.selectedCast) return;
    
    if (this.selectedCast.npcs.length >= this.maxNPCsPerCast) {
      alert(`Maximum number of NPCs per cast (${this.maxNPCsPerCast}) reached.`);
      return;
    }
    
    const newNPC = {
      name: 'New NPC',
      personality: 'A friendly character',
      personalityDescription: 'A friendly character',
      dialogue: 'Hello there!',
      color: 0xFF5733,
      height: 1.0,
      features: [],
      headShape: 'square',
      bodyType: 'average',
      modelCode: null,
      conversationHistory: [],
      npcConversations: {}
    };
    
    this.selectedCast.npcs.push(newNPC);
    this.loadCastNPCList(this.selectedCast);
  }
  
  editCastNPC(index) {
    if (!this.selectedCast || !this.selectedCast.npcs[index]) return;
    
    const npc = this.selectedCast.npcs[index];
    const newName = prompt('NPC Name:', npc.name);
    if (newName === null) return;
    
    const newPersonality = prompt('Personality Description:', npc.personalityDescription || npc.personality);
    if (newPersonality === null) return;
    
    const newDialogue = prompt('Initial Dialogue:', npc.dialogue);
    if (newDialogue === null) return;
    
    npc.name = newName;
    npc.personality = newPersonality;
    npc.personalityDescription = newPersonality;
    npc.dialogue = newDialogue;
    
    this.loadCastNPCList(this.selectedCast);
  }
  
  removeCastNPC(index) {
    if (!this.selectedCast || !this.selectedCast.npcs[index]) return;
    
    const npc = this.selectedCast.npcs[index];
    if (confirm(`Remove "${npc.name}" from this cast?`)) {
      this.selectedCast.npcs.splice(index, 1);
      this.loadCastNPCList(this.selectedCast);
    }
  }
  
  saveCast() {
    if (!this.selectedCast) return;
    
    const name = document.getElementById('cast-name-input').value.trim();
    const description = document.getElementById('cast-description-input').value.trim();
    const summary = document.getElementById('cast-summary-input').value.trim();
    
    if (!name) {
      alert('Please enter a cast name.');
      return;
    }
    
    this.selectedCast.name = name;
    this.selectedCast.description = description;
    this.selectedCast.summary = summary;
    this.selectedCast.updatedAt = new Date().toISOString();
    
    this.casts[this.selectedCast.id] = this.selectedCast;
    this.saveCastsToStorage();
    
    alert(`Cast "${name}" saved successfully!`);
    this.showMainView();
    this.loadCastList();
  }
  
  showNotification(message) {
    // Use existing notification system from npcManager
    if (this.npcManager) {
      this.npcManager.showNotification(message);
    }
  }
  
  showNPCMemoryView(npc) {
    this.currentView = 'npc-memory';
    this.selectedNPC = npc;
    this.npcMemorySection.style.display = 'block';
    this.npcListSection.style.display = 'none';
    this.eventSummarySection.style.display = 'none';
    document.getElementById('cast-management-section').style.display = 'none';
    
    this.selectedNpcName.textContent = npc.data.name;
    this.loadNPCMemories(npc);
  }
  
  async loadEventSummary() {
    try {
      this.eventSummaryContent.innerHTML = '<div class="loading-text">Generating town summary...</div>';
      
      // Collect conversation data from all NPCs
      const conversations = [];
      
      if (this.npcManager && this.npcManager.npcs) {
        for (const npc of this.npcManager.npcs) {
          // Player conversations
          if (npc.data.conversationHistory && Array.isArray(npc.data.conversationHistory)) {
            npc.data.conversationHistory.forEach(conv => {
              if (conv.role === 'assistant') {
                conversations.push(`${npc.data.name} said: "${conv.content}"`);
              } else if (conv.role === 'user') {
                conversations.push(`Player said to ${npc.data.name}: "${conv.content}"`);
              }
            });
          }
          
          // NPC-to-NPC conversations
          if (npc.data.npcConversations) {
            for (const [otherNpcId, convList] of Object.entries(npc.data.npcConversations)) {
              const otherNpc = this.npcManager.npcs.find(n => n.data.id === otherNpcId);
              const otherNpcName = otherNpc ? otherNpc.data.name : 'Unknown NPC';
              
              convList.forEach(convEntry => {
                if (convEntry.messages && Array.isArray(convEntry.messages)) {
                  convEntry.messages.forEach(msg => {
                    conversations.push(`${msg.speaker} said to ${msg.speaker === npc.data.name ? otherNpcName : npc.data.name}: "${msg.text}"`);
                  });
                }
              });
            }
          }
        }
      }
      
      if (conversations.length === 0) {
        this.eventSummaryContent.innerHTML = '<div>The town is quiet today. No significant events have occurred yet.</div>';
        return;
      }
      
      // Generate summary using AI
      const completion = await websim.chat.completions.create({
        messages: [
          {
            role: "system",
            content: `You are a town chronicler. Create a narrative summary of recent events in the town based on conversations and interactions. 
            Write in a storytelling style, highlighting interesting developments, relationships forming, conflicts, or notable happenings.
            Keep it engaging and concise (2-3 paragraphs). Focus on the most interesting and significant events.`
          },
          {
            role: "user",
            content: `Recent conversations and interactions in town:\n${conversations.slice(-20).join('\n')}`
          }
        ]
      });
      
      this.eventSummaryContent.innerHTML = `<div>${completion.content}</div>`;
      
    } catch (error) {
      console.error('Error loading event summary:', error);
      this.eventSummaryContent.innerHTML = '<div>Unable to load town events at this time.</div>';
    }
  }
  
  loadNPCList() {
    this.journalNpcList.innerHTML = '';
    
    if (!this.npcManager || !this.npcManager.npcs || this.npcManager.npcs.length === 0) {
      this.journalNpcList.innerHTML = '<div style="padding: 15px; font-style: italic;">No residents have been encountered yet.</div>';
      return;
    }
    
    for (const npc of this.npcManager.npcs) {
      const npcItem = document.createElement('div');
      npcItem.className = 'journal-npc-item';
      
      const nameDiv = document.createElement('div');
      nameDiv.className = 'npc-name';
      nameDiv.textContent = npc.data.name || 'Unknown Resident';
      
      const descDiv = document.createElement('div');
      descDiv.className = 'npc-description';
      descDiv.textContent = (npc.data.personality || '').substring(0, 100) + 
                           (npc.data.personality && npc.data.personality.length > 100 ? '...' : '');
      
      npcItem.appendChild(nameDiv);
      npcItem.appendChild(descDiv);
      
      npcItem.addEventListener('click', () => this.showNPCMemoryView(npc));
      
      this.journalNpcList.appendChild(npcItem);
    }
  }
  
  loadNPCMemories(npc) {
    this.npcMemoryContent.innerHTML = '';
    
    const memories = [];
    
    // Add player conversations
    if (npc.data.conversationHistory && Array.isArray(npc.data.conversationHistory)) {
      const playerConversations = [];
      npc.data.conversationHistory.forEach(conv => {
        playerConversations.push({
          speaker: conv.role === 'user' ? 'Player' : npc.data.name,
          text: conv.content,
          timestamp: conv.timestamp
        });
      });
      
      if (playerConversations.length > 0) {
        memories.push({
          type: 'player-conversation',
          title: 'Conversations with You',
          content: playerConversations,
          timestamp: Math.max(...playerConversations.map(c => c.timestamp || 0))
        });
      }
    }
    
    // Add NPC-to-NPC conversations
    if (npc.data.npcConversations) {
      for (const [otherNpcId, convList] of Object.entries(npc.data.npcConversations)) {
        const otherNpc = this.npcManager.npcs.find(n => n.data.id === otherNpcId);
        const otherNpcName = otherNpc ? otherNpc.data.name : 'Unknown NPC';
        
        const allMessages = [];
        convList.forEach(convEntry => {
          if (convEntry.messages && Array.isArray(convEntry.messages)) {
            convEntry.messages.forEach(msg => {
              allMessages.push({
                speaker: msg.speaker,
                text: msg.text,
                timestamp: new Date(convEntry.timestamp).getTime()
              });
            });
          }
        });
        
        if (allMessages.length > 0) {
          memories.push({
            type: 'npc-conversation',
            title: `Conversations with ${otherNpcName}`,
            content: allMessages,
            timestamp: Math.max(...allMessages.map(m => m.timestamp || 0))
          });
        }
      }
    }
    
    // Sort memories by timestamp (most recent first)
    memories.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
    
    if (memories.length === 0) {
      this.npcMemoryContent.innerHTML = '<div class="memory-entry"><div class="memory-entry-content">No memories recorded yet.</div></div>';
      return;
    }
    
    // Display memories
    memories.forEach(memory => {
      const memoryEntry = document.createElement('div');
      memoryEntry.className = 'memory-entry';
      
      const header = document.createElement('div');
      header.className = 'memory-entry-header';
      header.textContent = memory.title;
      
      const content = document.createElement('div');
      content.className = 'memory-entry-content';
      
      if (memory.type === 'player-conversation' || memory.type === 'npc-conversation') {
        memory.content.forEach(message => {
          const messageDiv = document.createElement('div');
          messageDiv.className = 'conversation-message';
          
          const speakerDiv = document.createElement('div');
          speakerDiv.className = 'conversation-speaker';
          speakerDiv.textContent = message.speaker + ':';
          
          const textDiv = document.createElement('div');
          textDiv.className = 'conversation-text';
          textDiv.textContent = message.text;
          
          messageDiv.appendChild(speakerDiv);
          messageDiv.appendChild(textDiv);
          content.appendChild(messageDiv);
        });
      }
      
      memoryEntry.appendChild(header);
      memoryEntry.appendChild(content);
      this.npcMemoryContent.appendChild(memoryEntry);
    });
  }
}