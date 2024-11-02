// Initialiser le sketch textOverlay et le rendre globalement accessible
let textOverlay2 = new p5(function(sketch) {
    let opacity = 255; // Valeur initiale de l'opacité du texte
    let fading = false; // Indicateur de démarrage de la réduction d'opacité
    let textCanvas;
    let customFont; // Variable pour la police personnalisée
    let logo; // Variable pour l'image du logo

    // Variables dynamiques pour les tailles de police et l'espacement des lignes
    let titleFontSize, subtitleFontSize, descriptionFontSize, authorFontSize;
    let lineHeight;

    // Précharger la police personnalisée et l'image du logo
    sketch.preload = function() {
        customFont = sketch.loadFont('fonts/OldNewspaperTypes.ttf');
        logo = sketch.loadImage('assets/logo.png'); // Charger le logo
    };

    // Configuration initiale du sketch
    sketch.setup = function() {
        textCanvas = sketch.createCanvas(window.innerWidth, window.innerHeight);
        textCanvas.position(0, 0);
        textCanvas.style('z-index', '3'); // Assurer que ce canvas est au-dessus des autres
        textCanvas.style('pointer-events', 'none');
        sketch.textFont(customFont); // Appliquer la police une fois chargée

        // Initialiser le layout en fonction de l'orientation initiale
        adjustLayout();
    };

    // Fonction pour déterminer l'orientation
    function isPortrait() {
        return window.innerHeight > window.innerWidth;
    }

    // Fonction pour ajuster le layout en fonction de l'orientation
    function adjustLayout() {
        if (isPortrait()) {
            setPortraitLayout();
        } else {
            setLandscapeLayout();
        }
    }

    // Fonction pour définir le layout en mode portrait
    function setPortraitLayout() {
        // Taille et position du logo
        let logoSizeX = sketch.map(sketch.width, 600, 1400, 100, 250); // Ajuster dynamiquement
        let logoSizeY = sketch.map(sketch.width, 600, 1400, 75, 180);
        let logoX = 100;
        let logoY = 40;

        // Appliquer le tint et dessiner le logo
        let sizeRatio = sketch.map(sketch.width, 600, 1400, 0, 1);
        let currentLogoOpacity = sketch.lerp(10, 200, sizeRatio);
        sketch.tint(255, currentLogoOpacity);
        sketch.image(logo, logoX, logoY, logoSizeX, logoSizeY); // Positionner et redimensionner le logo
        sketch.noTint();

        // Définir les tailles de texte pour le portrait
        titleFontSize = 46;
        subtitleFontSize = 50;
        descriptionFontSize = 40;
        authorFontSize = 38;
        lineHeight = 50;

        // Positions des textes
        sketch.titleY = sketch.height / 10 - 20;
        sketch.subtitleY = sketch.height / 8 + 10;
        sketch.descriptionY = sketch.height / 1.3;
    }

    // Fonction pour définir le layout en mode paysage
    function setLandscapeLayout() {
        // Taille et position du logo
        let logoSizeX = sketch.map(sketch.width, 600, 1400, 100, 250); // Ajuster dynamiquement
        let logoSizeY = sketch.map(sketch.width, 600, 1400, 75, 180);
        let logoX = 60;
        let logoY = 20;

        // Appliquer le tint et dessiner le logo
        let sizeRatio = sketch.map(sketch.width, 600, 1400, 0, 1);
        let currentLogoOpacity = sketch.lerp(10, 200, sizeRatio);
        sketch.tint(255, currentLogoOpacity);
        sketch.image(logo, logoX, logoY, logoSizeX, logoSizeY); // Positionner et redimensionner le logo
        sketch.noTint();

        // Définir les tailles de texte pour le paysage
        titleFontSize = 28;
        subtitleFontSize = 30;
        descriptionFontSize = 18;
        authorFontSize = 14;
        lineHeight = 20;

        // Positions des textes
        sketch.titleY = sketch.height / 10 - 32;
        sketch.subtitleY = sketch.height / 8;
        sketch.descriptionY = sketch.height / 1.3;
    }

    // Fonction de rendu
    sketch.draw = function() {
        sketch.clear();
        sketch.fill(255, 255, 255, opacity); // Appliquer l'opacité au texte

        // Définir les tailles et positions en fonction de l'orientation
        adjustLayout();

        // Dessiner le texte
        drawTextContent();

        // Réduire l'opacité si le fading est activé
        if (fading && opacity > 0) {
            opacity -= 5; // Diminue progressivement l'opacité
            if (opacity < 0) {
                opacity = 0; // Assurer que l'opacité ne passe pas en dessous de zéro
            }
        }
    };

    // Fonction pour dessiner le contenu textuel
    function drawTextContent() {
        // Titre centré en haut de l'écran
        sketch.textSize(titleFontSize);
        sketch.textAlign(sketch.CENTER, sketch.TOP);
        sketch.text("MÉTHODE NOUVELLE", sketch.width / 2, sketch.titleY);
        
        // Sous-titre centré en haut de l'écran
        sketch.textSize(subtitleFontSize);
        sketch.text("DE LA ", sketch.width / 2, sketch.subtitleY);

        // Sous-titre centré en haut de l'écran
        sketch.text("GÉOMÉTRIE DESCRIPTIVE", sketch.width / 2, sketch.subtitleY + 40);

        // Autre sous-titre centré
        sketch.textSize(descriptionFontSize);
        sketch.text("COLLECTION DE RELIEFS", sketch.width / 2, sketch.subtitleY + 80);
        
        // Auteur centré
        sketch.textSize(authorFontSize);
        sketch.text("A. JULLIEN", sketch.width / 2, sketch.subtitleY + 120);

        // Calculer la largeur maximale de la description en fonction de la taille de l'écran et de l'orientation
        let maxWidthDesc;
        if (isPortrait()) {
            maxWidthDesc = sketch.width * 0.9; // Plus large en portrait
        } else {
            maxWidthDesc = sketch.width / 3; // Limite la description à un tiers de la largeur en paysage
        }

        // Positionner la description sous le milieu de l'écran
        sketch.textAlign(sketch.LEFT, sketch.TOP);
        drawJustifiedText(
            "Cette boite date de 1880, elle fut très appréciée de son temps. Conçue pour les professeurs et étudiants en mathématiques, elle contient divers instruments de mesure et de géométrie qui ont résisté à l’épreuve du temps.\n\nOuvrez la boîte pour en savoir plus.",
            (sketch.width - maxWidthDesc) / 2, // Centrer horizontalement en ajustant x
            sketch.descriptionY, // Positionner sous le centre de l'écran
            maxWidthDesc
        );
    }

    // Gestion du redimensionnement de la fenêtre
    sketch.windowResized = function() {
        sketch.resizeCanvas(window.innerWidth, window.innerHeight);
        adjustLayout(); // Réajuster le layout après redimensionnement
    };

    // Fonction pour déclencher la réduction d'opacité depuis openBox1.js
    sketch.startFading = function() {
        fading = true;
    };

    // Fonction pour dessiner un texte justifié avec gestion des sauts de ligne
    function drawJustifiedText(text, x, y, maxWidth) {
        let paragraphs = text.split('\n');
        let currentY = y;

        paragraphs.forEach(paragraph => {
            if (paragraph.trim() === "") {
                // Ajouter un espacement supplémentaire pour les paragraphes vides (sauts de ligne multiples)
                currentY += lineHeight;
                return;
            }

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
                        // Si un seul mot dans la ligne, centrer
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

