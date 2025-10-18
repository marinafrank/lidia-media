class AufraumSpiel {
    constructor() {
        this.score = 0;
        this.currentRoom = null;
        this.cleanedItems = 0;
        this.totalItems = 0;
        this.perfectPlacements = 0;
        this.draggedElement = null;

        // Räume mit Möbeln und korrekten Plätzen
        this.roomData = {
            bedroom: {
                title: "🛏️ Schlafzimmer",
                furniture: [
                    { type: 'wardrobe', class: 'wardrobe', label: 'Kleiderschrank', labelPos: { x: 85, y: 15 } },
                    { type: 'bed', class: 'bed', label: 'Bett', labelPos: { x: 15, y: 35 } },
                    { type: 'desk', class: 'desk', label: 'Schreibtisch', labelPos: { x: 45, y: 45 } }
                ],
                items: [
                    { emoji: "👕", label: "T-Shirt", type: "clothing", correctZone: "wardrobe", pos: { x: 30, y: 60 } },
                    { emoji: "👖", label: "Hose", type: "clothing", correctZone: "wardrobe", pos: { x: 45, y: 80 } },
                    { emoji: "🧦", label: "Socken", type: "clothing", correctZone: "wardrobe", pos: { x: 25, y: 40 } },
                    { emoji: "👟", label: "Schuhe", type: "clothing", correctZone: "wardrobe", pos: { x: 60, y: 70 } },
                    { emoji: "📚", label: "Bücher", type: "study", correctZone: "desk", pos: { x: 70, y: 30 } },
                    { emoji: "📝", label: "Notizen", type: "study", correctZone: "desk", pos: { x: 35, y: 20 } },
                    { emoji: "✏️", label: "Stifte", type: "study", correctZone: "desk", pos: { x: 80, y: 50 } },
                    { emoji: "🧸", label: "Teddy", type: "toy", correctZone: "bed", pos: { x: 20, y: 25 } },
                    { emoji: "🎮", label: "Konsole", type: "electronics", correctZone: "desk", pos: { x: 55, y: 45 } },
                    { emoji: "📱", label: "Handy", type: "electronics", correctZone: "desk", pos: { x: 40, y: 35 } }
                ],
                dropZones: [
                    { id: "wardrobe", x: 85, y: 20, w: 12, h: 35, types: ["clothing"] },
                    { id: "desk", x: 45, y: 50, w: 15, h: 20, types: ["study", "electronics"] },
                    { id: "bed", x: 15, y: 40, w: 20, h: 25, types: ["toy"] }
                ]
            },
            kitchen: {
                title: "🍳 Küche",
                furniture: [
                    { type: 'cabinet', class: 'cabinet', label: 'Küchenschrank', labelPos: { x: 80, y: 25 } },
                    { type: 'stove', class: 'stove', label: 'Herd', labelPos: { x: 20, y: 40 } },
                    { type: 'sink', class: 'sink', label: 'Spüle', labelPos: { x: 35, y: 35 } }
                ],
                items: [
                    { emoji: "🍽️", label: "Teller", type: "dishes", correctZone: "cabinet", pos: { x: 30, y: 30 } },
                    { emoji: "🥄", label: "Löffel", type: "utensils", correctZone: "cabinet", pos: { x: 45, y: 60 } },
                    { emoji: "🍴", label: "Gabel", type: "utensils", correctZone: "cabinet", pos: { x: 25, y: 70 } },
                    { emoji: "🍳", label: "Pfanne", type: "cookware", correctZone: "stove", pos: { x: 60, y: 40 } },
                    { emoji: "🥘", label: "Topf", type: "cookware", correctZone: "stove", pos: { x: 70, y: 20 } },
                    { emoji: "☕", label: "Tasse", type: "dishes", correctZone: "cabinet", pos: { x: 35, y: 50 } },
                    { emoji: "🧽", label: "Schwamm", type: "cleaning", correctZone: "sink", pos: { x: 50, y: 80 } },
                    { emoji: "🧴", label: "Spülmittel", type: "cleaning", correctZone: "sink", pos: { x: 80, y: 75 } },
                    { emoji: "🥗", label: "Salat", type: "food", correctZone: "cabinet", pos: { x: 20, y: 35 } },
                    { emoji: "🍞", label: "Brot", type: "food", correctZone: "cabinet", pos: { x: 65, y: 60 } }
                ],
                dropZones: [
                    { id: "cabinet", x: 80, y: 30, w: 15, h: 25, types: ["dishes", "utensils", "food"] },
                    { id: "stove", x: 20, y: 45, w: 10, h: 15, types: ["cookware"] },
                    { id: "sink", x: 35, y: 40, w: 12, h: 18, types: ["cleaning"] }
                ]
            }
        };

        this.initEventListeners();
        this.updateScoreDisplay();
    }    initEventListeners() {
        // Raumauswahl-Buttons
        document.querySelectorAll('.room-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const room = e.currentTarget.dataset.room;
                this.startRoom(room);
            });
        });

        // Navigation-Buttons
        document.getElementById('back-btn').addEventListener('click', () => {
            this.showScreen('room-selection');
        });

        document.getElementById('reset-room').addEventListener('click', () => {
            if (this.currentRoom) {
                this.startRoom(this.currentRoom);
            }
        });

        // Erfolgsbildschirm-Buttons
        document.getElementById('play-again').addEventListener('click', () => {
            if (this.currentRoom) {
                this.startRoom(this.currentRoom);
            }
        });

        document.getElementById('choose-other-room').addEventListener('click', () => {
            this.showScreen('room-selection');
        });
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
        this.perfectPlacements = 0;

        const room = this.roomData[roomType];
        this.totalItems = room.items.length;

        // Titel setzen
        document.getElementById('current-room-title').textContent = room.title;

        // Raum aufbauen
        this.build3DRoom(room);

        // Score-Anzeige aktualisieren
        this.updateScoreDisplay();

        // Zum Spielbildschirm wechseln
        this.showScreen('game-area');
    }

    build3DRoom(room) {
        const furnitureContainer = document.querySelector('.furniture-container');
        const itemsContainer = document.querySelector('.items-container');
        const dropZonesContainer = document.querySelector('.drop-zones');
        const labelsContainer = document.querySelector('.furniture-labels');

        // Container leeren
        furnitureContainer.innerHTML = '';
        itemsContainer.innerHTML = '';
        dropZonesContainer.innerHTML = '';
        if (labelsContainer) {
            labelsContainer.innerHTML = '';
        }

        // Raum-spezifische CSS-Klasse hinzufügen
        furnitureContainer.className = `furniture-container ${this.currentRoom}-furniture`;

        // Möbel erstellen
        room.furniture.forEach(furniture => {
            const furnitureElement = document.createElement('div');
            furnitureElement.className = `furniture ${furniture.class}`;
            furnitureContainer.appendChild(furnitureElement);

            // Möbel-Label erstellen
            if (furniture.label && furniture.labelPos && labelsContainer) {
                const labelElement = document.createElement('div');
                labelElement.className = `furniture-label ${furniture.type}-label`;
                labelElement.textContent = furniture.label;
                labelElement.style.left = `${furniture.labelPos.x}%`;
                labelElement.style.top = `${furniture.labelPos.y}%`;
                labelsContainer.appendChild(labelElement);
            }
        });

        // Drop-Zones erstellen
        room.dropZones.forEach(zone => {
            const dropZone = document.createElement('div');
            dropZone.className = 'drop-zone';
            dropZone.id = `zone-${zone.id}`;
            dropZone.dataset.zoneId = zone.id;
            dropZone.dataset.acceptTypes = zone.types.join(',');
            dropZone.style.left = `${zone.x}%`;
            dropZone.style.top = `${zone.y}%`;
            dropZone.style.width = `${zone.w}%`;
            dropZone.style.height = `${zone.h}%`;
            dropZonesContainer.appendChild(dropZone);
        });

        // Gegenstände erstellen mit Emoji und Beschriftung
        room.items.forEach((item, index) => {
            const itemElement = document.createElement('div');
            itemElement.className = 'draggable-item';
            itemElement.dataset.itemType = item.type;
            itemElement.dataset.correctZone = item.correctZone;
            itemElement.dataset.itemId = index;
            itemElement.style.left = `${item.pos.x}%`;
            itemElement.style.top = `${item.pos.y}%`;
            itemElement.draggable = true;

            // Emoji-Element erstellen
            const emojiElement = document.createElement('div');
            emojiElement.className = 'item-emoji';
            emojiElement.textContent = item.emoji;

            // Label-Element erstellen
            const labelElement = document.createElement('div');
            labelElement.className = 'item-label';
            labelElement.textContent = item.label || this.getItemLabel(item.emoji);

            // Elemente zum Container hinzufügen
            itemElement.appendChild(emojiElement);
            itemElement.appendChild(labelElement);

            // Drag-Events hinzufügen
            this.addDragEvents(itemElement);

            itemsContainer.appendChild(itemElement);
        });

        // Drop-Events für Zonen hinzufügen
        this.addDropZoneEvents();
    }

    addDragEvents(itemElement) {
        itemElement.addEventListener('dragstart', (e) => {
            this.draggedElement = e.target;
            e.target.classList.add('dragging');
            e.dataTransfer.effectAllowed = 'move';
            e.dataTransfer.setData('text/plain', e.target.dataset.itemId);
        });

        itemElement.addEventListener('dragend', (e) => {
            e.target.classList.remove('dragging');
            // Nur draggedElement nullsetzen wenn das Element nicht erfolgreich platziert wurde
            setTimeout(() => {
                if (this.draggedElement && !this.draggedElement.classList.contains('placed')) {
                    this.draggedElement = null;
                }
            }, 100);
        });        // Touch-Events für mobile Geräte
        itemElement.addEventListener('touchstart', (e) => {
            this.handleTouchStart(e);
        });

        itemElement.addEventListener('touchmove', (e) => {
            this.handleTouchMove(e);
        });

        itemElement.addEventListener('touchend', (e) => {
            this.handleTouchEnd(e);
        });
    }

    addDropZoneEvents() {
        const dropZones = document.querySelectorAll('.drop-zone');

        dropZones.forEach(zone => {
            zone.addEventListener('dragover', (e) => {
                e.preventDefault();
                e.dataTransfer.dropEffect = 'move';
                zone.classList.add('highlight');
            });

            zone.addEventListener('dragleave', (e) => {
                zone.classList.remove('highlight');
            });

            zone.addEventListener('drop', (e) => {
                e.preventDefault();
                zone.classList.remove('highlight');
                this.handleDrop(zone, this.draggedElement);
            });
        });
    }

    handleDrop(dropZone, draggedItem) {
        if (!draggedItem) return;

        const itemType = draggedItem.dataset.itemType;
        const correctZone = draggedItem.dataset.correctZone;
        const zoneId = dropZone.dataset.zoneId;
        const acceptTypes = dropZone.dataset.acceptTypes.split(',');

        // Prüfen ob Gegenstand in richtige Zone gehört
        if (correctZone === zoneId && acceptTypes.includes(itemType)) {
            this.correctPlacement(draggedItem, dropZone);
        } else {
            this.wrongPlacement(draggedItem, dropZone);
        }
    }

    correctPlacement(item, zone) {
        // Gegenstand korrekt platziert
        item.classList.add('placed');
        zone.classList.add('correct-drop');

        // Punkte vergeben
        this.score += 20;
        this.cleanedItems++;
        this.perfectPlacements++;

        // Feedback anzeigen
        this.showFeedback('Perfekt! 🎉', 'success');

        // Erfolgseffekt
        this.showCleanEffect(item);

        // Gegenstand zur Zone bewegen und dort "einrasten"
        const zoneRect = zone.getBoundingClientRect();
        const containerRect = document.querySelector('.room-3d').getBoundingClientRect();
        const newX = ((zoneRect.left - containerRect.left + zoneRect.width/2 - 40) / containerRect.width) * 100;
        const newY = ((zoneRect.top - containerRect.top + zoneRect.height/2 - 40) / containerRect.height) * 100;

        // Position festsetzen und Dragging deaktivieren
        item.style.left = `${newX}%`;
        item.style.top = `${newY}%`;
        item.style.position = 'absolute';
        item.draggable = false;
        item.style.pointerEvents = 'none';
        item.style.cursor = 'default';

        // draggedElement nullsetzen
        this.draggedElement = null;

        setTimeout(() => {
            zone.classList.remove('correct-drop');
        }, 600);

        // Score aktualisieren
        this.updateScoreDisplay();

        // Prüfen ob alles aufgeräumt ist
        if (this.cleanedItems >= this.totalItems) {
            setTimeout(() => {
                this.roomCompleted();
            }, 800);
        }
    }

    wrongPlacement(item, zone) {
        // Falsche Platzierung
        zone.classList.add('wrong-drop');

        // Hilfreiche Nachricht basierend auf dem Gegenstand
        const itemLabel = item.querySelector('.item-label').textContent;
        const correctZoneName = this.getZoneName(item.dataset.correctZone);

        this.showFeedback(`${itemLabel} gehört zum ${correctZoneName}! 🤔`, 'error');

        // Element an ursprüngliche Position zurücksetzen
        setTimeout(() => {
            zone.classList.remove('wrong-drop');
        }, 600);

        // draggedElement nullsetzen
        this.draggedElement = null;
    }

    getZoneName(zoneId) {
        const zoneNames = {
            'wardrobe': 'Kleiderschrank',
            'desk': 'Schreibtisch',
            'bed': 'Bett',
            'cabinet': 'Küchenschrank',
            'stove': 'Herd',
            'sink': 'Spüle'
        };
        return zoneNames[zoneId] || zoneId;
    }

    showFeedback(text, type) {
        const feedback = document.getElementById('drag-feedback');
        const feedbackText = document.getElementById('feedback-text');

        feedbackText.textContent = text;
        feedback.className = `drag-feedback show ${type}`;

        setTimeout(() => {
            feedback.classList.remove('show');
        }, 2000);
    }

    showCleanEffect(itemElement) {
        // Partikel-Effekt beim Aufräumen
        const rect = itemElement.getBoundingClientRect();
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: fixed;
            left: ${rect.left + rect.width/2}px;
            top: ${rect.top + rect.height/2}px;
            font-size: 2em;
            color: #00b894;
            pointer-events: none;
            z-index: 1000;
            animation: cleanEffect 1s ease-out forwards;
        `;
        particle.textContent = '✨';

        // CSS-Animation hinzufügen
        if (!document.getElementById('clean-effect-styles')) {
            const style = document.createElement('style');
            style.id = 'clean-effect-styles';
            style.textContent = `
                @keyframes cleanEffect {
                    0% { transform: scale(0) rotate(0deg); opacity: 1; }
                    50% { transform: scale(1.5) rotate(180deg); opacity: 0.8; }
                    100% { transform: scale(0) rotate(360deg) translateY(-50px); opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }

        document.body.appendChild(particle);

        setTimeout(() => {
            if (particle.parentNode) {
                particle.parentNode.removeChild(particle);
            }
        }, 1000);
    }

    updateScoreDisplay() {
        document.getElementById('score').textContent = this.score;
        document.getElementById('cleaned-items').textContent = this.cleanedItems;
        document.getElementById('total-items').textContent = this.totalItems;
    }

    getItemLabel(emoji) {
        // Fallback-Labels für Emojis falls kein Label definiert ist
        const emojiLabels = {
            '👕': 'T-Shirt', '👖': 'Hose', '🧦': 'Socken', '👟': 'Schuhe',
            '📚': 'Bücher', '📝': 'Notizen', '✏️': 'Stifte', '🧸': 'Teddy',
            '🎮': 'Konsole', '📱': 'Handy', '🍽️': 'Teller', '🥄': 'Löffel',
            '🍴': 'Gabel', '🍳': 'Pfanne', '🥘': 'Topf', '☕': 'Tasse',
            '🧽': 'Schwamm', '🧴': 'Spülmittel', '🥗': 'Salat', '🍞': 'Brot'
        };
        return emojiLabels[emoji] || 'Gegenstand';
    }

    // Touch-Events für mobile Unterstützung
    handleTouchStart(e) {
        this.touchStartX = e.touches[0].clientX;
        this.touchStartY = e.touches[0].clientY;
        this.draggedElement = e.target;
        e.target.classList.add('dragging');
    }

    handleTouchMove(e) {
        e.preventDefault();
        if (!this.draggedElement) return;

        const touch = e.touches[0];
        this.draggedElement.style.position = 'fixed';
        this.draggedElement.style.left = `${touch.clientX - 30}px`;
        this.draggedElement.style.top = `${touch.clientY - 30}px`;
        this.draggedElement.style.zIndex = '1000';
    }

    handleTouchEnd(e) {
        if (!this.draggedElement) return;

        const touch = e.changedTouches[0];
        const elementBelow = document.elementFromPoint(touch.clientX, touch.clientY);
        const dropZone = elementBelow?.closest('.drop-zone');

        if (dropZone) {
            this.handleDrop(dropZone, this.draggedElement);
        }

        // Element-Position zurücksetzen falls nicht erfolgreich platziert
        if (!this.draggedElement.classList.contains('placed')) {
            this.draggedElement.style.position = 'absolute';
            this.draggedElement.style.zIndex = '100';
        }

        this.draggedElement.classList.remove('dragging');
        this.draggedElement = null;
    }

    roomCompleted() {
        // Bonus-Punkte für komplette Räume
        const bonusPoints = 100;
        this.score += bonusPoints;

        document.getElementById('final-score').textContent = this.score;
        document.getElementById('perfect-placements').textContent = this.perfectPlacements;
        this.showScreen('success-screen');

        // Konfetti-Effekt
        this.showConfetti();
    }    showConfetti() {
        const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7'];
        const confettiCount = 50;

        for (let i = 0; i < confettiCount; i++) {
            setTimeout(() => {
                const confetti = document.createElement('div');
                confetti.style.cssText = `
                    position: fixed;
                    left: ${Math.random() * 100}vw;
                    top: -10px;
                    width: 10px;
                    height: 10px;
                    background: ${colors[Math.floor(Math.random() * colors.length)]};
                    pointer-events: none;
                    z-index: 1000;
                    animation: confettiFall ${2 + Math.random() * 3}s linear forwards;
                `;

                if (!document.getElementById('confetti-styles')) {
                    const style = document.createElement('style');
                    style.id = 'confetti-styles';
                    style.textContent = `
                        @keyframes confettiFall {
                            to {
                                transform: translateY(100vh) rotate(360deg);
                                opacity: 0;
                            }
                        }
                    `;
                    document.head.appendChild(style);
                }

                document.body.appendChild(confetti);

                setTimeout(() => {
                    if (confetti.parentNode) {
                        confetti.parentNode.removeChild(confetti);
                    }
                }, 5000);
            }, i * 100);
        }
    }
}

// Spiel initialisieren wenn DOM geladen ist
document.addEventListener('DOMContentLoaded', () => {
    new AufraumSpiel();
});
