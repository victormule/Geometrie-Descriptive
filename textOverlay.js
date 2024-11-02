// Initialiser le sketch textOverlay et le rendre globalement accessible
let textOverlay = new p5(function(sketch) {
    let opacity = 255; // Valeur initiale de l'opacité
    let fading = false; // Indicateur de démarrage de la réduction d'opacité
    let textCanvas;

    sketch.setup = function() {
        textCanvas = sketch.createCanvas(window.innerWidth, window.innerHeight);
        textCanvas.position(0, 0);
        textCanvas.style('z-index', '2');
        textCanvas.style('pointer-events', 'none');
    };

    sketch.draw = function() {
        sketch.clear();
        sketch.fill(255, 255, 255, opacity); // Appliquer l'opacité au texte

        // Titre centré en haut de l'écran
        sketch.textSize(32);
        sketch.textAlign(sketch.CENTER, sketch.TOP);
        sketch.text("Boite de Géometrie", sketch.width / 2, sketch.height / 8);

        // Calculer la largeur maximale de la description en fonction de la taille de l'écran
        let maxWidth;
        if (sketch.width > 1400) {
            maxWidth = sketch.width / 3; // Limite la description à un tiers de la largeur
        } else if (sketch.width < 600) {
            maxWidth = sketch.width * 0.9; // Étend la description pour presque toute la largeur
        } else {
            maxWidth = sketch.map(sketch.width, 600, 1400, sketch.width * 0.9, sketch.width / 3);
        }

        // Positionner la description sous le milieu de l'écran
        sketch.textSize(18);
        sketch.textAlign(sketch.LEFT, sketch.TOP);
        drawJustifiedText(
            "Cette boite date de 1880, elle fut très appréciée de son temps. Conçue pour les professeurs et étudiants en mathématiques, elle contient divers instruments de mesure et de géométrie qui ont résisté à l’épreuve du temps.",
            (sketch.width - maxWidth) / 2, // Centrer horizontalement en ajustant x
            sketch.height / 1.6, // Positionner sous le centre de l'écran
            maxWidth
        );

        // Réduire l'opacité si le fading est activé
        if (fading && opacity > 0) {
            opacity -= 5; // Diminue progressivement l'opacité
            if (opacity < 0) {
                opacity = 0; // Assurer que l'opacité ne passe pas en dessous de zéro
            }
        }
    };

    sketch.windowResized = function() {
        sketch.resizeCanvas(window.innerWidth, window.innerHeight);
    };

    // Fonction pour déclencher la réduction d'opacité depuis openBox1.js
    sketch.startFading = function() {
        fading = true;
    };

    // Fonction pour dessiner un texte justifié
    function drawJustifiedText(text, x, y, maxWidth) {
        let words = text.split(' ');
        let line = '';
        let lineHeight = 30;
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
            if (i === lines.length - 1 || lines[i + 1].length === 0) {
                // Dernière ligne, centrée
                sketch.text(lineText, x, y + i * lineHeight);
            } else {
                // Lignes justifiées
                let wordsInLine = lineText.split(' ');
                let lineWithoutSpaces = wordsInLine.join('');
                let totalSpaceWidth = maxWidth - sketch.textWidth(lineWithoutSpaces);
                let spaceWidth = totalSpaceWidth / (wordsInLine.length - 1);

                let offsetX = x;
                for (let j = 0; j < wordsInLine.length; j++) {
                    sketch.text(wordsInLine[j], offsetX, y + i * lineHeight);
                    offsetX += sketch.textWidth(wordsInLine[j]) + spaceWidth;
                }
            }
        }
    }
});
