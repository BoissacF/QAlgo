/* QAlgo — sphère de Bloch 3D et ses curseurs
 *
 * Simulateur de circuits quantiques pour l'enseignement — https://www.qalgo.org
 * Code source : https://github.com/BoissacF/QAlgo
 *
 * Copyright (C) 2025-2026 Frédéric Boissac
 * Logiciel libre sous licence GNU AGPL version 3 ou ultérieure ;
 * voir le fichier LICENSE à la racine du dépôt.
 */
let fontGraphicBloch;
let graf3DBloch1;  // Le graphique 3D du qbit
let graf3DBloch2;  // Le graphique 3D du qbit de sortie

let angleThetaSlider=0;
let anglePhiSlider=0;

let derniere_valeur_theta=-10;
let derniere_valeur_phi=-10;
let isSliderMoving = false; // Le curseur est en mouvement




function valeurs_sliders_ont_change(theta,phi,difference){
  
  
  
  if (Math.abs(theta-derniere_valeur_theta)>=difference){
     derniere_valeur_theta=theta;
     derniere_valeur_phi=phi;
    
    return true;
  }
  
  if (Math.abs(phi-derniere_valeur_phi)>=difference){
     derniere_valeur_theta=theta;
     derniere_valeur_phi=phi;
    
    return true;
  }
  
  return false;
  
}
  
function changeSlider() {
  //if (mouseIsPressed) return; // Annule si la souris est encore enfoncée
  
  //console.log("Nouvelle valeur du slider theta:", angleThetaSlider.value());
   //console.log("Nouvelle valeur du slider pohi:", anglePhiSlider.value());
  isSliderMoving = true; // Le curseur est en mouvement
  let teta_sliders=angleThetaSlider.value();
  let teta=Math.PI*teta_sliders;
  
  let phi_sliders=anglePhiSlider.value()
  let phi=Math.PI*phi_sliders;
  
 // print("teta=",teta,"phi=",phi);
  //retourne [a1,b1,a2,b2] les coefficents complexes du qbit
  let coeffs=convertit_Bloch_complexe(teta,phi);
  
 // let S=G.lignes_quantiques[0][0];
  
  G.lignes_quantiques[0][0].Qbit[0][0].coeff_complexe(coeffs[0],coeffs[1]);
  G.lignes_quantiques[0][0].Qbit[0][1].coeff_complexe(coeffs[2],coeffs[3]);
  
  G.lignes_quantiques[0][0].Qbit[0][2]=G.lignes_quantiques[0][0].Qbit[0][0].proba;
  G.lignes_quantiques[0][0].Qbit[0][3]=G.lignes_quantiques[0][0].Qbit[0][1].proba
  
  
  
  //if (R.Graphique_visible==true)
  if (valeurs_sliders_ont_change(teta_sliders,phi_sliders,0.1))
  
 G.calcul_LignesQuantiQues_nQbitsEntree_nQbitsSortie();
  

 
 
  
  
} 
 



function simuleBloch(){
  
  if (G.lignes_quantiques.length!=1){
    R.active_Bloch=false;
    
    
    graf3DBloch1.dejaaffiche=false;
    
    graf3DBloch2.dejaaffiche=false;
    
    angleThetaSlider.hide();
    anglePhiSlider.hide();
    
     if (langue==1)
      alert(
        "To use the simulator with the Bloch sphere, only a single quantum line is needed."
      );else
        alert(
        "Pour utiliser le simulateur avec la sphère de Bloch, il faut une seule ligne quantique."
      );
    
    
    
    
    
    return;
  }
  
  
 // print("je l  nce simule avec ",R.active_Bloch)
  
  if (R.active_Bloch==false)
  {
    
    graf3DBloch1.initialiseAxes();
    graf3DBloch2.initialiseAxes();
    R.active_Bloch=true;
   
   
  //angleThetaSlider.show();
    //anglePhiSlider.show();
  
  }else
     { R.active_Bloch=false;
      
      graf3DBloch1.dejaaffiche=false;
     
    
    graf3DBloch2.dejaaffiche=false;
      
      
     angleThetaSlider.hide();
    anglePhiSlider.hide();
     }
  
}


