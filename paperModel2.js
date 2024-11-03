// sketch2.js

const sketch2 = (p) => {
    // Variables globales
    let myFont; // Variable pour stocker la police
    let rectangles = []; // Tableau pour stocker les objets rectangles
    let rows = 3; // Nombre de lignes
    let cols = 10; // Nombre de colonnes
    let targetShiftY = 70; // Valeur par défaut

    // Layout configuration encapsulée
    let layout = {
        baseSize: 80,
        hoverSize: 90,
        spacing: 24,
        shiftAmount: 5,
        shiftOffsetX: 5,
        titleSize: 24,
        descriptionSize: 18,
        description2Size: 12,
        description3Size: 14,
        description4Size: 14,
        lineSpacing: 24,
        lineSpacing2: 20,
        lineSpacing3: 18,
        lineSpacing4: 18,
        titleToDescriptionSpacing: 40,
        description2YShift: 0,
        description3YShift: 0,
        description4YShift: 0,
        lineWidth2: 0,
        lineWidth3: 0,
        lineWidth4: 0,
        paragrapheSpacing2: 0,
        paragrapheSpacing3: 0,
        paragrapheSpacing4: 0,
        description2X: 0,
        description2Y: 0,
        margin: 0
    };

    // Gestionnaire de textes et d'images
    let textManager;
    let imageManager;

    // Opacités
    let bgOpacity = 0; // Opacité initiale du fond noir
    let rectOpacity = 0; // Opacité initiale des rectangles
    const fadeSpeed = 0.05; // Vitesse de l'interpolation

    // Variables pour le texte dynamique
    let currentText = null; // Texte actuellement affiché
    let textOpacityCurrent = 0; // Opacité actuelle du texte
    let textTargetOpacity = 0; // Opacité cible du texte

    // Variable pour stocker l'image actuellement affichée
    let currentImageIndex = -1; // -1 signifie aucune image affichée

    // Opacités cibles
    let bgTargetOpacity = 200; // Opacité cible du fond noir
    let rectTargetOpacity = 200; // Opacité cible des rectangles

    // Fonction pour déterminer l'orientation
    function isPortrait() {
        return p.windowHeight > p.windowWidth;
    }

    // Fonction pour définir la grille basée sur l'orientation
    function setGridBasedOnOrientation() {
        if (isPortrait()) {
            rows = 3;
            cols = 10;
        } else {
            rows = 2;
            cols = 15;
        }
    }

    // Fonction pour définir le décalage vertical basé sur l'orientation
    function setTargetShiftYBasedOnOrientation() {
        if (isPortrait()) {
            targetShiftY = 280; // Déplace les rectangles plus vers le bas en mode portrait
        } else {
            targetShiftY = 70; // Valeur par défaut pour le mode paysage
        }
    }

    // Classe représentant un rectangle
    class Rectangle {
        constructor(row, col, number, baseSize, hoverSize) {
            this.row = row;
            this.col = col;
            this.number = number;

            this.baseSize = baseSize;
            this.hoverSize = hoverSize;

            this.currentSize = baseSize;
            this.targetSize = baseSize;

            this.currentShiftX = 0;
            this.targetShiftX = 0;

            this.currentShiftY = 120;
            this.targetShiftY = targetShiftY;
        }

        // Méthode pour dessiner le rectangle avec une opacité dynamique
        draw(x, y, opacity) {
            p.stroke(0, 0, 0, opacity); // Bordure noire avec opacité
            p.fill(255, 255, 255, opacity); // Blanc semi-transparent avec opacité dynamique
            p.rect(x + this.currentShiftX, y + this.currentShiftY, this.currentSize, this.currentSize);

            // Dessiner le numéro au centre du rectangle avec opacité dynamique
            p.noStroke();
            p.fill(0, opacity + 30); // Texte noir avec opacité dynamique
            p.textFont(myFont);
            p.textAlign(p.CENTER, p.CENTER);
            p.textSize(this.currentSize / 3); // Taille du texte proportionnelle à la taille du rectangle
            p.text(this.number, x + this.currentShiftX, y + this.currentShiftY);
        }

        // Méthode pour mettre à jour les propriétés pour des transitions fluides
        update() {
            // Interpoler la taille actuelle vers la taille cible
            this.currentSize = p.lerp(this.currentSize, this.targetSize, 0.1);
            // Interpoler le décalage actuel vers le décalage cible
            this.currentShiftX = p.lerp(this.currentShiftX, this.targetShiftX, 0.1);
            this.currentShiftY = p.lerp(this.currentShiftY, this.targetShiftY, 0.1);
        }
    }

    // Classe pour gérer les textes
    class TextManager {
        constructor(textsData, specialWords) {
            this.texts = textsData.texts; // Assurez-vous que le JSON a une clé "texts"
            this.specialWords = specialWords;
        }

        // Méthode pour obtenir le texte associé à un rectangle donné
        getText(rectNumber) {
            return this.texts[rectNumber - 1] || null;
        }

        // Méthode pour dessiner du texte coloré avec justification
        drawColoredText(line, x, y, lineWidth, lineSpacing) {
            let words = line.split(" ");
            let currentLine = [];
            let lineWidthAccumulated = 0;
            let lineY = y;

            words.forEach((word) => {
                let wordWidth = p.textWidth(word + " ");
                if (lineWidthAccumulated + wordWidth > lineWidth && currentLine.length > 0) {
                    this.justifyAndDrawLine(currentLine, x, lineY, lineWidth);
                    currentLine = [];
                    lineWidthAccumulated = 0;
                    lineY += lineSpacing;
                }
                currentLine.push(word);
                lineWidthAccumulated += wordWidth;
            });

            if (currentLine.length > 0) {
                this.justifyAndDrawLine(currentLine, x, lineY, lineWidth);
            }
        }

        // Méthode pour justifier et dessiner une ligne
        justifyAndDrawLine(lineWords, x, y, lineWidth) {
            let totalWordsWidth = lineWords.reduce((sum, word) => sum + p.textWidth(word), 0);
            let extraSpace = lineWidth - totalWordsWidth;
            let spaceWidth = lineWords.length > 1 ? extraSpace / (lineWords.length - 1) : 0;
            let currentX = x;

            lineWords.forEach((word) => {
                let color = this.specialWords[word] || [255, 255, 255]; // Blanc par défaut
                p.fill(...color);
                p.text(word, currentX, y);
                currentX += p.textWidth(word) + spaceWidth;
            });
        }
    }

    // Classe pour gérer les images
    class ImageManager {
        constructor(reliefImages) {
            this.reliefImages = reliefImages;
            this.imageOpacities = Array(reliefImages.length).fill(0);
            this.imageTargetOpacities = Array(reliefImages.length).fill(0);
        }

        // Méthode pour mettre à jour l'opacité des images
        updateOpacities() {
            for (let i = 0; i < this.imageOpacities.length; i++) {
                this.imageOpacities[i] = p.lerp(this.imageOpacities[i], this.imageTargetOpacities[i], 0.1);
            }
        }

        // Méthode pour dessiner l'image avec une opacité donnée
        drawImage(index, x, y, width, height) {
            if (index !== -1 && this.imageOpacities[index] > 0) {
                p.push();
                p.noStroke();
                p.tint(255, this.imageOpacities[index]); // Appliquer l'opacité
                p.imageMode(p.CENTER);
                p.image(this.reliefImages[index], x, y, width, height); // Étendre l'image pour couvrir le fond
                p.pop();
            }
        }

        // Méthode pour définir l'opacité cible d'une image
        setTargetOpacity(index, opacity) {
            if (index >= 0 && index < this.imageTargetOpacities.length) {
                this.imageTargetOpacities[index] = opacity;
            }
        }
    }

    // Classe pour gérer les interactions et le rendu
    class InteractionManager {
        constructor(rectangles, textManager, imageManager) {
            this.rectangles = rectangles;
            this.textManager = textManager;
            this.imageManager = imageManager;
            this.hoveredRect = null;
        }

        // Méthode pour détecter le rectangle survolé
        detectHoveredRect(relMouseX, relMouseY) {
            this.hoveredRect = null;

            outerLoop:
            for (let rect of this.rectangles) {
                let totalWidth = cols * (layout.baseSize + layout.spacing) - layout.spacing;
                let totalHeight = rows * (layout.baseSize + layout.spacing) - layout.spacing;
                let startX = -totalWidth / 2 + layout.baseSize / 2;
                let startY = -totalHeight / 2 + layout.baseSize / 2;
                let x = startX + rect.col * (layout.baseSize + layout.spacing) + rect.currentShiftX;
                let y = startY + rect.row * (layout.baseSize + layout.spacing) + rect.currentShiftY;

                let d = p.dist(relMouseX, relMouseY, x, y + targetShiftY);

                if (d < rect.currentSize / 2) { // Si la souris est sur le rectangle
                    this.hoveredRect = rect.number; // Stocker le numéro du rectangle survolé
                    break outerLoop; // Sortir des boucles une fois le premier survol détecté
                }
            }
        }

        // Méthode pour gérer les interactions basées sur le survol
        handleInteractions() {
            if (this.hoveredRect !== null) {
                bgTargetOpacity = 20;
                rectTargetOpacity = 20;

                let hoveredRectObj = this.rectangles.find(r => r.number === this.hoveredRect);
                if (hoveredRectObj) {
                    this.rectangles.forEach(rect => {
                        if (rect.row === hoveredRectObj.row) {
                            if (rect.col < hoveredRectObj.col) {
                                rect.targetShiftX = -layout.shiftOffsetX; // Déplacer à gauche
                            } else if (rect.col > hoveredRectObj.col) {
                                rect.targetShiftX = layout.shiftOffsetX; // Déplacer à droite
                            } else {
                                rect.targetShiftX = 0; // Rectangle survolé reste centré
                            }
                        } else {
                            rect.targetShiftX = 0; // Autres lignes ne bougent pas
                        }

                        if (rect.number === this.hoveredRect) {
                            rect.targetSize = layout.hoverSize; // Agrandir le rectangle survolé
                            if (rect.row === 0) {
                                rect.targetShiftY = targetShiftY - layout.shiftAmount; // Déplacer légèrement vers le haut
                            } else if (rect.row === 1) {
                                rect.targetShiftY = targetShiftY + layout.shiftAmount; // Déplacer légèrement vers le bas
                            }
                            // Si row == 2, ajustez si nécessaire
                        } else {
                            rect.targetSize = layout.baseSize; // Réinitialiser la taille des autres rectangles
                            rect.targetShiftY = targetShiftY; // Réinitialiser le décalage vertical
                        }

                        // Mettre à jour les propriétés pour des transitions fluides
                        rect.update();
                    });
                }
            } else {
                bgTargetOpacity = 200;
                rectTargetOpacity = 200;

                // Aucun rectangle survolé, réinitialiser toutes les propriétés
                this.rectangles.forEach(rect => {
                    rect.targetSize = layout.baseSize; // Réinitialiser la taille
                    rect.targetShiftX = 0; // Réinitialiser le décalage horizontal
                    rect.targetShiftY = targetShiftY; // Réinitialiser le décalage vertical

                    // Mettre à jour les propriétés pour des transitions fluides
                    rect.update();
                });
            }
        }

        // Méthode pour gérer le texte et les images basés sur le survol
        handleTextAndImage() {
            if (this.hoveredRect !== null) {
                let newImageIndex = this.hoveredRect - 1;

                if (currentImageIndex !== newImageIndex) {
                    // Réinitialiser l'opacité de l'image précédente
                    if (currentImageIndex !== -1) {
                        imageManager.setTargetOpacity(currentImageIndex, 0);
                    }

                    // Mettre à jour l'index de l'image actuelle
                    currentImageIndex = newImageIndex;

                    // Définir l'opacité cible pour l'image actuelle
                    imageManager.setTargetOpacity(currentImageIndex, 255);

                    // Mettre à jour le texte actuel
                    currentText = textManager.getText(currentImageIndex + 1);
                }
            } else {
                // Aucune image n'est survolée, réinitialiser l'image actuelle
                if (currentImageIndex !== -1) {
                    imageManager.setTargetOpacity(currentImageIndex, 0);
                    currentImageIndex = -1;
                }

                // Réinitialiser le texte
                currentText = null;
            }
        }
    }

    // Classe pour gérer les opacités et le rendu global
    class RenderManager {
        constructor(textManager, imageManager) {
            this.textManager = textManager;
            this.imageManager = imageManager;
        }

        // Méthode pour mettre à jour les opacités des images
        update() {
            this.imageManager.updateOpacities();
        }

        // Méthode pour dessiner les éléments
        draw(currentText) {
            // Dessiner l'image de relief actuellement sélectionnée en arrière-plan avec son opacité actuelle
            if (currentImageIndex !== -1) {
                this.imageManager.drawImage(currentImageIndex, 0, 0, p.width, p.height);
            }

            // Dessiner le rectangle noir de fond avec opacité dynamique
            p.noStroke();
            p.fill(0, bgOpacity); // Noir avec opacité dynamique
            p.rect(0, 0, p.width, p.height); // Rectangle centré couvrant tout l'écran

            // Gestion du texte dynamique avec fade-in et fade-out
            if (currentText) {
                textTargetOpacity = 255; // Opacité cible pour le texte
            } else {
                textTargetOpacity = 0; // Opacité cible à 0 lorsque aucun rectangle n'est survolé
            }

            // Interpoler l'opacité du texte
            textOpacityCurrent = p.lerp(textOpacityCurrent, textTargetOpacity, 0.1);

            // Dessiner le texte en haut centre de l'écran avec l'opacité actuelle
            if (currentText && textOpacityCurrent > 0) {
                p.push();
                p.noStroke();
                p.fill(255, textOpacityCurrent); // Texte blanc avec opacité dynamique
                p.textFont(myFont);
                p.textAlign(p.CENTER, p.TOP);

                // Partie pour le titre (en gras italique et taille dynamique)
                p.textSize(layout.titleSize);
                p.textStyle(p.BOLDITALIC);
                let titleY = -p.height / 2 + 20; // Positionner le titre
                p.text(currentText.title, 0, titleY);

                // Partie pour les descriptions (en normal et taille dynamique)
                p.textSize(layout.descriptionSize);
                p.textStyle(p.NORMAL);

                // Calculer la position Y initiale pour les descriptions
                let descriptionY = titleY + layout.titleToDescriptionSpacing; // Commencer après l'écart défini

                // Itérer sur le tableau des descriptions et les afficher
                currentText.descriptions.forEach(description => {
                    textManager.drawColoredText(description, 0, descriptionY, p.width, layout.lineSpacing);
                    descriptionY += layout.lineSpacing; // Ajouter de l'espace entre les lignes
                });

                // Vérifier si descriptions2 existe et l'afficher
                if (currentText.descriptions2) {
                    p.textSize(layout.description2Size);

                    // description2X et description2Y sont déjà calculés dans calculateSizes
                    // Utiliser les variables globales layout.description2X et layout.description2Y

                    // Aligner le texte à gauche
                    p.textAlign(p.LEFT, p.TOP);

                    // Utiliser uniquement drawColoredText sans p.text
                    currentText.descriptions2.forEach(line => {
                        textManager.drawColoredText(line, layout.description2X, layout.description2Y, layout.lineWidth2, layout.lineSpacing2);
                        layout.description2Y += layout.lineSpacing2; // Ajouter l'espacement des lignes
                    });

                    // Réinitialiser l'alignement pour éviter d'affecter d'autres textes
                    p.textAlign(p.CENTER, p.TOP);
                }

                // Vérifier si descriptions3 existe et l'afficher
                if (currentText.descriptions3) {
                    p.textSize(layout.description3Size);
                    let description3X = p.width / 2 - layout.paragrapheSpacing3;
                    let description3Y = titleY + layout.titleToDescriptionSpacing + layout.description3YShift;

                    // Aligner le texte à gauche
                    p.textAlign(p.LEFT, p.TOP);

                    // Utiliser uniquement drawColoredText sans p.text
                    currentText.descriptions3.forEach(line => {
                        textManager.drawColoredText(line, description3X, description3Y, layout.lineWidth3, layout.lineSpacing3);
                        description3Y += layout.lineSpacing3; // Ajouter l'espacement des lignes
                    });

                    // Réinitialiser l'alignement pour éviter d'affecter d'autres textes
                    p.textAlign(p.CENTER, p.TOP);
                }

                // Vérifier si descriptions4 existe et l'afficher
                if (currentText.descriptions4) {
                    p.textSize(layout.description4Size);
                    let description4X = p.width / 2 - layout.paragrapheSpacing4;
                    let description4Y = titleY + layout.titleToDescriptionSpacing + layout.description4YShift + layout.lineSpacing3 - 1;

                    // Aligner le texte à gauche
                    p.textAlign(p.LEFT, p.TOP);

                    // Utiliser uniquement drawColoredText sans p.text
                    currentText.descriptions4.forEach(line => {
                        textManager.drawColoredText(line, description4X, description4Y, layout.lineWidth4, layout.lineSpacing4);
                        description4Y += layout.lineSpacing4; // Ajouter l'espacement des lignes
                    });

                    // Réinitialiser l'alignement pour éviter d'affecter d'autres textes
                    p.textAlign(p.CENTER, p.TOP);
                }

                p.pop();
            }
        }
    }

    // Fonction pour initialiser le gestionnaire de textes
    function setupTextManager(textsData) {
        textManager = new TextManager(textsData, specialWords);
    }

    // Fonction pour initialiser le gestionnaire d'images
    function setupImageManager() {
        imageManager = new ImageManager(reliefImages);
    }

    // Fonction pour calculer les tailles et espacements basés sur la fenêtre
    function calculateSizes() {
        const initialWidth = 900; // Largeur de référence pour baseSize et spacing
        let scaleFactor = p.width / initialWidth;
        // Ajuster baseSize et spacing proportionnellement à la largeur actuelle, en respectant les minima

        setGridBasedOnOrientation();

        // Ajout d'ajustements basés sur l'orientation
        if (isPortrait()) {
            layout.baseSize = p.max(70, 80 * scaleFactor);
            layout.spacing = p.max(18, 24 * scaleFactor);
            layout.hoverSize = 90;

            layout.titleSize = p.max(36, 44 * scaleFactor);
            layout.descriptionSize = p.max(26, 34 * scaleFactor);
            layout.description2Size = p.max(20, 24 * scaleFactor);
            layout.description3Size = p.max(10, 14 * scaleFactor);
            layout.description4Size = p.max(10, 14 * scaleFactor);

            // Ajuster l'espacement entre les lignes proportionnellement, avec un minimum de 15px
            layout.lineSpacing = p.max(30, 40 * scaleFactor);
            layout.lineSpacing2 = p.max(30, 40 * scaleFactor);
            layout.lineSpacing3 = p.max(12, 18 * scaleFactor);
            layout.lineSpacing4 = p.max(12, 18 * scaleFactor);

            // Ajuster l'écart entre le titre et les descriptions, avec un minimum de 20px
            layout.titleToDescriptionSpacing = p.max(40, 80 * scaleFactor);

            // Ajuster l'écart pour description2Y, description3Y, et description4Y
            layout.description2YShift = p.map(scaleFactor, 0, 1, 120, 0, true); // scaleFactor de 1 à 0, shift de 0 à 100
            layout.description3YShift = p.map(scaleFactor, 0, 1, 120, 0, true); // scaleFactor de 1 à 0, shift de 0 à 100
            layout.description4YShift = p.map(scaleFactor, 0, 1, 120, 0, true); // scaleFactor de 1 à 0, shift de 0 à 100

            // Calculer les largeurs de ligne
            layout.lineWidth2 = p.max(360, 440 * scaleFactor);
            layout.lineWidth3 = p.max(160, 230 * scaleFactor);
            layout.lineWidth4 = p.max(160, 230 * scaleFactor);

            // Calculer les espacements des paragraphes
            layout.paragrapheSpacing2 = p.max(360, 500 * scaleFactor);
            layout.paragrapheSpacing3 = p.max(360, 550 * scaleFactor);
            layout.paragrapheSpacing4 = p.max(180, 280 * scaleFactor);

            // Définir la marge pour descriptions2
            layout.margin = layout.paragrapheSpacing2;

            // Calculer description2X et description2Y
            layout.description2X = p.width / 6;
            layout.description2Y = -p.height / 2 + 20 + layout.titleToDescriptionSpacing + layout.description2YShift + 10;
        } else {
            layout.baseSize = p.max(40, 50 * scaleFactor);
            layout.spacing = p.max(14, 20 * scaleFactor);
            layout.hoverSize = 60;

            layout.titleSize = p.max(18, 28 * scaleFactor); // Plus grand en paysage
            layout.descriptionSize = p.max(16, 22 * scaleFactor); // Plus grand en paysage
            layout.description2Size = p.max(12, 16 * scaleFactor); // Plus grand en paysage
            layout.description3Size = p.max(12, 18 * scaleFactor); // Plus grand en paysage
            layout.description4Size = p.max(12, 18 * scaleFactor); // Plus grand en paysage

            // Ajuster l'espacement entre les lignes proportionnellement, avec un minimum de 15px
            layout.lineSpacing = p.max(14, 24 * scaleFactor);
            layout.lineSpacing2 = p.max(14, 20 * scaleFactor);
            layout.lineSpacing3 = p.max(12, 18 * scaleFactor);
            layout.lineSpacing4 = p.max(12, 18 * scaleFactor);

            // Ajuster l'écart entre le titre et les descriptions, avec un minimum de 20px
            layout.titleToDescriptionSpacing = p.max(20, 40 * scaleFactor);

            // Ajuster l'écart pour description2Y, description3Y, et description4Y
            layout.description2YShift = p.map(scaleFactor, 0, 1, 120, 0, true); // scaleFactor de 1 à 0, shift de 0 à 100
            layout.description3YShift = p.map(scaleFactor, 0, 1, 120, 0, true); // scaleFactor de 1 à 0, shift de 0 à 100
            layout.description4YShift = p.map(scaleFactor, 0, 1, 120, 0, true); // scaleFactor de 1 à 0, shift de 0 à 100

            // Calculer les largeurs de ligne
            layout.lineWidth2 = p.max(320, 440 * scaleFactor);
            layout.lineWidth3 = p.max(160, 230 * scaleFactor);
            layout.lineWidth4 = p.max(160, 230 * scaleFactor);

            // Calculer les espacements des paragraphes
            layout.paragrapheSpacing2 = p.max(360, 500 * scaleFactor);
            layout.paragrapheSpacing3 = p.max(360, 550 * scaleFactor);
            layout.paragrapheSpacing4 = p.max(180, 280 * scaleFactor);

            // Définir la marge pour descriptions2
            layout.margin = layout.paragrapheSpacing2;

            // Calculer description2X et description2Y
            layout.description2X = p.width / 2 - layout.margin;
            layout.description2Y = -p.height / 2 + 20 + layout.titleToDescriptionSpacing + layout.description2YShift + 10;
        }
    }

    // Fonction pour initialiser ou réinitialiser les rectangles
    function initializeRectangles() {
        rectangles = []; // Réinitialiser le tableau des rectangles
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                let number = row * cols + col + 1; // Numérotation de 1 à (rows * cols)
                rectangles.push(new Rectangle(row, col, number, layout.baseSize, layout.hoverSize));
            }
        }
    }

    // Constantes en dehors de la fonction pour éviter de recréer l'objet à chaque appel
    const specialWords = {
        "a,a'": [255, 150, 150], // Rouge
        "a'": [255, 150, 150],   // Rouge
        "a": [255, 150, 150],    // Rouge
        "c": [150, 255, 150],    // Vert
        "c'": [150, 255, 150],   // Vert
        "c,c'": [150, 255, 150], // Vert
        "cd,c'd'": [150, 255, 150], // Vert
        "APA'": [150, 255, 150], // Vert
        "mm'": [150, 150, 255], // Bleu
        "C1": [0, 0, 255], // Bleu
        "C1d": [255, 165, 0], // Orange
        "bc,b'c'": [255, 150, 150],
    };

    // Fonction preload pour charger la police, les images et les textes avant le setup
    p.preload = function() {
        myFont = p.loadFont('fonts/OldNewspaperTypes.ttf');

        // Charger les images de relief
        for (let i = 1; i <= 30; i++) {
            let img = p.loadImage(`assets/relief/relief(${i}).JPG`,
                () => { /* Image chargée avec succès */ },
                () => { console.error(`Erreur de chargement de l'image assets/relief/relief(${i}).JPG`); }
            );
            reliefImages.push(img);
        }

        // Charger les textes depuis le fichier JSON
        textsData = p.loadJSON('assets/texts.json');
    };

    // Fonction setup pour initialiser le canvas et les rectangles
    p.setup = function() {
        // Créer un canvas en 2D qui couvre toute la fenêtre
        p.createCanvas(p.windowWidth, p.windowHeight);
        p.rectMode(p.CENTER); // Mode de dessin des rectangles centrés
        p.textAlign(p.CENTER, p.CENTER);
        p.noStroke();
        p.smooth(0); // Désactiver l'anti-aliasing pour améliorer la performance

        // Calculer les tailles initiales en fonction de la largeur de la fenêtre
        calculateSizes();
        setTargetShiftYBasedOnOrientation(); // Ajuste le décalage vertical basé sur l'orientation

        // Positionner le canvas au-dessus du premier canvas
        p.canvas.style.position = 'absolute';
        p.canvas.style.top = '0';
        p.canvas.style.left = '0';
        p.canvas.style.pointerEvents = 'auto'; // Permettre les interactions avec sketch2
        p.canvas.style.zIndex = '2'; // Assurer que ce canvas est au-dessus

        // Initialiser les rectangles avec leurs numéros
        initializeRectangles();

        // Initialiser les gestionnaires de textes et d'images
        setupTextManager(textsData);
        setupImageManager();
    };

    // Fonction pour dessiner les rectangles, les images et gérer les interactions
    p.draw = function() {
        p.clear(); // Effacer le canvas tout en gardant la transparence

        // Traduire l'origine au centre de l'écran
        p.translate(p.width / 2, p.height / 2);

        // Détection du rectangle survolé
        let relMouseX = p.mouseX - p.width / 2;
        let relMouseY = p.mouseY - p.height / 2;

        // Initialiser le gestionnaire d'interactions
        let interactionManager = new InteractionManager(rectangles, textManager, imageManager);
        interactionManager.detectHoveredRect(relMouseX, relMouseY);
        interactionManager.handleInteractions();
        interactionManager.handleTextAndImage();

        // Mettre à jour les opacités des images
        imageManager.updateOpacities();

        // Mettre à jour les opacités du fond et des rectangles
        bgOpacity = p.lerp(bgOpacity, bgTargetOpacity, fadeSpeed);
        rectOpacity = p.lerp(rectOpacity, rectTargetOpacity, fadeSpeed);

        // Rendre les éléments
        let renderManager = new RenderManager(textManager, imageManager);
        renderManager.draw(currentText);
    };

    // Fonction pour redimensionner le canvas lors du changement de taille de la fenêtre
    p.windowResized = function() {
        p.resizeCanvas(p.windowWidth, p.windowHeight);
        // Recalculer les tailles des rectangles, des polices, de l'espacement et de l'écart titre-descriptions
        calculateSizes();
        setGridBasedOnOrientation();
        setTargetShiftYBasedOnOrientation(); // Ajuste le décalage vertical basé sur l'orientation
        initializeRectangles();
    };
};

// Initialiser le second sketch après le chargement de p5.js
if (typeof p5 !== 'undefined') {
    new p5(sketch2);
}
