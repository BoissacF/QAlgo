/* QAlgo — boucle p5.js : canvas, souris, clavier, menu contextuel, zoom
 *
 * Simulateur de circuits quantiques pour l'enseignement — https://www.qalgo.org
 * Code source : https://github.com/BoissacF/QAlgo
 *
 * Copyright (C) 2025-2026 Frédéric Boissac
 * Logiciel libre sous licence GNU AGPL version 3 ou ultérieure ;
 * voir le fichier LICENSE à la racine du dépôt.
 */
//pb 1 : le control ne fonctionne plus
//pb2 : impossible ouvrir fichier

let doit_lancer_calcul_LignesQuantiQues_nQbitsEntree_nQbitsSortie=false;//lance lescalculs dans draw si pas de selection
let Time_Click = 0;

let Time_doubleClick = 300; // temps en millisecondes pour considérer un double cli
let precision_coeff=2;//nbre de chiffres apres la virgule pour les coefficients
let largeur = 100;
let hauteur = 100;

let demarrage=false;

let Pause = true;
let transparencetitre = 255;

let menuCouleurVisible = false;

/* Nombre maximal de lignes quantiques qu une porte multiple -- oracle,
   transformee de Fourier, diffuseur, porte creee -- peut traverser. C est lui
   qui dimensionne, dans le constructeur de Sommet, les tableaux Qbit,
   num_ligne, mesure et val_instant_mesure de ces portes.

   C etait le vrai plafond du simulateur : un oracle a 21 entrees debordait de
   ses emplacements et le calcul s arretait sur une erreur, bien avant que la
   memoire du vecteur d etat pose probleme. Porte de 20 a 24 le 21 octobre
   2026, ce qui coute quatre tableaux de quatre cases par porte multiple --
   rien. */
let nbre_qbits_max =24;
/*

let menuCouleurX, menuCouleurY;
let menuOptionsCouleurs = [
  "Bleu",
  "Vert",
  "Orange",
  "Rouge",
  "Gris",
  "Blanc",
  "Noir",
];
*/
let Selection_arete_pour_couleurs = [-1, -1,0];//numero du sommet,numero de l arete, et 1 si arete de controle, 0 sinon

let canevas;

let simulationFPS = 1; //1 frame par seconde pour les animations
//let numClic = -1;
//let numDeClic = -1;
let active_redimensionnement=false;
let numClicArete = [-1, -1];
let DernierClicCanevas = 0; //appuies clic=1 , lache clic = 2

let Selection = -1;
let double_clic_en_cours=false;
let ajoutVertical = 20; //texte au dessus du canvas

let correctifHauteurFenetre = ajoutVertical + 20; //largeur exacte dutexte  au dessus du canvas en tenant compte du bandeau
//let graph; //let ou const : portée locale restreinte au bloc,







//parametres par defaut
let tailleText = 10;
let diametreSommet = 35;

let couleur_Sommet = ["100", "100", "255"]; //bleu clair
let couleurCurseurOrange = [255, 100, 100]; //orange clair
//let couleur_Selection = [170, 117, 34]; //marron
let couleurRondFleche = [210];
let couleur_Contours = [0];
let epaisseur_Contours = 1;

let couleur_default_arete = [0];
let epaisseur_default_arete = 1;
let couleur_default_sommet = [150]; //["100", "100", "255"] //bleu clair
let diametre_default_sommet = 35;
let img_selection;

let typeSelectionne = -1; //  0:+|0> ; 1:+|1> ; 2:+0.707|0> + 0.707|1> ; 3 porte X ; 4:porte Z ; 5:porte H  -1 : desactive temporairement 
let boutonSelectionne=undefined;//bouton créé selectionné

let textContainer1, textContainer2; // Deux divs contenant les textes
//let isDragging1 = false, isDragging2 = false; // Indique si chaque fenêtre est en train d'être déplacée
//let offsetX1, offsetY1, offsetX2, offsetY2; // Décalages lors du déplacement des fenêtres

function calculLargeurEtHauteur(){
   var taillecolonne1 = document.getElementById("colonne1").offsetWidth;
  var tailleDes2colonnes = document.getElementById("les2colonnes").offsetWidth;

  largeur = tailleDes2colonnes - taillecolonne1 - 60; //60 px de marges a retirer : valeur empirique, ajustee a l oeil
  if (largeur < 50) largeur = 50;
  //hauteur = windowHeight-150;

  const textContainer = document.getElementById("text-container");
  const textHeight = textContainer.offsetHeight;
  hauteur = windowHeight - textHeight - 60; //150;
  //print("taille total:",windowHeight," hauteur texte: ",textHeight," hauteur fenetre: ",hauteur)

  
}

//redimensionne automatiquement le canvas
function windowResized() {
  calculLargeurEtHauteur();
  
   //print("yo apres",largeur, hauteur)
  resizeCanvas(largeur, hauteur);

  background(R.couleur_Fond);
}

function affiche_consigne(){
  if (G.TabSommets.length>2) return;
  
  
  fill(0);
  textAlign(CENTER, CENTER); // centre la phrase horizontalement et verticalement
  textSize(20);
  let montexte = "";
  
  
  if (langue==1){
    montexte = "Add qubits and gates using drag and drop";
  } else
  {
    montexte = "Ajoute des qubits et des portes par glisser-déposer";
  }

  let largeur_montexte = textWidth(montexte);
  while (largeur_montexte > width) {
    textSize(textSize() - 1);
    largeur_montexte = textWidth(montexte);
  }

  text(montexte, width / 2, 20);
  
  
  
}  
  


