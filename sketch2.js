// sketch2.js

const sketch2 = (p) => {
    let myFont; // Police utilisée
    const rows = 2; // Nombre de lignes
    const cols = 15; // Nombre de colonnes
    const baseSize = 60; // Taille de base des rectangles
    const hoverSize = 80; // Taille au survol
    const spacing = 20; // Espacement entre les rectangles
    const shiftAmount = 20; // Décalage vertical lors du survol

    // Variables pour l'animation de fade-in du fond et des rectangles
    let bgOpacity = 0;
    let rectOpacity = 0;
    const fadeSpeed = 0.05; // Vitesse du fade-in

    // Variables pour les images de relief
    let reliefImages = []; // Images chargées
    let currentImageIndex = -1; // Index de l'image actuellement affichée
    let currentImageOpacity = 0; // Opacité actuelle de l'image
    const imageFadeSpeed = 0.1; // Vitesse du fade-in des images

    // Variables pour le texte dynamique
    let texts = []; // Textes associés aux rectangles
    let currentText = ''; // Texte actuellement affiché
    let textOpacity = 0; // Opacité actuelle du texte
    const textFadeSpeed = 0.1; // Vitesse des transitions du texte

    // Tableau pour stocker les rectangles
    let rectangles = [];

    // Classe représentant un rectangle
    class Rectangle {
        constructor(x, y, number) {
            this.x = x; // Position X
            this.y = y; // Position Y
            this.number = number; // Numéro affiché

            // Propriétés pour la taille et le décalage
            this.currentSize = baseSize;
            this.targetSize = baseSize;
            this.currentShiftY = 0;
            this.targetShiftY = 0;
        }

        // Dessiner le rectangle
        draw(opacity) {
            p.stroke(0);
            p.fill(255, 255, 255, opacity);
            p.rect(this.x, this.y + this.currentShiftY, this.currentSize, this.currentSize);

            // Dessiner le numéro
            p.noStroke();
            p.fill(0, opacity);
            p.textFont(myFont);
            p.textAlign(p.CENTER, p.CENTER);
            p.textSize(this.currentSize / 3);
            p.text(this.number, this.x, this.y + this.currentShiftY);
        }

        // Mettre à jour les propriétés pour des transitions fluides
        update() {
            this.currentSize = p.lerp(this.currentSize, this.targetSize, 0.1);
            this.currentShiftY = p.lerp(this.currentShiftY, this.targetShiftY, 0.1);
        }

        // Vérifier si la souris survole ce rectangle
        isHovered(relMouseX, relMouseY) {
            let distance = p.dist(relMouseX, relMouseY, this.x, this.y + this.currentShiftY);
            return distance < this.currentSize / 2;
        }
    }

    // Précharger les ressources
    p.preload = function() {
        myFont = p.loadFont('fonts/OldNewspaperTypes.ttf');

        // Charger les images de relief
        for (let i = 1; i <= 30; i++) {
            let img = p.loadImage(`assets/relief/relief(${i}).JPG`, 
                () => { /* Image chargée avec succès */ }, 
                () => { console.error(`Erreur de chargement de l'image assets/relief/relief(${i}).JPG`); }
            );
            reliefImages.push(img);
            texts.push(`Lorem ipsum dolor sit amet, consectetur adipiscing elit. Rectangle ${i}.`);
        }
    };

    // Initialiser le canvas et les rectangles
    p.setup = function() {
        p.createCanvas(p.windowWidth, p.windowHeight);
        p.rectMode(p.CENTER);
        p.textAlign(p.CENTER, p.CENTER);
        p.noStroke();
        p.smooth(0); // Désactiver l'anti-aliasing pour de meilleures performances

        // Positionner le canvas
        p.canvas.style.position = 'absolute';
        p.canvas.style.top = '0';
        p.canvas.style.left = '0';
        p.canvas.style.pointerEvents = 'auto';
        p.canvas.style.zIndex = '2';

        // Calculer les positions des rectangles
        let totalWidth = cols * (baseSize + spacing) - spacing;
        let totalHeight = rows * (baseSize + spacing) - spacing;
        let startX = -totalWidth / 2 + baseSize / 2;
        let startY = -totalHeight / 2 + baseSize / 2;

        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                let x = startX + col * (baseSize + spacing);
                let y = startY + row * (baseSize + spacing);
                let number = row * cols + col + 1;
                rectangles.push(new Rectangle(x, y, number));
            }
        }
    };

    // Dessiner à chaque frame
    p.draw = function() {
        p.clear(); // Effacer le canvas

        p.translate(p.width / 2, p.height / 2); // Centrer le canvas

        // Fade-in du fond et des rectangles
        if (bgOpacity < 200) {
            bgOpacity = p.lerp(bgOpacity, 200, fadeSpeed);
            rectOpacity = p.lerp(rectOpacity, 200, fadeSpeed);
        }

        // Dessiner le fond noir
        p.noStroke();
        p.fill(0, bgOpacity);
        p.rect(0, 0, p.width, p.height);

        // Détection du rectangle survolé
        let relMouseX = p.mouseX - p.width / 2;
        let relMouseY = p.mouseY - p.height / 2;
        let hoveredRect = null;

        for (let rect of rectangles) {
            if (rect.isHovered(relMouseX, relMouseY)) {
                hoveredRect = rect;
                break; // Priorité à la première détection
            }
        }

        // Gestion des rectangles
        rectangles.forEach(rect => {
            if (rect === hoveredRect) {
                rect.targetSize = hoverSize;
                rect.targetShiftY = (rect.y < 0) ? -shiftAmount : shiftAmount;
            } else {
                rect.targetSize = baseSize;
                rect.targetShiftY = 0;
            }
            rect.update();
            rect.draw(rectOpacity);
        });

        // Gestion des images avec fade-in uniquement
        if (hoveredRect) {
            let newImageIndex = hoveredRect.number - 1;
            if (currentImageIndex !== newImageIndex) {
                // Réinitialiser l'opacité de l'image précédente
                currentImageOpacity = 0;
                // Mettre à jour l'image actuelle
                currentImageIndex = newImageIndex;
                // Définir l'opacité cible
                currentImageOpacity = 0; // Reset before starting fade-in
            }
            // Fade-in de l'image actuelle
            if (currentImageOpacity < 255) {
                currentImageOpacity = p.lerp(currentImageOpacity, 255, imageFadeSpeed);
            }
        } else {
            // Réinitialiser l'image si aucun rectangle n'est survolé
            currentImageIndex = -1;
            currentImageOpacity = 0;
        }

        // Dessiner l'image actuelle avec fade-in
        if (currentImageIndex !== -1 && reliefImages[currentImageIndex]) {
            p.push();
            p.noStroke();
            p.tint(255, currentImageOpacity);
            p.imageMode(p.CENTER);
            p.image(reliefImages[currentImageIndex], 0, 0, p.width, p.height);
            p.pop();
        }

        // Gestion du texte dynamique avec fade-in et fade-out
        if (hoveredRect) {
            currentText = texts[currentImageIndex];
            textOpacity = p.lerp(textOpacity, 255, textFadeSpeed);
        } else {
            textOpacity = p.lerp(textOpacity, 0, textFadeSpeed);
        }

        // Dessiner le texte avec opacité dynamique
        if (currentText && textOpacity > 0) {
            p.push();
            p.noStroke();
            p.fill(255, textOpacity);
            p.textFont(myFont);
            p.textAlign(p.CENTER, p.TOP);
            p.textSize(24);
            p.text(currentText, 0, -p.height / 2 + 20);
            p.pop();
        }
    };

    // Gérer le redimensionnement de la fenêtre
    p.windowResized = function() {
        p.resizeCanvas(p.windowWidth, p.windowHeight);
    };
};

// Initialiser le sketch après le chargement de p5.js
if (typeof p5 !== 'undefined') {
    new p5(sketch2);
}
