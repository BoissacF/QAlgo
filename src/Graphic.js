/* QAlgo — graphique phase / probabilité / partie réelle / partie imaginaire
 *
 * Simulateur de circuits quantiques pour l'enseignement — https://www.qalgo.org
 * Code source : https://github.com/BoissacF/QAlgo
 *
 * Copyright (C) 2025-2026 Frédéric Boissac
 * Logiciel libre sous licence GNU AGPL version 3 ou ultérieure ;
 * voir le fichier LICENSE à la racine du dépôt.
 */
let Monselect;
let Graphes_nQbits;//graphique

let Graphes_nQbitsExiste=false;

let Souris_Graphic=[-1,-1];


function mySelectEvent() {
  
  
  
  Graphes_nQbits.type=Graphes_nQbits.calculType();
  //Graphes_nQbits.Calcul_Valeurs_Graphe(Graphes_nQbits.L(),Graphes_nQbits.H());
  
  
      Graphes_nQbits.Calcul_Valeurs_Graphe();
   
  
  
 // print("type",Graphes_nQbits.type,Graphes_nQbits.L(),largeur)
} 

function graphique(){
  
 
  
  
  if (R.Graphique_visible==false){
    R.Graphique_visible=true;
     //mySelectEvent();
    // Monselect.show();//le rend visible
    
    Monselect.style.display = "block";
    Graphes_nQbits.Calcul_Valeurs_Graphe();
  }else{
    R.Graphique_visible=false;
     //Monselect.hide();//le rend invisible
    Monselect.style.display = "none";
  }
    
  
  
  
}