function affichetitre() {
  
   affiche_consigne();
  
  
   
//  else
  if (G.TabSommets.length!=0) return;
  
  
  
  
  if (transparencetitre <= 0) return;

  // print(transparencetitre)

  fill(255,0, 255, transparencetitre);
  textSize(150); // définit la taille de la police de la phrase
  

   montexte="QAlgo"
 

   largeur_montexte = textWidth(montexte);
  while (largeur_montexte > width) {
    textSize(textSize() - 1);
    largeur_montexte = textWidth(montexte);
  }

  text(montexte, width / 2, height / 2);

  textSize(14);
  text("Copyright 2025-2026 Frédéric Boissac", width / 2, height / 2 + 55);

  transparencetitre -= 10;
  demarrage=true;
  
    
  
  if (transparencetitre<0) if (Selection<0)
    
     if (G.lignes_quantiques.length==0)
    chargeFichierIntro();
  //textAlign(LEFT); // supprime l'alignement horizontal et vertical
}



function initialise_variables_clic() {
  
  
  loop();
  
  
  /*
  try {
    texteInput.remove();
    button.remove();
    
  } catch (error) {
    //console.error(error);
    // print("pas de texte")
  }
  try {
    input.remove();
  } catch (error) {
    // console.error(error);
    // print("pas d input")
  }
*/
  
  
  
  
  //on reinitialise les variables de clic
  numClicArete[0] = -1;
  numClicArete[1] = -1;
 // numClic = -1;
 // numDeclic = -1;
  
  Selection_arete_pour_couleurs = [-1, -1,0];
 
  Selection = -1;
  active_redimensionnement=false;
}




function preload() {
  /*
 let url = window.location.href;
  
  
  
  if (url.endsWith("indexFR.html")) {
    
   
  }else{
    changeLanguage();
  }
  
  */
  // Charger une police avant le setup
  fontGraphicBloch = loadFont('assets/fonts/regular.ttf');
  alice = loadImage("assets/img/Alice.png");
  
 bob = loadImage("assets/img/Bob.png");
  gerard = loadImage("assets/img/gerard.png");
  
  
  img_selection = loadImage("assets/img/selection.png");
  img_dimension = loadImage("assets/img/dimension.png");
  
//tetelion.resize(100, 0);
 
  
  
  // image(tetelion, this.x-25,this.y-80);
}





