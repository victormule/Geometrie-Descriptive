// Variables globales pour les réglages
let borderThickness = 1;    // Épaisseur du cadre noir
let numberSize = 18;        // Taille du texte des numéros
let numberOffsetZ = 1;      // Décalage en Z pour les numéros afin d'éviter le z-fighting

// Classe pour gérer chaque rectangle avec numéro et cadre
class RectangleItem {
  constructor(x, y, number) { // Ajout du paramètre 'number'
    this.x = x + 10;               // Position en X (ajustée)
    this.y = y - 50;               // Position en Y initiale
    this.initialY = y;             // Position Y de départ
    this.targetY = y - 100;        // Position Y cible après animation (100 pixels vers le haut)
    this.opacity = 0;              // Opacité initiale
    this.targetOpacity = 200;      // Opacité cible
    this.isAnimating = false;      // Indique si l'animation est en cours
    this.number = number;          // Numéro du rectangle

    // Créer une texture avec le numéro
    this.numberGraphics = createGraphics(40, 30); // Taille ajustée pour le numéro
    this.numberGraphics.clear();                     // Rendre le fond transparent
    this.numberGraphics.textAlign(CENTER, CENTER);
    this.numberGraphics.textSize(numberSize);
    this.numberGraphics.fill(0); // Couleur du texte (noir)
    this.numberGraphics.noStroke();
    this.numberGraphics.text(this.number, this.numberGraphics.width / 2, this.numberGraphics.height / 2); // Centrer le numéro
    this.numberTexture = this.numberGraphics; // Stocker la texture du numéro
  }

  // Met à jour la position et l'opacité du rectangle
  update() {
    if (this.isAnimating) {
      // Déplacer vers le haut progressivement
      if (this.y > this.targetY) {
        this.y -= 2; // Vitesse de déplacement (ajustez si nécessaire)
        if (this.y < this.targetY) {
          this.y = this.targetY;
        }
      }

      // Augmenter l'opacité progressivement
      if (this.opacity < this.targetOpacity) {
        this.opacity += 5; // Vitesse d'augmentation de l'opacité (ajustez si nécessaire)
        if (this.opacity > this.targetOpacity) {
          this.opacity = this.targetOpacity;
        }
      }
    }
  }

  // Affiche le rectangle avec sa position et son opacité actuelles
  display() {
    // Dessiner le cadre noir
    push();
    translate(this.x, this.y, 0); // Positionner le cadre
    fill(0, this.opacity);       // Noir avec opacité actuelle
    noStroke();
    plane(20 + 2 * borderThickness, 30 + 2 * borderThickness); // Dimension du cadre
    pop();

    // Dessiner le rectangle blanc au-dessus du cadre noir
    push();
    translate(this.x, this.y, 1); // Positionner légèrement en avant pour éviter le z-fighting
    fill(255, this.opacity);      // Blanc avec opacité actuelle
    noStroke();
    plane(20, 30);                 // Dimension du rectangle
    pop();

    // Dessiner le numéro légèrement en avant pour éviter le z-fighting
    push();
    translate(this.x, this.y, numberOffsetZ); // Positionner légèrement en avant
    tint(255, this.opacity);                  // Appliquer l'opacité via tint
    texture(this.numberTexture);               // Appliquer la texture avec le numéro
    plane(20, 30);                            // Dimension du plan pour le numéro
    pop();
  }

  // Démarre l'animation pour ce rectangle
  startAnimation() {
    this.isAnimating = true;
  }
}

// Variables de rotation et d'animation
let angle = 0;              // Angle de rotation autour de l'axe Y
let coverAngle = 0;         // Angle d'ouverture du couvercle
let isRotating = true;      // Indique si la boîte tourne automatiquement
let xIncline = 0;           // Inclinaison sur l'axe X
let isAnimating = false;    // Indique si une animation est en cours
let targetAngle = 0;        // Angle cible pour aligner la boîte
let mouseIncline = 0;       // Inclinaison basée sur la souris

// Variables de zoom et déplacement vertical
let zoomFactor = 100;       // Distance initiale de la caméra (plus grand = plus éloigné)
let maxZoom = -300;         // Distance minimale de zoom (plus petit = plus proche)
let zoomSpeed = 5;          // Vitesse du zoom pendant l'animation
let yOffset = 0;            // Déplacement vertical du coffre
let ySpeed = 2;             // Vitesse de déplacement vertical

// Variables pour les textures
let couvercleTexture, couvercleTexture2;
let boiteTexture1, boiteTexture2, boiteTexture3, boiteTexture4;
let boiteDessous, boiteDessus;