class GraphiqueBloch{
  constructor(est_au_debut){
    
  
   
    
    // Créer un canvas 3D secondaire pour dessiner la sphère et les axes
  this.graf3D = createGraphics(220, 220, WEBGL); // Taille du graphique 3D
  this.graf3D.textFont(fontGraphicBloch); // Appliquer la police
    
   this.est_au_debut=est_au_debut;//si au debut qbit sinon c est une mesure
   this.angleX = -Math.PI /8;
    this.angleY = -Math.PI /8;
    this.prevMouseX=0;
    this.prevMouseY=0;
    this.rotating = false;

    this.seDeplace=false;

// Définir les angles de l'axe
this.theta_original = Math.PI / 3; // 30° en radians
this.theta = Math.PI - this.theta_original; // Correction
this.phi = Math.PI / 20; // 45° en radians

    this.dejaaffiche=false;
    
    
   
}
  
initialiseAxes(){
  
  this.angleX = -Math.PI /8;
    this.angleY = -Math.PI /8;
    this.prevMouseX=0;
    this.prevMouseY=0;
    this.rotating = false;
     this.dejaaffiche=false;
    this.seDeplace=false;
}  
  
toucheSouris(){
  if (R.active_Bloch==false) return false;
  
  
  
  if (mouseX<this.x) return false;
  if (mouseX>this.x+220) return false;
  if (mouseY<this.y) return false;
  if (mouseY>this.y+220) return false;
  
 //print("touche la sphere",mouseX,mouseY,this.x,this.y)
  
  return true;
  
 } 
  
  
initialise_sliders(){
  
  
   let S=G.lignes_quantiques[0][0];
  
  let ket0=S.Qbit[0][0];
  let ket1=S.Qbit[0][1];
    
    
    //retourne teta et phi [teta,phi] les coefficients de bloch
 let angles=convertit_complexe_Bloch(ket0,ket1);
 
  // Dessiner d'autres éléments 2D sur le canvas principal
  
 
  // Récupérer les valeurs des curseurs et les affecter à teta et phi
  
  
  this.theta_original = angles[0];
  this.theta = Math.PI - this.theta_original; // Correction
  this.phi = angles[1];
  
  
  
  angleThetaSlider.value(this.theta_original/Math.PI);
  anglePhiSlider.value(this.phi/Math.PI);
  
 
  
  
  
}  
 
  

affiche(){
  
  
  if (G.lignes_quantiques.length!=1){
    R.active_Bloch=false;graf3DBloch1.dejaaffiche=false;
    angleThetaSlider.hide();
    anglePhiSlider.hide();
    return;
  }
  
  
  
  
  textAlign(CENTER, CENTER);
  
  
  
  let canvasX = canevas.position().x; // récupère la coordonnée x du coin supérieur gauche du canvas
  let canvasY = canevas.position().y; // récupère la coordonnée y du coin supérieur gauche du canvas
  if (this.dejaaffiche==false){
    
    let S;
    if (this.est_au_debut==false){
       S=G.lignes_quantiques[0][G.lignes_quantiques[0].length-1];
      this.x= S.x+S.rayon-220;
      this.y= S.y+S.rayon+20;
    }else{
       S=G.lignes_quantiques[0][0];
 this.x= S.x-S.rayon;
  this.y= S.y+S.rayon+20;
      this.initialise_sliders();
 
    }
     this.dejaaffiche=true;
    }
  
  
  
  
  
  if (this.est_au_debut==true){//debut
    
  
   angleThetaSlider.position(canvasX +this.x+50, this.y+240+canvasY ); // Placer le curseur sous le graphique 
  anglePhiSlider.position(canvasX +this.x+50, this.y+270+canvasY ); // Placer le curseur sous le graphique
 
    angleThetaSlider.show();
    anglePhiSlider.show();
    
    
  // Dessiner d'autres éléments 2D sur le canvas principal
  
 
  // Récupérer les valeurs des curseurs et les affecter à teta et phi
  
  
  this.theta_original = Math.PI*angleThetaSlider.value();
  this.theta = Math.PI - this.theta_original; // Correction
  this.phi = Math.PI*anglePhiSlider.value();
  
  
   textSize(12);
  let t = this.theta_original/Math.PI;
  t=t.toFixed(2);
  let p = this.phi/Math.PI;
  p=p.toFixed(2);
  
  let phi = "\u03C6";   // Code Unicode pour φ
  let theta = "\u03B8"; // Code Unicode pour θ
  text(theta+"="+t.toString()+"xπ",this.x+110, this.y+235); 
  text(phi+"="+p.toString()+"xπ",this.x+110, this.y+265);
  
  
  

 
  }//fin de c est au debut
  
  else{// c est a la fin
    
   
   
  //deux complexes distincts : convertit_complexe_Bloch les lit tous les deux
  //a la fois, le jeton de complexe_au_rang ne conviendrait pas
  let ket0=complexe_depuis_vecteur(G.n_Qbits_sortie.re[0],G.n_Qbits_sortie.im[0],G.n_Qbits_sortie.pr[0]);
  let ket1=complexe_depuis_vecteur(G.n_Qbits_sortie.re[1],G.n_Qbits_sortie.im[1],G.n_Qbits_sortie.pr[1]);
    
    
    //retourne teta et phi [teta,phi] les coefficients de bloch
 let angles=convertit_complexe_Bloch(ket0,ket1);
 
  // Dessiner d'autres éléments 2D sur le canvas principal
  
 
  // Récupérer les valeurs des curseurs et les affecter à teta et phi
  
  
  this.theta_original = angles[0];
  this.theta = Math.PI - this.theta_original; // Correction
  this.phi = angles[1];
  
  
   textSize(12);
  let t = this.theta_original/Math.PI;
  t=t.toFixed(2);
  let p = this.phi/Math.PI;
  p=p.toFixed(2);
  
  let phi = "\u03C6";   // Code Unicode pour φ
  let theta = "\u03B8"; // Code Unicode pour θ
  text(theta+"="+t.toString()+"xπ",this.x+110, this.y+235); 
  text(phi+"="+p.toString()+"xπ",this.x+110, this.y+255);
  
    
    
    
    
    
    
    
    
    
    
    
  }//fin de c est a la fin
  
  
  
   // Rotation de la scène en fonction du mouvement de la souris
  if (this.rotating) {
    let deltaX = -mouseX + this.prevMouseX;
    let deltaY = -mouseY + this.prevMouseY;

    this.angleX += deltaY * 0.01;
    this.angleY -= deltaX * 0.01;
  }

  // Mettre à jour les positions de la souris pour le prochain calcul
  this.prevMouseX = mouseX;
  this.prevMouseY = mouseY;

  this.draw3DAxesAndSphere();
  this.graf3D.textSize(14);
  // Afficher le graphique 3D (la sphère et les axes) dans le canvas 2D
  image(this.graf3D, this.x, this.y); // Afficher à une position donnée dans le canvas principal

  
  
  if (this.toucheSouris()==true){
        image(img_selection,this.x,this.y)
        
    
  }
    
  
}