function setup() {
 
  
 // let t1=millis();
  
  
  
  calculLargeurEtHauteur();
    
   canevas = createCanvas(largeur, hauteur); 

 // print("yo au depart",largeur, hauteur)
  
//extrait_bits_particuliers()
  //canevas = createCanvas(windowWidth, windowHeight - correctifHauteurFenetre);
  R=new Reglages();
  
  

  
  
 // canevas = createCanvas(largeur, hauteur);

  canevas.parent("parentducanvas");
  
  background(R.couleur_Fond);

  //windowResized();
    
   // Créer les curseurs pour teta (0 à pi) et phi (0 à 2pi)
  angleThetaSlider = createSlider(0, 1, 0, 0.01);  // Curseur pour teta de 0 à pi
 
  
  anglePhiSlider = createSlider(0, 2, 0, 0.01);  // Curseur pour phi de 0 à 2pi
    angleThetaSlider.hide();
    anglePhiSlider.hide();
  
  /*
  let canvasX = canevas.position().x; // récupère la coordonnée x du coin supérieur gauche du canvas
  let canvasY = canevas.position().y; // récupère la coordonnée y du coin supérieur gauche du canvas

    
  
   angleThetaSlider.position(canvasX +100, 240+canvasY ); // Placer le curseur sous le graphique 
  anglePhiSlider.position(canvasX +100, 270+canvasY ); // Placer le curseur sous le graphique
  
  */
  
  
  
  
   // Détecter le changement de valeur et appeler la fonction change()
  angleThetaSlider.input(changeSlider);
   anglePhiSlider.input(changeSlider);

  
  
  /*
  //debut modif graphic
   Monselect = createSelect();
Monselect.option('Phase');
Monselect.option("Prob");  
Monselect.option('Re(amplitude)');


Monselect.option('Im(amplitude)');

Monselect.changed(mySelectEvent);
Monselect.hide();//le rend invisible
Monselect.selected('Prob');
  
  Monselect.style('height', '18px');
  
  Monselect.style('width', '50px');
  Monselect.style('font-size', '12px');
  */
  
  
  Monselect = document.getElementById("monSelect");
 
 // Changer le style directement en utilisant la propriété 'style'
Monselect.style.display = "none"; // ren invisible Affiche l'élément
Monselect.style.height = "18px";   // Change la hauteur
Monselect.style.width = "50px";    // Change la largeur
Monselect.style.fontSize = "12px"; // Change la taille de la police
  Graphes_nQbits=new Graphique();



  
  //fin modif graphic
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  

  //canevas.hide();
  //canevas.show();

  G = new Graph();
  
  graf3DBloch1=new GraphiqueBloch(true);
  graf3DBloch2=new GraphiqueBloch(false);
  
  //noStroke();
  stroke(couleur_Contours);
  strokeWeight(epaisseur_Contours);

  textSize(tailleText);
  textAlign(CENTER);
  //textStyle(BOLD);

  

  canevas.mousePressed(ClicCanevas); //attache l ecoute a canvas

  canevas.doubleClicked(DoubleClicCanevas);
  canevas.mouseReleased(DeclicCanevas);

  //desactive la roulette mais que pour le canvas
  canevas.mouseWheel(disableWheel);

  // Désactiver le menu contextuel, bouton droit de la souris par défaut
  document.addEventListener("contextmenu", (event) => event.preventDefault());
  
  
  
  // Initialiser les tooltips de la page, permet d afficher un texte quand je survole un élément
  document.addEventListener('DOMContentLoaded', function () {
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
      return new bootstrap.Tooltip(tooltipTriggerEl)
    })
  });
  
  
  // Créer un input de type "color" et le cacher initialement
  colorPicker = createElement('input');
  colorPicker.attribute('type', 'color');
  colorPicker.attribute('value', '#ff0000'); // couleur par défaut
  colorPicker.hide();
  
  
  
  
  
  
  
  /*
  console.log("Largeur du canvas : " + width);
  console.log("Hauteur du canvas : " + height);

  // Obtenir la position du canvas
  let canvasX = canvas.elt.offsetLeft;
  let canvasY = canvas.elt.offsetTop;
  
  
  */
  
  
  
 
  
  
 /*
  // Créer la première fenêtre flottante pour le texte
  textContainer1 = createDiv();
  textContainer1.style('position', 'absolute');
  textContainer1.style('top', topPosition1 + 'px');
  textContainer1.style('left', leftPosition1 + 'px');
  textContainer1.style('min-width', '300px'); 
//textContainer1.style('max-width', '600px');
  
  textContainer1.style('max-width', width);
textContainer1.style('width', 'auto');  // Laissez la largeur s'adapter en fonction du contenu
  
   textContainer1.style('font-size', '16px');
 // textContainer1.style('width', '300px');
  textContainer1.style('height', '100px');
  textContainer1.style('background-color', 'rgba(255, 255, 255, 0.9)');
  textContainer1.style('border', '1px solid black');
  textContainer1.style('padding', '10px');
  textContainer1.style('overflow', 'auto');  // Permet le défilement
  textContainer1.style('cursor', 'move');  // Affiche un curseur de déplacement
  
  // Ajout du texte à la première fenêtre
  let longText1 = "";
  textContainer1.html(longText1);  // Ajouter le texte dans la div

  // Initialiser les événements de déplacement pour la première fenêtre
  textContainer1.mousePressed(startDragging1);
  textContainer1.mouseReleased(stopDragging);
*/
  
  
   // Obtenir la position du canvas
 // let canvasX = canvas.elt.offsetLeft;
  //let canvasY = canvas.elt.offsetTop;

  
  /*
  // Créer la deuxième fenêtre flottante pour le texte
  textContainer2 = createDiv();
  textContainer2.style('position', 'absolute');
 // textContainer2.style('top', '300px');
  textContainer2.style('font-size', '16px'); // Imposer la taille du texte à 12px
  textContainer2.style('top', topPosition2 + 'px');
  textContainer2.style('left', leftPosition2 + 'px');
  //textContainer2.style('left', '50px');
  //textContainer2.style('width', '300px');
  textContainer2.style('min-width', '300px'); 
textContainer2.style('max-width', width);
textContainer2.style('width', 'auto');  // Laissez la largeur 
  textContainer2.style('height', '100px');
  textContainer2.style('background-color', 'rgba(255, 255, 255, 0.9)');
  textContainer2.style('border', '1px solid black');
  textContainer2.style('padding', '10px');
  textContainer2.style('overflow', 'auto');  // Permet le défilement
  textContainer2.style('cursor', 'move');  // Affiche un curseur de déplacement
  
  // Ajout du texte à la deuxième fenêtre
  let longText2 = "";
  textContainer2.html(longText2);  // Ajouter le texte dans la div

  // Initialiser les événements de déplacement pour la deuxième fenêtre
  textContainer2.mousePressed(startDragging2);
  textContainer2.mouseReleased(stopDragging);
*/
  

 
  
  
  
  
  
  //compteur();
  
 
  // Initialisation des deux conteneurs
 textContainer1 = document.getElementById('textcontainer1');
 textContainer2 = document.getElementById('textcontainer2');
  
   // Positionner la fenêtre : 50px à droite du début du canvas et 50px au-dessus du bas
  let leftPosition1 = canevas.elt.offsetLeft+5;//160; // 50px à droite
  let topPosition1 = hauteur-100; // 50px au-dessus du bas (200px est la hauteur de la fenêtre)
  
  
 
  
  let leftPosition2 = canevas.elt.offsetLeft+15;//190; // 50px à droite
  let topPosition2 = hauteur-45; // 50px au-dessus du bas (200px est la hauteur de la fenêtre)
  
  //print("pos",canevas.elt.offsetLeft,hauteur,leftPosition1,topPosition1)

// Tu peux définir leurs positions initiales ici
setupTextContainer(textContainer1, topPosition1,leftPosition1 );
setupTextContainer(textContainer2, topPosition2,leftPosition2 );

 
  
 textContainer1.style.display = "none";
 textContainer2.style.display = "none"; 
  
   // textContainer1.hide();//ne pas afficher la fenetre
   // textContainer2.hide();//ne pas afficher la fenetre
  
  
  //let t2=millis();
    
    
   // print("duree setup:",t2-t1)
  //chargeFichierIntro();
  
}
function setupTextContainer(container, top, left, maxWidth = '1200px') {
  
   
  top=top.toString();
  left=left.toString();
  
  
  
  
  container.style.position = 'absolute';
  container.style.top = top + 'px';
  
 // print("letop",container.style.top);
  
  
  container.style.left = left + 'px';
  container.style.minWidth = '100px';
  container.style.maxWidth = maxWidth;
  container.style.width = 'auto';
  container.style.height = '100px';
  container.style.fontSize = '16px';
  container.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
  container.style.border = '1px solid black';
  container.style.padding = '10px';
  container.style.overflow = 'auto';
  container.style.cursor = 'move';
  container.style.resize = 'both';
  container.style.boxSizing = 'border-box';

  // Empêche la sélection/modif du texte
  const content = container.querySelector('.text-content');
  content.style.pointerEvents = 'none';
  content.style.userSelect = 'none';

  // Déplacement à la souris
  let isDragging = false;
  let offsetX, offsetY;

  container.addEventListener('mousedown', function (e) {
    // Autoriser drag sauf si on clique sur coin de resize
    if (e.offsetX < container.clientWidth - 10 &&
        e.offsetY < container.clientHeight - 10) {
      isDragging = true;
      offsetX = e.clientX - container.getBoundingClientRect().left;
      offsetY = e.clientY - container.getBoundingClientRect().top;

      container.style.zIndex = Date.now();
    }
  });

  document.addEventListener('mousemove', function (e) {
    if (isDragging) {
      container.style.left = (e.clientX - offsetX) + 'px';
      container.style.top = (e.clientY - offsetY) + 'px';
    }
  });

  document.addEventListener('mouseup', function () {
    isDragging = false;
  });
}




