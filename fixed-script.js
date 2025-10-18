class AufraumSpiel {
    constructor() {
        this.score = 0;
        this.currentRoom = null;
        this.cleanedItems = 0;
        this.totalItems = 0;
        this.isDragging = false;
        this.dragOffset = { x: 0, y: 0 };
        this.activeElement = null;

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
        // Event Listeners für Raumauswahl
        document.querySelectorAll('.room-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.startRoom(e.currentTarget.dataset.room);
            });
        });

        // Navigation
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

        // Success screen buttons
        const playAgainBtn = document.getElementById('play-again');
        if (playAgainBtn) {
            playAgainBtn.addEventListener('click', () => {
                if (this.currentRoom) {
                    this.startRoom(this.currentRoom);
                }
            });
        }

        const chooseOtherBtn = document.getElementById('choose-other-room');
        if (chooseOtherBtn) {
            chooseOtherBtn.addEventListener('click', () => {
                this.showScreen('room-selection');
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
        // Clear containers
        const containers = ['.items-container', '.drop-zones', '.furniture-labels'];
        containers.forEach(selector => {
            const container = document.querySelector(selector);
            if (container) container.innerHTML = '';
        });

        this.createZones(roomData.zones);
        this.createItems(roomData.items);
    }

    createZones(zones) {
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
            dropZone.dataset.accepts = zone.accepts.join(',');
            container.appendChild(dropZone);

            // Label
            const label = document.createElement('div');
            label.className = 'furniture-label';
            label.textContent = zone.name;
            label.style.position = 'absolute';
            label.style.left = `${zone.x + zone.w/2}%`;
            label.style.top = `${zone.y - 4}%`;
            label.style.transform = 'translateX(-50%)';
            label.style.background = 'rgba(0,0,0,0.8)';
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
            itemDiv.dataset.itemType = item.type;
            itemDiv.dataset.correctZone = item.correctZone;
            itemDiv.dataset.startX = item.startPos.x;
            itemDiv.dataset.startY = item.startPos.y;

            // Emoji
            const emoji = document.createElement('div');
            emoji.className = 'item-emoji';
            emoji.textContent = item.emoji;

            // Label
            const label = document.createElement('div');
            label.className = 'item-label';
            label.textContent = item.label;

            itemDiv.appendChild(emoji);
            itemDiv.appendChild(label);

            // Mouse Events - Einfaches Drag-and-Drop ohne HTML5 Drag API
            itemDiv.addEventListener('mousedown', (e) => {
                if (itemDiv.classList.contains('placed')) return;

                e.preventDefault();
                this.startDrag(itemDiv, e);
            });

            container.appendChild(itemDiv);
        });

        // Global mouse events
        document.addEventListener('mousemove', (e) => {
            if (this.isDragging && this.activeElement) {
                this.drag(e);
            }
        });

        document.addEventListener('mouseup', (e) => {
            if (this.isDragging && this.activeElement) {
                this.endDrag(e);
            }
        });
    }

    startDrag(element, e) {
        this.isDragging = true;
        this.activeElement = element;

        const rect = element.getBoundingClientRect();
        const containerRect = document.querySelector('.room-3d').getBoundingClientRect();

        this.dragOffset = {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };

        element.style.zIndex = '1000';
        element.classList.add('dragging');
        document.body.style.userSelect = 'none';
    }

    drag(e) {
        if (!this.activeElement) return;

        const containerRect = document.querySelector('.room-3d').getBoundingClientRect();

        const newX = ((e.clientX - containerRect.left - this.dragOffset.x) / containerRect.width) * 100;
        const newY = ((e.clientY - containerRect.top - this.dragOffset.y) / containerRect.height) * 100;

        // Grenzen einhalten
        const clampedX = Math.max(0, Math.min(95, newX));
        const clampedY = Math.max(0, Math.min(95, newY));

        this.activeElement.style.left = `${clampedX}%`;
        this.activeElement.style.top = `${clampedY}%`;

        // Check for drop zone highlight
        this.updateZoneHighlight(e);
    }

    updateZoneHighlight(e) {
        const zones = document.querySelectorAll('.drop-zone');
        zones.forEach(zone => {
            const rect = zone.getBoundingClientRect();
            if (e.clientX >= rect.left && e.clientX <= rect.right &&
                e.clientY >= rect.top && e.clientY <= rect.bottom) {
                zone.classList.add('highlight');
            } else {
                zone.classList.remove('highlight');
            }
        });
    }

    endDrag(e) {
        if (!this.activeElement) return;

        // Find drop zone under mouse
        const dropZone = this.findDropZone(e);

        if (dropZone) {
            this.handleDrop(dropZone);
        } else {
            this.resetPosition();
        }

        // Cleanup
        this.activeElement.classList.remove('dragging');
        this.activeElement.style.zIndex = '100';
        document.querySelectorAll('.drop-zone').forEach(zone => {
            zone.classList.remove('highlight');
        });
        document.body.style.userSelect = '';

        this.isDragging = false;
        this.activeElement = null;
    }

    findDropZone(e) {
        const zones = document.querySelectorAll('.drop-zone');
        for (let zone of zones) {
            const rect = zone.getBoundingClientRect();
            if (e.clientX >= rect.left && e.clientX <= rect.right &&
                e.clientY >= rect.top && e.clientY <= rect.bottom) {
                return zone;
            }
        }
        return null;
    }

    handleDrop(dropZone) {
        const itemType = this.activeElement.dataset.itemType;
        const correctZone = this.activeElement.dataset.correctZone;
        const zoneId = dropZone.dataset.zoneId;
        const accepts = dropZone.dataset.accepts.split(',');

        if (correctZone === zoneId && accepts.includes(itemType)) {
            this.correctPlacement(dropZone);
        } else {
            this.wrongPlacement();
        }
    }

    correctPlacement(dropZone) {
        // Position in der Mitte der Zone
        const zoneRect = dropZone.getBoundingClientRect();
        const containerRect = document.querySelector('.room-3d').getBoundingClientRect();

        const centerX = ((zoneRect.left - containerRect.left + zoneRect.width/2 - 40) / containerRect.width) * 100;
        const centerY = ((zoneRect.top - containerRect.top + zoneRect.height/2 - 40) / containerRect.height) * 100;

        // Element dauerhaft positionieren
        this.activeElement.style.left = `${centerX}%`;
        this.activeElement.style.top = `${centerY}%`;
        this.activeElement.classList.add('placed');
        this.activeElement.style.pointerEvents = 'none';

        // Erfolg
        this.showMessage('✅ Perfekt platziert!', 'success');
        this.score += 20;
        this.cleanedItems++;
        this.updateDisplay();

        // Check completion
        if (this.cleanedItems >= this.totalItems) {
            setTimeout(() => {
                this.roomCompleted();
            }, 1000);
        }
    }

    wrongPlacement() {
        this.resetPosition();
        this.showMessage('❌ Das gehört nicht hierhin!', 'error');
    }

    resetPosition() {
        const startX = this.activeElement.dataset.startX;
        const startY = this.activeElement.dataset.startY;
        this.activeElement.style.left = `${startX}%`;
        this.activeElement.style.top = `${startY}%`;
    }

    showMessage(text, type) {
        const messageDiv = document.createElement('div');
        messageDiv.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            padding: 12px 24px;
            border-radius: 8px;
            color: white;
            font-weight: bold;
            font-size: 1.1em;
            z-index: 2000;
            background: ${type === 'success' ? '#00b894' : '#d63031'};
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        `;
        messageDiv.textContent = text;

        document.body.appendChild(messageDiv);

        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.parentNode.removeChild(messageDiv);
            }
        }, 2000);
    }

    updateDisplay() {
        document.getElementById('score').textContent = this.score;
        document.getElementById('cleaned-items').textContent = this.cleanedItems;
        document.getElementById('total-items').textContent = this.totalItems;
    }

    roomCompleted() {
        this.score += 100;
        this.updateDisplay();

        document.getElementById('final-score').textContent = this.score;
        document.getElementById('perfect-placements').textContent = this.cleanedItems;

        this.showMessage('🎉 Raum erfolgreich aufgeräumt!', 'success');

        setTimeout(() => {
            this.showScreen('success-screen');
        }, 2000);
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    new AufraumSpiel();
});
