// sketch2.js

const sketch2 = (p) => {
    let myFont; // Variable pour stocker la police
    let rectangles = []; // Tableau pour stocker les objets rectangles
    const rows = 2; // Nombre de lignes
    const cols = 15; // Nombre de colonnes
    const baseSize = 60; // Taille de base des rectangles
    const hoverSize = 80; // Taille des rectangles au survol
    const spacing = 20; // Espacement entre les rectangles
    const shiftAmount = 20; // Décalage vertical lors du survol
    const shiftOffsetX = 10; // Décalage horizontal des rectangles adjacents

    // Variables pour l'animation de fade-in
    let bgOpacity = 0; // Opacité du fond noir
    let rectOpacity = 0; // Opacité des rectangles blancs et des nombres
    const fadeDurationFrames = 30; // Nombre de frames pour l'animation de fade-in
    let currentFadeFrame = 0; // Compteur de frames pour le fade-in

    // Variables pour les images de relief
    let reliefImages = [];          // Tableau pour stocker les images de relief
    let imageOpacities = [];        // Tableau pour stocker l'opacité actuelle des images
    let imageTargetOpacities = [];  // Tableau pour stocker l'opacité cible des images

    // Variable pour stocker l'image actuellement affichée
    let currentImageIndex = -1; // -1 signifie aucune image affichée

    // Classe représentant un rectangle
    class Rectangle {
        constructor(row, col, number) {
            this.row = row; // Numéro de la ligne (0 ou 1)
            this.col = col; // Numéro de la colonne (0 à 14)
            this.number = number; // Numéro affiché dans le rectangle

            // Propriétés pour gérer la taille
            this.currentSize = baseSize; // Taille actuelle
            this.targetSize = baseSize; // Taille cible

            // Propriétés pour gérer le décalage horizontal
            this.currentShiftX = 0; // Décalage horizontal actuel
            this.targetShiftX = 0; // Décalage horizontal cible

            // Propriétés pour gérer le décalage vertical
            this.currentShiftY = 0; // Décalage vertical actuel
            this.targetShiftY = 0; // Décalage vertical cible
        }

        // Méthode pour dessiner le rectangle avec une opacité dynamique
        draw(x, y, opacity) {
            p.stroke(0); // Bordure noire
            p.fill(255, 255, 255, opacity); // Blanc semi-transparent avec opacité dynamique
            p.rect(x + this.currentShiftX, y + this.currentShiftY, this.currentSize, this.currentSize);

            // Dessiner le numéro au centre du rectangle avec opacité dynamique
            p.noStroke();
            p.fill(0, opacity); // Texte noir avec opacité dynamique
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

    // Fonction preload pour charger la police et les images avant le setup
    p.preload = function() {
        myFont = p.loadFont('fonts/OldNewspaperTypes.ttf');

        // Charger les images de relief
        for (let i = 1; i <= 30; i++) {
            let img = p.loadImage(`assets/relief/relief(${i}).JPG`, 
                () => { /* Image chargée avec succès */ }, 
                () => { console.error(`Erreur de chargement de l'image assets/relief/relief(${i}).JPG`); }
            );
            reliefImages.push(img);
            imageOpacities.push(0);         // Initialiser l'opacité à 0
            imageTargetOpacities.push(0);   // Initialiser l'opacité cible à 0
        }
    };

    // Fonction setup pour initialiser le canvas et les rectangles
    p.setup = function() {
        // Créer un canvas en 2D qui couvre toute la fenêtre
        p.createCanvas(p.windowWidth, p.windowHeight);
        p.rectMode(p.CENTER); // Mode de dessin des rectangles centrés
        p.textAlign(p.CENTER, p.CENTER);
        p.noStroke();
        p.smooth(0); // Désactiver l'anti-aliasing pour améliorer la performance

        // Positionner le canvas au-dessus du premier canvas
        p.canvas.style.position = 'absolute';
        p.canvas.style.top = '0';
        p.canvas.style.left = '0';
        p.canvas.style.pointerEvents = 'auto'; // Permettre les interactions avec sketch2
        p.canvas.style.zIndex = '2'; // Assurer que ce canvas est au-dessus

        // Initialiser les rectangles avec leurs numéros
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                let number = row * cols + col + 1; // Numérotation de 1 à 30
                rectangles.push(new Rectangle(row, col, number));
            }
        }
    };

    // Fonction draw pour dessiner les rectangles, les images et gérer les interactions
    p.draw = function() {
        p.clear(); // Effacer le canvas tout en gardant la transparence

        // Traduire l'origine au centre de l'écran
        p.translate(p.width / 2, p.height / 2);

        // Animation de fade-in
        if (currentFadeFrame < fadeDurationFrames) {
            bgOpacity = p.lerp(bgOpacity, 200, 0.05); // Augmente l'opacité du fond noir vers 100
            rectOpacity = p.lerp(rectOpacity, 200, 0.05); // Augmente l'opacité des rectangles vers 200
            currentFadeFrame++;
        }

        // Variables pour la détection de survol
        let relMouseX = p.mouseX - p.width / 2;
        let relMouseY = p.mouseY - p.height / 2;

        let hoveredRect = null; // Stocker le numéro du rectangle survolé

        // Calculer la largeur et la hauteur totales de la grille
        let totalWidth = cols * (baseSize + spacing) - spacing;
        let totalHeight = rows * (baseSize + spacing) - spacing;

        // Calculer les positions de départ pour centrer la grille
        let startX = -totalWidth / 2 + baseSize / 2;
        let startY = -totalHeight / 2 + baseSize / 2;

        // Détection du rectangle survolé (priorité à la première ligne)
        outerLoop:
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                let rect = rectangles[row * cols + col];
                let x = startX + col * (baseSize + spacing);
                let y = startY + row * (baseSize + spacing);

                let d = p.dist(relMouseX, relMouseY, x + rect.currentShiftX, y + rect.currentShiftY);

                if (d < rect.currentSize / 2) { // Si la souris est sur le rectangle
                    hoveredRect = rect.number; // Stocker le numéro du rectangle survolé
                    break outerLoop; // Sortir des boucles une fois le premier survol détecté
                }
            }
        }

        // Gestion des cibles de taille et de décalage en fonction du survol
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                let rect = rectangles[row * cols + col];

                if (rect.number === hoveredRect) {
                    rect.targetSize = hoverSize; // Agrandir le rectangle survolé
                    if (rect.row === 0) {
                        rect.targetShiftY = -shiftAmount; // Déplacer vers le haut
                    } else if (rect.row === 1) {
                        rect.targetShiftY = shiftAmount; // Déplacer vers le bas
                    }
                    rect.targetShiftX = 0; // Réinitialiser le décalage horizontal
                } else {
                    rect.targetSize = baseSize; // Réinitialiser la taille
                    rect.targetShiftX = 0; // Réinitialiser le décalage horizontal
                    rect.targetShiftY = 0; // Réinitialiser le décalage vertical
                }
            }
        }

        // Mettre à jour les opacités des images en fonction du survol
        // Réinitialiser toutes les opacités cibles à 0
        for (let i = 0; i < imageTargetOpacities.length; i++) {
            imageTargetOpacities[i] = 0;
        }

        // Définir l'opacité cible pour l'image correspondante au rectangle survolé
        if (hoveredRect !== null) {
            imageTargetOpacities[hoveredRect - 1] = 255; // Opacité cible pour l'image correspondante
            currentImageIndex = hoveredRect - 1; // Mettre à jour l'index de l'image actuelle
        } else {
            currentImageIndex = -1; // Aucune image affichée
        }

        // Interpoler les opacités actuelles vers les opacités cibles
        for (let i = 0; i < imageOpacities.length; i++) {
            imageOpacities[i] = p.lerp(imageOpacities[i], imageTargetOpacities[i], 0.1);
        }

        // Dessiner l'image de relief actuellement sélectionnée en arrière-plan avec son opacité actuelle
        if (currentImageIndex !== -1 && imageOpacities[currentImageIndex] > 0) {
            p.push();
            p.noStroke();
            p.tint(255, imageOpacities[currentImageIndex]); // Appliquer l'opacité
            p.imageMode(p.CENTER);
            p.image(reliefImages[currentImageIndex], 0, 0, p.width, p.height); // Étendre l'image pour couvrir le fond
            p.pop();
        }

        // Dessiner le rectangle noir de fond
        p.noStroke();
        p.fill(0, bgOpacity); // Noir avec opacité dynamique
        p.rect(0, 0, p.width, p.height); // Rectangle centré couvrant tout l'écran

        // Mettre à jour et dessiner les rectangles
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                let rect = rectangles[row * cols + col];

                // Mettre à jour les propriétés pour des transitions fluides
                rect.update();

                // Calculer la position ajustée du rectangle
                let x = startX + col * (baseSize + spacing) + rect.currentShiftX;
                let yPos = startY + row * (baseSize + spacing) + rect.currentShiftY;

                // Dessiner le rectangle avec l'opacité actuelle des rectangles
                rect.draw(x, yPos, rectOpacity);
            }
        }
    };

    // Fonction pour redimensionner le canvas lors du changement de taille de la fenêtre
    p.windowResized = function() {
        p.resizeCanvas(p.windowWidth, p.windowHeight);
        // Aucun recalcul supplémentaire nécessaire car les positions sont recalculées dynamiquement dans draw()
    };
};

// Initialiser le second sketch après le chargement de p5.js
if (typeof p5 !== 'undefined') {
    new p5(sketch2);
}