/*
function setupTextContainer(container, top, left, maxWidth = '600px') {
  container.style.position = 'absolute';
  container.style.top = top + 'px';
  container.style.left = left + 'px';
  container.style.minWidth = '300px';
  container.style.maxWidth = maxWidth;
  container.style.width = 'auto';
  container.style.height = '100px';
  container.style.fontSize = '16px';
  container.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
  container.style.border = '1px solid black';
  container.style.padding = '10px';
  container.style.overflow = 'auto';
  container.style.cursor = 'move';
  container.style.resize = 'both';
  container.style.boxSizing = 'border-box';

  // Drag logic
  let isDragging = false;
  let offsetX, offsetY;

  container.addEventListener('mousedown', function (e) {
    // Ignore if near resize handle (bottom-right corner)
    if (e.target === container &&
        e.offsetX < container.clientWidth - 10 &&
        e.offsetY < container.clientHeight - 10) {
      isDragging = true;
      offsetX = e.clientX - container.getBoundingClientRect().left;
      offsetY = e.clientY - container.getBoundingClientRect().top;

      // Bring container to front
      container.style.zIndex = Date.now(); // crude way to make it "on top"
    }
  });

  document.addEventListener('mousemove', function (e) {
    if (isDragging) {
      container.style.left = (e.clientX - offsetX) + 'px';
      container.style.top = (e.clientY - offsetY) + 'px';
    }
  });

  document.addEventListener('mouseup', function () {
    isDragging = false;
  });
}


*/



/*

// Démarre le déplacement de la première fenêtre
function startDragging1() {
  if (Selection>=0) {
    isDragging1 =false;isDragging2 = false;
    return;
  }
  isDragging1 = true;
  offsetX1 = mouseX - textContainer1.elt.offsetLeft;
  offsetY1 = mouseY - textContainer1.elt.offsetTop;
}


// Démarre le déplacement de la deuxième fenêtre
function startDragging2() {
  if (Selection>=0) {
    isDragging1 =false;isDragging2 = false;
    return;
  }
  isDragging2 = true;
  offsetX2 = mouseX - textContainer2.elt.offsetLeft;
  offsetY2 = mouseY - textContainer2.elt.offsetTop;
}

// Arrête le déplacement de la deuxième fenêtre
function stopDragging() {
 
  isDragging2 = false;isDragging1 = false;
}

// Gère le déplacement des fenêtres
function mouseDragged() {
  //print("dpct,",isDragging1,isDragging2 )
  // Déplacement de la première fenêtre
  if (isDragging1) {
    let xPos1 = mouseX - offsetX1;
    let yPos1 = mouseY - offsetY1;
    textContainer1.position(xPos1, yPos1);  // Déplace la première fenêtre
  }

  // Déplacement de la deuxième fenêtre
  if (isDragging2) {
    let xPos2 = mouseX - offsetX2;
    let yPos2 = mouseY - offsetY2;
    textContainer2.position(xPos2, yPos2);  // Déplace la deuxième fenêtre
  }
}


*/









//pour desactiver la roulette mais que pour le canvas
function disableWheel(event) {
  event.preventDefault(); // Empêche l'événement de se propager (désactive la molette)
}

function mouseWheel(event) {
  
  if (R.on_est_dans_une_fenetre==true) return;
  
  let Selection_bis=G.NumSommetQuiTouche();
  
  
  if (Selection_bis >= 0) {
    //modification diametre sommet
    
    if ((G.TabSommets[Selection_bis].type & 128)!=0) return;// cest une image

    diametre_default_sommet = 2 * G.TabSommets[Selection_bis].rayon;

    if (event.delta > 0) {
      if (diametre_default_sommet > 20)
        diametre_default_sommet = diametre_default_sommet - 5;
      else if (diametre_default_sommet > 10)
        diametre_default_sommet = diametre_default_sommet - 1;
    } else {
      if (diametre_default_sommet < 250)
        diametre_default_sommet = diametre_default_sommet + 5;
    }
    G.TabSommets[Selection_bis].changeDiametre(diametre_default_sommet);
  } //fin de modification daimetre
  else {
    //modification epaisseur arete

    var n = G.NumAreteQuiTouchePetitCercle();
    var n_sommet = n[0];
    if (n_sommet == -1) return; //pas d 'arete selectionner'

    var n_arete = n[1];
    let controle=n[2];
    
    if (n[2]==1)
      epaisseur_default_arete = G.TabSommets[n_sommet].aretes_controle[n_arete].epaisseur;
    else epaisseur_default_arete = G.TabSommets[n_sommet].aretes_sortantes[n_arete].epaisseur;
   
    
    if (event.delta > 0) {
      if (epaisseur_default_arete > 1)
        epaisseur_default_arete = epaisseur_default_arete - 1;
    } else {
      if (epaisseur_default_arete < 9)
        epaisseur_default_arete = epaisseur_default_arete + 1;
    }
    if (n[2]==1)
      G.TabSommets[n_sommet].aretes_controle[n_arete].epaisseur = epaisseur_default_arete;
    else G.TabSommets[n_sommet].aretes_sortantes[n_arete].epaisseur = epaisseur_default_arete;
  }
}
function deplace_bloch_souris(){
  if (mouseIsPressed==false) return false;
  if (graf3DBloch1.rotating==true) return false;
  if (graf3DBloch2.rotating==true) return false;
  
     if 
       ((mouseX>=graf3DBloch1.x)&&(mouseY>=graf3DBloch1.y)
       &&(mouseX<=(graf3DBloch1.x+img_selection.width))&&(mouseY<=(graf3DBloch1.y+img_selection.height))){
         
        graf3DBloch1.seDeplace=true;
      
       return true;
     }
  
    if 
       ((mouseX>=graf3DBloch2.x)&&(mouseY>=graf3DBloch2.y)
       &&(mouseX<=(graf3DBloch2.x+img_selection.width))&&(mouseY<=(graf3DBloch2.y+img_selection.height))){
         
        graf3DBloch2.seDeplace=true;
         
    
       return true;
     }
  
  
  return false;
}
   



