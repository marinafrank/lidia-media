class SimpleAufraumSpiel {
    constructor() {
        this.score = 0;
        this.currentRoom = null;
        this.cleanedItems = 0;
        this.totalItems = 0;
        this.draggedElement = null;
        this.originalPosition = { x: 0, y: 0 };

        // Einfache Raumdaten
        this.roomData = {
            bedroom: {
                title: "🛏️ Schlafzimmer",
                items: [
                    { emoji: "👕", label: "T-Shirt", type: "clothing", correctZone: "wardrobe", startPos: { x: 30, y: 60 } },
                    { emoji: "👖", label: "Hose", type: "clothing", correctZone: "wardrobe", startPos: { x: 45, y: 80 } },
                    { emoji: "🧦", label: "Socken", type: "clothing", correctZone: "wardrobe", startPos: { x: 25, y: 40 } },
                    { emoji: "📚", label: "Bücher", type: "study", correctZone: "desk", startPos: { x: 70, y: 30 } },
                    { emoji: "🎮", label: "Konsole", type: "electronics", correctZone: "desk", startPos: { x: 55, y: 45 } },
                    { emoji: "🧸", label: "Teddy", type: "toy", correctZone: "bed", startPos: { x: 20, y: 25 } }
                ],
                zones: [
                    { id: "wardrobe", name: "Kleiderschrank", x: 80, y: 20, w: 15, h: 30, accepts: ["clothing"] },
                    { id: "desk", name: "Schreibtisch", x: 40, y: 50, w: 20, h: 20, accepts: ["study", "electronics"] },
                    { id: "bed", name: "Bett", x: 15, y: 40, w: 25, h: 25, accepts: ["toy"] }
                ]
            },
            kitchen: {
                title: "🍳 Küche",
                items: [
                    { emoji: "🍽️", label: "Teller", type: "dishes", correctZone: "cabinet", startPos: { x: 30, y: 30 } },
                    { emoji: "🍴", label: "Gabel", type: "utensils", correctZone: "cabinet", startPos: { x: 25, y: 70 } },
                    { emoji: "🍳", label: "Pfanne", type: "cookware", correctZone: "stove", startPos: { x: 60, y: 40 } },
                    { emoji: "☕", label: "Tasse", type: "dishes", correctZone: "cabinet", startPos: { x: 35, y: 50 } },
                    { emoji: "🧽", label: "Schwamm", type: "cleaning", correctZone: "sink", startPos: { x: 50, y: 80 } },
                    { emoji: "🧴", label: "Spülmittel", type: "cleaning", correctZone: "sink", startPos: { x: 80, y: 75 } }
                ],
                zones: [
                    { id: "cabinet", name: "Küchenschrank", x: 75, y: 25, w: 20, h: 30, accepts: ["dishes", "utensils"] },
                    { id: "stove", name: "Herd", x: 15, y: 40, w: 15, h: 20, accepts: ["cookware"] },
                    { id: "sink", name: "Spüle", x: 35, y: 35, w: 15, h: 25, accepts: ["cleaning"] }
                ]
            }
        };

        this.init();
    }

    init() {
        console.log("Spiel wird initialisiert...");

        // Event Listeners für Raumauswahl
        document.querySelectorAll('.room-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                console.log("Raum ausgewählt:", e.currentTarget.dataset.room);
                this.startRoom(e.currentTarget.dataset.room);
            });
        });

        // Navigation Buttons
        const backBtn = document.getElementById('back-btn');
        if (backBtn) {
            backBtn.addEventListener('click', () => {
                this.showScreen('room-selection');
            });
        }

        const resetBtn = document.getElementById('reset-room');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                if (this.currentRoom) {
                    this.startRoom(this.currentRoom);
                }
            });
        }

        this.updateDisplay();
    }

    showScreen(screenId) {
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        document.getElementById(screenId).classList.add('active');
    }

    startRoom(roomType) {
        console.log("Starte Raum:", roomType);
        this.currentRoom = roomType;
        this.cleanedItems = 0;

        const roomData = this.roomData[roomType];
        this.totalItems = roomData.items.length;

        document.getElementById('current-room-title').textContent = roomData.title;

        this.setupRoom(roomData);
        this.updateDisplay();
        this.showScreen('game-area');
    }

    setupRoom(roomData) {
        const room3d = document.querySelector('.room-3d');

        // Alle Container leeren
        const containers = ['.furniture-container', '.items-container', '.drop-zones', '.furniture-labels'];
        containers.forEach(selector => {
            const container = document.querySelector(selector);
            if (container) container.innerHTML = '';
        });

        // Drop-Zones erstellen
        this.createDropZones(roomData.zones);

        // Items erstellen
        this.createItems(roomData.items);

        console.log("Raum setup abgeschlossen");
    }

    createDropZones(zones) {
        const container = document.querySelector('.drop-zones');
        if (!container) return;

        zones.forEach(zone => {
            // Drop Zone
            const dropZone = document.createElement('div');
            dropZone.className = 'drop-zone';
            dropZone.id = `zone-${zone.id}`;
            dropZone.style.left = `${zone.x}%`;
            dropZone.style.top = `${zone.y}%`;
            dropZone.style.width = `${zone.w}%`;
            dropZone.style.height = `${zone.h}%`;
            dropZone.dataset.zoneId = zone.id;
            dropZone.dataset.zoneName = zone.name;
            dropZone.dataset.accepts = zone.accepts.join(',');

            // Drop Events
            dropZone.addEventListener('dragover', (e) => {
                e.preventDefault();
                dropZone.classList.add('highlight');
            });

            dropZone.addEventListener('dragleave', () => {
                dropZone.classList.remove('highlight');
            });

            dropZone.addEventListener('drop', (e) => {
                e.preventDefault();
                dropZone.classList.remove('highlight');
                this.handleDrop(dropZone);
            });

            container.appendChild(dropZone);

            // Label
            const label = document.createElement('div');
            label.className = 'zone-label';
            label.textContent = zone.name;
            label.style.position = 'absolute';
            label.style.left = `${zone.x + zone.w/2}%`;
            label.style.top = `${zone.y - 3}%`;
            label.style.transform = 'translateX(-50%)';
            label.style.background = 'rgba(0,0,0,0.7)';
            label.style.color = 'white';
            label.style.padding = '4px 8px';
            label.style.borderRadius = '4px';
            label.style.fontSize = '0.8em';
            label.style.fontWeight = 'bold';
            label.style.zIndex = '20';
            label.style.pointerEvents = 'none';

            container.appendChild(label);
        });
    }

    createItems(items) {
        const container = document.querySelector('.items-container');
        if (!container) return;

        items.forEach((item, index) => {
            const itemDiv = document.createElement('div');
            itemDiv.className = 'draggable-item';
            itemDiv.id = `item-${index}`;
            itemDiv.style.left = `${item.startPos.x}%`;
            itemDiv.style.top = `${item.startPos.y}%`;
            itemDiv.draggable = true;
            itemDiv.dataset.itemType = item.type;
            itemDiv.dataset.correctZone = item.correctZone;
            itemDiv.dataset.itemIndex = index;

            // Emoji
            const emoji = document.createElement('div');
            emoji.className = 'item-emoji';
            emoji.textContent = item.emoji;
            emoji.style.fontSize = '2em';
            emoji.style.textAlign = 'center';

            // Label
            const label = document.createElement('div');
            label.className = 'item-label';
            label.textContent = item.label;
            label.style.fontSize = '0.7em';
            label.style.fontWeight = 'bold';
            label.style.textAlign = 'center';
            label.style.marginTop = '2px';

            itemDiv.appendChild(emoji);
            itemDiv.appendChild(label);

            // Drag Events
            itemDiv.addEventListener('dragstart', (e) => {
                console.log("Drag start:", item.label);
                this.draggedElement = itemDiv;
                this.originalPosition = {
                    x: parseFloat(itemDiv.style.left),
                    y: parseFloat(itemDiv.style.top)
                };
                itemDiv.style.opacity = '0.5';
                e.dataTransfer.effectAllowed = 'move';
            });

            itemDiv.addEventListener('dragend', () => {
                console.log("Drag end");
                itemDiv.style.opacity = '1';
            });

            container.appendChild(itemDiv);
        });
    }

    handleDrop(dropZone) {
        console.log("handleDrop called");
        if (!this.draggedElement) {
            console.log("Kein Element wird gezogen");
            return;
        }

        const itemType = this.draggedElement.dataset.itemType;
        const correctZone = this.draggedElement.dataset.correctZone;
        const zoneId = dropZone.dataset.zoneId;
        const accepts = dropZone.dataset.accepts.split(',');

        console.log("Drop details:", {
            itemType,
            correctZone,
            zoneId,
            accepts,
            match: correctZone === zoneId && accepts.includes(itemType)
        });

        if (correctZone === zoneId && accepts.includes(itemType)) {
            this.correctPlacement(dropZone);
        } else {
            this.wrongPlacement(dropZone);
        }
    }

    correctPlacement(dropZone) {
        console.log("Korrekte Platzierung!");

        // Position in der Zone festsetzen
        const zoneRect = dropZone.getBoundingClientRect();
        const containerRect = document.querySelector('.room-3d').getBoundingClientRect();

        const centerX = ((zoneRect.left - containerRect.left + zoneRect.width/2 - 40) / containerRect.width) * 100;
        const centerY = ((zoneRect.top - containerRect.top + zoneRect.height/2 - 40) / containerRect.height) * 100;

        this.draggedElement.style.left = `${centerX}%`;
        this.draggedElement.style.top = `${centerY}%`;
        this.draggedElement.style.pointerEvents = 'none';
        this.draggedElement.draggable = false;
        this.draggedElement.classList.add('placed');

        // Feedback
        this.showMessage(`✅ Perfekt! ${this.draggedElement.querySelector('.item-label').textContent} ist richtig platziert!`, 'success');

        // Punkte
        this.score += 20;
        this.cleanedItems++;
        this.updateDisplay();

        // Check completion
        if (this.cleanedItems >= this.totalItems) {
            setTimeout(() => {
                this.roomCompleted();
            }, 1000);
        }

        this.draggedElement = null;
    }

    wrongPlacement(dropZone) {
        console.log("Falsche Platzierung!");

        // Zurück zur ursprünglichen Position
        this.draggedElement.style.left = `${this.originalPosition.x}%`;
        this.draggedElement.style.top = `${this.originalPosition.y}%`;

        const itemName = this.draggedElement.querySelector('.item-label').textContent;
        const zoneName = dropZone.dataset.zoneName;

        this.showMessage(`❌ ${itemName} gehört nicht zu ${zoneName}!`, 'error');

        this.draggedElement = null;
    }

    showMessage(text, type) {
        console.log("Message:", text);

        // Simple alert for now - can be improved later
        const messageDiv = document.createElement('div');
        messageDiv.style.position = 'fixed';
        messageDiv.style.top = '20px';
        messageDiv.style.left = '50%';
        messageDiv.style.transform = 'translateX(-50%)';
        messageDiv.style.padding = '10px 20px';
        messageDiv.style.borderRadius = '8px';
        messageDiv.style.color = 'white';
        messageDiv.style.fontWeight = 'bold';
        messageDiv.style.zIndex = '1000';
        messageDiv.style.background = type === 'success' ? '#00b894' : '#d63031';
        messageDiv.textContent = text;

        document.body.appendChild(messageDiv);

        setTimeout(() => {
            document.body.removeChild(messageDiv);
        }, 3000);
    }

    updateDisplay() {
        document.getElementById('score').textContent = this.score;
        document.getElementById('cleaned-items').textContent = this.cleanedItems;
        document.getElementById('total-items').textContent = this.totalItems;
    }

    roomCompleted() {
        this.score += 100; // Bonus
        this.updateDisplay();
        this.showMessage('🎉 Raum erfolgreich aufgeräumt! +100 Bonus Punkte!', 'success');

        // Show success screen after delay
        setTimeout(() => {
            document.getElementById('final-score').textContent = this.score;
            this.showScreen('success-screen');
        }, 2000);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM loaded, initializing game...");
    window.game = new SimpleAufraumSpiel();
});
