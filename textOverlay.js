// Initialiser le sketch textOverlay et le rendre globalement accessible
let textOverlay = new p5(function(sketch) {
    let opacity = 255; // Valeur initiale de l'opacité du texte
    let fading = false; // Indicateur de démarrage de la réduction d'opacité
    let textCanvas;
    let customFont; // Variable pour la police personnalisée
    let logo; // Variable pour l'image du logo
    let logoSizeY = 150; // Hauteur initiale du logo
    let logoSizeX = 200; // Largeur initiale du logo

    // Précharger la police personnalisée et l'image du logo
    sketch.preload = function() {
        customFont = sketch.loadFont('fonts/OldNewspaperTypes.ttf');
        logo = sketch.loadImage('assets/logo.png'); // Charger le logo
    };

    // Configuration initiale du sketch
    sketch.setup = function() {
        textCanvas = sketch.createCanvas(window.innerWidth, window.innerHeight);
        textCanvas.position(0, 0);
        textCanvas.style('z-index', '2');
        textCanvas.style('pointer-events', 'none');
        sketch.textFont(customFont); // Appliquer la police une fois chargée
    };

    // Fonction de rendu
    sketch.draw = function() {
        sketch.clear();
        sketch.fill(255, 255, 255, opacity); // Appliquer l'opacité au texte

        // Calculer les paramètres du logo en fonction de la taille de l'écran
        let minWidth = 600;
        let maxWidth = 1400;
        let logoMinSizeX = 100;
        let logoMaxSizeX = 250;
        let logoMinSizeY = 75;
        let logoMaxSizeY = 180;
        let logoMinOpacity = 10;
        let logoMaxOpacity = 200;

        let currentWidth = sketch.width;
        // Limiter la largeur actuelle entre minWidth et maxWidth
        if (currentWidth > maxWidth) currentWidth = maxWidth;
        if (currentWidth < minWidth) currentWidth = minWidth;

        // Calculer le ratio de taille basé sur la largeur actuelle
        let sizeRatio = sketch.map(currentWidth, minWidth, maxWidth, 0, 1);

        // Calculer la taille actuelle du logo
        let currentLogoSizeX = sketch.lerp(logoMinSizeX, logoMaxSizeX, sizeRatio);
        let currentLogoSizeY = sketch.lerp(logoMinSizeY, logoMaxSizeY, sizeRatio);

        // Calculer l'opacité actuelle du logo
        let currentLogoOpacity = sketch.lerp(logoMinOpacity, logoMaxOpacity, sizeRatio);

        // Appliquer l'opacité au logo en utilisant tint
        sketch.tint(255, currentLogoOpacity);
        // Afficher le logo en haut à gauche avec les dimensions spécifiées
        sketch.image(logo, 60, 20, currentLogoSizeX, currentLogoSizeY); // Positionner et redimensionner le logo
        // Réinitialiser le tint pour éviter d'affecter d'autres éléments
        sketch.noTint();

        // Titre centré en haut de l'écran
        sketch.textSize(28);
        sketch.textAlign(sketch.CENTER, sketch.TOP);
        sketch.text("MÉTHODE NOUVELLE", sketch.width / 2, sketch.height / 10 - 32);
        
        // Sous-titre centré en haut de l'écran
        sketch.textSize(32);
        sketch.textAlign(sketch.CENTER, sketch.TOP);
        sketch.text("DE LA ", sketch.width / 2, sketch.height / 10);

        // Sous-titre centré en haut de l'écran
        sketch.textSize(32);
        sketch.textAlign(sketch.CENTER, sketch.TOP);
        sketch.text("GÉOMÉTRIE DESCRIPTIVE", sketch.width / 2, sketch.height / 10 + 40);

        // Autre sous-titre centré
        sketch.textSize(22);
        sketch.textAlign(sketch.CENTER, sketch.TOP);
        sketch.text("COLLECTION DE RELIEFS", sketch.width / 2, sketch.height / 10 + 80);
        
        // Auteur centré
        sketch.textSize(18);
        sketch.textAlign(sketch.CENTER, sketch.TOP);
        sketch.text("A. JULLIEN", sketch.width / 2, sketch.height / 10 + 120);

        // Calculer la largeur maximale de la description en fonction de la taille de l'écran
        let maxWidthDesc;
        if (sketch.width > 1400) {
            maxWidthDesc = sketch.width / 3; // Limite la description à un tiers de la largeur
        } else if (sketch.width < 600) {
            maxWidthDesc = sketch.width * 0.9; // Étend la description pour presque toute la largeur
        } else {
            maxWidthDesc = sketch.map(sketch.width, 600, 1400, sketch.width * 0.9, sketch.width / 3);
        }

        // Positionner la description sous le milieu de l'écran
        sketch.textSize(18);
        sketch.textAlign(sketch.LEFT, sketch.TOP);
        drawJustifiedText(
                        " Cette boîte contient une collection de reliefs à pièces mobiles, récompensée par un diplôme de mérite lors de l'Exposition Universelle de Vienne en 1873. Elle renferme 32 cartons, 118 pièces métalliques et une notice explicative destinée aux candidats au Baccalauréat des sciences, ainsi qu'aux aspirants aux Écoles Navale et des Beaux-Arts.\nCe matériel pédagogique témoigne d'un ancien savoir-faire et d'une grande précision dans sa réalisation.\n\nOuvrez la boîte pour en apprendre davantage",
            (sketch.width - maxWidthDesc) / 2, // Centrer horizontalement en ajustant x
            sketch.height / 1.6, // Positionner sous le centre de l'écran
            maxWidthDesc
        );

        // Réduire l'opacité si le fading est activé
        if (fading && opacity > 0) {
            opacity -= 5; // Diminue progressivement l'opacité
            if (opacity < 0) {
                opacity = 0; // Assurer que l'opacité ne passe pas en dessous de zéro
            }
        }
    };

    // Gestion du redimensionnement de la fenêtre
    sketch.windowResized = function() {
        sketch.resizeCanvas(window.innerWidth, window.innerHeight);
    };

    // Fonction pour déclencher la réduction d'opacité depuis openBox1.js
    sketch.startFading = function() {
        fading = true;
    };

    // Fonction pour dessiner un texte justifié avec gestion des sauts de ligne
    function drawJustifiedText(text, x, y, maxWidth) {
        let paragraphs = text.split('\n');
        let lineHeight = 30;
        let currentY = y;

        paragraphs.forEach(paragraph => {
            let words = paragraph.split(' ');
            let line = '';
            let lines = [];

            // Construire les lignes de texte en ajustant à maxWidth
            for (let i = 0; i < words.length; i++) {
                let testLine = line + words[i] + ' ';
                let testWidth = sketch.textWidth(testLine);
                if (testWidth > maxWidth && i > 0) {
                    lines.push(line.trim());
                    line = words[i] + ' ';
                } else {
                    line = testLine;
                }
            }
            lines.push(line.trim()); // Ajouter la dernière ligne

            // Dessiner chaque ligne en centrant ou en justifiant
            for (let i = 0; i < lines.length; i++) {
                let lineText = lines[i];
                if (i === lines.length - 1) {
                    // Dernière ligne du paragraphe, centrée
                    sketch.text(lineText, x, currentY + i * lineHeight);
                } else {
                    // Lignes justifiées
                    let wordsInLine = lineText.split(' ');
                    if (wordsInLine.length === 1) {
                        // Si une seule mot dans la ligne, centrer
                        sketch.text(lineText, x, currentY + i * lineHeight);
                        continue;
                    }
                    let lineWithoutSpaces = wordsInLine.join('');
                    let totalSpaceWidth = maxWidth - sketch.textWidth(lineWithoutSpaces);
                    let spaceWidth = totalSpaceWidth / (wordsInLine.length - 1);

                    let offsetX = x;
                    for (let j = 0; j < wordsInLine.length; j++) {
                        sketch.text(wordsInLine[j], offsetX, currentY + i * lineHeight);
                        offsetX += sketch.textWidth(wordsInLine[j]) + spaceWidth;
                    }
                }
            }

            currentY += lines.length * lineHeight + 10; // Ajouter un espacement entre les paragraphes
        });
    }
});