class Graphique{
  constructor(){
    this.divise_Hauteur_par_deux=false;
    this.type=this.calculType();
    this.echelle_graphe=0;
    this.echelle_Temps_Pour_graphe=0;
     this.L_graphe=210;//largeur par defaut du graphe energie
     this.H_graphe=210;//hauteur par defaut du graphe energie

    this.affiche_plein_ecran=false;
    
     this.x= largeur-this.L_graphe; //postion point haut gauche de this.G*
       this.y=0;  //postion point haut gauche de this.G*
    
  
   this.G=createGraphics(  this.L_graphe,   this.H_graphe);
  this.InitialisationGraphe();
    
    Graphes_nQbitsExiste=true;
    
    
  
    
  
  }
L(){
    return this.G.width;
   }
  
H(){
    return this.G.height;
  }
  
  
  
calculType(){//le numerode type 1:phase 2 : proba 3 Re(amplitude) 4:Im(amplitude)
  
  //print("yoyocalcultype graphics")

  
  
 switch (Monselect.value) {
         case 'Phase':
          this.divise_Hauteur_par_deux=true;
          return 1;
     break;
       case 'Prob': 
        this.divise_Hauteur_par_deux=false;
        return 2;
     break;
      case 'Re(amplitude)':
        this.divise_Hauteur_par_deux=true;
        return 3;
     break;
      case 'Im(amplitude)':
      this.divise_Hauteur_par_deux=true;
      return 4;
     break;
      
     
     
  default:
     return 2;
     break;
     
 }
  
 
}

valeur(Qbit){
  switch (this.type) {
         case 1:
         
          return Qbit.theta_deg;
     break;
       case 2: 
        return 100 * Qbit.proba;
     break;
      case 3:
        return Qbit.x;
     break;
      case 4:
      return Qbit.y;
     break;
  }  
     
 return Qbit.theta_deg; 
}
  
  
CalculLesEchellesPourTracerGraphe(){
 
 print("yo calcul echelle graphics")
  //10,10 c est le zero des origines
  let L=this.L()-10;
  let H=this.H()-10;
//print("Pour le calcul des echelles la hauteur est",H," la largeur est",L)
  
    this.echelle_graphe=0;
    this.echelle_Temps_Pour_graphe=0;
  
     let  n_Qbit=undefined;
   
  
  
  if (OnFaitLesMesures!=0) n_Qbit=G.Qbits_pouraffichage_graphics;//meme chose que this.n_Qbits_mesure mais on a supprimé les etats mesurés, donc nqbit plus court;
    else n_Qbit=G.n_Qbits_sortie; 
  
  var derniere_ordonnee_max=-1000000;
  var derniere_ordonnee_min=1000000;
  
  var amplitude; 
  
  
   //CALCUL DE L ORDONNée max
  for (let i = 0; i < n_Qbit.length; i++) {
      let val=this.valeur(n_Qbit[i]);
    
    if (val<derniere_ordonnee_min) derniere_ordonnee_min=val;
    if (val>derniere_ordonnee_max)derniere_ordonnee_max=val;
  
  }
  
 
  
 if (this.divise_Hauteur_par_deux==true){//on met l axe y au milieu
     amplitude=max(-derniere_ordonnee_min,derniere_ordonnee_max);
     
     amplitude=amplitude+0.1*amplitude;//on grandit un peu l amplitude pour y voir plus clai
    
    this.echelle_graphe=(H/2-20)/amplitude;
   
    
  }
  else {
    
    amplitude=derniere_ordonnee_max;
    
    amplitude=amplitude+0.1*amplitude;//on grandit un peu l amplitude pour y voir plus clai
    
     if (amplitude!=0) this.echelle_graphe=(H-20)/amplitude;
  else this.echelle_graphe=0;
  }
  
 //print("echelle",derniere_ordonnee_min,derniere_ordonnee_max,amplitude,this.echelle_graphe)

  
 
  //CALCUL ABSCISSE.
  
  

  
    
  this.echelle_Temps_Pour_graphe=(L-20)/n_Qbit.length;
  
  
 
//print("echelles",this.echelle_graphe,this.echelle_Temps_Pour_graphe)
  
  
  
 
    
   
  
}


InitialisationGraphe(){
  
  print("yo initialise graphics")
   this.G.clear();
 // print("efface")
  this.G.background(150);
  

  
  var L=this.L();
   var H=this.H();
  
  
   
  
  this.G.textSize(12);
 // this.G.strokeWeight(1);
  
  
  
  
  
  
       //le numerode type 1:phase 2 : proba 3 Re(amplitude) 4:Im(amplitude)
  //this.G.stroke(color(0,0,255));
 switch (this.type) {
         case 1://x(t)
     this.G.text('Phase',5,10);
     break;
       case 2://
     this.G.text('Prob(%)',5,10);
     break;
      case 3://
     this.G.text('Re(amplitude)',5,10);
     break;
      case 4://
     this.G.text('Im(amplitude)',5,10);
     break;
     
 }
  
 // this.G.stroke(0);
  
  
 // (xA, yA, xB, yB, ArrowLength, ArrowWidth, couleur, epaisseur)
  
  
  
  
  
  if (this.divise_Hauteur_par_deux==true) {
           //l ecran est partagée en 2 l origine est aumieu
          this.traceAxes(10,(H-10)/2,L-15,(H-10)/2,10,10,0,2,true);
    this.G.text('|k⟩',L-15,(H-10)/2);
        }else{
          this.traceAxes(10,(H-10),L-15,(H-10),10,10,0,2,true);
    this.G.text('|k⟩',L-15,(H-10));
          
        }
  
  
  this.traceAxes(10,H-10,10,13,10,10,0,2,true);
  
 
  
 
  
   this.boutonwindows();
  
  
  
  
  
}  
  
  
  
 
affiche(){
  
  if (R.Graphique_visible==false) return;
  
  
  if (Souris_Graphic[0]!=-1){//on deplace le graphique
    let dpctx=mouseX-Souris_Graphic[0];
    let dpcty=mouseY-Souris_Graphic[1];
    this.x=this.x+dpctx;
    this.y=this.y+dpcty;
    Souris_Graphic[0]=mouseX;Souris_Graphic[1]=mouseY;
  }
  
  
  
  
  
  if (this.affiche_plein_ecran==false)
   image(this.G,this.x,this.y);
 else  image(this.G,0,0);
  
  
  
  
  var canvasX = canevas.position().x; // récupère la coordonnée x du coin supérieur gauche du canvas
  var canvasY = canevas.position().y; // récupère la coordonnée y du coin supérieur gauche du canvas
//Monselect.position(canvasX +largeur-88, canvasY ); 
  
  
let X=this.x;
let Y=this.y;
  if (Graphes_nQbits.affiche_plein_ecran==true){
    X=0;Y=0;
  }
  let L= this.L_graphe;
  
  
//Monselect.position(canvasX +X+L-88, Y+canvasY );  
  
//Monselect.show();//le rend visible
  Monselect.style.display = "block";
  let XX=canvasX +X+L-88;
  let YY=Y+canvasY ;
  XX=XX.toString();YY=YY.toString();
 Monselect.style.position = "absolute";
  Monselect.style.left = XX+'px';//"100px";
  Monselect.style.top = YY+'px';//"50px";   
  
  
  
  
  
  this.affichevaleurpointeur();
  
}
  
  
 boutonwindows(){
  var L= this.L_graphe;
  var H= this.H_graphe;
   // Dessiner le bouton de fermeture
  this.G.strokeWeight(1);
  this.G.stroke(100);
  this.G.fill(200);
 this.G.rect(L- 18, 3, 15, 15);
  this.G.stroke(0);
  this.G.line(L - 15, 6, L - 6, 15);
  this.G.line(L - 15, 15,L - 6, 6);
  
  // Dessiner le bouton d a grandissement
  this.G.stroke(100);
  this.G.fill(200);
  this.G.rect(L- 36, 3, 15, 15);
  this.G.stroke(0);
  
   
   //print("this.l",this.L(),"largeur",largeur)
   
  if (this.L()<largeur)
  this.G.rect(L- 32, 7, 7, 7);
  else{
  this.G.rect(L- 31, 6, 7, 7);
  this.G.rect(L- 33, 8, 7, 7);
  }
  this.G.noFill();
}

affichevaleurpointeur(){
  
 // print("yopointeur graphics")
 
  let X;
  let Y;
  
  if (this.affiche_plein_ecran==true){
    X=0;Y=0;
  }else{
    X=this.x;Y=this.y;
  }
  
  //print("bjour",X,Y,this.L_graphe,this.H_graphe)
  
  
  if (mouseX<X) return false;
  if (mouseX>X+this.L_graphe) return false;
  if (mouseY<Y) return false;
  if (mouseY>Y+this.H_graphe) return false;
  let signe;//indique si on est au dessu ou audessous de la xe 0 
  
  
 // print("yopointeur graphics lance")
 
  let n_Qbit;
  
   if (OnFaitLesMesures!=0) n_Qbit=G.Qbits_pouraffichage_graphics;//meme chose que this.n_Qbits_mesure mais on a supprimé les etats mesurés, donc nqbit plus court;
    else n_Qbit=G.n_Qbits_sortie;
  
    //raphique=10+i*this.echelle_Temps_Pour_graphe
   X=mouseX-X;
   
  
   
  
  let i=round((X-10)/this.echelle_Temps_Pour_graphe);
  let n=int(i);
  if (n<0) return;
  
  if (n>(n_Qbit.length-1)) return;
 
  let coeff=100*Math.abs(n-i)/i;
  if (coeff>5) return;
  
  let unite="";
  
  
  let precision= parseInt(document.getElementById("precisionChiffresApresVirgule").value);
 if (this.type!=2) {
       precision=precision+2; 
      let Yzero=Y+(this.H()-10)/2;
      if  ((Yzero-mouseY)>=0) signe=+1;//positif
      else signe=-1;
       
      if (this.type==1) unite="°";
   
 } else{//proba
     unite="%";
     signe=+1;
   
 }
  
  
  
  
     
  
         
  
  
  //print("le numero de ket est",n, "  avec x=",X,"typ",this.type)
  let val=roundToDecimals(this.valeur(n_Qbit[i]),precision);
  
  
 
    let num_2px=int(round((2)/this.echelle_Temps_Pour_graphe));
    let k=i;
    //print("recherche valeur plus grande ou plus petite de 0 a + ou -",num_2px," a partir de ",i, " signe=",signe)
    if (num_2px>=1)
     for (let j = 1; j <= num_2px; j++) {
       
       if (((i-j)>=0) && ((i-j)<=(n_Qbit.length-1))){
         let val1=roundToDecimals(this.valeur(n_Qbit[i-j]),precision);
      
         if ((signe*val1)>(signe*val)){ val=val1;k=i-j;}
         
       }
  
      if (((i+j)>=0) && ((i+j)<=(n_Qbit.length-1))){
        let val2=roundToDecimals(this.valeur(n_Qbit[i+j]),precision);
       
       if ((signe*val2)>(signe*val)) { val=val2;k=i+j;}
      }
       
       
       
       
      
       
     }
    if (k!=i){
     //  print("j ai deplace de ",i," a ",k);
      i=k;
     
    }
  
  
 textAlign(LEFT, CENTER); // centre la phrase horizontalement et verticalement
  noStroke();fill(0);
  textSize(12);
  
  text("|"+i.toString()+'⟩ ; '+val.toString()+unite,mouseX,mouseY-10)
  
 // this.G.text(i.toString()+'   '+val.toString(),X,Y);
  
} 
  
toucheSouris(){
  if (R.Graphique_visible==false) return false;
  //if (this.affiche_plein_ecran==true) return false;
  let X;
  let Y;
  
  if (this.affiche_plein_ecran==true){
    X=0;Y=0;
  }else{
    X=this.x;Y=this.y;
  }
  
  
  if (mouseX<X) return false;
  if (mouseX>X+this.L_graphe) return false;
  if (mouseY<Y) return false;
  if (mouseY>Y+this.H_graphe) return false;
 
  
  Souris_Graphic=[mouseX,mouseY];
  return true;
  
  
  
}
traceAxes(xA, yA, xB, yB, ArrowLength, ArrowWidth, couleur, epaisseur){
    
    
  if (dist(xA, yA, xB, yB) <= 1) return; //trop petit pour etre affiché

  if (ArrowLength === undefined) {
    ArrowLength = 10;
  }
  if (ArrowWidth === undefined) {
    ArrowWidth = 8;
  }

  ArrowLength = ArrowLength;
  ArrowWidth = ArrowWidth;

  // Calculs des coordonnées des points C, D et E (sur l axe et les2 //extremites
  
  

  var AB = Math.sqrt(Math.pow(xB - xA, 2) + Math.pow(yB - yA, 2));

  var xC = xB + (ArrowLength * (xA - xB)) / AB;
  var yC = yB + (ArrowLength * (yA - yB)) / AB;
  var xD = xC + (ArrowWidth * -(yB - yA)) / AB;
  var yD = yC + (ArrowWidth * (xB - xA)) / AB;
  var xE = xC - (ArrowWidth * -(yB - yA)) / AB;
  var yE = yC - (ArrowWidth * (xB - xA)) / AB;
  
  
    
  this.G.fill(couleur);
  this.G.stroke(couleur);
  this.G.strokeWeight(epaisseur);

  this.G.line(xA, yA, xB, yB);
     // et on trace le segment [AB], et sa flèche:
  this.G.line(xD, yD, xB, yB);
  this.G.line(xE, yE, xB, yB);
    
 

  this.G.noStroke();
  this.G.strokeWeight(0);
}

    


  
  
