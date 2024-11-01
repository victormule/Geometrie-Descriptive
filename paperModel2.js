// sketch2.js

const sketch2 = (p) => {
    let myFont; // Variable pour stocker la police
    let rectangles = []; // Tableau pour stocker les objets rectangles
    let rows = 3; // Nombre de lignes
    let cols = 10; // Nombre de colonnes
    let baseSize = 80; // Taille de base des rectangles (modifiable)
    let hoverSize = 90; // Taille des rectangles au survol
    let spacing = 24; // Espacement entre les rectangles (modifiable)
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
    let description3Size = 14;        // Taille initiale des descriptions3
    let description4Size = 14;        // Taille initiale des descriptions4
    let lineSpacing = 24;             // Espacement initial entre les lignes
    let lineSpacing2 = 20;            // Espacement initial entre les lignes pour descriptions2
    let lineSpacing3 = 18;            // Espacement initial entre les lignes pour descriptions3
    let lineSpacing4 = 18;            // Espacement initial entre les lignes pour descriptions4
    let titleToDescriptionSpacing = 40; // Ecart initial entre le titre et les descriptions
    let description2YShift = 0;       // Ajustement dynamique pour description2Y
    let description3YShift = 0;       // Ajustement dynamique pour description3Y
    let description4YShift = 0;       // Ajustement dynamique pour description4Y
    let lineWidth2; // Pour descriptions2
    let lineWidth3; // Pour descriptions3
    let lineWidth4; // Pour descriptions4
    let paragrapheSpacing2; // Pour descriptions2
    let paragrapheSpacing3; // Pour descriptions3
    let paragrapheSpacing4; // Pour descriptions4

        // Fonction pour déterminer l'orientation
    function isPortrait() {
        return p.windowHeight > p.windowWidth;
    }

function setGridBasedOnOrientation() {
        if (isPortrait()) {
            rows = 3;
            cols = 10;
        } else {
            rows = 2;
            cols = 15;
        }
    }

function setTargetShiftYBasedOnOrientation() {
        if (isPortrait()) {
            targetShiftY = -150; // Déplace les rectangles plus vers le bas en mode portrait
        } else {
            targetShiftY = 70; // Valeur par défaut pour le mode paysage
        }
    }
    
    // Fonction pour calculer baseSize, spacing, les tailles de police, l'espacement des lignes et l'écart titre-descriptions en fonction de la largeur de la fenêtre
    function calculateSizes() {
        const initialWidth = 1600; // Largeur de référence pour baseSize et spacing
        let scaleFactor = p.width / initialWidth;
        // Ajuster baseSize et spacing proportionnellement à la largeur actuelle, en respectant les minima

         setGridBasedOnOrientation();
        
        // Ajout d'ajustements basés sur l'orientation
        if (isPortrait()) {
            baseSize = p.max(70, 80 * scaleFactor);
            spacing = p.max(18, 24 * scaleFactor);
            hoverSize = 90;
        } else {
            baseSize = p.max(40, 50 * scaleFactor); // Exemple: plus grand en paysage
            spacing = p.max(14, 20 * scaleFactor);  // Exemple: plus grand en paysage
            hoverSize = 60;
        }


        // Ajuster les tailles de police proportionnellement, avec des minima
        if (isPortrait()) {
            titleSize = p.max(16, 24 * scaleFactor);
            descriptionSize = p.max(14, 18 * scaleFactor);
            description2Size = p.max(10, 14 * scaleFactor);
            description3Size = p.max(10, 14 * scaleFactor);
            description4Size = p.max(10, 14 * scaleFactor);
        } else {
            titleSize = p.max(18, 28 * scaleFactor); // Plus grand en paysage
            descriptionSize = p.max(16, 22 * scaleFactor); // Plus grand en paysage
            description2Size = p.max(12, 18 * scaleFactor); // Plus grand en paysage
            description3Size = p.max(12, 18 * scaleFactor); // Plus grand en paysage
            description4Size = p.max(12, 18 * scaleFactor); // Plus grand en paysage
        }

        // Ajuster l'espacement entre les lignes proportionnellement, avec un minimum de 15px
        lineSpacing = p.max(14, 24 * scaleFactor);
        lineSpacing2 = p.max(14, 20 * scaleFactor);
        lineSpacing3 = p.max(12, 18 * scaleFactor);
        lineSpacing4 = p.max(12, 18 * scaleFactor);

        // Ajuster l'écart entre le titre et les descriptions, avec un minimum de 20px
        titleToDescriptionSpacing = p.max(20, 40 * scaleFactor);

        // Ajuster l'écart pour description2Y, description3Y, et description4Y
        description2YShift = p.map(scaleFactor, 0, 1, 120, 0, true); // scaleFactor de 1 à 0, shift de 0 à 100
        description3YShift = p.map(scaleFactor, 0, 1, 120, 0, true); // scaleFactor de 1 à 0, shift de 0 à 100
        description4YShift = p.map(scaleFactor, 0, 1, 120, 0, true); // scaleFactor de 1 à 0, shift de 0 à 100

        // Calculer les largeurs de ligne
        lineWidth2 = p.max(270, 370 * scaleFactor);
        lineWidth3 = p.max(160, 230 * scaleFactor);
        lineWidth4 = p.max(160, 230 * scaleFactor);

        // Calculer les espacements des paragraphes
        paragrapheSpacing2 = p.max(300, 500 * scaleFactor);
        paragrapheSpacing3 = p.max(360, 550 * scaleFactor);
        paragrapheSpacing4 = p.max(180, 280 * scaleFactor);
    }

 // Fonction pour initialiser ou réinitialiser les rectangles
    function initializeRectangles() {
        rectangles = []; // Réinitialiser le tableau des rectangles
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                let number = row * cols + col + 1; // Numérotation de 1 à (rows * cols)
                rectangles.push(new Rectangle(row, col, number));
            }
        }
    }



    // Classe représentant un rectangle
    class Rectangle {
        constructor(row, col, number) {
            this.row = row;
            this.col = col;
            this.number = number;
    
            this.currentSize = baseSize;
            this.targetSize = baseSize;
    
            this.currentShiftX = 0;
            this.targetShiftX = 0;
    
            this.currentShiftY = 120;
            this.targetShiftY = targetShiftY; // Utilise la valeur modifiée selon l'orientation
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
                        `figuré par le coude d'une pièce de cuivre.         `,
                        `Fig(2): a,a' point situé sur le mur,  au dessus du sol, et`,
                        `se confondant avec sa projection horizontale a         `,
                        `Fig(3): a,a' point situé sur le sol,  en avant  du mur, et`,
                        `se confondant avec sa projection horizontale a         `,
                        `Fig(4): a,a' point situé sur la ligne de  terre  et se con-`,
                        `fondant avec chacune de ses projections.           `,
                        `Fig(5): a,a' point situé dans l'angle  antérieur inférieur`,
                        `figuré par le coude d'une pièce de cuivre.         `,
                        `Fig(6): a,a' point situé  sur le mur,  au dessous  du sol.`,
                        `Le point vient en a'après le rabattement du plan verti-`,
                        `cal sur le plan horizontal. Dans l'espace,  il n'est autre `,
                        `que le trou 5.                                       `,
                        `Fig(7): a,a' point situé dans l'angle postérieur supérieur`,
                        `figuré par le coude d'une pièce de cuivre.             `,
                        `Fig(8): a,a' point sur  le sol derrière  le mur.  Ce point`,
                        `n'est  autre que le trou 2  avec lequel a coïncide après`,
                        `le rabattement du plan vertical.                       `,
                        `Fig(9): a,a' point situé dans l'angle postérieur inférieur,`,
                        `figuré par le coude d'une pièce de cuivre.             `,
                        `Les projections sont les trous 1 et 4 avec lesquels a et `,
                        `a' se confondent après le rabattement du plan vertical.`,
                    ]
                });
            }
            if (i === 2) {
                texts.push({
                    title: `Relief ${i}`,  // Texte pour le titre
                    descriptions: [
                        `Représentation de la droite. Tracés d'une droite.`,  // ligne 1
                        `Angle que fait une droite avec les plans de projection.`,  // ligne 2
                        `Distance de deux points.`  // ligne 3
                    ],
                    descriptions2: [
                        `LEGENDE`,
                        `Représentation de la droite cd,c'd' droite représentée`,
                        `par ses deux projections,figurée par un fil noir`,
                        `Traces d'une droite d trace horizontale de la droite,`,
                        `c' trace verticale.                                `,
                        `Angles que fait une droite avec les plans de projection.`,
                        `C1 rabattement du point c' sur le sol.             `,
                        `C1d rabattement de la droite sur le même plan.`,
                        `cdC1 angle que fait le droite avec le plan horizontal.`,
                        `Autre Méthode d1 rabattement du point d sur le mur, par`,
                        `une rotation autour de cc'.                       `,
                        `c'd1 rabattement de la droite sur le même plan.`,
                        `c'd1c angle de la droite avec le plan horizontal.`,
                        `Distance de deux points: a,a' point donné, figuré par le`,
                        `coude d'une pièce de cuivre.                       `,
                        `b,b' autre point donné, également figuré par le coude`,
                        `d'une pièce de cuivre.                             `,
                        `cd,c'd' droite passant par les deux points.        `,
                        `A1 rabattement du point a,a' sur le sol par rotation`,
                        `autour de cd.                                      `,
                        `B1 rabattement du point bb' sur le même plan.`,
                        `A1B1 distance des deux points.                     `,
                        `Autre méthode. a'1 rabattement du point a,a' sur le mur,`,
                        `par une rotation autour de cc'.                    `,
                        `b1' rabattement du point b,b' sur le même plan.`,
                        `a'1b'1 distance des deux points.                  `,
                    ]
                });
            } 
            if (i === 3) {
                texts.push({
                    title: `Relief ${i}`,  // Texte pour le titre
                    descriptions: [
                        `Représentation de la droite (cas particulier).`  // ligne 1
                    ],
                    descriptions2: [
                        `LEGENDE`,
                        `Représentation de la droite: ab,a'b' droite passant`,
                        `par le point b de la ligne de terre, figurée par la`,
                        `branche libre d'un fil de fer.                 `,
                        `se confondant avec sa projection horizontale a`,
                        `Angles d'une droite avec les plans de projection:`,
                        `m,m' point pris sur la droite, figuré par le coude de`,
                        `la pièce de cuivre.                            `,
                        `M1 rabattement de ce point sur le plan horizontal.`,
                        `bM1 rabattement de la droite sur ce plan.`,
                        `mbM1 angle de la droite avec le même plan.`,
                        `M2 rabattement du point m,m' sur le plan vertical.`,
                        `bM2 rabattement de la droite sur ce plan.`,
                        `m'bM2 angle de la droite avec le même plan.`,
                    ]
                });
            } 
            if (i === 4) {
                texts.push({
                    title: `Relief ${i}`,  // Texte pour le titre
                    descriptions: [
                        `Représentation de la droite (cas particulier).`  // ligne 1
                    ],
                    descriptions3: [
                        `LEGENDE`,
                        `Fig(1): Droite perçant le mur au`, 
                        `dessus du sol et  le sol derrière`,
                        `le mur, figurée par une aiguille`,
                        `droite.`,
                        `a b,a'b' projections de la droite`,
                        `b' trace verticale de la droite,`,
                        `c trace horizontale ou plutôt la`,
                        `trace horizontale est le point 3`,
                        `avec laquel c coïncide, lorsqu'on`,
                        `rabat le plan vertical sur le plan`,
                        `horizontal.`,
                        `Fig(2): Droite située dans un plan`,
                        `de profil perçant le mur au dessus`,
                        `du sol, et le sol en avant du mur,`,
                        `figurée par une aiguille droite.`,
                        `m,m' et n,n' points donnés dans un`,
                        `plan de profil en déterminant la`,
                        `droite.`,
                        `M1 rabattement du point m,m' par`,
                        `une rotation autour de la trace`,
                        `horizontale du plan de profil`,
                        `(mM1 = a'u = a'm').            `,
                        `N1 rabattement du point n,n' par`,
                        `une rotation autour de la trace`,
                        `horizontale du plan de profil`,
                        `(nN1 = a'v = a'n').            `,
                        `M,N, rabattement de la droite`,
                        `passant par les deux points.`,
                        `a trace horizontale de la droite.`,
                        `B1 rabattement de latrace verticale`,
                        `de la droite.                   `,
                        `b trace verticale relevée.      `,
                        `a'aB1 angle de la droite et du plan`,
                        `horizontal.                     `,
                        `aB1a' angle de la droite et du plan`,
                        `vertical.                       `,

                    ],
                    descriptions4: [
                        `aa',a'b' projections de la droite`,
                        `(partie visible).                `,
                        `Fig(3): Droite située dans un plan`,
                        `de profil, perçant le mur au dessous`,
                        `du sol et le sol en avant du mur,`,
                        `figurée par une aiguille droite.`,
                        `a trace horizontale de la droite.`,
                        `c' trace verticale de la droite ou`,
                        `plutôt cette trace est le point 2 qui`,
                        `vient s'appliquer en C', lorsqu'on`,
                        `rabat le plan vertical sur le plan`,
                        `horizontal.                      `,
                        `Les deux traces a et c' determinent`,
                        `la droite.                       `,
                        `C'1 rabattement de la trace verticale`,
                        `de la droite.                     `,
                        `a'aC'1 angle de la droite et du plan`,
                        `horizontal.                       `,
                        `aC'1a' angle de la droite et du plan`,
                        `vertical.                        `,
                        `ab,a'b' projections de la droite`,
                        `(partie visible).                `,
                        `Fig(4): Droite perçant le sol en avant`,
                        `du mur et le mur au dessous du sol,`,
                        `figurée par une aiguille droite.`,
                        `ab,a'b' projections de la droite.`,
                        `a trace horizontale de la droite.`,
                        `c' trace verticale, ou plutôt la trace`,
                        `verticale est le point 1 qui vient`,
                        `coïncider avec c' lorsqu'on rabat le`,
                        `plan vertical sur le plan horizontal.`,
                    ]
                });
            } 
            if (i === 5) {
                texts.push({
                    title: `Relief ${i}`,  // Texte pour le titre
                    descriptions: [
                        `Représentation du plan. Droite située dans un plan.`  // ligne 1
                    ],
                    descriptions2: [
                        `LEGENDE`,
                        `Fig(1): APA'   plan donné.               `,
                        `PA trace horizontale du plan.                 `,
                        `cd,c'd' droite située dans le plan, figurée par`,
                        `un fil noir.                                   `,
                        `Fig(2) BQB', plan dont les traces sont en ligne`,
                        `droite lorsque le plan vertical est rabattu.   `,
                    ],
                });
            } 
            if (i === 6) {
                texts.push({
                    title: `Relief ${i}`,  // Texte pour le titre
                    descriptions: [
                        `Droites parallèles. Par un point faire passer un`,
                        `plan parallèle à un plan donné.`, 
                    ],
                    descriptions2: [
                        `LEGENDE`,
                        `Théorie: cd,c'd' et ef,e'f' droites parallèles.`,
                        `Problème: APA'   plan donné.              `,
                        `mm' poins donné, figuré par le coude de la`,
                        `pièce de cuivre.                            `,
                        `cd,c'd' droite prise arbitrairement dans le plan`,
                        `donné, figurée par un fil rouge              `,
                        `ef,e'f' droite parallèle à la précédente et passant`,
                        `par le point donné figurée par un fil rouge.`,
                        `BQB' plan parallèle au plan donné.         `,
                    ],
                });
            } 
            if (i === 7) {
                texts.push({
                    title: `Relief ${i}`,  // Texte pour le titre
                    descriptions: [
                        `Droites perpendiculaire à un plan`,
                    ],
                    descriptions2: [
                        `LEGENDE`,
                        `APA'   plan donné.                       `,
                        `mm' point donné, figuré par le coude de la pièce`,
                        `de cuivre.                                 `,
                        `bc,b'c' droite passant par le point et perpendiculaire`,
                        `au plan donné figurée par le branche libre du`,
                        `fil de fer.                                 `,
                    ],
                });
            } 
            if (i === 8) {
                texts.push({
                    title: `Relief ${i}`,  // Texte pour le titre
                    descriptions: [
                        `Horizontale d'un plan. Par un point`,
                        `mener un plan parallèle à un plan donné.`,
                    ],
                    descriptions2: [
                        `LEGENDE`,
                        `Théorie: dc,d'c' horizontal du plan BQB' figurée`,
                        `par la branche libre du fil de fer.        `,
                        `Problème APA' plan donné.                  `,
                        `m,m' point donné, figuré par le coude de la pièce`,
                        `dc,d'c' horizontale du plan cherché, passant par`,
                        `le point donné.                            `,
                        `BQB' plan parallèle au plan donné.         `,
                    ],
                });
            } 
            if (i === 9) {
                texts.push({
                    title: `Relief ${i}`,  // Texte pour le titre
                    descriptions: [
                        `Ligne de plus grands pente.`,
                    ],
                    descriptions2: [
                        `LEGENDE`,
                        `APA' plan donné                        `,
                        `m, m' point quelconque pris dans le plan, figuré`,
                        `par le coude de la pièce de cuivre.              `,
                        `Le fil noir est la ligne de plus grande pente. On`,
                        `veux démontrer qu'elle est perpendiculaire à PA.`,
                        `Le fil rouge ayant sa trace en d est une droite`, 
                        `quelconque prise dans le plan et passant par le`,
                        `point m, m.'                              `,
                        `Le fil rouge ayant se trace en d, et la même droite`,
                        `après sa rotation autour de la branche libre du fil`,
                        `de cuivre.                                  `,
                        `On voit que la portion des fils rouges comprise entre`,
                        `le point M de l'espace et le plan horizontal en plus`,
                        `grande que la portion correspondante du fil noir,`,
                        `ce qui démontre le théorème.               `,
                    ],
                    
                });
            } 
            if (i === 10) {
                texts.push({
                    title: `Relief ${i}`,  // Texte pour le titre
                    descriptions: [
                        `Rotation d'un point autour d'un axe perpendiculaire`,
                        `au plan vertical de projection autour d'un axe vertical.`,
                    ],
                    descriptions2: [
                        `LEGENDE`,
                        `Fig(1): Rotation d'un point situé dans un plan de profil,`,
                        `autour de la trace horizontale de celui-ci.`,
                        `m, m' point donné dans le plan de profil, la trace`,
                        `horizontale de ce plan se confond avec a b.`,
                        `m2 point rabattu sur le plan horizontal`,
                        `(mm2 = am2' = am').                          `,
                        `Rotation d'un point situé dans un plan de profil, autour`, 
                        `d'une horizontale de ce plan.                   `,
                        `a' trace verticale de l'horizontale donnée figurée par`,
                        `le fil de fer.                              `,
                        `ab projection horizontale de la même droite.`,
                        `m,m' point donné, figuré par le coude de la pièce`,
                        `de cuivre                                  `,
                        `m1,m1' projection nouvelles du point, après une`,
                        `rotation de 90°.                               `,
                        `Fig(2): Rotation d'un point autour d'un axe vertical.`,
                        `a trace horizontale de l'axe; lequel est figuré par`,
                        `le fil de fer.                                 `,
                        `a'b' projections nouvelles du point quand il a tourné`,
                        `de l'angle m a m1.                             `,
                        `m2, m2' projection nouvelles du point quand il s'est`,
                        `placé dans un plan parallèle au plan vertical et`,
                        `passant par l'axe donné.                       `,
                    ],
                    
                });
            } 
            if (i === 11) {
                texts.push({
                    title: `Relief ${i}`,  // Texte pour le titre
                    descriptions: [
                        `Rotation d'un point autour d'un axe situé`,
                        `dans le plan horizontal de projection.`,
                    ],
                    descriptions2: [
                        `LEGENDE`,
                        `ab axe donné, situé dans leplan horizontal.`,
                        `m, m' point donné, figuré par le coude de la`,
                        `pièce de cuivre.                           `,
                        `M1 rabattement du point sur le plan horizontal par`,
                        `une rotation autour de mn perpendiculaire à`,
                        `ab (mM1 = ms = uv = um').                       `,
                        `M2 rabattement du point sur le plan horizontal,`, 
                        `par une rotation autour de ab (nM2 = nM1).`,
                    ],
                    
                });
            } 
            if (i === 12) {
                texts.push({
                    title: `Relief ${i}`,  // Texte pour le titre
                    descriptions: [
                        `Rabattement d'un plan vertical.`,
                    ],
                    descriptions2: [
                        `LEGENDE`,
                        `APA'  plan donné perpendiculaire au plan horizontal.`,
                        `cP,c'd' projections d'une droite située dans le plan,`,
                        `figurée par un fil noir.                       `,
                        `cP,e'f' projections d'une horizontale du plan, figurée`,
                        `par le fil de fer.                             `,
                        `m,m' point situé dans le plan, figuré par le coude.`,
                        `du fil de cuivre.                              `, 
                        `PA1' rabattement de la trace verticale PA' du plan,`,
                        `par une rotation autour de PA.             `,
                        `M1 rabattement du point m,m' (mM1 = Ps = Pv = um')`,
                        `cD1 rabattement de la droite dont les projections`,
                        `sont cP,c'd'.                                  `,
                        `E1F1 rabattement de l'horizontale du plan.     `,
                    ],
                    
                });
            } 
            if (i === 13) {
                texts.push({
                    title: `Relief ${i}`,  // Texte pour le titre
                    descriptions: [
                        `Rabattement d'un plan quelconque.`,
                    ],
                    descriptions2: [
                        `LEGENDE`,
                        `APA' plan donné.                           `,
                        `m,m' point du plan, figuré par le coude du`,
                        `fil de cuivre.                            `,
                        `bc,b'c' horizontale du plan, figurée par le de fer.`,
                        `gd,g'd' droit située dans le plan, figurée par`,
                        `le fil noir.                               `,
                        `E1 rabattement du point e' par une rotation autour`, 
                        `de ef perpendiculaire à PA (eE1 = ce'),`,
                        `E2 rabattement du point e' par une rotation autour de`,
                        `PA (fE2 = fE1).                            `,
                        `PA1 rabattement de la trace verticale PA' du plan.`,
                        `B1C1 rabattement de l'horizontale du plan.`,
                        `M1 rabattement du point m,m' par une rotation autour de`,
                        `m n perpendiculaire à PA (mM1 = mr =uv = um').`,
                        `M2 rabattement du point m,m' par une rotation autour`,
                        `de PA (nM2 = nM1).                            `,
                        `G1d rabattement de la droite gd,g'd'.`,
                    ],
                    
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
        setTargetShiftYBasedOnOrientation(); // Ajuste le décalage vertical basé sur l'orientation
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
         initializeRectangles();
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
            bgTargetOpacity = 20;
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
                const margin = paragrapheSpacing2;
                let description2X = p.width / 2 - margin;

                let description2Y = titleY + titleToDescriptionSpacing + description2YShift ;

                // Aligner le texte à gauche
                p.textAlign(p.LEFT, p.TOP);

                currentText.descriptions2.forEach(line => {
                    // Split the line into words
                    let words = line.split(' ');

                    // Calculate total width of words
                    let totalWordsWidth = words.reduce((sum, word) => sum + p.textWidth(word), 0);

                    // Calculate the number of spaces
                    let numberOfSpaces = words.length - 1;

                    // Maximum line width is lineWidth2
                    let lineWidth = lineWidth2;

                    // If total words width is greater than lineWidth, we need to handle it
                    if (totalWordsWidth > lineWidth) {
                        // Scale down the font size or wrap the text
                        // For simplicity, we'll draw the text normally
                        p.text(line, description2X, description2Y);
                    } else {
                        let extraSpace = lineWidth - totalWordsWidth;

                        let spaceWidth = numberOfSpaces > 0 ? extraSpace / numberOfSpaces : 0;

                        // Start drawing words
                        let x = description2X;

                        words.forEach((word, index) => {
                            p.text(word, x, description2Y);
                            x += p.textWidth(word);
                            if (index < words.length - 1) {
                                x += spaceWidth;
                            }
                        });
                    }

                    description2Y += lineSpacing2;
                });

                // Réinitialiser l'alignement pour éviter d'affecter d'autres textes
                p.textAlign(p.CENTER, p.TOP);
            }

            // Vérifier si descriptions3 existe et l'afficher
            if (currentText.descriptions3) {
                p.textSize(description3Size);
                const margin = paragrapheSpacing3;
                let description3X = p.width / 2 - margin;

                let description3Y = titleY + titleToDescriptionSpacing + description3YShift;

                // Aligner le texte à gauche
                p.textAlign(p.LEFT, p.TOP);

                currentText.descriptions3.forEach(line => {
                    // Split the line into words
                    let words = line.split(' ');

                    // Calculate total width of words
                    let totalWordsWidth = words.reduce((sum, word) => sum + p.textWidth(word), 0);

                    // Calculate the number of spaces
                    let numberOfSpaces = words.length - 1;

                    // Maximum line width is lineWidth3
                    let lineWidth = lineWidth3;

                    // If total words width is greater than lineWidth, we need to handle it
                    if (totalWordsWidth > lineWidth) {
                        // Scale down the font size or wrap the text
                        // For simplicity, we'll draw the text normally
                        p.text(line, description3X, description3Y);
                    } else {
                        let extraSpace = lineWidth - totalWordsWidth;

                        let spaceWidth = numberOfSpaces > 0 ? extraSpace / numberOfSpaces : 0;

                        // Start drawing words
                        let x = description3X;

                        words.forEach((word, index) => {
                            p.text(word, x, description3Y);
                            x += p.textWidth(word);
                            if (index < words.length - 1) {
                                x += spaceWidth;
                            }
                        });
                    }

                    description3Y += lineSpacing3;
                });

                p.textAlign(p.CENTER, p.TOP);
            }

            // Vérifier si descriptions4 existe et l'afficher
            if (currentText.descriptions4) {
                p.textSize(description4Size);
                const margin = paragrapheSpacing4;
                let description4X = p.width / 2 - margin;

                let description4Y = titleY + titleToDescriptionSpacing + description4YShift + lineSpacing3 - 1;

                // Aligner le texte à gauche
                p.textAlign(p.LEFT, p.TOP);

                currentText.descriptions4.forEach(line => {
                    // Split the line into words
                    let words = line.split(' ');

                    // Calculate total width of words
                    let totalWordsWidth = words.reduce((sum, word) => sum + p.textWidth(word), 0);

                    // Calculate the number of spaces
                    let numberOfSpaces = words.length - 1;

                    // Maximum line width is lineWidth4
                    let lineWidth = lineWidth4;

                    // If total words width is greater than lineWidth, we need to handle it
                    if (totalWordsWidth > lineWidth) {
                        // Scale down the font size or wrap the text
                        // For simplicity, we'll draw the text normally
                        p.text(line, description4X, description4Y);
                    } else {
                        let extraSpace = lineWidth - totalWordsWidth;

                        let spaceWidth = numberOfSpaces > 0 ? extraSpace / numberOfSpaces : 0;

                        // Start drawing words
                        let x = description4X;

                        words.forEach((word, index) => {
                            p.text(word, x, description4Y);
                            x += p.textWidth(word);
                            if (index < words.length - 1) {
                                x += spaceWidth;
                            }
                        });
                    }

                    description4Y += lineSpacing4;
                });

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
        setGridBasedOnOrientation();
        setTargetShiftYBasedOnOrientation(); // Ajuste le décalage vertical basé sur l'orientation
        initializeRectangles();
        // Aucun recalcul supplémentaire nécessaire car les positions sont recalculées dynamiquement dans draw()
    };
};

// Initialiser le second sketch après le chargement de p5.js
if (typeof p5 !== 'undefined') {
    new p5(sketch2);
}
