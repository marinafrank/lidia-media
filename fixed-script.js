class AufraumSpiel {
    constructor() {
        this.score = 0;
        this.currentRoom = null;
        this.cleanedItems = 0;
        this.totalItems = 0;
        this.isDragging = false;
        this.dragOffset = { x: 0, y: 0 };
        this.activeElement = null;
        this.currentLevel = 1; // Standard Level
        this.maxLevel = 3;
        this.selectedItem = null; // Für Mobile Click-to-Select
        this.isMobile = this.detectMobile();

        this.roomData = {
            bedroom: {
                title: "🛏️ Schlafzimmer",
                items: [
                    { emoji: "👕", symbol: "👕", label: "T-Shirt", type: "clothing", correctZone: "wardrobe", startPos: { x: 30, y: 60 } },
                    { emoji: "👖", symbol: "👖", label: "Hose", type: "clothing", correctZone: "wardrobe", startPos: { x: 45, y: 80 } },
                    { emoji: "🧦", symbol: "🧦", label: "Socken", type: "clothing", correctZone: "wardrobe", startPos: { x: 25, y: 40 } },
                    { emoji: "📚", symbol: "📚", label: "Bücher", type: "study", correctZone: "desk", startPos: { x: 70, y: 30 } },
                    { emoji: "🎮", symbol: "🎮", label: "Konsole", type: "electronics", correctZone: "desk", startPos: { x: 55, y: 45 } },
                    { emoji: "🧸", symbol: "🧸", label: "Teddy", type: "toy", correctZone: "bed", startPos: { x: 20, y: 25 } }
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
                    { emoji: "🍽️", symbol: "🍽️", label: "Teller", type: "dishes", correctZone: "cabinet", startPos: { x: 30, y: 30 } },
                    { emoji: "🍴", symbol: "🍴", label: "Gabel", type: "utensils", correctZone: "cabinet", startPos: { x: 25, y: 70 } },
                    { emoji: "🍳", symbol: "🍳", label: "Pfanne", type: "cookware", correctZone: "stove", startPos: { x: 60, y: 40 } },
                    { emoji: "☕", symbol: "☕", label: "Tasse", type: "dishes", correctZone: "cabinet", startPos: { x: 35, y: 50 } },
                    { emoji: "🧽", symbol: "🧽", label: "Schwamm", type: "cleaning", correctZone: "sink", startPos: { x: 50, y: 80 } },
                    { emoji: "🧴", symbol: "🧴", label: "Spülmittel", type: "cleaning", correctZone: "sink", startPos: { x: 80, y: 75 } }
                ],
                zones: [
                    { id: "cabinet", name: "Küchenschrank", x: 75, y: 25, w: 20, h: 30, accepts: ["dishes", "utensils"] },
                    { id: "stove", name: "Herd", x: 15, y: 40, w: 15, h: 20, accepts: ["cookware"] },
                    { id: "sink", name: "Spüle", x: 35, y: 35, w: 15, h: 25, accepts: ["cleaning"] }
                ]
            },
            bathroom: {
                title: "🛁 Badezimmer",
                items: [
                    { emoji: "🧴", symbol: "🧴", label: "Shampoo", type: "hygiene", correctZone: "shower", startPos: { x: 25, y: 30 } },
                    { emoji: "🧽", symbol: "🧽", label: "Seife", type: "hygiene", correctZone: "sink", startPos: { x: 60, y: 80 } },
                    { emoji: "🪥", symbol: "🪥", label: "Zahnbürste", type: "dental", correctZone: "sink", startPos: { x: 40, y: 25 } },
                    { emoji: "🧻", symbol: "🧻", label: "Toilettenpapier", type: "toilet", correctZone: "toilet", startPos: { x: 70, y: 45 } },
                    { emoji: "🛁", symbol: "🛁", label: "Handtuch", type: "towels", correctZone: "towel-rack", startPos: { x: 35, y: 60 } },
                    { emoji: "💊", symbol: "💊", label: "Medikamente", type: "medicine", correctZone: "cabinet", startPos: { x: 50, y: 40 } },
                    { emoji: "🪒", symbol: "🪒", label: "Rasierer", type: "hygiene", correctZone: "cabinet", startPos: { x: 80, y: 30 } }
                ],
                zones: [
                    { id: "shower", name: "Dusche", x: 15, y: 20, w: 20, h: 25, accepts: ["hygiene"] },
                    { id: "sink", name: "Waschbecken", x: 40, y: 45, w: 18, h: 20, accepts: ["hygiene", "dental"] },
                    { id: "toilet", name: "Toilette", x: 70, y: 60, w: 15, h: 20, accepts: ["toilet"] },
                    { id: "towel-rack", name: "Handtuchhalter", x: 65, y: 25, w: 12, h: 25, accepts: ["towels"] },
                    { id: "cabinet", name: "Medizinschrank", x: 80, y: 40, w: 15, h: 20, accepts: ["medicine", "hygiene"] }
                ]
            },
            kids_room: {
                title: "🧸 Kinderzimmer",
                items: [
                    { emoji: "🧸", symbol: "🧸", label: "Teddybär", type: "toy", correctZone: "toybox", startPos: { x: 30, y: 30 } },
                    { emoji: "🚗", symbol: "🚗", label: "Spielzeugauto", type: "toy", correctZone: "toybox", startPos: { x: 45, y: 70 } },
                    { emoji: "🎨", symbol: "🎨", label: "Malstifte", type: "art", correctZone: "desk", startPos: { x: 25, y: 50 } },
                    { emoji: "📚", symbol: "📚", label: "Bilderbuch", type: "books", correctZone: "shelf", startPos: { x: 70, y: 35 } },
                    { emoji: "🧩", symbol: "🧩", label: "Puzzle", type: "toy", correctZone: "toybox", startPos: { x: 55, y: 25 } },
                    { emoji: "👕", symbol: "👕", label: "Kindershirt", type: "clothing", correctZone: "wardrobe", startPos: { x: 80, y: 60 } },
                    { emoji: "🎒", symbol: "🎒", label: "Schulranzen", type: "school", correctZone: "shelf", startPos: { x: 35, y: 75 } },
                    { emoji: "🏀", symbol: "🏀", label: "Ball", type: "sport", correctZone: "toybox", startPos: { x: 60, y: 80 } }
                ],
                zones: [
                    { id: "toybox", name: "Spielzeugkiste", x: 75, y: 70, w: 20, h: 25, accepts: ["toy", "sport"] },
                    { id: "desk", name: "Schreibtisch", x: 15, y: 40, w: 25, h: 20, accepts: ["art", "school"] },
                    { id: "shelf", name: "Regal", x: 45, y: 25, w: 15, h: 30, accepts: ["books", "school"] },
                    { id: "wardrobe", name: "Kinderschrank", x: 70, y: 40, w: 18, h: 25, accepts: ["clothing"] }
                ]
            },
            garden: {
                title: "🌻 Garten",
                items: [
                    { emoji: "🌱", symbol: "🌱", label: "Blumentopf", type: "plants", correctZone: "greenhouse", startPos: { x: 25, y: 30 } },
                    { emoji: "🔧", symbol: "🔧", label: "Schaufel", type: "tools", correctZone: "shed", startPos: { x: 60, y: 80 } },
                    { emoji: "🪣", symbol: "🪣", label: "Gießkanne", type: "watering", correctZone: "greenhouse", startPos: { x: 40, y: 25 } },
                    { emoji: "🧤", symbol: "🧤", label: "Gartenhandschuhe", type: "clothing", correctZone: "shed", startPos: { x: 70, y: 45 } },
                    { emoji: "🪴", symbol: "🪴", label: "Gartenschlauch", type: "watering", correctZone: "storage", startPos: { x: 35, y: 60 } },
                    { emoji: "⚽", symbol: "⚽", label: "Fußball", type: "sport", correctZone: "storage", startPos: { x: 50, y: 40 } },
                    { emoji: "🗞️", symbol: "🗞️", label: "Zeitungen", type: "waste", correctZone: "compost", startPos: { x: 80, y: 30 } },
                    { emoji: "🍂", symbol: "🍂", label: "Blätter", type: "waste", correctZone: "compost", startPos: { x: 20, y: 75 } }
                ],
                zones: [
                    { id: "greenhouse", name: "Gewächshaus", x: 15, y: 20, w: 25, h: 25, accepts: ["plants", "watering"] },
                    { id: "shed", name: "Geräteschuppen", x: 65, y: 60, w: 20, h: 25, accepts: ["tools", "clothing"] },
                    { id: "storage", name: "Aufbewahrung", x: 40, y: 50, w: 20, h: 20, accepts: ["watering", "sport"] },
                    { id: "compost", name: "Kompost", x: 75, y: 25, w: 18, h: 20, accepts: ["waste"] }
                ]
            },
            garage: {
                title: "🚗 Garage",
                items: [
                    { emoji: "🔧", symbol: "🔧", label: "Schraubenschlüssel", type: "tools", correctZone: "workbench", startPos: { x: 30, y: 30 } },
                    { emoji: "🛞", symbol: "🛞", label: "Autoreifen", type: "car", correctZone: "storage", startPos: { x: 45, y: 70 } },
                    { emoji: "🔩", symbol: "🔩", label: "Schrauben", type: "hardware", correctZone: "workbench", startPos: { x: 25, y: 50 } },
                    { emoji: "🧽", symbol: "🧽", label: "Autopflegemittel", type: "cleaning", correctZone: "shelf", startPos: { x: 70, y: 35 } },
                    { emoji: "📦", symbol: "📦", label: "Kartons", type: "storage", correctZone: "storage", startPos: { x: 55, y: 25 } },
                    { emoji: "🔌", symbol: "🔌", label: "Verlängerungskabel", type: "electrical", correctZone: "workbench", startPos: { x: 80, y: 60 } },
                    { emoji: "🚲", symbol: "�", label: "Fahrrad", type: "vehicle", correctZone: "parking", startPos: { x: 35, y: 75 } },
                    { emoji: "🧥", symbol: "🧥", label: "Arbeitsjacke", type: "clothing", correctZone: "shelf", startPos: { x: 60, y: 80 } }
                ],
                zones: [
                    { id: "workbench", name: "Werkbank", x: 15, y: 40, w: 25, h: 25, accepts: ["tools", "hardware", "electrical"] },
                    { id: "storage", name: "Lagerbereich", x: 50, y: 20, w: 20, h: 30, accepts: ["car", "storage"] },
                    { id: "shelf", name: "Regal", x: 75, y: 45, w: 18, h: 30, accepts: ["cleaning", "clothing"] },
                    { id: "parking", name: "Stellplatz", x: 40, y: 65, w: 25, h: 25, accepts: ["vehicle"] }
                ]
            },
            balcony: {
                title: "🌿 Balkon",
                items: [
                    { emoji: "🌺", symbol: "🌺", label: "Blumen", type: "plants", correctZone: "planters", startPos: { x: 30, y: 30 } },
                    { emoji: "☂️", symbol: "☂️", label: "Sonnenschirm", type: "furniture", correctZone: "storage", startPos: { x: 45, y: 70 } },
                    { emoji: "🪑", symbol: "🪑", label: "Stuhl", type: "furniture", correctZone: "seating", startPos: { x: 25, y: 50 } },
                    { emoji: "📰", symbol: "📰", label: "Zeitschriften", type: "reading", correctZone: "table", startPos: { x: 70, y: 35 } },
                    { emoji: "🕯️", symbol: "🕯️", label: "Kerzen", type: "decoration", correctZone: "table", startPos: { x: 55, y: 25 } },
                    { emoji: "🧹", symbol: "🧹", label: "Besen", type: "cleaning", correctZone: "storage", startPos: { x: 80, y: 60 } },
                    { emoji: "⚽", symbol: "⚽", label: "Spielball", type: "sport", correctZone: "storage", startPos: { x: 35, y: 75 } }
                ],
                zones: [
                    { id: "planters", name: "Pflanzgefäße", x: 15, y: 25, w: 20, h: 30, accepts: ["plants"] },
                    { id: "seating", name: "Sitzbereich", x: 40, y: 40, w: 25, h: 25, accepts: ["furniture"] },
                    { id: "table", name: "Tisch", x: 70, y: 50, w: 15, h: 20, accepts: ["reading", "decoration"] },
                    { id: "storage", name: "Aufbewahrung", x: 75, y: 70, w: 20, h: 25, accepts: ["furniture", "cleaning", "sport"] }
                ]
            }
        };

        this.init();
    }

    init() {
        // Event Listeners für Level-Auswahl
        document.querySelectorAll('.level-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const selectedLevel = parseInt(e.currentTarget.dataset.level);
                this.setLevel(selectedLevel);

                // UI Update für aktiven Level-Button
                document.querySelectorAll('.level-btn').forEach(b => b.classList.remove('active'));
                e.currentTarget.classList.add('active');
            });
        });

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

        // Global click handler um Selektion aufzuheben
        document.addEventListener('click', (e) => {
            if (this.selectedItem) {
                // Nur deselektieren wenn nicht auf Item, Zone, Label oder Mobile-Area geklickt
                if (!e.target.closest('.draggable-item') &&
                    !e.target.closest('.drop-zone') &&
                    !e.target.closest('.furniture-label') &&
                    !e.target.closest('.mobile-click-area')) {
                    console.log('🔄 Global click - deselecting item');
                    this.deselectItem();
                } else {
                    console.log('🎯 Click on valid element, keeping selection');
                }
            }
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

        const roomData = this.roomData[roomType];
        // Verwende Level-spezifische Items
        const levelItems = this.getLevelItems(roomType);
        this.totalItems = levelItems.length;

        // Erstelle temporäre Room-Daten mit Level-Items und Level-Zonen
        const levelZones = this.getLevelZones(roomType);
        const levelRoomData = {
            ...roomData,
            items: levelItems,
            zones: levelZones
        };

        document.getElementById('current-room-title').textContent = `${roomData.title} - ${this.getLevelName()}`;

        // Setze den thematischen Hintergrund
        const roomContainer = document.querySelector('.room-3d');
        if (roomContainer) {
            // Entferne alle alten Raum-Klassen und füge Level-Klasse hinzu
            roomContainer.className = `room-3d ${roomType} level-${this.currentLevel}`;
        }

        this.setupRoom(levelRoomData);
        this.updateDisplay();
        this.showScreen('game-area');
    }

    getLevelName() {
        const levelNames = {
            0: "🟢 Einfach",
            1: "🟡 Normal",
            2: "🟠 Schwer",
            3: "🔴 Experte"
        };
        return levelNames[this.currentLevel];
    }

    // Mobile Detection
    detectMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
               ('ontouchstart' in window) ||
               (navigator.maxTouchPoints > 0);
    }

    // Mobile Click-to-Select System
    selectItem(itemElement) {
        console.log('Selecting item:', itemElement.querySelector('.item-label').textContent); // Debug

        // Deselect previously selected item
        if (this.selectedItem) {
            this.selectedItem.classList.remove('selected');
        }

        // Select new item
        this.selectedItem = itemElement;
        itemElement.classList.add('selected');

        console.log('Item selected. Correct zone:', itemElement.dataset.correctZone); // Debug

        // Show instruction message
        this.showMobileInstruction();
    }

    deselectItem() {
        if (this.selectedItem) {
            this.selectedItem.classList.remove('selected');
            this.selectedItem = null;
            this.hideMobileInstruction();
        }
    }

    showMobileInstruction() {
        let instruction = document.getElementById('mobile-instruction');
        if (!instruction) {
            instruction = document.createElement('div');
            instruction.id = 'mobile-instruction';
            instruction.className = 'mobile-instruction';

            // Suche nach verfügbaren Containern
            const gameArea = document.getElementById('game-area') ||
                           document.querySelector('.room-3d') ||
                           document.body;
            gameArea.appendChild(instruction);
        }

        // Zeige verfügbare Zonen für das ausgewählte Item
        const itemType = this.selectedItem.dataset.itemType;
        const correctZone = this.selectedItem.dataset.correctZone;
        instruction.innerHTML = `📱 Tippe auf <strong>${this.getZoneName(correctZone)}</strong> um "${this.selectedItem.querySelector('.item-label').textContent}" zu platzieren!`;
        instruction.style.display = 'block';

        // Markiere die richtige Zone nur auf einfachstem Level (Level 0)
        if (this.currentLevel === 0) {
            this.highlightCorrectZone(correctZone);
        }
    }

    getZoneName(zoneId) {
        const zoneElement = document.querySelector(`[data-zone-id="${zoneId}"]`);
        if (zoneElement) {
            const label = document.querySelector(`.furniture-label`);
            // Finde das richtige Label basierend auf Position
            const labels = document.querySelectorAll('.furniture-label');
            for (let label of labels) {
                const labelText = label.textContent.toLowerCase();
                if (zoneId.includes('wardrobe') && labelText.includes('schrank')) return label.textContent;
                if (zoneId.includes('desk') && labelText.includes('schreibtisch')) return label.textContent;
                if (zoneId.includes('bed') && labelText.includes('bett')) return label.textContent;
                if (zoneId.includes('cabinet') && labelText.includes('schrank')) return label.textContent;
                if (zoneId.includes('sink') && (labelText.includes('spüle') || labelText.includes('waschbecken'))) return label.textContent;
                if (zoneId.includes('storage') && labelText.includes('lager')) return label.textContent;
            }
        }
        return zoneId; // Fallback
    }

    highlightCorrectZone(correctZoneId) {
        // Entferne alle Highlights
        document.querySelectorAll('.drop-zone').forEach(zone => {
            zone.classList.remove('mobile-highlight');
        });

        // Highlighte die richtige Zone
        const correctZone = document.querySelector(`[data-zone-id="${correctZoneId}"]`);
        if (correctZone) {
            correctZone.classList.add('mobile-highlight');
        }
    }

    hideMobileInstruction() {
        const instruction = document.getElementById('mobile-instruction');
        if (instruction) {
            instruction.style.display = 'none';
        }

        // Entferne Zone Highlights
        document.querySelectorAll('.drop-zone').forEach(zone => {
            zone.classList.remove('mobile-highlight');
        });
    }

    // Universal Zone Click Handler (Mobile & Desktop)
    handleZoneClick(zoneElement) {
        console.log('handleZoneClick called:', {
            hasSelectedItem: !!this.selectedItem,
            isMobile: this.isMobile,
            zoneId: zoneElement.dataset.zoneId
        }); // Debug

        if (!this.selectedItem) {
            console.log('No item selected, ignoring zone click'); // Debug
            return;
        }

        const zoneId = zoneElement.dataset.zoneId;
        const itemType = this.selectedItem.dataset.itemType;
        const correctZone = this.selectedItem.dataset.correctZone;

        console.log('Zone placement attempt:', {
            zoneId,
            itemType,
            correctZone,
            isValid: this.isValidPlacement(zoneId, itemType, correctZone)
        }); // Debug

        if (this.isValidPlacement(zoneId, itemType, correctZone)) {
            console.log('Valid placement - placing item'); // Debug
            this.placeItemInZone(this.selectedItem, zoneElement);
            this.deselectItem();
        } else {
            console.log('Invalid placement'); // Debug
            this.showMessage('❌ Das gehört hier nicht hin!', 'error');
            // Kurz rot blinken lassen
            zoneElement.style.backgroundColor = 'rgba(255, 0, 0, 0.3)';
            setTimeout(() => {
                zoneElement.style.backgroundColor = '';
            }, 500);
        }
    }

    // Validiere ob Item in Zone platziert werden kann
    isValidPlacement(zoneId, itemType, correctZone) {
        return zoneId === correctZone;
    }

    // Universelle Item-Platzierung für Drag&Drop und Click-to-Select
    placeItemInZone(itemElement, zoneElement) {
        // Berechne Zonen-Center Position
        const zoneRect = zoneElement.getBoundingClientRect();
        const containerRect = document.querySelector('.room-3d').getBoundingClientRect();

        const centerX = ((zoneRect.left + zoneRect.width / 2 - containerRect.left) / containerRect.width) * 100;
        const centerY = ((zoneRect.top + zoneRect.height / 2 - containerRect.top) / containerRect.height) * 100;

        // Platziere Item in der Mitte der Zone
        itemElement.style.left = `${centerX}%`;
        itemElement.style.top = `${centerY}%`;
        itemElement.style.transform = 'translate(-50%, -50%)';

        // Markiere als platziert
        itemElement.classList.add('placed');
        itemElement.style.opacity = '0.7';
        itemElement.style.pointerEvents = 'none';

        // Erfolgs-Feedback
        this.cleanedItems++;
        this.score += 10;
        this.updateDisplay();

        this.showMessage('✅ Richtig platziert! +10 Punkte', 'success');

        // Grüner Erfolgs-Effekt
        zoneElement.style.backgroundColor = 'rgba(0, 255, 0, 0.3)';
        setTimeout(() => {
            zoneElement.style.backgroundColor = '';
        }, 1000);

        // Prüfe ob Raum fertig
        if (this.cleanedItems >= this.totalItems) {
            setTimeout(() => {
                this.roomCompleted();
            }, 1500);
        }
    }    setupRoom(roomData) {
        // Clear containers
        const containers = ['.items-container', '.drop-zones', '.furniture-labels'];
        containers.forEach(selector => {
            const container = document.querySelector(selector);
            if (container) container.innerHTML = '';
        });

        this.createZones(roomData.zones);
        this.createItems(roomData.items);
        this.createMobileClickAreas(roomData.zones); // Neue Click-Bereiche
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

            // Universal Click Handler für Zonen (Mobile & Desktop)
            dropZone.addEventListener('click', (e) => {
                if (this.selectedItem) {  // Vereinfacht - checke nur ob Item ausgewählt
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('Zone clicked:', dropZone.dataset.zoneId, 'Mobile:', this.isMobile); // Debug
                    this.handleZoneClick(dropZone);
                }
            });

            // Touch Events für mobile Zonen
            dropZone.addEventListener('touchstart', (e) => {
                if (this.selectedItem) {
                    e.preventDefault();
                    // Visueller Feedback
                    dropZone.style.backgroundColor = 'rgba(0, 123, 255, 0.3)';
                    console.log('Zone touch start:', dropZone.dataset.zoneId); // Debug
                }
            });

            dropZone.addEventListener('touchend', (e) => {
                if (this.selectedItem) {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('Zone touched:', dropZone.dataset.zoneId); // Debug
                    this.handleZoneClick(dropZone);
                    // Reset visual feedback
                    setTimeout(() => {
                        dropZone.style.backgroundColor = '';
                    }, 200);
                }
            });

            container.appendChild(dropZone);

            // Erstelle Button anstatt Label für bessere Klickbarkeit
            const label = document.createElement('button');
            label.className = 'furniture-label furniture-button';
            label.textContent = zone.name;
            label.type = 'button';
            label.style.position = 'absolute';
            label.style.left = `${zone.x + zone.w/2}%`;
            label.style.top = `${zone.y - 8}%`;
            label.style.transform = 'translateX(-50%)';
            label.style.zIndex = '999';
            label.style.pointerEvents = 'auto';
            label.style.cursor = 'pointer';
            label.dataset.zoneId = zone.id;

            console.log('Creating BUTTON:', zone.name, 'with zone ID:', zone.id);            // Bessere Mobile-Sichtbarkeit
            if (this.isMobile) {
                label.style.fontSize = '1.2em';
                label.style.padding = '12px 16px';
                label.style.minWidth = '100px';
                label.style.minHeight = '40px';
                label.style.borderRadius = '10px';
                label.style.border = '2px solid rgba(255,255,255,0.6)';
            }

            // Einfacher, direkter Click-Handler
            const self = this; // Referenz für den Event-Handler

            label.onclick = function(e) {
                console.log('� BUTTON CLICKED:', zone.name, 'Selected item:', !!self.selectedItem);

                if (self.selectedItem) {
                    console.log('👍 Processing zone click...');
                    self.handleZoneClick(dropZone);
                } else {
                    console.log('❌ No item selected');
                    alert('Bitte wähle zuerst einen Gegenstand aus!');
                }

                e.preventDefault();
                e.stopPropagation();
                return false;
            };

            // Touch Support
            label.addEventListener('touchend', function(e) {
                console.log('📱 BUTTON TOUCHED:', zone.name);
                e.preventDefault();

                if (self.selectedItem) {
                    self.handleZoneClick(dropZone);
                } else {
                    alert('Bitte wähle zuerst einen Gegenstand aus!');
                }
            });            container.appendChild(label);
        });
    }

    // Erstelle realistische Click-Bereiche für Mobile mit speziellen Möbelteilen
    createMobileClickAreas(zones) {
        const container = document.querySelector('.room-3d');
        if (!container) return;

        zones.forEach(zone => {
            const name = zone.name.toLowerCase();

            // Spezielle Behandlung für Küchenschrank und Gewächshaus
            if (name.includes('küchenschrank') || name.includes('küchenzeile')) {
                this.createKitchenCabinet(container, zone);
            } else if (name.includes('gewächshaus')) {
                this.createGreenhouse(container, zone);
            } else {
                // Standard kompakter Click-Bereich für andere Möbel
                this.createStandardClickArea(container, zone);
            }
        });
    }

    // Küchenschrank mit Türen
    createKitchenCabinet(container, zone) {
        // Linke Küchenschranktür
        const leftDoor = document.createElement('div');
        leftDoor.className = 'mobile-click-area kitchen-door';
        leftDoor.style.position = 'absolute';
        leftDoor.style.left = `${zone.x + 2}%`;
        leftDoor.style.top = `${zone.y + 10}%`;
        leftDoor.style.width = `${zone.w/2 - 3}%`;
        leftDoor.style.height = `${zone.h - 20}%`;
        leftDoor.style.background = 'linear-gradient(135deg, #8B4513, #A0522D)';
        leftDoor.style.border = '2px solid #654321';
        leftDoor.style.borderRadius = '5px';
        leftDoor.style.zIndex = '1000';
        leftDoor.style.cursor = 'pointer';
        leftDoor.style.boxShadow = '2px 2px 4px rgba(0,0,0,0.3)';
        leftDoor.dataset.zoneId = zone.id;
        leftDoor.title = '🚪 ' + zone.name;
        leftDoor.textContent = '🚪';
        leftDoor.style.display = 'flex';
        leftDoor.style.alignItems = 'center';
        leftDoor.style.justifyContent = 'center';
        leftDoor.style.fontSize = '1.2em';

        // Rechte Küchenschranktür
        const rightDoor = document.createElement('div');
        rightDoor.className = 'mobile-click-area kitchen-door';
        rightDoor.style.position = 'absolute';
        rightDoor.style.left = `${zone.x + zone.w/2 + 1}%`;
        rightDoor.style.top = `${zone.y + 10}%`;
        rightDoor.style.width = `${zone.w/2 - 3}%`;
        rightDoor.style.height = `${zone.h - 20}%`;
        rightDoor.style.background = 'linear-gradient(135deg, #8B4513, #A0522D)';
        rightDoor.style.border = '2px solid #654321';
        rightDoor.style.borderRadius = '5px';
        rightDoor.style.zIndex = '1000';
        rightDoor.style.cursor = 'pointer';
        rightDoor.style.boxShadow = '2px 2px 4px rgba(0,0,0,0.3)';
        rightDoor.dataset.zoneId = zone.id;
        rightDoor.title = '🚪 ' + zone.name;
        rightDoor.textContent = '🚪';
        rightDoor.style.display = 'flex';
        rightDoor.style.alignItems = 'center';
        rightDoor.style.justifyContent = 'center';
        rightDoor.style.fontSize = '1.2em';

        this.addClickHandler(leftDoor, zone);
        this.addClickHandler(rightDoor, zone);

        container.appendChild(leftDoor);
        container.appendChild(rightDoor);
    }

    // Gewächshaus mit Haustür
    createGreenhouse(container, zone) {
        // Gewächshaus-Haustür
        const door = document.createElement('div');
        door.className = 'mobile-click-area greenhouse-door';
        door.style.position = 'absolute';
        door.style.left = `${zone.x + zone.w/2 - 8}%`;
        door.style.top = `${zone.y + zone.h/3}%`;
        door.style.width = '16%';
        door.style.height = `${zone.h/2}%`;
        door.style.background = 'linear-gradient(135deg, #654321, #8B4513)';
        door.style.border = '3px solid #2F4F2F';
        door.style.borderRadius = '8px 8px 3px 3px';
        door.style.zIndex = '1000';
        door.style.cursor = 'pointer';
        door.style.boxShadow = '3px 3px 6px rgba(0,0,0,0.4)';
        door.dataset.zoneId = zone.id;
        door.title = '🏠 ' + zone.name;
        door.textContent = '🏠';
        door.style.display = 'flex';
        door.style.alignItems = 'center';
        door.style.justifyContent = 'center';
        door.style.fontSize = '1.5em';

        this.addClickHandler(door, zone);
        container.appendChild(door);
    }

    // Standard Click-Bereich für andere Möbel
    createStandardClickArea(container, zone) {
        const clickArea = document.createElement('div');
        clickArea.className = 'mobile-click-area';
        clickArea.style.position = 'absolute';
        clickArea.style.left = `${zone.x + zone.w/2}%`;
        clickArea.style.top = `${zone.y + zone.h/2}%`;
        clickArea.style.transform = 'translate(-50%, -50%)';
        clickArea.style.background = 'rgba(0, 255, 0, 0.8)';
        clickArea.style.border = '2px solid lime';
        clickArea.style.borderRadius = '8px';
        clickArea.style.zIndex = '1000';
        clickArea.style.cursor = 'pointer';
        clickArea.style.padding = '10px 15px';
        clickArea.style.fontSize = '1em';
        clickArea.style.fontWeight = 'bold';
        clickArea.style.color = 'white';
        clickArea.style.textShadow = '1px 1px 2px black';
        clickArea.style.whiteSpace = 'nowrap';
        clickArea.dataset.zoneId = zone.id;
        clickArea.textContent = zone.name;

        this.addClickHandler(clickArea, zone);
        container.appendChild(clickArea);
    }

    // Einheitlicher Click-Handler
    addClickHandler(element, zone) {
        element.onclick = (e) => {
            console.log('🪑 FURNITURE CLICKED:', zone.name);
            if (this.selectedItem) {
                console.log('📦 Placing item in zone:', zone.id);
                this.handleZoneClick(element);
            } else {
                alert('Bitte wähle zuerst einen Gegenstand!');
            }
            e.stopPropagation();
        };

        // Hover-Effekte
        element.onmouseenter = () => {
            element.style.transform = element.style.transform.includes('translate')
                ? element.style.transform + ' scale(1.1)'
                : 'scale(1.1)';
            element.style.filter = 'brightness(1.2)';
        };
        element.onmouseleave = () => {
            element.style.transform = element.style.transform.replace(' scale(1.1)', '');
            element.style.filter = 'brightness(1)';
        };
    }

    createItems(items) {
        const container = document.querySelector('.items-container');
        if (!container) return;

        items.forEach((item, index) => {
            // Für doppelte Items in Level 3 mehrere erstellen
            const itemCount = item.isDuplicate ? item.duplicateCount : 1;

            for (let copy = 0; copy < itemCount; copy++) {
                const itemDiv = document.createElement('div');
                itemDiv.className = 'draggable-item';
                itemDiv.id = `item-${index}-${copy}`;

                // Für Duplikate verschiedene Positionen
                const posX = copy === 0 ? item.startPos.x : Math.random() * 80 + 10;
                const posY = copy === 0 ? item.startPos.y : Math.random() * 80 + 10;

                itemDiv.style.left = `${posX}%`;
                itemDiv.style.top = `${posY}%`;
                itemDiv.dataset.itemType = item.type;
                itemDiv.dataset.correctZone = item.correctZone;
                itemDiv.dataset.startX = posX;
                itemDiv.dataset.startY = posY;
                itemDiv.dataset.isDuplicate = item.isDuplicate || false;

                // Level 0: Farbige Umrandung als Hilfe
                if (this.currentLevel === 0 && item.hasHelper) {
                    itemDiv.classList.add('helper-border');
                    itemDiv.style.border = '3px solid #ffeb3b';
                    itemDiv.style.boxShadow = '0 0 10px rgba(255, 235, 59, 0.7)';
                }

                // Robuste Icon-Darstellung mit Unicode-Symbolen
                const emoji = document.createElement('div');
                emoji.className = 'item-emoji';
                emoji.textContent = item.emoji;
                emoji.setAttribute('data-item-type', item.type);
                emoji.setAttribute('data-label', item.label);

                // Label mit Duplikat-Info
                const label = document.createElement('div');
                label.className = 'item-label';
                label.textContent = item.isDuplicate ? `${item.label} (${copy + 1}/${itemCount})` : item.label;

                itemDiv.appendChild(emoji);
                itemDiv.appendChild(label);

                // Mouse Events - Einfaches Drag-and-Drop ohne HTML5 Drag API
                itemDiv.addEventListener('mousedown', (e) => {
                    if (itemDiv.classList.contains('placed')) return;

                    e.preventDefault();
                    this.startDrag(itemDiv, e);
                });

                // Universal Click-to-Select für alle Geräte
                itemDiv.addEventListener('click', (e) => {
                    if (itemDiv.classList.contains('placed')) return;

                    e.preventDefault();
                    e.stopPropagation();

                    console.log('Item clicked:', item.label, 'Mobile:', this.isMobile); // Debug

                    if (this.selectedItem === itemDiv) {
                        this.deselectItem(); // Deselect if already selected
                    } else {
                        this.selectItem(itemDiv); // Select new item
                    }
                });

                // Touch Events für bessere Mobile Experience
                itemDiv.addEventListener('touchstart', (e) => {
                    if (itemDiv.classList.contains('placed')) return;

                    e.preventDefault();
                    console.log('Item touched:', item.label); // Debug
                    this.selectItem(itemDiv);
                });                container.appendChild(itemDiv);
            }
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

        if (this.isValidPlacement(zoneId, itemType, correctZone)) {
            this.placeItemInZone(this.activeElement, dropZone);
        } else {
            this.wrongPlacement();
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

    // Level System Methods
    setLevel(level) {
        this.currentLevel = Math.max(0, Math.min(level, 3));
        this.updateLevelDisplay();
    }

    updateLevelDisplay() {
        const levelNames = {
            0: "🟢 Einfach",
            1: "🟡 Normal",
            2: "🟠 Schwer",
            3: "🔴 Experte"
        };

        const levelElement = document.getElementById('current-level');
        if (levelElement) {
            levelElement.textContent = `Level: ${levelNames[this.currentLevel]}`;
        }
    }

    getLevelItems(roomKey) {
        const baseItems = this.roomData[roomKey].items;

        switch (this.currentLevel) {
            case 0: // Einfach - weniger Items, farbige Umrandungen
                return baseItems.slice(0, 3).map(item => ({
                    ...item,
                    hasHelper: true // Für farbige Umrandung
                }));

            case 1: // Normal - Standard
                return baseItems;

            case 2: // Schwer - mehr Items, verstecktere Positionen
                return this.getHardLevelItems(baseItems);

            case 3: // Experte - doppelte Items + zusätzliche
                return this.getExpertLevelItems(baseItems);

            default:
                return baseItems;
        }
    }

    getHardLevelItems(baseItems) {
        // Füge 2-3 zusätzliche Items hinzu für Level 2
        const extraItems = [
            { emoji: "🗃️", symbol: "🗃️", label: "Box", type: "storage", correctZone: "storage", startPos: { x: 15, y: 85 } },
            { emoji: "🧹", symbol: "🧹", label: "Besen", type: "cleaning", correctZone: "storage", startPos: { x: 85, y: 15 } },
            { emoji: "🧴", symbol: "🧴", label: "Reiniger", type: "cleaning", correctZone: "storage", startPos: { x: 10, y: 10 } }
        ];

        // Versteckte Positionen (näher an den Rändern)
        const hiddenItems = baseItems.map(item => ({
            ...item,
            startPos: {
                x: Math.random() < 0.5 ? Math.random() * 15 + 5 : Math.random() * 15 + 80,
                y: Math.random() < 0.5 ? Math.random() * 15 + 5 : Math.random() * 15 + 80
            }
        }));

        return [...hiddenItems, ...extraItems.slice(0, 2)];
    }

    getLevelZones(roomKey) {
        const baseZones = this.roomData[roomKey].zones;

        if (this.currentLevel >= 2) {
            // Füge zusätzliche Storage-Zone für Level 2+ hinzu
            const extraZones = [
                { id: "storage", name: "Lager", x: 5, y: 5, w: 15, h: 15, accepts: ["storage", "cleaning"] },
                { id: "entrance", name: "Eingang", x: 85, y: 85, w: 10, h: 10, accepts: ["shoes", "important"] }
            ];
            return [...baseZones, ...extraZones];
        }

        return baseZones;
    }

    getExpertLevelItems(baseItems) {
        // Erstelle doppelte Items für Level 3
        const doubleItems = baseItems.slice(0, 3).map((item, index) => ({
            ...item,
            id: `${item.label}_copy_${index}`,
            label: `${item.label} (2x)`,
            isDuplicate: true,
            duplicateCount: 2,
            startPos: { x: Math.random() * 80 + 10, y: Math.random() * 80 + 10 }
        }));

        // Zusätzliche schwierige Items
        const expertItems = [
            { emoji: "🥾", symbol: "🥾", label: "Gummistiefel", type: "shoes", correctZone: "entrance", startPos: { x: 12, y: 88 } },
            { emoji: "🧳", symbol: "🧳", label: "Koffer", type: "storage", correctZone: "storage", startPos: { x: 88, y: 12 } },
            { emoji: "🔑", symbol: "🔑", label: "Schlüssel", type: "important", correctZone: "desk", startPos: { x: 45, y: 92 } }
        ];

        return [...baseItems, ...doubleItems, ...expertItems];
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    new AufraumSpiel();
});