function mousePressed() {
  
  if (demarrage==false )return;
  //print("je clique");loop();
  //gere le menu bouton droit de la souris pour changer la couleur d une arete ou d un sommet
  
 // print(mouseX,mouseY)
  
  //console.log('Position X:', canevas.elt.offsetLeft);
  //console.log('Position Y:', canevas.elt.offsetTop);
  if (R.on_est_dans_une_fenetre==true) return;
  
 
  
  
  
   if (R.active_Bloch==true){
    
    if (graf3DBloch1.toucheSouris()==true) {
      
      if (deplace_bloch_souris()==true) return;
      
      
      
      graf3DBloch1.rotating = true;
      return;
    }
    if (graf3DBloch2.toucheSouris()==true) {
      if (deplace_bloch_souris()==true) return;
      
      graf3DBloch2.rotating = true;
      return;
    }
  
  }
  
  

  if (mouseButton === RIGHT) {
    
    


    
    
    //si pas de selection ou d arete touchée on se casse
    if (Selection < 0) {
      
        Selection=G.NumSommetQuiTouche();
         if (Selection < 0){
           Selection_arete_pour_couleurs = G.NumAreteQuiTouchePetitCercle();
           if (Selection_arete_pour_couleurs[0] == -1) return;
         } else if ((G.TabSommets[Selection].type & 128)!=0) return;// cest une image
     
    } else
      if ((G.TabSommets[Selection].type & 128)!=0) return;// cest une image

    // Si clic droit, afficher le menu
    
    menuCouleurVisible = true;
    //menuCouleurX = mouseX;
    //menuCouleurY = mouseY;
    
    
    let ObjetSelectionne;
     let arete_sommet;
     if (Selection >= 0) {
          ObjetSelectionne=G.TabSommets[Selection];
          
           arete_sommet=1;
          //couleur_default_sommet = choix_couleur(menuOptionsCouleurs[i]);
           Selection=-1;
         
        } else {
          //modification epaisseur arete
          if (Selection_arete_pour_couleurs[0] == -1) return;

          let n_sommet = Selection_arete_pour_couleurs[0];
          let n_arete = Selection_arete_pour_couleurs[1];
          let controle = Selection_arete_pour_couleurs[2];
        
          if (controle==1) ObjetSelectionne= G.TabSommets[n_sommet].aretes_controle[n_arete];
          else ObjetSelectionne= G.TabSommets[n_sommet].aretes_sortantes[n_arete];
        
          //couleur_default_arete = choix_couleur(menuOptionsCouleurs[i]);
          arete_sommet=2;
          Selection_arete_pour_couleurs = [-1, -1,0];
        }
    
    
    
    colorPicker.attribute('value',rgbToHex(ObjetSelectionne.couleur));
    colorPicker.position(mouseX+115, mouseY+45);
    colorPicker.show();
    // Donner le focus à l'input
    colorPicker.elt.focus();
    
    
    // Écouter le changement de couleur
    colorPicker.changed(() => {
      // Lorsque la couleur change, récupérer la couleur choisie
      let selectedColor = colorPicker.elt.value;
      
          //
      ObjetSelectionne.couleur=hexToRGB(selectedColor);
      if (arete_sommet==1) couleur_default_sommet = ObjetSelectionne.couleur;
      else couleur_default_arete = ObjetSelectionne.couleur;
       menuCouleurVisible = false;
      
      colorPicker.hide();
    });
   


    
    
    

    return false; // Empêche le menu contextuel par défaut du navigateur
  }
/*
  // Si clic gauche,
  // Vérifier si une option est sélectionnée
  else if (menuCouleurVisible) {
    for (let i = 0; i < menuOptionsCouleurs.length; i++) {
      if (
        mouseX > menuCouleurX &&
        mouseX < menuCouleurX + 100 &&
        mouseY > menuCouleurY + i * 20 &&
        mouseY < menuCouleurY + (i + 1) * 20
      ) {
        // Option sélectionnée
        console.log("Vous avez sélectionné : " + menuOptionsCouleurs[i]);

        if (Selection >= 0) {
          
          

          couleur_default_sommet = choix_couleur(menuOptionsCouleurs[i]);
          G.TabSommets[Selection].couleur = couleur_default_sommet;
        } else {
          //modification epaisseur arete
          if (Selection_arete_pour_couleurs[0] == -1) return;

          var n_sommet = Selection_arete_pour_couleurs[0];
          var n_arete = Selection_arete_pour_couleurs[1];
          var controle = Selection_arete_pour_couleurs[2];
          
          let arete;
          if (controle==1) arete= G.TabSommets[n_sommet].aretes_controle[n_arete];
          else arete = G.TabSommets[n_sommet].aretes_sortantes[n_arete];
          
          
         

          couleur_default_arete = choix_couleur(menuOptionsCouleurs[i]);
          arete.couleur = couleur_default_arete;

          Selection_arete_pour_couleurs = [-1, -1,0];
        }

        initialise_variables_clic();
        return;
        // menuCouleurVisible = false; // Fermer le menu après sélection
      }
    }
  }
  */
}
/*
function drawMenu_clic_droit_souris(x, y) {
  // Dessiner le fond du menu
  fill(255);
  stroke(0);

  textSize(15);

  rect(x, y, 100, menuOptionsCouleurs.length * 20 + 10);

  // Dessiner les options du menu
  for (let i = 0; i < menuOptionsCouleurs.length; i++) {
    fill(0);
    noStroke();
    text(menuOptionsCouleurs[i], x + 50, y + 20 + i * 20);

    // Gérer les survols pour changer l'apparence
    if (
      mouseX > x &&
      mouseX < x + 150 &&
      mouseY > y + i * 20 &&
      mouseY < y + (i + 1) * 20
    ) {
      fill(200);

      rect(x, y + i * 20 + 10, 100, 20);
      fill(0);
      text(menuOptionsCouleurs[i], x + 50, y + 20 + i * 20);
    }
  }
}



function choix_couleur(reponse) {
  var couleur = [50];
  switch (reponse) {
    case "Noir":
      couleur = [50];

      break;
    case "Bleu":
      couleur = [100, 100, 255];
      break;
    case "Vert":
      couleur = [100, 255, 100];
      break;
    case "Orange":
      couleur = [244, 102, 27];
      break;
    case "Rouge":
      couleur = [255, 0, 0];

      break;
    case "Gris":
      couleur = [150];
      break;
    case "Blanc":
      couleur = [235];
      break;
  }

  return couleur;
}
*/
function draw() {

  /*
  si on clique sur un sommet et qu il ne peut plus avoir d arete sortante (car il en a deja une)
  on le selctionne.
  on supprime l effacement d une arete en repassant dessus, ce comportement n etait pas souhaitable
  mes touches supp et le clic droit suffisent
*/
  frameRate(10); // make frameRate 10 FPS 10 mise a jour par seconde
  
  if (ouverture_de_fichier_en_cours){
      affichemessagedattente();
      return;
    }
  
  
  
  if (R.on_est_dans_une_fenetre==true) return;
  background(R.couleur_Fond);
  
 

  affichetitre();
  clignote_bouton_info();

  affiche_etat_superposition_des_Qbits();
  G.afficheGraphe();
  
  
  if (Graphes_nQbitsExiste==true)
  Graphes_nQbits.affiche();
  
  
  if(R.active_Bloch==true){//BLOCH
graf3DBloch1.affiche();
if (G.TabSommets.length>2) graf3DBloch2.affiche();
  //image(graf3DBloch1.graf3D, 100, 100);
    
   // Vérifie si le curseur du bloch n'est plus en mouvement et recalcule
  if (isSliderMoving && !mouseIsPressed) {
    G.calcul_LignesQuantiQues_nQbitsEntree_nQbitsSortie();
    isSliderMoving = false; // Réinitialise l'état après avoir appelé la fonction
     derniere_valeur_theta=-10;
     derniere_valeur_phi=-10;
  } //FIN BLOCH
    
    
    if (graf3DBloch1.seDeplace==true){
       graf3DBloch1.x=mouseX-img_selection.width/2;graf3DBloch1.y=mouseY-img_selection.height/2;
    }else if (graf3DBloch2.seDeplace==true){
       graf3DBloch2.x=mouseX-img_selection.width/2;graf3DBloch2.y=mouseY-img_selection.height/2;
    }
    
  }
  
  
  
  afficheAreteEnConstructionOuChemin();
  
  


 
    if (Selection >= 0) {
      
      if (active_redimensionnement==true)
       image(img_dimension,mouseX - img_selection.width / 2,mouseY-img_selection.height/2);
      else image(img_selection,mouseX - img_selection.width / 2,mouseY-img_selection.height/2);
      
      //si la souris touche plus le sommet on deselectionne
      //si on est pas dans le menu des couleurs
      
      /*
      if ( (menuCouleurVisible==false)&&
          (G.NumSommetQuiTouche()!=Selection)){
        //print("deselection",Selection)
          //on regarde quand meme si y a redimensionnement
         if ((active_redimensionnement==true) && (Selection >= 0)){
      
               G.ajouteAretesSommetApresRedimensionnement(Selection);
           G.calcul_LignesQuantiQues_nQbitsEntree_nQbitsSortie();
                active_redimensionnement=false;
    
               } 
        Selection=-1;print("yo je remets à -1 ligne 979")
        active_redimensionnement=false;
      } */
      
      
      //si le sommet sort de l ecran on l efface
      if ((mouseX<0)||(mouseY<0)) if  (Selection>=0)
      if (G.TabSommets[Selection].type!=65) //on efface pas une mesure
      
      {
        G.supprimeSommet(Selection);
        initialise_variables_clic();
      }
      
            
      
      
    } else
      
      {
        
        if (doit_lancer_calcul_LignesQuantiQues_nQbitsEntree_nQbitsSortie==true) {
        G.calcul_LignesQuantiQues_nQbitsEntree_nQbitsSortie();
        
      }
      
      if (typeSelectionne>=0) //affiche un carre de selection
 
  {
    // Récupérer la couleur de l'écran sous la souris
    
  
    
  let col = get(mouseX, mouseY);
    let SommetsDeLareteQueToucheSouris=G.NumDesSommetsDontLAreteToucheSouris();
    
   if (SommetsDeLareteQueToucheSouris!=undefined)
      fill(255, col[1]-40, col[2]-40, 150);
  // Ajuster la couleur du rectangle en fonction de cette couleur
  else fill(col[0]-40, col[1]-40, col[2]-40, 150); // Ajouter de la transparence (alpha)
    noStroke()
    rect(mouseX-15, mouseY-15, 30,30);
    
    if (SommetsDeLareteQueToucheSouris!=undefined)
    if ((typeSelectionne<64)&&(typeSelectionne!=0)){
      
      let num_ligne=G.TabSommets[SommetsDeLareteQueToucheSouris[0]].num_ligne[0];
      let L_controle=G.ListeNumDesSommetsPouvantControleDansLaBandeVerticaleQueToucheSouris(typeSelectionne,num_ligne);
      
      if (L_controle.length>0)
         for (let j = 0; j < L_controle.length; j++) 
            afficheAreteControleEnConstruction(L_controle[j]);
    }
    
    
    
  }
      
}   

 // if (menuCouleurVisible) {
  //  drawMenu_clic_droit_souris(menuCouleurX, menuCouleurY);
 // }
}





