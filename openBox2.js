// sketch1.js

// Variables de rotation et d'animation
let angle = 0;              // Angle de rotation autour de l'axe Y
let coverAngle = 0;         // Angle d'ouverture du couvercle
let isRotating = true;      // Indique si la boîte tourne automatiquement
let xIncline = 0;           // Inclinaison sur l'axe X
let isAnimating = false;    // Indique si une animation est en cours
let targetAngle = 0;        // Angle cible pour aligner la boîte
let mouseIncline = 0;       // Inclinaison basée sur la souris

// Variables de zoom et déplacement vertical
let zoomFactor = 600;       // Distance initiale de la caméra (plus grand = plus éloigné)
let maxZoom = -800;         // Distance minimale de zoom (plus petit = plus proche)
let zoomSpeed = 5;          // Vitesse du zoom pendant l'animation
let yOffset = 0;            // Déplacement vertical du coffre
let ySpeed = 2;             // Vitesse de déplacement vertical

// Variables pour les textures
let couvercleTexture, couvercleTexture2;
let boiteTexture1, boiteTexture2, boiteTexture3, boiteTexture4;
let boiteDessous, boiteDessus;

// Variable pour suivre la complétion de l'animation
let animationComplete = false;

// Variable pour stocker le canvas
let canvas;

function preload() {
  // Charger les images pour le couvercle et la boîte
  couvercleTexture = loadImage('assets2/couvercle_exterieur.png');
  couvercleTexture2 = loadImage('assets2/couvercle_interieure.png');
  boiteTexture1 = loadImage('assets2/boitedevantext.png');    // Face avant
  boiteTexture2 = loadImage('assets2/boitederriereext.png'); // Face arrière
  boiteTexture3 = loadImage('assets2/boitedroiteext.png');   // Face droite
  boiteTexture4 = loadImage('assets2/boitegaucheext.png');   // Face gauche
  boiteDessous = loadImage('assets2/boitedessousext.png');    // Dessous
  boiteDessus = loadImage('assets2/boitedessusext.png');      // Dessus
}

function setup() {
  // Créer un canvas en 3D qui couvre toute la fenêtre
  canvas = createCanvas(windowWidth, windowHeight, WEBGL);
  noStroke(); // Supprimer les contours des formes

  // Positionner le canvas correctement sous sketch2.js
  canvas.position(0, 0);
  canvas.style('z-index', '1'); // S'assurer que ce canvas est sous sketch2.js
  canvas.style('pointer-events', 'none'); // Permettre aux interactions de passer à sketch2.js
}

function draw() {
  background(180, 0, 0); // Fond coloré avec transparence

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

  // Inclinaison basée sur la position de la souris si aucune animation n'est en cours
  if (!isAnimating) {
    let mouseOffset = (mouseY - centerY) / centerY; // Normaliser entre -1 et 1
    mouseIncline = map(mouseOffset, -1, 1, PI / 8, -PI / 8);  // Incliner entre +PI/8 et -PI/8
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

    // Vérifier si toutes les animations sont terminées
    if (
      abs(diff) <= 0.01 &&
      xIncline <= -PI / 8 &&
      coverAngle >= PI / 2 &&
      zoomFactor <= maxZoom &&
      yOffset >= 50
    ) {
      animationComplete = true; // Marquer l'animation comme terminée
      triggerSketch2(); // Appeler la fonction pour lancer le second sketch
    }
  }

  // Appliquer les rotations
  rotateY(angle);
  rotateX(isAnimating ? xIncline : mouseIncline);

  // Dessiner la boîte et le couvercle
  drawBox();
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
  if (!isAnimating && !animationComplete) {
   if (mouseX > windowWidth / 3 && mouseX < windowWidth - windowWidth / 3 && mouseY > windowHeight / 3 && mouseY < windowHeight - windowHeight / 3) {
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
  }}
}

// Fonction pour lancer le second sketch
function triggerSketch2() {
  // Vérifier si le second sketch est déjà chargé
  if (typeof sketch2Loaded === 'undefined') {
    // Charger le fichier sketch2.js dynamiquement
    let script = document.createElement('script');
    script.src = 'paperModel1.js';
    document.body.appendChild(script);
    window.sketch2Loaded = true; // Marquer comme chargé
  }
}

// Fonction pour redimensionner le canvas lors du changement de taille de la fenêtre
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  // Aucun recalcul supplémentaire nécessaire car les positions sont recalculées dynamiquement dans draw()
}

// Fonction pour lancer le second sketch
function triggerSketch2() {
  // Vérifier si le second sketch est déjà chargé
  if (typeof sketch2Loaded === 'undefined') {
    // Charger le fichier sketch2.js dynamiquement
    let script = document.createElement('script');
    script.src = 'paperModel1.js';
    document.body.appendChild(script);
    window.sketch2Loaded = true; // Marquer comme chargé
  }
}

// Fonction pour redimensionner le canvas lors du changement de taille de la fenêtre
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  detectOrientation();         // Détecter la nouvelle orientation
  initializeDimensions();     // Réinitialiser les dimensions proportionnelles
}

// Optionnel : Gérer les événements tactiles pour les appareils mobiles
function touchStarted() {
  mousePressed(); // Utiliser la même logique que pour le clic souris
}