 draw3DAxesAndSphere() {
  // Dessiner la sphère et les axes dans le graphique 3D
  //this.graf3D.background(200);
   this.graf3D.background(200)

  this.graf3D.push(); // Sauvegarder l'état actuel de la transformation

  // Rotation de la sphère et des axes en fonction de la souris
  this.graf3D.rotateX(this.angleX);
  this.graf3D.rotateY(this.angleY);
 // Activer le tri de profondeur
  //this.graf3D.enableDepthTests();
  // Dessiner les axes dans le graphique 3D
  this.drawAxesInGraf3D();

  // Dessiner la sphère avec de la transparence
  this.graf3D.fill(240, 240, 240, 100);
   //noStroke();noFill();
    this.graf3D.noStroke();
   
 // this.graf3D.stroke(240,240,240,0); // Sphère avec de la transparence (alpha = 100) la transparence ne fonctionne pas pour le stroke !!!!
   
   
   
  this.graf3D.sphere(75); // Dessiner la sphère avec un diamètre de 50
  
  this.graf3D.pop(); // Restaurer l'état du graphique
   
  
   
}

drawAxesInGraf3D() {
  // Calculer les coordonnées de l'axe défini par theta et phi
  let r = 72;  // Longueur de l'axe
  let x = r * Math.sin(this.theta) * Math.cos(this.phi);
  let y = r * Math.sin(this.theta) * Math.sin(this.phi);
  let z = r * Math.cos(this.theta);

  // Dessiner l'axe défini par (theta, phi)
  this.graf3D.strokeWeight(3);
  this.graf3D.stroke(0, 0, 0, 150); // Vert avec 150 de transparence
  this.graf3D.line(0, 0, 0, y, z, x);  // Tracer l'axe depuis l'origine jusqu'au point (x, y, z)
 // this.graf3D.strokeWeight(1);

  // Dessiner un petit cercle noir au bout de la ligne
  this.graf3D.push();  // Sauvegarder l'état pour la transformation du cercle
  this.graf3D.translate(y, z, x);  // Déplacer à la position finale de l'axe
  this.graf3D.fill(0);  // Remplir le cercle en noir
  this.graf3D.sphere(5);  // Dessiner un cercle avec un rayon de 5
  this.graf3D.pop();  // Restaurer l'état après avoir dessiné le cercle
  
   // Dessiner les ellipses représentant les angles theta et phi
 //this.drawEllipseForTheta( r, z);
//  this.drawEllipseForPhi(r);
  
  
  this.graf3D.strokeWeight(2);
  // Dessiner les axes X, Y, Z
  this.graf3D.stroke(255, 0, 0, 150); // Rouge avec 150 de transparence
  this.graf3D.line(-100, 0, 0, 100, 0, 0);
// this.graf3D.textSize(24);
  this.graf3D.fill(255, 0, 0, 150); // Texte rouge avec 150 de transparence
  this.graf3D.text('Y', 80, 0);

  this.graf3D.stroke(255, 0, 255, 150); // Violet avec 150 de transparence
  this.graf3D.line(0, -100, 0, 0, 100, 0);
 //this.graf3D.textSize(24);
  this.graf3D.fill(255, 0, 255, 150); // Texte violet avec 150 de transparence
  this.graf3D.text('Z', 0, -85);

  this.graf3D.push(); // Sauvegarder l'état pour l'axe X
  this.graf3D.stroke(0, 0, 255, 150); // Bleu avec 150 de transparence
  this.graf3D.line(0, 0, -110, 0, 0, 110);

  //this.graf3D.textSize(24);
  this.graf3D.fill(0, 0, 255, 150); // Texte bleu avec 150 de transparence

  this.graf3D.push(); // Sauvegarder l'état de la transformation pour l'étiquette
  this.graf3D.translate(0, 0, 100);  // Déplacer l'étiquette à l'extrémité de l'axe Y
  this.graf3D.text('X', 0, 0);  // Dessiner l'étiquette "X" au bout de l'axe X
  this.graf3D.pop(); // Restaurer l'état de la transformation pour l'étiquette
  this.graf3D.pop(); // Restaurer l'état pour l'axe X
  
 // this.graf3D.strokeWeight(4);
   // Dessiner les ellipses représentant les angles theta et phi
  this.drawEllipseForTheta( r, z);
  this.drawEllipseForPhi(r);
  //this.graf3D.strokeWeight(1);
}

drawEllipseForTheta(r, z) {

  
  let r_ellipse = r * Math.sin(this.theta); // Rayon du cercle de latitude
this.graf3D.push();
  this.graf3D.translate(0, z, 0); // Placer l'ellipse à la bonne hauteur
   this.graf3D.rotateX(Math.PI / 2); // Tourner l'ellipse pour la placer sur le plan XY
this.graf3D.noFill();
this.graf3D.stroke(0, 0, 255); // Bleu
this.graf3D.ellipse(0, 0, 2 * r_ellipse, 2 * r_ellipse); // Dessiner l'ellipse avec le bon rayon
this.graf3D.pop();
  
  
}

// Fonction pour dessiner l'ellipse représentant phi (dans le plan parallèle XY)
drawEllipseForPhi(r) {
  
  
  this.graf3D.push();
  this.graf3D.rotateY(this.phi+Math.PI / 2); // Tourner l'ellipse pour la placer dans le plan parallèle XY
  this.graf3D.stroke(0, 0, 255); // Bleu
  this.graf3D.noFill();
  this.graf3D.ellipse(0, 0, 2 * r, 2 * r); // Ellipse avec un rayon de r
  this.graf3D.pop();
  
}



}