function afficheAreteEnConstructionOuChemin() {
  
  if (Selection < 0) return;
  if (mouseIsPressed == false) return;
  if (DernierClicCanevas != 1) return;

  //if (numClic < 0) return;

 
    
  
  Xsouris = G.TabSommets[Selection].x;
  Ysouris = G.TabSommets[Selection].y;
 
  

  
  
    
   
    
    
    if (active_redimensionnement==true){
      let S=G.TabSommets[Selection];
      S.Coeff_hauteur=2*abs(mouseY-S.y)/S.diametre;
      S.calcul_Rayon();
      //print(S.Coeff_hauteur,S.ymin,S.ymax,"nouvelle coord",S.x,S.y)
      
    }
   else{
     
     if ((G.TabSommets[Selection].type!=65) || ((mouseX>10)&&(mouseY>10))){
       
       
       let t= millis();
       if ((t-Time_Click)>Time_doubleClick){
         let y=  mouseY;
       
        G.TabSommets[Selection].changePositionRayon(mouseX,y);
       }
       
          
       }
        
    
   }
    
    
  
}


//affiche une arete de controle en rouge entre la souris et le sommet num
function afficheAreteControleEnConstruction(num) {
  
 
  

 
 
  let xA;
  let xB;
  let yA;
  let yb;
 
  if (G.TabSommets[num].type!=16 && G.TabSommets[num].type!=17){
    xA=mouseX;yA=mouseY;
    xB=G.TabSommets[num].x;yB=G.TabSommets[num].y;
    
  }else{
    xB=mouseX;yB=mouseY;
    xA=G.TabSommets[num].x;yA=G.TabSommets[num].y;
  }
  
    
    fleche(
      xA,yA,xB,yB,
      5,
      5,
      [255,0,0],
      2*epaisseur_Contours
    );
  
  
}

