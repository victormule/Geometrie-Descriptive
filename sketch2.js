// sketch2.js

const sketch2 = (p) => {
    let myFont; // Variable pour stocker la police
    let rectangles = []; // Tableau pour stocker les objets rectangles
    const rows = 2; // Nombre de lignes
    const cols = 15; // Nombre de colonnes
    let baseSize = 50; // Taille de base des rectangles (modifiable)
    let hoverSize = 70; // Taille des rectangles au survol
    let spacing = 20; // Espacement entre les rectangles (modifiable)
    const shiftAmount = 5; // Décalage vertical lors du survol
    const shiftOffsetX = 5; // Décalage horizontal pour maintenir l'espacement

    // Variables pour l'animation de fade-in
    let bgOpacity = 0; // Opacité initiale du fond noir (modifié à 0 pour fade-in)
    let rectOpacity = 0; // Opacité initiale des rectangles blancs et des nombres (modifié à 0 pour fade-in)
    const fadeSpeed = 0.05; // Vitesse de l'interpolation

    // Variables pour les images de relief
    let reliefImages = [];          // Tableau pour stocker les images de relief
    let imageOpacities = [];        // Tableau pour stocker l'opacité actuelle des images
    let imageTargetOpacities = [];  // Tableau pour stocker l'opacité cible des images

    // Tableau de textes pour chaque rectangle
    let texts = []; // Array de 30 textes

    // Variables pour la gestion du texte dynamique
    let currentText = null;           // Texte actuellement affiché (objet avec title et descriptions)
    let textOpacity = 0;              // Opacité actuelle du texte
    let textTargetOpacity = 0;        // Opacité cible du texte

    // Variable pour stocker l'image actuellement affichée
    let currentImageIndex = -1;       // -1 signifie aucune image affichée

    // Variables pour gérer les opacités cibles
    let bgTargetOpacity = 200;        // Opacité cible du fond noir
    let rectTargetOpacity = 200;      // Opacité cible des rectangles blancs

    // Variables pour les tailles de police, l'espacement des lignes et l'écart titre-descriptions
    let titleSize = 24;               // Taille initiale du titre
    let descriptionSize = 18;         // Taille initiale des descriptions
    let description2Size = 14;        // Taille initiale des descriptions2
    let lineSpacing = 24;             // Espacement initial entre les lignes
    let lineSpacing2 = 20;             // Espacement initial entre les lignes
    let titleToDescriptionSpacing = 40; // Ecart initial entre le titre et les descriptions
    let description2YShift = 0; // Ajustement dynamique pour description2Y

    // Fonction pour calculer baseSize, spacing, les tailles de police, l'espacement des lignes et l'écart titre-descriptions en fonction de la largeur de la fenêtre
    function calculateSizes() {
        const initialWidth = 1600; // Largeur de référence pour baseSize et spacing
        let scaleFactor = p.width / initialWidth;

        // Ajuster baseSize et spacing proportionnellement à la largeur actuelle, en respectant les minima
        baseSize = p.max(30, 50 * scaleFactor);
        spacing = p.max(8, 20 * scaleFactor);

        // Ajuster les tailles de police proportionnellement, avec des minima
        titleSize = p.max(16, 24 * scaleFactor);
        descriptionSize = p.max(14, 18 * scaleFactor);
        description2Size = p.max(10, 14 * scaleFactor);

        // Ajuster l'espacement entre les lignes proportionnellement, avec un minimum de 15px
        lineSpacing = p.max(14, 24 * scaleFactor);
        lineSpacing2 = p.max(14, 20 * scaleFactor);

        // Ajuster l'écart entre le titre et les descriptions, avec un minimum de 20px
        titleToDescriptionSpacing = p.max(20, 40 * scaleFactor);

        // Ajuster l'écart pour description2Y, avec une augmentation jusqu'à 100px lorsque la fenêtre se rétrécit
        description2YShift = p.map(scaleFactor, 0, 1, 120, 0, true); // scaleFactor de 1 à 0, shift de 0 à 100


    }

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
            this.currentShiftY = 120; // Déplacement initial de 120 pixels vers le bas
            this.targetShiftY = 70; // Position finale décalée de 70 pixels sur l'axe Y
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

        // Initialiser les textes (Lorem Ipsum)
        for (let i = 1; i <= 30; i++) {

            if (i === 1) {
                texts.push({
                    title: `Relief ${i}`,  // Texte pour le titre
                    descriptions: [
                        `Description du point.`  // ligne 1
                    ],
                    descriptions2: [
                        `LEGENDE`,
                        `Fig(1): a,a' point situé dans l'angle antérieur supérieur,`,
                        `figuré par le coude d'une pièce de cuivre.`,
                        `Fig(2): a,a' point situé sur le mur,  au dessus du sol, et`,
                        `se confondant avec sa projection horizontale a`,
                        `Fig(3): a,a' point situé sur le sol,  en avant  du mur, et`,
                        `se confondant avec sa projection horizontale a`,
                        `Fig(4): a,a' point situé sur la ligne de  terre  et se con-`,
                        `fondant avec chacune de ses projections.`,
                        `Fig(5): a,a' point situé dans l'angle  antérieur inférieur`,
                        `figuré par le coude d'une pièce de cuivre.`,
                        `Fig(6): a,a' point situé  sur le mur,  au dessous  du sol.`,
                        `Le point vient en a'après le rabattement du plan verti-`,
                        `cal sur le plan horizontal. Dans l'espace,  il n'est autre `,
                        `que le trou 5.`,
                        `Fig(7): a,a' point situé dans l'angle postérieur supérieur`,
                        `figuré par le coude d'une pièce de cuivre.`,
                        `Fig(8): a,a' point sur  le sol derrière  le mur.  Ce point`,
                        `n'est  autre que le trou 2  avec lequel a coïncide après`,
                        `le rabattement du plan vertical.`,
                        `Fig(9): a,a' point situé dans l'angle postérieur inférieur,`,
                        `figuré par le coude d'une pièce de cuivre.`,
                        `Les projections sont les trous 1 et 4 avec lesquels a et `,
                        ` a' se confondent après le rabattement du plan vertical.`,
                    ],
                });
            }
            if (i === 2) {
                texts.push({
                    title: `Relief ${i}`,  // Texte pour le titre
                    descriptions: [
                        `Représentation de la droite. Tracés d'une droite.`,  // ligne 1
                        `Angle que fait une droite avec les plans de projection.`,  // ligne 2
                        `Distance de deux points.`  // ligne 3
                    ]
                });
            } 
            if (i === 3) {
                texts.push({
                    title: `Relief ${i}`,  // Texte pour le titre
                    descriptions: [
                        `Représentation de la droite (cas particulier).`  // ligne 1
                    ]
                });
            } 
            if (i === 4) {
                texts.push({
                    title: `Relief ${i}`,  // Texte pour le titre
                    descriptions: [
                        `Représentation de la droite (cas particulier).`  // ligne 1
                    ]
                });
            } 
            if (i === 5) {
                texts.push({
                    title: `Relief ${i}`,  // Texte pour le titre
                    descriptions: [
                        `Représentation du plan. Droite située dans un plan.`  // ligne 1
                    ]
                });
            } 

           
        }
    }

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

        // Détection du rectangle survolé
        let relMouseX = p.mouseX - p.width / 2;
        let relMouseY = p.mouseY - p.height / 2;
        let hoveredRect = null;

        // Détection du rectangle survolé (priorité à la première ligne)
        outerLoop:
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                let rect = rectangles[row * cols + col];
                let x = -((cols * (baseSize + spacing) - spacing) / 2) + baseSize / 2 + col * (baseSize + spacing);
                let y = -((rows * (baseSize + spacing) - spacing) / 2) + baseSize / 2 + row * (baseSize + spacing);

                // Garder le décalage +70 comme demandé
                let d = p.dist(relMouseX, relMouseY, x + rect.currentShiftX, y + rect.currentShiftY + 70);

                if (d < rect.currentSize / 2) { // Si la souris est sur le rectangle
                    hoveredRect = rect.number; // Stocker le numéro du rectangle survolé
                    break outerLoop; // Sortir des boucles une fois le premier survol détecté
                }
            }
        }

        // Définir les opacités cibles en fonction de l'état de survol
        if (hoveredRect !== null) {
            bgTargetOpacity = 0;
            rectTargetOpacity = 20;
        } else {
            bgTargetOpacity = 200;
            rectTargetOpacity = 200;
        }

        // Gestion des cibles de taille, de décalage et du positionnement pour maintenir l'espacement
        if (hoveredRect !== null) {
            let hoveredRectObj = rectangles.find(r => r.number === hoveredRect);
            if (hoveredRectObj) {
                rectangles.forEach(rect => {
                    if (rect.row === hoveredRectObj.row) {
                        if (rect.col < hoveredRectObj.col) {
                            rect.targetShiftX = -shiftOffsetX; // Déplacer à gauche
                        } else if (rect.col > hoveredRectObj.col) {
                            rect.targetShiftX = shiftOffsetX; // Déplacer à droite
                        } else {
                            rect.targetShiftX = 0; // Rectangle survolé reste centré
                        }
                    } else {
                        rect.targetShiftX = 0; // Autres lignes ne bougent pas
                    }

                    if (rect.number === hoveredRect) {
                        rect.targetSize = hoverSize; // Agrandir le rectangle survolé
                        if (rect.row === 0) {
                            rect.targetShiftY = 70 - shiftAmount; // Déplacer légèrement vers le haut
                        } else if (rect.row === 1) {
                            rect.targetShiftY = 70 + shiftAmount; // Déplacer légèrement vers le bas
                        }
                    } else {
                        rect.targetSize = baseSize; // Réinitialiser la taille des autres rectangles
                        rect.targetShiftY = 70; // Réinitialiser le décalage vertical
                    }

                    // Mettre à jour les propriétés pour des transitions fluides
                    rect.update();
                });
            }
        } else {
            // Aucun rectangle survolé, réinitialiser toutes les propriétés
            rectangles.forEach(rect => {
                rect.targetSize = baseSize; // Réinitialiser la taille
                rect.targetShiftX = 0; // Réinitialiser le décalage horizontal
                rect.targetShiftY = 70; // Réinitialiser le décalage vertical

                // Mettre à jour les propriétés pour des transitions fluides
                rect.update();
            });
        }

        // Interpoler les opacités vers les cibles
        bgOpacity = p.lerp(bgOpacity, bgTargetOpacity, fadeSpeed);
        rectOpacity = p.lerp(rectOpacity, rectTargetOpacity, fadeSpeed);

        // Gestion des images avec fade-in uniquement
        if (hoveredRect !== null) {
            let newImageIndex = hoveredRect - 1;

            if (currentImageIndex !== newImageIndex) {
                // Réinitialiser l'opacité de l'image précédente
                if (currentImageIndex !== -1) {
                    imageOpacities[currentImageIndex] = 0;
                }

                // Mettre à jour l'index de l'image actuelle
                currentImageIndex = newImageIndex;

                // Définir l'opacité cible pour l'image actuelle
                imageTargetOpacities[currentImageIndex] = 255;

                // Mettre à jour le texte actuel
                currentText = texts[currentImageIndex];
            }
        } else {
            // Aucune image n'est survolée, réinitialiser l'image actuelle
            if (currentImageIndex !== -1) {
                imageOpacities[currentImageIndex] = 0;
                currentImageIndex = -1;
            }

            // Réinitialiser le texte
            currentText = null;
        }

        // Mettre à jour les opacités des images en fonction des cibles
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

        // Dessiner le rectangle noir de fond avec opacité dynamique
        p.noStroke();
        p.fill(0, bgOpacity); // Noir avec opacité dynamique
        p.rect(0, 0, p.width, p.height); // Rectangle centré couvrant tout l'écran

        // Gestion du texte dynamique avec fade-in et fade-out
        if (hoveredRect !== null) {
            textTargetOpacity = 255; // Opacité cible pour le texte
        } else {
            textTargetOpacity = 0; // Opacité cible à 0 lorsque aucun rectangle n'est survolé
        }

        // Interpoler l'opacité du texte
        textOpacity = p.lerp(textOpacity, textTargetOpacity, 0.1);

        // Dessiner le texte en haut centre de l'écran avec l'opacité actuelle
        if (currentText && textOpacity > 0) {
            p.push();
            p.noStroke();
            p.fill(255, textOpacity); // Texte blanc avec opacité dynamique
            p.textFont(myFont);
            p.textAlign(p.CENTER, p.TOP);

            // Partie pour le titre (en gras italique et taille dynamique)
            p.textSize(titleSize);
            p.textStyle(p.BOLDITALIC);
            let titleY = -p.height / 2 + 20; // Positionner le titre
            p.text(currentText.title, 0, titleY);  

            // Partie pour les descriptions (en normal et taille dynamique)
            p.textSize(descriptionSize);
            p.textStyle(p.NORMAL);

            // Calculer la position Y initiale pour les descriptions
            let descriptionY = titleY + titleToDescriptionSpacing;  // Commencer après l'écart défini

            // Itérer sur le tableau des descriptions et les afficher
            currentText.descriptions.forEach(description => {
                p.text(description, 0, descriptionY);  // Afficher chaque ligne
                descriptionY += lineSpacing;  // Ajouter de l'espace entre les lignes
            });

            // Vérifier si descriptions2 existe et l'afficher
            if (currentText.descriptions2) {
                p.textSize(description2Size);
                // Définir une marge
                const margin = 400;

                // Calculer la position X pour descriptions2 (côté droit avec marge)
                let description2X = p.width / 2 - margin;

                // Réinitialiser la position Y pour descriptions2
                let description2Y = titleY + titleToDescriptionSpacing + description2YShift;  // Aligner avec le début des descriptions et ajouter l'ajustement


                // Aligner le texte à droite
                p.textAlign(p.LEFT, p.TOP);

                // Itérer sur le tableau des descriptions2 et les afficher
                currentText.descriptions2.forEach(description2 => {
                    p.text(description2, description2X, description2Y);  // Afficher chaque ligne
                    description2Y += lineSpacing2;  // Ajouter de l'espace entre les lignes
                });

                // Réinitialiser l'alignement pour éviter d'affecter d'autres textes
                p.textAlign(p.CENTER, p.TOP);
            }

            p.pop();
        }

        // Dessiner les rectangles après le fond et les images pour qu'ils restent visibles
        rectangles.forEach(rect => {
            // Calculer la position ajustée du rectangle
            let totalWidth = cols * (baseSize + spacing) - spacing;
            let totalHeight = rows * (baseSize + spacing) - spacing;
            let startX = -totalWidth / 2 + baseSize / 2;
            let startY = -totalHeight / 2 + baseSize / 2;
            let x = startX + rect.col * (baseSize + spacing) + rect.currentShiftX;
            let yPos = startY + rect.row * (baseSize + spacing) + rect.currentShiftY;

            // Dessiner le rectangle avec l'opacité actuelle des rectangles
            rect.draw(x, yPos, rectOpacity);
        });
    };

    // Fonction pour redimensionner le canvas lors du changement de taille de la fenêtre
    p.windowResized = function() {
        p.resizeCanvas(p.windowWidth, p.windowHeight);
        // Recalculer les tailles des rectangles, des polices, de l'espacement et de l'écart titre-descriptions
        calculateSizes();
        // Aucun recalcul supplémentaire nécessaire car les positions sont recalculées dynamiquement dans draw()
    };
};

// Initialiser le second sketch après le chargement de p5.js
if (typeof p5 !== 'undefined') {
    new p5(sketch2);
}