// Variables pour les rectangles
let rectangles = [];               // Tableau pour stocker les rectangles
let rectanglesAnimated = false;    // Indique si l'animation des rectangles a déjà démarré

function preload() {
  // Charger les images pour le couvercle et la boîte
  couvercleTexture = loadImage('assets/couvercle_exterieur.png');
  couvercleTexture2 = loadImage('assets/couvercle_interieure.png');
  boiteTexture1 = loadImage('assets/boitedevantext.png');    // Face avant
  boiteTexture2 = loadImage('assets/boitederriereext.png'); // Face arrière
  boiteTexture3 = loadImage('assets/boitedroiteext.png');   // Face droite
  boiteTexture4 = loadImage('assets/boitegaucheext.png');   // Face gauche
  boiteDessous = loadImage('assets/boitedessousext.png');    // Dessous
  boiteDessus = loadImage('assets/boitedessusext.png');      // Dessus
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  noStroke(); // Supprimer les contours des formes

  // Configuration des rectangles
  let rows = 2;         // Nombre de lignes
  let cols = 15;        // Nombre de colonnes
  let rectW = 20;       // Largeur des rectangles
  let rectH = 30;       // Hauteur des rectangles
  let spacingX = 10;    // Espacement horizontal entre les rectangles
  let spacingY = 10;    // Espacement vertical entre les lignes

  // Calculer la largeur et la hauteur totales
  let totalWidth = cols * (rectW + spacingX) - spacingX;
  let totalHeight = rows * (rectH + spacingY) - spacingY;

  // Calculer la position de départ pour centrer les rectangles
  let startX = -totalWidth / 2;
  let startY = -totalHeight / 2;

  // Créer les rectangles et les ajouter au tableau avec des numéros
  let currentNumber = 1; // Initialiser le compteur de numéros
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      let x = startX + col * (rectW + spacingX);
      let y = startY + row * (rectH + spacingY);
      rectangles.push(new RectangleItem(x, y, currentNumber));
      currentNumber++; // Incrémenter le numéro
    }
  }
}

function draw() {
  background(180, 120, 0, 50); // Fond coloré avec transparence

  // Calculer la distance de la souris par rapport au centre de l'écran
  let centerX = width / 2;
  let centerY = height / 2;
  let distance = dist(mouseX, mouseY, centerX, centerY);
  let maxDistance = dist(0, 0, centerX, centerY); // Distance maximale possible

  // Mapper la distance à une vitesse de rotation (plus loin = plus rapide)
  let rotationSpeed = map(distance, 0, maxDistance, 0.005, 0.05);

  // Appliquer le zoom avant en déplaçant la caméra vers la boîte
  translate(0, yOffset, -zoomFactor); // Déplacement vertical et zoom

  // Rotation automatique autour de l'axe Y avec vitesse variable
  if (isRotating) {
    angle += rotationSpeed;
  }

  // Inclinaison basée sur la position de la souris si aucune animation n'est en cours et que les rectangles ne sont pas animés
  if (!isAnimating && !rectanglesAnimated) {
    let mouseOffset = (mouseY - centerY) / centerY; // Normaliser entre -1 et 1
    mouseIncline = map(mouseOffset, -1, 1, PI / 8, -PI / 8);  // Incliner entre +PI/8 et -PI/8
  } else {
    mouseIncline = 0; // Réinitialiser l'inclinaison
  }

  // Gestion de l'animation lors du clic
  if (isAnimating) {
    let diff = targetAngle - angle;

    // Rotation vers l'angle cible
    if (abs(diff) > 0.01) {
      angle += diff * 0.1; // Ajustement progressif
    } else if (xIncline > -PI / 8) {
      xIncline -= 0.01;      // Incliner la boîte
    } else if (coverAngle < PI / 2) {
      coverAngle += 0.05;     // Ouvrir le couvercle
      if (coverAngle >= PI / 2) {
        coverAngle = PI / 2; // Limiter l'angle d'ouverture
      }
    }

    // Effectuer le zoom avant pendant l'animation
    if (zoomFactor > maxZoom) {
      zoomFactor -= zoomSpeed; // Diminuer zoomFactor pour se rapprocher
      if (zoomFactor < maxZoom) {
        zoomFactor = maxZoom;   // Limiter le zoom à maxZoom
      }
    }

    // Faire descendre le coffre de 50 pixels pendant l'animation
    if (yOffset < 50) {
      yOffset += ySpeed; // Augmenter le décalage vertical
      if (yOffset > 50) {
        yOffset = 50;    // Limiter le décalage vertical
      }
    }

    // Vérifier si l'animation du coffre est terminée
    if (
      isAnimating &&
      abs(targetAngle - angle) <= 0.01 &&
      xIncline <= -PI / 8 &&
      coverAngle >= PI / 2 &&
      zoomFactor <= maxZoom &&
      yOffset >= 50 &&
      !rectanglesAnimated // Vérifier si les rectangles n'ont pas encore été animés
    ) {


      // Démarrer l'animation des rectangles
      for (let rect of rectangles) {
        rect.startAnimation();
      }

      rectanglesAnimated = true; // Indiquer que les rectangles ont été animés
    }
  }

  // Appliquer les rotations
  rotateY(angle);
  rotateX(isAnimating ? xIncline : mouseIncline);

  // Dessiner la boîte et le couvercle
  drawBox();

  // *** Ajout : Dessiner 30 rectangles blancs au centre avec numéros ***
  push(); // Sauvegarder l'état actuel de la transformation

  // Positionner les rectangles devant la boîte
  translate(0, 0, 100); // Ajustez la valeur z pour les amener devant (plus grand que 68)

  // NE PAS ROTATION POUR ÉVITER L'EFFET MIROIR
  // rotateY(PI); // Retiré pour corriger l'orientation des numéros

  // Dessiner chaque rectangle
  for (let rect of rectangles) {
    rect.update();      // Mettre à jour la position et l'opacité
    rect.display();     // Afficher le rectangle avec le numéro et le cadre
  }

  pop(); // Restaurer l'état de transformation
}

