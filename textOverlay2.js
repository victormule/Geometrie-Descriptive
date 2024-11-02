// Initialiser le sketch textOverlay et le rendre globalement accessible
let textOverlay2 = new p5(function(sketch) {
    let opacity = 255; // Valeur initiale de l'opacité du texte
    let fading = false; // Indicateur de démarrage de la réduction d'opacité
    let textCanvas;
    let customFont; // Variable pour la police personnalisée
    let logo; // Variable pour l'image du logo

    // Variables dynamiques pour les tailles de police
    let titleFontSize, subtitle1FontSize, subtitle2FontSize, subtitle3FontSize, authorFontSize;

    // Variables dynamiques pour les positions Y
    let titleY, subtitle1Y, subtitle2Y, subtitle3Y, authorY;

    // Variable pour l'espacement des lignes (si nécessaire)
    let subtitleSpacing;

    // Variable pour suivre l'orientation actuelle
    let currentOrientation = 'portrait'; // Initialisation par défaut

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
        currentOrientation = isPortrait() ? 'portrait' : 'landscape';
        if (currentOrientation === 'portrait') {
            setPortraitLayout();
        } else {
            setLandscapeLayout();
        }
    };

    // Fonction pour déterminer l'orientation
    function isPortrait() {
        return window.innerHeight > window.innerWidth;
    }

    // Fonction pour ajuster le layout en fonction de l'orientation
    function adjustLayout() {
        let newOrientation = isPortrait() ? 'portrait' : 'landscape';
        if (newOrientation !== currentOrientation) {
            currentOrientation = newOrientation;
            if (currentOrientation === 'portrait') {
                setPortraitLayout();
            } else {
                setLandscapeLayout();
            }
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
        subtitle1FontSize = 50;
        subtitle2FontSize = 40;
        subtitle3FontSize = 38;
        authorFontSize = 38;
        lineHeight = 40;

        // Définir l'espacement entre les sous-titres
        subtitleSpacing = 60;

        // Positions des textes
        titleY = sketch.height / 10 - 20;
        subtitle1Y = sketch.height / 10 + 100;
        subtitle2Y = subtitle1Y + subtitleSpacing;
        subtitle3Y = subtitle2Y + subtitleSpacing;
        authorY = subtitle3Y ;
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
        titleFontSize = 32;
        subtitle1FontSize = 36;
        subtitle2FontSize = 28;
        subtitle3FontSize = 24;
        authorFontSize = 24;
        lineHeight = 24;

        // Définir l'espacement entre les sous-titres
        subtitleSpacing = 40;

        // Positions des textes
        titleY = sketch.height / 10 - 32;
        subtitle1Y = sketch.height / 8;
        subtitle2Y = subtitle1Y + subtitleSpacing;
        subtitle3Y = subtitle2Y + subtitleSpacing;
        authorY = subtitle3Y + subtitleSpacing;
    }

    // Fonction de rendu
    sketch.draw = function() {
        sketch.clear();
        sketch.fill(255, 255, 255, opacity); // Appliquer l'opacité au texte

        // Définir les tailles et positions en fonction de l'orientation seulement si elle a changé
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
        // Titre principal centré en haut de l'écran
        sketch.textSize(titleFontSize);
        sketch.textAlign(sketch.CENTER, sketch.TOP);
        sketch.text("MÉTHODE NOUVELLE", sketch.width / 2, titleY);
        
        // Sous-titre 1 centré en haut de l'écran
        sketch.textSize(subtitle1FontSize);
        sketch.text("DE LA ", sketch.width / 2, subtitle1Y);

        // Sous-titre 2 centré en haut de l'écran
        sketch.textSize(subtitle2FontSize);
        sketch.text("GÉOMÉTRIE DESCRIPTIVE", sketch.width / 2, subtitle2Y);

        // Autre sous-titre centré
        sketch.textSize(subtitle3FontSize);
        sketch.text("COLLECTION DE RELIEFS", sketch.width / 2, subtitle3Y);
        
        // Auteur centré
        sketch.textSize(authorFontSize);
        sketch.text("A. JULLIEN", sketch.width / 2, authorY);

        // Calculer la largeur maximale de la description en fonction de la taille de l'écran et de l'orientation
        let maxWidthDesc;
        if (isPortrait()) {
            maxWidthDesc = sketch.width * 0.9; // Plus large en portrait
        } else {
            maxWidthDesc = sketch.width / 1.6; // Limite la description à 1.6ème de la largeur en paysage
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