 //calcul les valeurs affichées
  Calcul_Valeurs_Graphe(){
    
 
    
    if (R.on_est_dans_une_fenetre==true) return;
   if (Selection>=0) return;
   if (G.n_Qbits_sortie.length<=0) return;
    
   
   
   
    
   
  // print("yo je calucle le graphe")
    
    
   
   
    
  this.G=createGraphics(this.L_graphe,this.H_graphe);
  
 this.InitialisationGraphe();
  this.CalculLesEchellesPourTracerGraphe();
  
    
   
    
  
  
  
  //10,10 c est le zero des origines
  var L=this.L()-10;
   var H=this.H()-10;
    
    
    //print("Pour le calcul des pointsla hauteur est",H," la largeur est",L)
  
     if (this.divise_Hauteur_par_deux==true) {
          H=H/2; //l ecran est partagée en 2 l origine est aumieu
           //print("Pour le calcul des pointsla hauteur est divisée par 2",H);
        }
    
    let  n_Qbit=undefined;
   
   if (OnFaitLesMesures!=0) n_Qbit=G.Qbits_pouraffichage_graphics;//meme chose que this.n_Qbits_mesure mais on a supprimé les etats mesurés, donc nqbit plus court;
    else n_Qbit=G.n_Qbits_sortie;
    
    this.G.strokeWeight(2);
    this.G.stroke(color(255,255,255));
    this.G.fill(color(255,255,255))
    
     
    
    for (let i = 0; i < n_Qbit.length; i++) {
      
      
      
        let val=this.valeur(n_Qbit[i]);
      
      

 //this.G.circle(10+i*this.echelle_Temps_Pour_graphe,H-proba*this.echelle_graphe, 2);
      
      this.G.line(10+i*this.echelle_Temps_Pour_graphe,H-val*this.echelle_graphe,10+i*this.echelle_Temps_Pour_graphe,H);
      
     // print("i=",i,"x=",i*this.echelle_Temps_Pour_graphe,"y=",H-proba*this.echelle_graphe)
      
      
    }  
    
    //reglage visuel du zero
   // this.G.fill(color(255,0,0))
   // this.G.circle(10,H,5);
    
   
  
  
}

}
//fin de la classe