function drawBox() {
  push(); // Sauvegarder l'état actuel de la transformation

  // Face avant
  push();
  texture(boiteTexture1);
  translate(0, 0, 68); // Positionner la face avant
  plane(300, 50);       // Dessiner la face avant
  pop();

  // Face arrière
  push();
  texture(boiteTexture2);
  translate(0, 0, -68); // Positionner la face arrière
  plane(300, 50);        // Dessiner la face arrière
  pop();

  // Face droite
  push();
  texture(boiteTexture3);
  rotateY(HALF_PI);        // Faire pivoter de 90 degrés pour la face droite
  translate(0, 0, 150);    // Positionner la face droite
  plane(136, 50);          // Dessiner la face droite
  pop();

  // Face gauche
  push();
  texture(boiteTexture4);
  rotateY(HALF_PI);        // Faire pivoter de 90 degrés pour la face gauche
  translate(0, 0, -150);   // Positionner la face gauche
  plane(136, 50);          // Dessiner la face gauche
  pop();

  // Dessus de la boîte
  push();
  texture(boiteDessus);
  translate(0, -24, 0);    // Positionner le dessus
  rotateX(HALF_PI);        // Faire pivoter pour être horizontal
  plane(300, 136);         // Dessiner le dessus
  pop();

  // Dessous de la boîte
  push();
  texture(boiteDessous);
  translate(0, 25, 0);     // Positionner le dessous
  rotateX(HALF_PI);        // Faire pivoter pour être horizontal
  plane(300, 136);         // Dessiner le dessous
  pop();

  pop(); // Restaurer l'état de transformation

  // Dessiner le couvercle (partie extérieure)
  push();
  translate(0, -22, -65);    // Positionner le couvercle sur le dessus
  rotateX(coverAngle);        // Faire pivoter le couvercle pour l'ouvrir
  translate(0, 0, 65);        // Ajuster le pivot
  texture(couvercleTexture);
  box(298, 5, 134);           // Dessiner le couvercle extérieur
  pop();

  // Dessiner le couvercle (partie intérieure)
  push();
  translate(0, -21, -65);    // Positionner le couvercle intérieur
  rotateX(coverAngle);        // Faire pivoter le couvercle pour l'ouvrir
  translate(0, 0, 65);        // Ajuster le pivot
  texture(couvercleTexture2);
  box(298, 6, 134);           // Dessiner le couvercle intérieur
  pop();
}

function mousePressed() {
  if (!isAnimating) {
    isRotating = false;        // Arrêter la rotation automatique
    isAnimating = true;        // Démarrer l'animation
    zoomFactor = 100;           // Réinitialiser le zoomFactor pour commencer le zoom avant
    yOffset = 0;                // Réinitialiser le décalage vertical

    // Calculer l'angle cible pour aligner la boîte face à nous
    let angleMod = angle % TWO_PI;
    if (angleMod > PI) {
      targetAngle = angle - angleMod + TWO_PI;
    } else {
      targetAngle = angle - angleMod;
    }

    // **Ne pas démarrer l'animation des rectangles ici**
    // Les rectangles commenceront à s'animer après que l'animation du coffre soit terminée
    // for (let rect of rectangles) {
    //   rect.startAnimation();
    // }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