//ci dessous gere les clics et declics sur l ensemble dela page
function mouseClicked() {}

function doubleClicked() {}

function mouseReleased() {}
 

function DoubleClicCanevas() {
 if (demarrage==false )return;
  
  if (mouseButton === RIGHT) return;
  if (menuCouleurVisible == true) return;

  if (R.on_est_dans_une_fenetre==true) return;
  
  double_clic_en_cours=true;
  
  //on regerde si on a double cliqué sur quelquechose
   if (Selection<0) Selection=G.NumSommetQuiTouche();
  

  if (Selection>=0)
    //if (numDeClic >= 0 && numClic >= 0 && numDeClic == numClic) //on a clique sur un sommet et c est sont nimero
    {
    
      
      if (G.TabSommets[Selection].type<=2) //il faut que ce soit un Qbit
   // parametrage_des_coeffs_du_Qbit();
        {
          
          affecte_valeurs_qbit_champs_html();
          
       document.getElementById("affichageParametresqbit").style.display = "inline";
          ouvre_fenetre_met_a_jour_parametres();
          //R.on_est_dans_une_fenetre=true;
          noLoop();  
          
        }
      
      else
      
       if (G.TabSommets[Selection].type==7) //porte R_phi
        {
          
          
          
        affecte_valeurs_phase_nombre_champs_html();
          
       document.getElementById("affichagePhasedeR").style.display = "inline";
          
          ouvre_fenetre_met_a_jour_parametres();
          //R.on_est_dans_une_fenetre=true;
          noLoop();  
          
        }
      
       else
       if ((G.TabSommets[Selection].type==8) ||(G.TabSommets[Selection].type==9)) //portegénérée
        {
          
        
          let id="boutonCree"+G.TabSommets[Selection].phase_nombre.toString();
          affichageCreationPorte(document.getElementById(id));
          
        
        }
      
      
      else
      
      //configuration de l 'oracle'
      if (G.TabSommets[Selection].type==10){
        
        affecte_valeurs_phase_nombre_champs_html();
        
         if (G.TabSommets[Selection].texte_annexe!=""){
           LeTexteDeFonctionOracle=G.TabSommets[Selection].texte_annexe;
        document.getElementById('selectOption').value=6;
           changerTexte(document.getElementById('selectOption'));
          
         } else{
           document.getElementById('selectOption').value=1;
           changerTexte(document.getElementById('selectOption'));
         }
           
         
        
        
         document.getElementById("affichageFonction").style.display = "inline";
          ouvre_fenetre_met_a_jour_parametres();
        //R.on_est_dans_une_fenetre=true;
        
       
        oracle_en_attente_de_fonction=G.TabSommets[Selection];//la valeur de f_oracle ci dessus va etre modifiée par le choix de l utliateur
  
      }
      else
      if (G.TabSommets[Selection].type==65){//mesure partielle
      fait_les_mesures_ligne_quantique(G.TabSommets[Selection].num_ligne[0]);
        print("mesure partielle")
        effaceOuAfficheBoutonsmesures();
      Selection=-1;
      G.affiche_du_nQbit_de_sortie_et_des_probas();
      }
      else {//on a double cliqué mais on fait rien on annule selection
        Selection=-1;
      }
      
  }
  
  
  
  double_clic_en_cours=false;
  
  
 
  
  
}


function clicsurSommetcontrole(numSommet){
  
  let Sommet=G.TabSommets[numSommet];
  
  if (Sommet.type==0) return false;
  if (Sommet.type>=64) return false;
  if ((Sommet.type==16)||(Sommet.type==17)) return false;
  
  
  let dim = Sommet.rayon / 4;
        

        if (
          abs(mouseX - Sommet.x) <= dim &&
          abs(mouseY - Sommet.y + 1.5 * Sommet.rayon) <= dim
        ) { return true}
  
  return false;
}