function gestionClicGraphicEnergie(){
  if (R.Graphique_visible==false) return false;
  
 // print("bug",mouseX,mouseY,largeur)
  // clic dans la fermeture
  
  let X=Graphes_nQbits.x;
  let Y=Graphes_nQbits.y;
  if (Graphes_nQbits.affiche_plein_ecran==true){
    X=0;Y=0;
  }
  
  
  
  let L= Graphes_nQbits.L_graphe;
  let H= Graphes_nQbits.H_graphe;
    
  
  
  //if( ((mouseX<(largeur-3))&& (mouseX>(largeur-18)))
  
  //&& ((mouseY>(3))&& (mouseY<(18))))
  
  
  if( ((mouseX<(X+L-3))&& (mouseX>(X+L-18)))
  
  && ((mouseY>(Y+3))&& (mouseY<(Y+18))))
  
  
  
  {
    R.Graphique_visible=false;
    Monselect.style.display = "none";
   // Monselect.hide();//le rend invisible
    return true;
    
    
  }
  
 // if( ((mouseX<(largeur-21))&& (mouseX>(largeur-36)))
  
 // && ((mouseY>(3))&& (mouseY<(18))))
  
  if( ((mouseX<(X+L-21))&& (mouseX>(X+L-36)))
  
  && ((mouseY>(Y+3))&& (mouseY<(Y+18))))
  
  {
    
     if ((Graphes_nQbits.L_graphe==210)&&
      (Graphes_nQbits.H_graphe==210)){
         Graphes_nQbits.L_graphe=largeur;
         Graphes_nQbits.H_graphe=hauteur;
       Graphes_nQbits.affiche_plein_ecran=true;
     }else {
       Graphes_nQbits.L_graphe=210;
   Graphes_nQbits.H_graphe=210;
       Graphes_nQbits.affiche_plein_ecran=false;
    }
     
    
    
      Graphes_nQbits.Calcul_Valeurs_Graphe();
    
    return true;
    
  }
  
  
  
  return false;
  
}