function ClicCanevas() {
  
  if (demarrage==false )return;
  if (gestionClicGraphicEnergie()==true) return;
  
  if (Graphes_nQbitsExiste==true)
  if (Graphes_nQbits.toucheSouris()==true){
    
    return;
  }
  
  Time_Click =  millis();
 
  
  if (mouseButton === RIGHT) return;
  if (menuCouleurVisible == true) return;

  DernierClicCanevas = 1;
  
  
  
  
  if (R.on_est_dans_une_fenetre==true) return;
  

 // numClicArete = [-1, -1];
  Selection = G.NumSommetQuiTouche();
  active_redimensionnement=false;
  
  //si il peut faire aucune liaison alors on le selectionne
  if (Selection>=0)
 // if (G.Sommet_peut_faire_liaison_avec_autre_sommet(numClic)==false)
  {
    //Selection = numClic;
    // if ((G.TabSommets[numClic].type==10)||(G.TabSommets[numClic].type==11)||(G.TabSommets[numClic].type==12))
     if ((G.TabSommets[Selection].type>=9)&&(G.TabSommets[Selection].type<=15))
     
     {
          let y_lim=(G.TabSommets[Selection].ymin+G.TabSommets[Selection].ymax)/2;
         
         if ((mouseY-y_lim)>10) active_redimensionnement=true;
     }
    
  } 
  
  
  
}


 




function DeclicCanevas() {
  colorPicker.hide();
  if (R.on_est_dans_une_fenetre==true) return;
  
  print("jedeclic bloch=",R.active_Bloch," selection=",Selection,"double_clic_en_cours",double_clic_en_cours,"deplace graphic",Souris_Graphic[0])
  
  if (R.active_Bloch==true){
    
    graf3DBloch1.rotating = false;
    graf3DBloch2.rotating = false;
    graf3DBloch1.seDeplace=false;
    graf3DBloch2.seDeplace=false;

    //return;
  }
  
  affiche_connexion_bit_control=false;//a supprimer dans tous les cas de declics

  if (Souris_Graphic[0]!=-1){//on deplace le graphique et on quitte
    Souris_Graphic=[-1,-1];
    return;
  }
   
  if (double_clic_en_cours==true){//gere une action avec le double clic, on se casse et on initialise les variables
    
    typeSelectionne=-1;
    active_redimensionnement=false;
    return;
  }
  
  
  if (mouseButton === RIGHT) return;
  
  if (menuCouleurVisible == true) {
    //menuCouleurVisible = false;
    Selection=-1;
    active_redimensionnement=false;
    return;
  }
  
  //redimensionnement d une porte, calcul des nouvelles aretes
  
  //print("declic",Selection,active_redimensionnement)
  if ((active_redimensionnement==true) && (Selection >= 0)){
      
     G.ajouteAretesSommetApresRedimensionnement(Selection);
     G.calcul_LignesQuantiQues_nQbitsEntree_nQbitsSortie();
     active_redimensionnement=false;
     Selection = -1;
    return;
  } 
   
  
 // var ClicSommet;

  DernierClicCanevas = 2;
  
 // numDeClic = G.NumSommetQuiTouche();
  
  
   //print("selection",Selection,"type=",typeSelectionne,"numclic=",numClic,"numdeclic=",numDeClic)
/*
  if (numDeClic >= 0 && numClic >= 0 && numDeClic == numClic)
    ClicSommet = numClic;
  //on a cliqué et decliqué sur le même sommet
  else ClicSommet = -1;
*/
  
  //print("ClicSommet",ClicSommet,"SommetDepart",SommetDepart);

  //utilisation du clic sommet pour recuperer des positions de deprt ou d arrivée ds les algos

  
/*
  if (ClicSommet >= 0) {
    Selection = ClicSommet;
    print("yo je cree selection",Selection)
    return;
  }
*/
  /*
  
  if (Selection >= 0) {
    //on deplace le sommet selectionné

    if (numDeClic < 0 && numClic >= 0) {
      //print("dpct", mouseX, " ", mouseY)
      
        
        if ((G.TabSommets[Selection].type!=65) || ((mouseX>10)&&(mouseY>10)))
          {
            G.TabSommets[Selection].changePositionRayon(mouseX, mouseY);
          }
         
    }
    Selection = -1;
    return;
  }*/

  Selection = -1;
  
  
  //on ajoute un sommet si y en a pas a cet emplacementet si on était pas parti ds un cliqué glissé
  if (typeSelectionne>=0)
  //if (numDeClic < 0 && numClic < 0)
  
  {
    
    if (mouseX < 0) return;
    
    if (mouseY < 0) return;
   //  print('ok j affiche le sommet');
    noLoop();
    
    
    G.ajouteSommet(mouseX, mouseY, diametre_default_sommet,typeSelectionne);
    loop();
    typeSelectionne=-1;
    return;
  }

 
 
}

function keyPressed() {
  //parametrage sommeten cours
  // background('yellow');
  //text(`${key} ${keyCode}`, 10, 40);
  // print(keyCode);
  // return;
  
  
  if (R.on_est_dans_une_fenetre==true) return;
  
  codeTouch = keyCode;
  
  //la touche d lancait debugage() : retire d une version publiee.
  //debugage() reste disponible depuis la console du navigateur.
  
 // print("code touche=",codeTouch);
  // print("code touche=", codeTouch,Selection,numClic,numDeClic);
  
  if ((codeTouch != 46 && codeTouch != 8)) return;
  
//si sommet on l efface
  if (Selection >= 0) {
      if (G.TabSommets[Selection].type==65) return;//on efface pas une mesure
      G.supprimeSommet(Selection);
      
       initialise_variables_clic()
      //effaceInputAreteSommet();
      
      return;
      
    }
    

  
}

