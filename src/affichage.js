/* QAlgo — fenêtres de l'interface, éditeur de matrice, portes créées par l'utilisateur
 *
 * Simulateur de circuits quantiques pour l'enseignement — https://www.qalgo.org
 * Code source : https://github.com/BoissacF/QAlgo
 *
 * Copyright (C) 2025-2026 Frédéric Boissac
 * Logiciel libre sous licence GNU AGPL version 3 ou ultérieure ;
 * voir le fichier LICENSE à la racine du dépôt.
 */
/*
let R.affiche_coefficients_Qbit=true;
let R.affiche_coefficients_et_Probas_nQbit=true;
let R.couleur_Fond ="#c8c8c8"; //200gris clair
let R.on_est_dans_une_fenetre=false;
let R.type_affichage_qBit=1;//1: complexe ; 2: trigo 3 : bloch
let R.unite_angle=1;//1 degre 2//rad 3//multiple de PI
let R.affiche_decimal=false;//affcihe les etats |0111> en decimal

*/
let couleur_mesure=0;// donne un effet couleur a chaque mesure, du rouge au noir

let matrice_generee = [];//matrice generee

let Bouton_mis_a_jour_matrice=undefined;//qaund on met a jour une matrice de porte generee
let liste_boutons_crees=[];//liste de tous les boutons crees avec leur matrice etc...

let M;//class qui gère l affichage de la matrice avec le curseur, sa ligne, colonne etc...

/*INTERFACE


function initialise_texte_R_phi(num){


function valide_choix_phase_R()
function ouvre_fenetre_met_a_jour_parametres(){

function ferme_fenetre_met_a_jour_parametres(){
function affichage_Qbit_et_Probas(){

function Efface_affichage_Qbit_et_Probas(){

function valide_choix_affichage_generale(){
function fenetre_affichage_generale(){

 function affecte_valeurs_phase_nombre_champs_html(){

//affecte les coefficients du qbits aux champs html qu on a lorsqu on double clic sur un qbit
function affecte_valeurs_qbit_champs_html(){
  
}


//return tuple des valeurs du qbit recuperees
function retourne_coeff_qbit(messageErreur=false){

function valide_Input_parametres_qBit() {

// Fonction JS pour modifier le format chosi du qbit
function changerOptionQbit(selectElement) {
//si on change d unite d angle il faut changer les affichages
function change_affichage_angle(unite1,unite2){
// Fonction JS pour modifier le format chosi du qbit
function changerAngle(selectElement) {

// Fonction JS pour modifier le contenu du textarea
function changerTexte(selectElement) {






// Fonction JS pour modifier le contenu du textarea
function changerTexte(selectElement) {



function fermeraffichagecommande(element){
function affichageCommande(element){
function fermeraffichagecommande(element){






function generateMatrix() 
function affichageCreationPorte(element){


// Fonction JS pour modifier le format chosi du coeff de matrice
function changerOptionCoeffmatrice(selectElement) {


function recupere_coeff_matrice_et_affiche_matrice(messageErreur=false){
function affiche_valeur_matrice_dans_champs_html(){

//modifie ou non les champshtml des coeffs de la matrice, fonctionne avec la fonction suivante
function modifie_champs_html_sichangementFormatMatrice(C1,champs1=false,champs2=false){

// Fonction qui ajoute un bouton gris lorsqu'on clique sur le bouton "Créer/porte"
    function CreationPorte() {
    
    
    
class AfficheMatrix {
  constructor(){
    this.curseurmatrice=0;//varie de 0 à n2  - 1 //indice pour se deplacer dans la matrice html
    
methodes :
deplacecurseur(element) 

affiche_matrice_generee()
setMatrixValue(x,y) {
    
setMatrixColor(x,y,enbleu=false) {

    
  }
  
  
  
   
    
    
*/
let clignote=0;


function clignote_bouton_info(){
  if (clignote<=0) return;
  clignote=clignote-1;
  
 
  
 
  
  
  if (clignote%2!=0){
     document.getElementById('boutonTexte').style.color = '#0d6efd'; // 
    
    document.getElementById('boutonTexte').style.backgroundColor = 'white'; 
  }else
  {
     document.getElementById('boutonTexte').style.color = 'white'; // 
    
    document.getElementById('boutonTexte').style.backgroundColor = '#0d6efd';
  }
 
  
}



function affichemessagedattente() {
  
   background(R.couleur_Fond);
  
  fill(0);
  textAlign(CENTER, CENTER); // centre la phrase horizontalement et verticalement
  textSize(100); // définit la taille de la police de la phrase
  let montexte0 = "Chargement en cours";
  
  let montexte = "Les calculs avec beaucoup de qBits peuvent être longs";
  let montexte2 = "Merci de patienter quelques secondes";
  
  
  if (langue==1){
    montexte0 = "Loading";
  
  montexte = "Calculations with many qBits can be long";
  montexte2 = "Please wait a few seconds";
  
    
    
  }

  let largeur_montexte = textWidth(montexte);
  while (largeur_montexte > width) {
    textSize(textSize() - 1);
    largeur_montexte = textWidth(montexte);
  }

 
  
  


  fill(255, 0, 0);
  
  

  
  text(montexte0, width / 2,-2*textSize()+ height / 2);
  text(montexte, width / 2, height / 2);
  text(montexte2, width / 2,2*textSize()+ height / 2);

  fill(0);
 
  
  //noLoop();
}





function initialise_texte_R_phi(num){
    
    let n=String((roundToDecimals(G.TabSommets[num].phase_nombre/Math.PI, 2)));
  if (n==0) G.TabSommets[num].texte_indice="0";
  else if (n==1) G.TabSommets[num].texte_indice='π';
  else if (n==-1) G.TabSommets[num].texte_indice='-π';
  else G.TabSommets[num].texte_indice=n+'π';
  }

function valide_choix_phase_R(){
  
   if (Selection<0) return true;//on arrete , pas de selection
   let unite=document.getElementById("unitePhase").value;
  
  
let phi = document.getElementById('phiPhaseR').value;

  if (phi == "") return false;
  
  
    phi = parseFloat(phi);
  
    // Vérifie si la conversion est un nombre valide
    if (isNaN(phi)) {
      if (langue==1)
      alert(
        "you have to enter numbers. If possible your Qbit should be normalized, otherwise it will be normalized automatically."
      );else
         alert(
        "tu dois rentrer des nombres. Si possible ton Qbit doit être normalisé, sinon il sera normalisé automatiquement."
      );
      document.getElementById('phiPhaseR').value="";
      return false;
    }
  
  
  
  
   
  if (unite==1){//degre
    G.TabSommets[Selection].phase_nombre=Math.PI*phi/180;
  } else
    if (unite==2){//radian
    G.TabSommets[Selection].phase_nombre=phi;
  }if (unite==3){//milti^ple de pi
    G.TabSommets[Selection].phase_nombre=Math.PI*phi;
  }
  
   initialise_texte_R_phi(Selection);
  
  
  
  
  
  
  
  
  loop();
  //on reinitialise les variables de clic
  numClicArete[0] = -1;
  numClicArete[1] = -1;
 
  Selection = -1;
 active_redimensionnement=false;
  
  
  
  return true;
}


function ouvre_fenetre_met_a_jour_parametres(){
  print("ouvrefenetre")
  R.on_est_dans_une_fenetre=true;
  if (R.affiche_coefficients_et_Probas_nQbit==true) Efface_affichage_Qbit_et_Probas();
  
  R.supprimme_affichages();
 
  
  
  
}

function ferme_fenetre_met_a_jour_parametres(){
  Selection=-1;//cool doit etre ici
  
  R.on_est_dans_une_fenetre=false;
  if (R.affiche_coefficients_et_Probas_nQbit==true) affichage_Qbit_et_Probas();
  
  R.remet_parametres_affichages();
}


function affichage_Qbit_et_Probas(){
  
 
  
    G.affiche_du_nQbit_de_sortie_et_des_probas();
   // textContainer1.show();//afficher la fenetre
    //textContainer2.show();//afficher la fenetre
     

}

function Efface_affichage_Qbit_et_Probas(){
  
 
  
     textContainer1.style.display = "none";
  textContainer2.style.display = "none"; 
    //textContainer1.hide();//ne pas afficher la fenetre
    //textContainer2.hide();//ne pas afficher la fenetre
     

}

function nbreQbitsregistreY(){
  

  
  
  let n = document.getElementById("nbreqbitsregistre").value;
  if (n=="") {
    document.getElementById("nbreqbitsregistre").value="1";
    return;
    
  }
   n = parseInt(n);
   
    

    // Vérifie si la conversion est un nombre valide
    if ((isNaN(n) )||(n<=0)) {
     
      if (langue==1)
        alert(
        "you must enter a whole number"
      );
      
      else
      alert(
        "tu dois rentrer un nombre entier"
      );
      document.getElementById("nbreqbitsregistre").value="1";
    return;
    }
  
  
  if (Selection>=0){
     
     G.TabSommets[Selection].phase_nombre=n;
     G.TabSommets[Selection].nAretes_min=1+n;
    print("modif du nbre de registre : ",n)
  }
  
}
 


function valide_choix_affichage_generale(){
  R.couleur_Fond = document.getElementById("colorPicker").value;
  
  
         // Vérifier quelle case est cochée
        if (document.getElementById("radioOuiSuper").checked) {
            R.option_superposition=true;
        } else if (document.getElementById("radioNonSuper").checked) {
            R.option_superposition=false
        } 
  
         
  
        
        // Vérifier quelle case est cochée
        if (document.getElementById("radioOui").checked) {
            R.affiche_coefficients_Qbit=true;
        } else if (document.getElementById("radioNon").checked) {
            R.affiche_coefficients_Qbit=false
        } 
  
  
    // Vérifier quelle case est cochée
        if (document.getElementById("radioOuiProba").checked) {
            R.affiche_coefficients_et_Probas_nQbit=true;
        } else if (document.getElementById("radioNonProba").checked) {
            R.affiche_coefficients_et_Probas_nQbit=false;
          print("R.affiche_coefficients_Qbitproba",R.affiche_coefficients_et_Probas_nQbit)
        } 
  
  
     // Vérifier quelle case est cochée
        if (document.getElementById("radioOuidecimal").checked) {
            R.affiche_decimal=true;
        } else if (document.getElementById("radioNondecimal").checked) {
            R.affiche_decimal=false;
          
        } 
  
  
  
 
}

function fenetre_affichage_generale(){
  
     //R.on_est_dans_une_fenetre=true; 
  ouvre_fenetre_met_a_jour_parametres();
  
   document.getElementById("affichageParametresAffichage").style.display = "inline";
  
  
  
  
  
  document.getElementById("colorPicker").value=R.couleur_Fond;
  
  
  
}


//modifie ou non les champshtml du qbit, fonctionne avec la fonction suivante
function modifie_champs_html_qbits(C1,C2,champs1=false,champs2=false,champs3=false){
  
  //print("modifie",champs1,champs2,champs3)
  
  let texte="qBit normalisé : ";
  if ((C1.x!=0)||(C1.y!=0)) texte=texte+C1.texte_complexe(false)+"|0⟩";
  if ((C2.x!=0)||(C2.y!=0)) texte=texte+C2.texte_complexe(false)+"|1⟩";
  document.getElementById("qbitnormalise").textContent=texte;
  
  print("ket0",C1.x,C1.y)
   print("ket1",C2.x,C2.y)
  
  
  
  if (champs1==true){
  document.getElementById('a1').value=C1.x;
  document.getElementById('b1').value=C1.y;
  document.getElementById('a2').value=C2.x;
  document.getElementById('b2').value=C2.y;
   
  }
  
  
  
  
  
  if (champs2==true){
  document.getElementById('rtrigo1').value=C1.r;
  
  document.getElementById('rtrigo2').value=C2.r;
  
  
  
  if (R.unite_angle==1){//degre
    document.getElementById('tetatrigo1').value=C1.theta_deg;
    document.getElementById('tetatrigo2').value=C2.theta_deg;
    
    
   
  }else
    if (R.unite_angle==2){//rad
    document.getElementById('tetatrigo1').value=C1.theta_rad;
    document.getElementById('tetatrigo2').value=C2.theta_rad;

  }else
    if (R.unite_angle==3){//rad
    document.getElementById('tetatrigo1').value=C1.k;
    document.getElementById('tetatrigo2').value=C2.k;
  }
  }
  
  
  if (champs3==true){
    
    
    
    let teta;
    let phi;
    //en fait je multiplie (a1+b1i)|0> + (a2+b2i)[1> par (a1-b1i)/racine(a1a1 + b1b1)]
    
    //cas particulier ket 1 , dans ce cas teta=Pi et teta/2 = Pi/2
    if (C1.r==0){
      teta=Math.PI;
      
      phi = C2.theta_rad;
      
    }else
    if (C2.r==0){
      
      //attention au modulo ici c est pas 2pi mais pi car ya le 2 !!!
      if ((C1.x<0) ||(C1.y<0))teta=2*Math.PI;//un peu au pif, ce sont des qbits equivalent -|0> et + |0>
      else teta=0;
      phi = 0;
      
    }else
    
    
    {//cas normal
      //pour ket o cette multiplication donne le module
    //donc teta s obtient a partir du module
     teta=2*Math.acos(C1.r);
    
   // pour ket 1 on obtient la partie reelle A et lapartie imaginaire B
    let A= (C1.x*C2.x + C1.y*C2.y)/C1.r;
    let B = (C1.x*C2.y-C1.y*C2.x)/C1.r;
    
    //print("A=",A," B=",B)
    
    //phi s obtient comme d habitude
     phi= 0;
    if (A==0) phi = Math.acos(B);
    else
  // Calcul de l'argument theta en radians
     phi = Math.atan2(B, A);
    
   // print("Phi=",phi)
      
    }
    
    
    
   
    
    if (R.unite_angle==1){//degre
    
    document.getElementById('tetabloch1').value=teta*180/Math.PI;
    document.getElementById('phibloch').value=phi*180/Math.PI; document.getElementById("tetabloch2").textContent=roundToDecimals(parseFloat(document.getElementById('tetabloch1').value),2);
   
  }else
    if (R.unite_angle==2){//rad
    document.getElementById('tetabloch1').value=teta;
    document.getElementById('phibloch').value=phi;
      document.getElementById("tetabloch2").textContent=roundToDecimals(parseFloat(document.getElementById('tetabloch1').value),2);

  }else
    if (R.unite_angle==3){//rad
    document.getElementById('tetabloch1').value=teta/Math.PI;
      document.getElementById("tetabloch2").textContent=roundToDecimals(parseFloat(document.getElementById('tetabloch1').value),2);
    document.getElementById('phibloch').value=phi/Math.PI;
  }
    
    
    //print("aprss",teta,phi)
    
    
  }
  
   
  
}

function affecte_valeurs_phase_nombre_champs_html(){
  
        
        if (Selection<0)return
        
        let phase_nombre=G.TabSommets[Selection].phase_nombre;
         //print(G.TabSommets[Selection])
  
  
        if (phase_nombre==undefined) return;
        
        if (G.TabSommets[Selection].type==10){//oracle, nbre d elements du deuxieme registre
          document.getElementById("nbreqbitsregistre").value=phase_nombre;
          return;
        }
        
        
        if (G.TabSommets[Selection].type==7){//phase
          
          let unitPhase=document.getElementById("unitePhase").value;
          
          
          if (unitPhase==1){//degre
    
            document.getElementById("phiPhaseR").value=roundToDecimals(phase_nombre*180/Math.PI,10);
  } else
    if (unitPhase==2){//radian
    document.getElementById("phiPhaseR").value=roundToDecimals(phase_nombre,10);
  }if (unitPhase==3){//milti^ple de pi
    document.getElementById("phiPhaseR").value=roundToDecimals(phase_nombre/Math.PI,10);
   
  }
          
          
          
          return;
        }
        
      }



//affecte les coefficients du qbits aux champs html qu on a lorsqu on double clic sur un qbit
function affecte_valeurs_qbit_champs_html(){
  if (Selection<0) return;
  let Q=G.TabSommets[Selection].Qbit[0];
  let C1=Q[0];//complexe 0 devant |0>
  let C2=Q[1];//complexe 1 devant |1>
  
  //modifie les3 champsa partir des complexes c1 c2 du qbit
  modifie_champs_html_qbits(C1,C2,true,true,true);
  
  
}

//return tuple des valeurs du qbit recuperees
function retourne_coeff_qbit(messageErreur=false){
   // let R.type_affichage_qBit=1;//1: complexe ; 2: trigo 3 : bloch
//let R.unite_angle=1;//1 degre 2//rad
  let a1;
  let a2;
  let b1;
  let b2;
  print("R.type_affichage_qBit dans retournecoeffqbit",R.type_affichage_qBit)
  document.getElementById("qbitnormalise").textContent="";
  
  
  let champs1=true;
  let champs2=true;
  let champs3=true;
  
  
  
  if (R.type_affichage_qBit==1){
  champs1=false;
  a1 = document.getElementById('a1').value;
 a2 = document.getElementById('a2').value;
   b1 = document.getElementById('b1').value;
   b2 = document.getElementById('b2').value;
  
  if ((a1 == "")&&(a2 == "")&&(b1 == "")&&(b2 == "")) return undefined;
  
  if (a1=="") a1=0;if (a2=="") a2=0;if (b1=="") b1=0;if (b2=="") b2=0;

    // Tente de convertir la chaîne en nombre flottant
    a1 = parseFloat(a1);
    a2 = parseFloat(a2);
    b1 = parseFloat(b1);
    b2 = parseFloat(b2);
    
    

    // Vérifie si la conversion est un nombre valide
    if (isNaN(a2) || isNaN(a1)|| isNaN(b1)|| isNaN(b2)) {
      if (messageErreur==true)
        if (langue==1)
      alert(
        "you have to enter numbers. If possible your Qbit should be normalized, otherwise it will be normalized automatically."
      );else
        alert(
        "tu dois rentrer des nombres. Si possible ton Qbit doit être normalisé, sinon il sera normalisé automatiquement."
      );
        
      return undefined;
    }
   

  } //affichae normal
  else if (R.type_affichage_qBit==2){//reiteta
    
     champs2=false;
    let r1=document.getElementById('rtrigo1').value;
    let teta1=document.getElementById('tetatrigo1').value;
    let r2=document.getElementById('rtrigo2').value;
    let teta2=document.getElementById('tetatrigo2').value;
    
    if ((r1 == "")&&(r2 == "")&&(teta1 == "")&&(teta2 == "")) return undefined;
  
  if (r1=="") r1=0;if (r2=="") r2=0;if (teta1=="") teta1=0;if (teta2=="") teta2=0;

    // Tente de convertir la chaîne en nombre flottant
    r1 = parseFloat(r1);
    r2 = parseFloat(r2);
    teta1 = parseFloat(teta1);
    teta2 = parseFloat(teta2);

    // Vérifie si la conversion est un nombre valide
    if (isNaN(r2) || isNaN(r1)|| isNaN(teta1)|| isNaN(teta2)) {
      if (messageErreur==true)
        if (langue==1)
          alert(
        "you have to enter numbers. If possible your Qbit should be normalized, otherwise it will be normalized automatically."
      );
      else
      alert(
        "tu dois rentrer des nombres. Si possible ton Qbit doit être normalisé, sinon il sera normalisé automatiquement."
      );
      return undefined;
    }

    if((r1<0)||(r2<0)){
      
      if (messageErreur==true)
        if (langue==1)
           alert(
        "The modulus of a complex must be positive"
      );else
      alert(
        "Le module d'un complexe doit être positif"
      );
      return undefined;
    }
    //les calculs se font en radians si degré il faut convertir
    
   
    if (R.unite_angle>=2){//radian 
      
      
      if (R.unite_angle==3){
        teta1=Math.PI*teta1;
        teta2=Math.PI*teta2;
      }
      
      
      a1=r1*Math.cos(teta1);b1=r1*Math.sin(teta1);
      a2=r2*Math.cos(teta2);b2=r2*Math.sin(teta2);
    }else{
     teta1=teta1 * (Math.PI/180);teta2=teta2 * (Math.PI/180);
    a1=r1*Math.cos(teta1);b1=r1*Math.sin(teta1);
      a2=r2*Math.cos(teta2);b2=r2*Math.sin(teta2);
    }
    
  
    
  }else if (R.type_affichage_qBit==3){//bloc
      champs3=false;
    let teta=document.getElementById('tetabloch1').value;
    let phi=document.getElementById('phibloch').value;
    document.getElementById("tetabloch2").textContent=roundToDecimals(parseFloat(teta),2);
    
    
    
    
    if ((teta == "")&&(phi == "")) return undefined;
  
  if (teta=="") teta=0;if (phi=="") phi=0;
    // Tente de convertir la chaîne en nombre flottant
    teta = parseFloat(teta);
    phi = parseFloat(phi);
    

    // Vérifie si la conversion est un nombre valide
    if (isNaN(teta) || isNaN(phi)) {
      if (messageErreur==true)
        if (langue==1)
      alert(
        "you have to enter numbers. If possible your Qbit should be normalized, otherwise it will be normalized automatically."
      );else
        alert(
        "tu dois rentrer des nombres. Si possible ton Qbit doit être normalisé, sinon il sera normalisé automatiquement."
      );
        
      return undefined;
    }

    if (R.unite_angle>=2){//radi
      if (R.unite_angle==3){
        teta=Math.PI*teta;
        phi=Math.PI*phi;
      }
      
      a1=Math.cos(teta/2);b1=0;
      a2=Math.sin(teta/2)*Math.cos(phi);b2=Math.sin(teta/2)*Math.sin(phi);
      
    
     
      
      
    }else{
     teta=teta * (Math.PI/180);phi=phi * (Math.PI/180);
      a1=Math.cos(teta/2);b1=0;
      a2=Math.sin(teta/2)*Math.cos(phi);b2=Math.sin(teta/2)*Math.sin(phi);
    }
    
   // print(teta,phi,a1,a2,b1,b2)
    
  }
  
  
 
  let norme = sqrt(a1 * a1 + a2 * a2+b1 * b1 + b2 * b2);
  //on normalise
    a1=a1/norme;b1=b1/norme;a2=a2/norme;b2=b2/norme;
  
  let c1=new complexe(a1,b1);
 let c2=new  complexe(a2,b2);
  
  
  print(c1,c2)
 
 /*
  let texte="qBit normalisé : ";
  if ((c1.x!=0)||(c1.y!=0)) texte=texte+c1.texte_complexe(false)+"|0⟩";
  if ((c2.x!=0)||(c2.y!=0)) texte=texte+c2.texte_complexe(false)+"|1⟩";
  document.getElementById("qbitnormalise").textContent=texte;
 */
  print("avec typeaffichage=",R.type_affichage_qBit,"les valeurs sont",a1," ",b1," ",a2," ",b2)
  print("avt les valeurs html sont",document.getElementById('a1').value," ",document.getElementById('b1').value," ", document.getElementById('a2').value," ",document.getElementById('b2').value);
  
  modifie_champs_html_qbits(c1,c2,champs1,champs2,champs3)
  
  print("apres les valeurs html sont",document.getElementById('a1').value," ",document.getElementById('b1').value," ", document.getElementById('a2').value," ",document.getElementById('b2').value);
    return[a1,b1,a2,b2]
}

//recupère et valude les champs input des parametres du qbit
function valide_Input_parametres_qBit() {
  
  let L=retourne_coeff_qbit(true);
  if (L==undefined) return false;
  let a1=L[0];
  let b1=L[1];
  let a2=L[2];
  let b2=L[3];

     if (OnFaitLesMesures!=0) initialise_mesures();//si mesure on doit reinitialiser
    
    
 // print("avant norme",a1,b1,a2,b2)
  
     

   // G.TabSommets[Selection].Qbit[0] = [a, b, a * a, b * b];
  
//  print("apres norme",a1,b1,a2,b2)
  
    G.TabSommets[Selection].calcul_coeff_Qbit(a1,b1,a2,b2,0);
  
    
  
    //on doit tout recalculer
   
  
  
  G.calcul_LignesQuantiQues_nQbitsEntree_nQbitsSortie();

   
  
  loop();
  //on reinitialise les variables de clic
  numClicArete[0] = -1;
  numClicArete[1] = -1;
 
 
  

  Selection = -1;
 active_redimensionnement=false;
  return true;
    
}

 // Fonction JS pour modifier le format chosi du qbit
function changerOptionQbit(selectElement) {
 
     // 
     if (selectElement.value == "1") {
        
      document.getElementById("complexe").style.display = "inline";
       document.getElementById("trigo").style.display = "none";
       document.getElementById("bloch").style.display = "none";
       document.getElementById("unite").style.display = "none";
        R.type_affichage_qBit=1;
       document.getElementById("selectQbitAffichage").value="1";
        document.getElementById("selectQbit").value="1";
        
      } else
      if (selectElement.value == "2") {
        document.getElementById("complexe").style.display = "none";
       document.getElementById("trigo").style.display = "inline";
       document.getElementById("bloch").style.display = "none";
        document.getElementById("unite").style.display = "inline";
         R.type_affichage_qBit=2;
        document.getElementById("selectQbitAffichage").value="2";
        document.getElementById("selectQbit").value="2";
        
      }else
      if (selectElement.value == "3") {
        document.getElementById("complexe").style.display = "none";
       document.getElementById("trigo").style.display = "none";
       document.getElementById("bloch").style.display = "inline";
        document.getElementById("unite").style.display = "inline";
         R.type_affichage_qBit=3;//on ne peut pas afficher avec bloch
        document.getElementById("selectQbitAffichage").value="2";
        document.getElementById("selectQbit").value="3";
      }
    retourne_coeff_qbit(false);
}

//si on change d unite d angle il faut changer les affichages
function change_affichage_angle(unite1,unite2){
  
    let v1=document.getElementById('tetatrigo1').value;
    let v2=document.getElementById('tetatrigo2').value;
    let v3=document.getElementById('tetabloch1').value;
    let v4=document.getElementById('phibloch').value;
    let v5=document.getElementById('coefftetatrigo1').value;
  
    let Pi=Math.PI;
    let coeff=PI/180;
    let phase1=document.getElementById("phiPhaseR").value;
  
  
    print(Pi)
  
  
  
  
  if (unite1==1){//degre
       if (unite2==2){//rad
         document.getElementById("phiPhaseR").value=roundToDecimals(phase1*coeff,10);
         document.getElementById('tetatrigo1').value=roundToDecimals(v1*coeff,10);
         document.getElementById('tetatrigo2').value=roundToDecimals(v2*coeff,10);
         document.getElementById('tetabloch1').value=roundToDecimals(v3*coeff,10);
document.getElementById("tetabloch2").textContent=roundToDecimals(parseFloat(document.getElementById('tetabloch1').value),2);
         document.getElementById('phibloch').value=roundToDecimals(v4*coeff,10);
         document.getElementById('coefftetatrigo1').value=roundToDecimals(v5*coeff,10);
         
       }else
       if (unite2==3){//multi
         document.getElementById("phiPhaseR").value=roundToDecimals(phase1/180,10);
         document.getElementById('tetatrigo1').value=roundToDecimals(v1/180,10);
         document.getElementById('tetatrigo2').value=roundToDecimals(v2/180,10);
         document.getElementById('tetabloch1').value=roundToDecimals(v3/180,10);
  document.getElementById("tetabloch2").textContent=roundToDecimals(parseFloat(document.getElementById('tetabloch1').value),2);
         document.getElementById('phibloch').value=roundToDecimals(v4/180,10);
         document.getElementById('coefftetatrigo1').value=roundToDecimals(v5/180,10);
       }
    
    
  }
  else if (unite1==2){//rad
    if (unite2==1){//deg
         document.getElementById("phiPhaseR").value=roundToDecimals(phase1/coeff,10);
         document.getElementById('tetatrigo1').value=roundToDecimals(v1/coeff,10);
         document.getElementById('tetatrigo2').value=roundToDecimals(v2/coeff,10);
         document.getElementById('tetabloch1').value=roundToDecimals(v3/coeff,10);
      document.getElementById("tetabloch2").textContent=roundToDecimals(parseFloat(document.getElementById('tetabloch1').value),2);
         document.getElementById('phibloch').value=roundToDecimals(v4/coeff,10);
      document.getElementById('coefftetatrigo1').value=roundToDecimals(v5/coeff,10);
         
       }else
       if (unite2==3){//multi
         document.getElementById("phiPhaseR").value=roundToDecimals(phase1/Pi,10);
         document.getElementById('tetatrigo1').value=roundToDecimals(v1/Pi,10);
         document.getElementById('tetatrigo2').value=roundToDecimals(v2/Pi,10);
         document.getElementById('tetabloch1').value=roundToDecimals(v3/Pi,10);
         document.getElementById("tetabloch2").textContent=roundToDecimals(parseFloat(document.getElementById('tetabloch1').value),2);
         document.getElementById('phibloch').value=roundToDecimals(v4/Pi,10);
         document.getElementById('coefftetatrigo1').value=roundToDecimals(v5/Pi,10);
       }
    
  }else if (unite1==3){//rad multiple de pi
    if (unite2==1){//deg
         document.getElementById("phiPhaseR").value=roundToDecimals(phase1*180,10);
         document.getElementById('tetatrigo1').value=roundToDecimals(v1*180,10);
         document.getElementById('tetatrigo2').value=roundToDecimals(v2*180,10);
         document.getElementById('tetabloch1').value=roundToDecimals(v3*180,10);
      document.getElementById("tetabloch2").textContent=roundToDecimals(parseFloat(document.getElementById('tetabloch1').value),2);
         document.getElementById('phibloch').value=roundToDecimals(v4*180,10);
      document.getElementById('coefftetatrigo1').value=roundToDecimals(v5*180,10);
         
       }else
       if (unite2==2){//rad
         document.getElementById("phiPhaseR").value=roundToDecimals(phase1*Pi,10);
         document.getElementById('tetatrigo1').value=roundToDecimals(v1*Pi,10);
         document.getElementById('tetatrigo2').value=roundToDecimals(v2*Pi,10);
         document.getElementById('tetabloch1').value=roundToDecimals(v3*Pi,10);
         document.getElementById("tetabloch2").textContent=roundToDecimals(parseFloat(document.getElementById('tetabloch1').value),2);
         document.getElementById('phibloch').value=roundToDecimals(v4*Pi,10);
         document.getElementById('coefftetatrigo1').value=roundToDecimals(v5*Pi,10);
       }
  }
  
}



 // Fonction JS pour modifier le format chosi du qbit
function changerAngle(selectElement) {
    
     //si on change d unite d angle il faut changer les affichages
 change_affichage_angle( R.unite_angle,parseInt(selectElement.value));
  
  
  
  
  
     if (selectElement.value == "1") {
        R.unite_angle=1;
       document.getElementById("uniteaffichage").value="1";
        document.getElementById("uniteAngleQbit").value="1";
       document.getElementById("uniteAngleMatrice").value="1";
       document.getElementById("unitePhase").value="1";
        var elements = document.getElementsByClassName("affichePi");
for (var i = 0; i < elements.length; i++) {
    elements[i].style.display = "none";
}
     
      } else
        if (selectElement.value == "2")
        {
      R.unite_angle=2;
        document.getElementById("uniteaffichage").value="2";
        document.getElementById("uniteAngleQbit").value="2";
          document.getElementById("uniteAngleMatrice").value="2";
          var elements = document.getElementsByClassName("affichePi");
for (var i = 0; i < elements.length; i++) {
    elements[i].style.display = "none";
}
       document.getElementById("unitePhase").value="2";
      }else
         {
      R.unite_angle=3;
        document.getElementById("uniteaffichage").value="3";
        document.getElementById("uniteAngleQbit").value="3";
           document.getElementById("unitePhase").value="3";
           document.getElementById("uniteAngleMatrice").value="3";
           var elements = document.getElementsByClassName("affichePi");
for (var i = 0; i < elements.length; i++) {
    elements[i].style.display = "inline";
}
        
      }
  
  
   retourne_coeff_qbit(false);
     
  
}




  

  
  
 


 // Fonction JS pour modifier le contenu du textarea
function changerTexte(selectElement) {
  
  
 
      var texte = "";
      
      // Modifie le texte du textarea en fonction de la valeur sélectionnée
     if (selectElement.value == "1") {
        
        texte = "function f(x){\n   if (x == 5) return 1;\n   else return 0;\n   }";
        
        
      } else
      if (selectElement.value == "2") {
        texte = "function f(x) {\n   let L = ['Bob', 'John', 'Toto', 'Elies', 'Juju','Fredo','Manu','Asterix'];\n   if (L[x] == 'Juju') {return 1;}\n    else {return 0;}\n   }";
      } else  if (selectElement.value == "3") { 
        texte = "function f(x) {\n   return 1;\n   }";
        
        } else  if (selectElement.value == "4") { //f(x) est équilibrée (0 si x estpair , 1 si impair)
         texte="function f(x) {\n   if (x%2==0) return 0;\n   return 1;\n   }";
        
        
      }else  if (selectElement.value == "5") { 
         texte=
         "function f(x) {\n   let binaire = x.toString(2);\n   let resultat = 0;\n   for (let bit of binaire) {\n      resultat ^= parseInt(bit);\n      }\n   return resultat;\n   }";
        
        
      }else  if (selectElement.value == "6") { 
         texte= LeTexteDeFonctionOracle;
         
        
        
      }

  
 
      // Met à jour le contenu du textarea avec le texte choisi
     document.getElementById('fonctionTextarea').value = texte;
 // document.getElementById('fonctionTextarea').innerText = texte;
  
 // print(texte)
  //document.getElementById('fonctionTextarea').textContent = texte;
   //document.getElementById('selectOption').value=6;
  
    }

function affichageCommande(element){
  
  //R.on_est_dans_une_fenetre=true;
  ouvre_fenetre_met_a_jour_parametres();
  if (element.id=="boutonTexte"){
    
   
    document.getElementById("explication").style.display = "inline";
  } else
  
  document.getElementById("affichageCommande").style.display = "inline";
  
 
  
 // if ( R.affiche_coefficients_et_Probas_nQbit) Efface_affichage_Qbit_et_Probas();//pour pas que les fenetres de probas cachent la fenetre de fonction
  
  
  
}

function fermeraffichagecommande(element){
  
  
  
  
  if (element.id=="boutonOkexplication"){
   document.getElementById("explication").style.display = "none";
    let texteArea = document.getElementById('explicationAlgo').value;
    
    if (texteArea.substring(0, 4)!="Ici,"){
      
      let nouveauTexte = texteArea.replace(/;/g, ',').replace(/!/g, '.');
      
      texte_explication_algo=nouveauTexte;
    }
    else
      texte_explication_algo="";
    
   
    
    
    
  }
  else
  
  if (element.id=="boutonok"){
   document.getElementById("affichageCommande").style.display = "none";
    
  }
  else
    if (element.id=="boutonOkfonction"){
      
      try{
      let r=F_oracle(8);
        print("r=",r)
        if ((r==-1)||(r[0]!=0)&&(r[0]!=1)){
          if (langue==1)
          alert("There must be an error in the code of your function. Your function must return 0 or 1. Check.");
          else
            alert("Il doit y avoir une erreur dans le code de ta fonction.Ta fonction doit renvoyer 0 ou 1. Verifie.")
          erreurdansoracle=true;
           ferme_fenetre_met_a_jour_parametres();
        return;
        }
      } catch {
        if (langue==1)
          alert("There must be an error in the code of your function. Your function must return 0 or 1. Check.");
          else
            alert("Il doit y avoir une erreur dans le code de ta fonction.Ta fonction doit renvoyer 0 ou 1. Verifie.")
        erreurdansoracle=true;
         ferme_fenetre_met_a_jour_parametres();
        return;
      }
      
      print("je ferme")
   document.getElementById("affichageFonction").style.display = "none";
        oracle_en_attente_de_fonction.texte_annexe=document.getElementById('fonctionTextarea').value;
     // oracle_en_attente_de_fonction.texte_annexe=document.getElementById('fonctionTextarea').textContent;
      
     erreurdansoracle=false;
      LeTexteDeFonctionOracle=oracle_en_attente_de_fonction.texte_annexe;
        document.getElementById('selectOption').value=6;
      
       let nbre= Math.max(oracle_en_attente_de_fonction.nAretes_entrantes-oracle_en_attente_de_fonction.phase_nombre,8);
        oracle_en_attente_de_fonction.f_oracle=F_oracle(nbre);
        if (OnFaitLesMesures!=0)initialise_mesures();
     
      
        print("mon calcul d oracle pour 8 bits",oracle_en_attente_de_fonction.f_oracle);
      //ON INITIALISE ET RECALCULE LES LIGNES
          G.calcul_LignesQuantiQues_nQbitsEntree_nQbitsSortie();
      
       
    }
 
  else 
   if (element.id=="boutonAnnulerfonction"){
     
     if (erreurdansoracle==false){//si pas d erreur on change rien
       print("pas d erreur d oracle")
       document.getElementById("affichageFonction").style.display = "none";
        //R.on_est_dans_une_fenetre=false;
       
      
       ferme_fenetre_met_a_jour_parametres();
       return;
     }
     //sinon y a une erreur on modifie
     erreurdansoracle=false;
     LeTexteDeFonctionOracle = "function f(x) {\n   return 0;\n   }";
      
     oracle_en_attente_de_fonction.texte_annexe=LeTexteDeFonctionOracle;
        document.getElementById('selectOption').value=6;
     
     
     
      print("je ferme mais modifie la fonction")
   document.getElementById("affichageFonction").style.display = "none";
     
      let nbre= Math.max(oracle_en_attente_de_fonction.nAretes_entrantes-oracle_en_attente_de_fonction.phase_nombre,8);
     oracle_en_attente_de_fonction.f_oracle=F_oracle(nbre);
     if (OnFaitLesMesures!=0)initialise_mesures();
     
     // oracle_en_attente_de_fonction.texte_annexe=document.getElementById('fonctionTextarea').value;
        print("mon calcul d oracle pour 8 bits",oracle_en_attente_de_fonction.f_oracle);
     //ON INITIALISE ET RECALCULE LES LIGNES
       G.calcul_LignesQuantiQues_nQbitsEntree_nQbitsSortie();
     
     
     
   } else
  
  if (element.id=="boutonparametre"){
    
    
    print("selection",Selection)
    
    //recupere les valeurs du champs pour intialiser la valeur des coefficients du qBIT
 if (valide_Input_parametres_qBit()==false) {
    //ferme_fenetre_met_a_jour_parametres();
   return;
 }
   document.getElementById("affichageParametresqbit").style.display = "none";
    graf3DBloch1.dejaaffiche=false;
    
  }
 
   else
  
  if (element.id=="boutonparametreaffichage"){
   
 valide_choix_affichage_generale();
   document.getElementById("affichageParametresAffichage").style.display = "none";
    
  }
  
    else
  
  if (element.id=="boutonphaseR"){
    if (valide_choix_phase_R()==false) return;
    document.getElementById("affichagePhasedeR").style.display = "none";
    //ON INITIALISE ET RECALCULE LES LIGNES
       G.calcul_LignesQuantiQues_nQbitsEntree_nQbitsSortie();
  }
  
  
  else 
   if (element.id=="boutonAnnulermatrice"){
     
     
       document.getElementById("affichagematrice").style.display = "none";
       
       
     }
  
  else 
   if (element.id=="boutonOkmatrice"){
     
     
       document.getElementById("affichagematrice").style.display = "none";
     
     if (Bouton_mis_a_jour_matrice!=undefined){
     //on a modifié la matrice , doit mettre mettre a jour tous les sommets deja crees avec ce bouton
      mise_a_jour_des_portes_generees_deja_placees();
     
     
     }else
       CreationPorte();
       
     }
  
  
  
  
  
  
  ferme_fenetre_met_a_jour_parametres();
  //R.on_est_dans_une_fenetre=false;
    
}






function generateMatrix(matrice_deja_faite=undefined) {
  
  
     if (matrice_deja_faite!=undefined){
       
       /* Une COPIE, et non la matrice du bouton elle meme : les cases que l on
          remplit ne doivent pas modifier la porte avant le clic sur OK. Sans
          cela « Annuler » n annulait rien -- les coefficients etaient deja
          appliques a toutes les portes posees, qui partagent la matrice du
          bouton -- et les etats intermediaires de la saisie entraient dans
          l historique du circuit. La copie n est reversee dans le bouton qu au
          clic sur OK, par mise_a_jour_des_portes_generees_deja_placees(). */
       matrice_generee=copie_matrice(matrice_deja_faite);
       
     }else
       
     {
    let n = parseInt(document.getElementById("nombrelignequantique").value);
    n = 2 ** n;
    
  
  
  //on genere une matrice unitaire
  matrice_generee = [];
  /*for (let i = 0; i < n; i++) {
    // Créer un tableau de taille n rempli de zéros
    matrice_generee[i] = new Array(n).fill(new complexe(0,0));
  }attention c est le même complexe sur toute la ligne, ne fonctionne pas*/
  
  for (let i = 0; i < n; i++) {
    matrice_generee.push([]);
    for (let j = 0; j < n; j++)
       if (i==j) matrice_generee[i][j] = new complexe(1,0);
       else matrice_generee[i][j] = new complexe(0,0);
  }
     }
  
 
  
  
   
  
  M= new AfficheMatrix();
  document.getElementById("texteindice").textContent="0,0";
  document.getElementById("coeffa1").value=matrice_generee[0][0].x.toString();
  document.getElementById("coeffb1").value=matrice_generee[0][0].y.toString();
  recupere_coeff_matrice_et_affiche_matrice();
  
  
  
 M.affiche_matrice_generee();

   
   
  M.setMatrixColor(0,0,true);
}


function affichageCreationPorte(element){
  
  
  
  
     //R.on_est_dans_une_fenetre=true; 
  ouvre_fenetre_met_a_jour_parametres();
  
   document.getElementById("affichagematrice").style.display = "inline";
  document.getElementById("symboleportecree").focus();
  
  if (document.getElementById("selectnotationcoeff").value!="1"){
    document.getElementById("selectnotationcoeff").value="1";
    changerOptionCoeffmatrice(document.getElementById("selectnotationcoeff"));
  }
  Bouton_mis_a_jour_matrice=undefined;
  
  
  if (element.id!="boutonporte"){
    
   
    typeSelectionne=-1;
    let numerobouton=parseInt(element.id.substr(10));
    print("numerobouton=",numerobouton)
    //boutonSelectionne
      
    
    
     Bouton_mis_a_jour_matrice= liste_boutons_crees[numerobouton];
   
    //if (boutonSelectionne.nAretes_max==1)  typeSelectionne =8;else typeSelectionne =9;
    
    
    
    
   
    
   document.getElementById("nombrelignequantique").value=Bouton_mis_a_jour_matrice.nAretes_max.toString();
    document.getElementById("symboleportecree").value=Bouton_mis_a_jour_matrice.symbole;
    
    
    document.getElementById("generematrice").style.display = "none";
    
     document.getElementById("nombrelignequantique").disabled = true;  // Désactiver l'input
    
    generateMatrix(Bouton_mis_a_jour_matrice.matrice);
    
    
    
    
  }
  
  
  
  else {
    
    if ((G.lignes_quantiques.length>=1)&&(G.lignes_quantiques.length<=8))
     document.getElementById("generematrice").style.display = "inline";
    else
      document.getElementById("generematrice").style.display = "none";
     document.getElementById("nombrelignequantique").disabled = false;  // activer l'input
    document.getElementById("nombrelignequantique").value="1";
     generateMatrix();
  }
  
 
 
 
  
  
  
}


//on a modifié la matrice , doit mettre mettre a jour tous les sommets deja crees avec ce bouton
 function    mise_a_jour_des_portes_generees_deja_placees(){
   
   print("yo je mets z a jour")
    Bouton_mis_a_jour_matrice.symbole=document.getElementById("symboleportecree").value;
    
    Bouton_mis_a_jour_matrice.matrice= matrice_generee;
    Bouton_mis_a_jour_matrice.oublie_chaine_matrice();//la matrice a change
   
  // print(Bouton_mis_a_jour_matrice,liste_boutons_crees[Bouton_mis_a_jour_matrice.numero])
   
  // Bouton_mis_a_jour_matrice= liste_boutons_crees[Bouton_mis_a_jour_matrice.numero];
   
   //print("l id est ")
   document.getElementById(Bouton_mis_a_jour_matrice.id).textContent=Bouton_mis_a_jour_matrice.symbole;
   
   for (let i = 0; i < G.TabSommets.length; i++) {
      if (G.TabSommets[i] != undefined)
        
        if ((G.TabSommets[i].type==8)||(G.TabSommets[i].type==9))
     if (G.TabSommets[i].phase_nombre==Bouton_mis_a_jour_matrice.numero){
       print("ca le fait")
       G.TabSommets[i].matrice=Bouton_mis_a_jour_matrice.matrice;
       G.TabSommets[i].texte=Bouton_mis_a_jour_matrice.symbole;
     }
       
   
 }

 }



// Fonction JS pour modifier le format chosi du coeff de matrice
function changerOptionCoeffmatrice(selectElement) {
 
     // 
     if (selectElement.value == "1") {
        
      document.getElementById("coeffcomplexe").style.display = "inline";
       document.getElementById("coefftrigo").style.display = "none";
       
       document.getElementById("uniteMatrice").style.display = "none";
        
        
      } else
      if (selectElement.value == "2") {
        document.getElementById("coeffcomplexe").style.display = "none";
       document.getElementById("coefftrigo").style.display = "inline";
       
        document.getElementById("uniteMatrice").style.display = "inline";
         
        
      }
  
  recupere_coeff_matrice_et_affiche_matrice();
    
}

function recupere_coeff_matrice_et_affiche_matrice(messageErreur=false){
  
  
  let type_affichage_matrice=document.getElementById('selectnotationcoeff').value;//1: complexe ; 2: trigo
//let R.unite_angle=1;//1 degre 2//rad
  let a1;
 
  let b1;
  
 
  
  
  let champs1=true;
  let champs2=true;
  
  
  
  
  if (type_affichage_matrice=="1"){
  champs1=false;
  a1 = document.getElementById('coeffa1').value;
 
   b1 = document.getElementById('coeffb1').value;
 
  
  if ((a1 == "")&&(b1 == "")) return undefined;
  
  if (a1=="") a1=0;if (b1=="") b1=0;

    // Tente de convertir la chaîne en nombre flottant
    a1 = parseFloat(a1);
    
    b1 = parseFloat(b1);
   
    
    

    // Vérifie si la conversion est un nombre valide
    if ( isNaN(a1)|| isNaN(b1)) {
      
        if (messageErreur==true)
        if (langue==1)
      alert(
        "you have to enter numbers. If possible your Qbit should be normalized, otherwise it will be normalized automatically."
      );else
        alert(
        "tu dois rentrer des nombres. Si possible ton Qbit doit être normalisé, sinon il sera normalisé automatiquement."
      );
        
      return undefined;
    }
    
    
     

  } //affichae normal
  else if (type_affichage_matrice=="2"){//reiteta
    
     champs2=false;
    let r1=document.getElementById('coeffrtrigo1').value;
    let teta1=document.getElementById('coefftetatrigo1').value;
    
    
    if ((r1 == "")&&(teta1 == "")) return undefined;
  
  if (r1=="") r1=0;if (teta1=="") teta1=0;

    // Tente de convertir la chaîne en nombre flottant
    r1 = parseFloat(r1);
    
    teta1 = parseFloat(teta1);
   

    // Vérifie si la conversion est un nombre valide
    if ( isNaN(r1)|| isNaN(teta1)) {
        if (messageErreur==true)
        if (langue==1)
          alert(
        "you have to enter numbers. "
      );
      else
      alert(
        "tu dois rentrer des nombres."
      );
      return undefined;
    }

    if((r1<0)){
        if (messageErreur==true)
        if (langue==1)
           alert(
        "The modulus of a complex must be positive"
      );else
      alert(
        "Le module d'un complexe doit être positif"
      );
      return undefined;
    }
    //les calculs se font en radians si degré il faut convertir
    
   
    if (R.unite_angle>=2){//radian 
      
      
      if (R.unite_angle==3){
        teta1=Math.PI*teta1;
        
      }
      
      
      a1=r1*Math.cos(teta1);b1=r1*Math.sin(teta1);
     
    }else{
     teta1=teta1 * (Math.PI/180);
    a1=r1*Math.cos(teta1);b1=r1*Math.sin(teta1);
      
    }
    
  
    
  }
  
  
 
  
  
  let c1=new complexe(a1,b1);
 
  
  
  print(c1)
 

  //print("avec typeaffichage=",R.type_affichage_qBit,"les valeurs sont",a1," ",b1)
 
  
  //modifie_champs_html_qbits(c1,champs1,champs2)
  
    modifie_champs_html_sichangementFormatMatrice(c1,champs1,champs2);
    
   // return[a1,b1]
  
  
  
  
  //affiche la valeur courante dans la matrice
 // let n = parseInt(document.getElementById("nombrelignequantique").value);
 // n = 2 ** n;
  //let ligne =  Math.floor(M.curseurmatrice / n);
 //let colonne =M.curseurmatrice % n;
  
  
  
  matrice_generee[M.ligne_curseur][M.colonne_curseur].coeff_complexe(a1,b1);
  M.setMatrixValue(M.ligne_curseur,M.colonne_curseur);
  
  
}


function affiche_valeur_matrice_dans_champs_html(){
 // let n = parseInt(document.getElementById("nombrelignequantique").value);
  //n = 2 ** n;
  //let ligne =  Math.floor(M.curseurmatrice / n);
 // let colonne =M.curseurmatrice % n;
  
  
 
  
  let C1=matrice_generee[M.ligne_curseur][M.colonne_curseur];
  modifie_champs_html_sichangementFormatMatrice(C1,true,true);
  
  
}


//modifie ou non les champshtml des coeffs de la matrice, fonctionne avec la fonction suivante
function modifie_champs_html_sichangementFormatMatrice(C1,champs1=false,champs2=false){
  
  
  
 // print("coeffs a=",C1.x,"  b=",C1.y)
  
  
  
  
  if (champs1==true){
  document.getElementById('coeffa1').value=C1.x;
  document.getElementById('coeffb1').value=C1.y;
  
   
  }
  
  
  
  
  
  if (champs2==true){
  document.getElementById('coeffrtrigo1').value=C1.r;
  
  
  
  
  
  if (R.unite_angle==1){//degre
    document.getElementById('coefftetatrigo1').value=C1.theta_deg;
    
    
    
   
  }else
    if (R.unite_angle==2){//rad
    document.getElementById('coefftetatrigo1').value=C1.theta_rad;
    

  }else
    if (R.unite_angle==3){//rad
    document.getElementById('coefftetatrigo1').value=C1.k;
    
  }
  }
  
  
  
  
   
  
}



//Une copie independante d une matrice de complexes : les deux matrices ne
//partagent plus aucun objet, on peut modifier l une sans toucher a l autre.
function copie_matrice(matrice){
  let copie=[];
  for (let i = 0; i < matrice.length; i++) {
    copie.push([]);
    for (let j = 0; j < matrice.length; j++)
      copie[i][j]=new complexe(matrice[i][j].x,matrice[i][j].y);
  }
  return copie;
}


class BoutonPorte {// c est une porte qui a été créé
  constructor(numero,matrice,symbole=undefined,nAretes_max=undefined) {
    
    
    this.numero=numero;//ca sera son indice dans la liste  liste_boutons_crees
    
    if (symbole!=undefined) this.symbole=symbole; else
    this.symbole=document.getElementById('symboleportecree').value;
    
    if (this.symbole=="") this.symbole=numero.toString();
    this.matrice=copie_matrice(matrice);
    this.cache_chaine=null;//voir chaine_matrice()
    
    if (nAretes_max!=undefined) this.nAretes_max=nAretes_max; else
    this.nAretes_max=parseInt(document.getElementById("nombrelignequantique").value);
    
    
    
    this.id="boutonCree"+numero.toString();
    var newButton = document.createElement('button');
    newButton.type = 'button';
     
      
    newButton.id=this.id;
      
        newButton.className = 'btn btn-secondary btn-sm p-0 d-flex align-items-center justify-content-center';
        newButton.style.width = '25px';
        newButton.style.height = '25px';
        newButton.style.marginRight = '5px';
        newButton.style.marginBottom = '5px';  // Ajouter un espacement au bas pour qu'ils ne se chevauchent pas

    
    
    
    
    // Attribuer les données pour le tooltip
newButton.setAttribute('data-bs-toggle', 'tooltip');
newButton.setAttribute('data-bs-placement', 'top');
//newButton.setAttribute('title', 'Double-Clic ici pour visualiser ou modifier la matrice');

    newButton.setAttribute('title', 'Double-Click here to view or edit the matrix');
    
    
    
        // Ajouter du texte ou une icône au bouton
      
        newButton.innerHTML =this.symbole ;
      newButton.onfocus = function() {
    choix_type(this);
};

    
    // Ajouter l'événement de double-clic
newButton.addEventListener('dblclick', function() {
  affichageCreationPorte(this);
  
});
    
    
    
        // Ajouter le bouton au container de boutons
        var container = document.getElementById('button-container');
        container.appendChild(newButton);
    
    
  }
  
  
  /* La matrice en texte, telle que CodeGraphEnString() l attend, gardee en
     cache. L historique releve le circuit entier toutes les 800 ms : reecrire
     les 4^n coefficients a chaque relevé coutait 350 ms a 10 qbits, en pure
     perte puisque la matrice d un bouton ne change presque jamais. On ne la
     reconstruit donc qu apres oublie_chaine_matrice(). */
  chaine_matrice(){
    if (this.cache_chaine===null){
      let M=this.matrice;
      let chaine="";
      for (let u = 0; u < M.length; u++) 
            for (let v = 0; v <M.length; v++){
                 chaine=chaine+M[u][v].x.toString()+";"
                 chaine=chaine+M[u][v].y.toString()+";"
                 
           }
      this.cache_chaine=chaine;
    }
    return this.cache_chaine;
  }
  
  
  //a appeler des que la matrice du bouton a change
  oublie_chaine_matrice(){
    this.cache_chaine=null;
  }
}
  
  
function EffaceButton(buttonId) {
    var button = document.getElementById(buttonId);
    if (button) {
        button.remove();  // Retire l'élément du DOM
    } else {
        console.log('Bouton non trouvé avec l\'id: ' + buttonId);
    }
}




 // Fonction qui ajoute un bouton gris lorsqu'on clique sur le bouton "Créer/porte"
    function CreationPorte() {
        // Créer un nouveau bouton
      
      let nbre=liste_boutons_crees.length;
      liste_boutons_crees.push(new BoutonPorte(nbre,matrice_generee));
      
      /* Le constructeur en a pris une copie : garder la notre doublait la
         memoire d une porte creee (276 Mo au lieu de 138 a 10 qbits) jusqu a
         la prochaine ouverture de la fenetre. La fenetre est fermee, et toute
         reouverture repasse par generateMatrix(), qui la reconstruit. */
      matrice_generee=[];
      
     
    }



function afficheImage(bouton) {
  let img;
  if (bouton.id=="type5"){
       img = document.getElementById("H");
  }  else if (bouton.id=="type3"){
       img = document.getElementById("X");
  }  else if (bouton.id=="type6"){
       img = document.getElementById("Y");
  }  else if (bouton.id=="type4"){
       img = document.getElementById("Z");
  }  else if (bouton.id=="type12"){
       img = document.getElementById("SWAP");
  }  else if (bouton.id=="type7"){
       img = document.getElementById("Rphi");
  }  else if (bouton.id=="type32"){
       img = document.getElementById("Rnon");
  }  else if (bouton.id=="type15"){
      img =  document.getElementById("Rswap");
  }  
    
      let rect = bouton.getBoundingClientRect(); // Récupère les coordonnées du bouton

      // Positionner l'image juste au-dessus du bouton
      img.style.top = (rect.top - img.offsetHeight - 50) + "px"; // 5px d'espace
      img.style.left = (rect.right) + "px";

      img.style.display = "block"; // Affiche l'image
  
  }

  function cacherImage(bouton) {
    
    if (bouton.id=="type5"){
       document.getElementById("H").style.display = "none";;
  }  else if (bouton.id=="type3"){
        document.getElementById("X").style.display = "none";;
  }  else if (bouton.id=="type6"){
       document.getElementById("Y").style.display = "none";;
  }  else if (bouton.id=="type4"){
       document.getElementById("Z").style.display = "none";;
  }  else if (bouton.id=="type12"){
        document.getElementById("SWAP").style.display = "none";;
  }  else if (bouton.id=="type7"){
       document.getElementById("Rphi").style.display = "none";;
  }  else if (bouton.id=="type32"){
       document.getElementById("Rnon").style.display = "none";;
  }  else if (bouton.id=="type15"){
       document.getElementById("Rswap").style.display = "none";;
  }  
    
    
    
    
     
  }

function toggleGrayscale() {
    document.body.classList.toggle("grayscale");
}

function genere_matrice_et_porte_a_partir_circuit_affiche_a_lecran(){
  
    noLoop();//il faut desactiver car on va modifier les qbits d entrees
  
  let sauvegarde_nQbits=genere_copie_profonde_nqbit(G.n_Qbits_sortie);
  
  
    //1ere etape : on fait une sauvegarde du nqbit d entree , pour le remttre a la fin car on va le modifier
  
     //let sauvegarde_nQbits=G.n_Qbits_entree.slice(); //=copieProfonde
 //G.lignes_quantiques = retourne_liste_lignes_quantiques(G); //initialise les lignes quantiques
    
 // G.n_Qbits_sortie = retourne_vecteur_nQbits_dentree(G.lignes_quantiques);
  
  
     
    
  //2eme etape : on initialise tout et le champs html et on génère la matrice vide
  
   
    
    
   
    
  
  
  
  
    let nbre_qbits=G.lignes_quantiques.length;
  
    document.getElementById("nombrelignequantique").value=nbre_qbits.toString();
    
    
    
    let n = 2 ** nbre_qbits;//dimension de la matrice
    
  
  
    //on genere une matrice vide
     matrice_generee = [];
 
    for (let i = 0; i < n; i++) {
      matrice_generee.push([]);
      for (let j = 0; j < n; j++)
         matrice_generee[i][j] = new complexe(0,0);
      
     }
     
  
  
  
  
  
  
  //3eme etape : on va mettre une proba de 1 successivement a chaque etat du nqbit entree et calculer la matrice de sortie a chaque fois ce qui va permettre de la constuire colonne par colonne
  for (let i = 0; i < n; i++) {
    
      
    // on transforme  le nqbit d entree en mettant tout a 0
    for (let j = 0; j < n; j++) {
      
      G.n_Qbits_sortie.ecrit(j,0,0);
    }
    //et l etat voulu numero i  a 1
    
     G.n_Qbits_sortie.ecrit(i,1,0);///on mets que cet etat a une probabilite de 1
    
   
    
    
   // print("i=",i," nqbit entree=",G.n_Qbits_sortie)
     G.calcul_n_Qbits_sortie_apres_passage_toutes_les_portes_de_la_liste_ordonnee_pour_intrication(nbre_qbits);
   // print("i=",i," nqbit sorite=",G.n_Qbits_sortie)
   // print("")
    
    //le nqbits de sortie que l'on vient de calculer correspond a la ieme colonne de la matrice
  //on copie dans la colonne i
    for (let ligne = 0; ligne < n; ligne++) {
      let x=G.n_Qbits_sortie.re[ligne];
      let y=G.n_Qbits_sortie.im[ligne];
      
     // print(ligne,i,x,y)
      matrice_generee[ligne][i].coeff_complexe(x,y);
    }
    
     
  }
  
   
//5eme etape : on retabli notre qbit d e sortie pour la suite
   
   
   // G.n_Qbits_entree=sauvegarde_nQbits.slice(); //=copieProfonde
    copie_profonde_nqbit(sauvegarde_nQbits,G.n_Qbits_sortie);
       
      
   
  
  
  
//  matrice_generee=transposeMatrix(matrice_generee);
  
  print("matrice",matrice_generee)   
   
  
  
  
  
  //6eme etape on affiche la matrice
  
  
  M= new AfficheMatrix();
  //M.curseurmatrice=0;//varie de 0 à n2  - 1
  document.getElementById("texteindice").textContent="0,0";
  document.getElementById("coeffa1").value=matrice_generee[0][0].x.toString();
  document.getElementById("coeffb1").value=matrice_generee[0][0].y.toString();
  recupere_coeff_matrice_et_affiche_matrice();
  
  
  
 M.affiche_matrice_generee();

   
   
  M.setMatrixColor(0,0,true);
  
  loop();//on remet l affichage
  
}







class AfficheMatrix {
  constructor(){
   //this.curseurmatrice=0;//varie de 0 à n2  - 1 //indice pour se deplacer dans la matrice html
    
  this.ligne_curseur =  0;
  this.colonne_curseur =0;
    
  let n = parseInt(document.getElementById("nombrelignequantique").value);
    
  this.dim=2**n;//matrice_generee.length;//dimension d un côté de la matrice
    
  this.n_max=this.dim;//nbre max de cellule en largeur que l on peut afficher
    this.calcul_nbre_cellules_max(); 
    
    this.xmin=0;//point de depart de la ligne de cellule a afficher
    this.ymin=0;//point de depart de la ligne de cellule a afficher
    this.xmax=this.xmin+this.n_max-1;//point d arrivée de la ligne de cellule a afficher
    this.ymax=this.ymin+this.n_max-1;//point d arrivée de la ligne de cellule a afficher
    
    
  }
  

  
deplacecurseur(element){
 
  
  
  
  
  
  
  let dpct=parseInt(document.getElementById("multiplie").value);
 
  
  
  
  let type_affichage_matrice=document.getElementById('selectnotationcoeff').value;//1: complexe ; 2: trigo
   
  
  if (type_affichage_matrice==1)
  document.getElementById("coeffa1").focus();
  else document.getElementById("coeffrtrigo1").focus();
  
  this.setMatrixColor(this.ligne_curseur,this.colonne_curseur);//efface le bleu du dernier deplacement de cursuer
  
  print("avant :",this.ligne_curseur,"  ",this.colonne_curseur)
   switch (element.id) {
          case "boutonhaut":
            this.ligne_curseur=this.ligne_curseur-dpct;
            if (this.ligne_curseur<0) this.ligne_curseur=this.dim-1;
       
            break;
             case "boutonbas":
            this.ligne_curseur=this.ligne_curseur+dpct;
            if (this.ligne_curseur>(this.dim-1)) this.ligne_curseur=0;
       
            break;
            case "boutongauche":
            this.colonne_curseur=this.colonne_curseur-dpct;
            if (this.colonne_curseur<0) this.colonne_curseur=this.dim-1;
            
       
            break;
             case "boutondroite":
            this.colonne_curseur=this.colonne_curseur+dpct;
            if (this.colonne_curseur>(this.dim-1)) this.colonne_curseur=0;
       
            break;
   }
  
  
  
 // print("curseur et ymax",this.ligne_curseur,this.xmax)
  
  
 
 
  if (((this.ligne_curseur>this.xmax)||(this.ligne_curseur<this.xmin))||((this.colonne_curseur>this.ymax)||(this.colonne_curseur<this.ymin))){
    this.recalcul_bornes_matrice();
    this.affiche_matrice_generee();
    
  }
  
  
  this.setMatrixColor(this.ligne_curseur,this.colonne_curseur,true);
  
 
  
  
  document.getElementById("texteindice").textContent=this.ligne_curseur.toString()+","+this.colonne_curseur.toString();
  print("apres", this.ligne_curseur," - ",this.colonne_curseur)
  affiche_valeur_matrice_dans_champs_html();
  
}

//attention, n affiche que des matrices carrés !!!!!!
recalcul_bornes_matrice()  {
  
   this.calcul_nbre_cellules_max() ;
   let i_max=this.dim-1;//indice maximum
   let n=this.n_max-1;//nbre max qu on peut ajouter ou retirer
  
   //le curseur ne peut faire q u un depassement a la fois, les 4 situations sont donc indépendantes
   if (this.colonne_curseur>this.ymax){
     
     
     this.ymin=this.colonne_curseur;
     this.ymax=this.colonne_curseur+n;
     if (this.ymax>i_max) {
       this.ymax=i_max;
       this.ymin=this.ymax-n;
     }
     
     return;//les 4 cas sont independants
   }
  
  if (this.colonne_curseur<this.ymin){
     
     
     this.ymax=this.colonne_curseur;
     this.ymin=this.colonne_curseur-n;
     if (this.ymin<0) {
       this.ymin=0;
       this.ymax=n;
     }
     
     return;//les 4 cas sont independants
   }
  
  
  if (this.ligne_curseur>this.xmax){
     
     
     this.xmin=this.ligne_curseur;
     this.xmax=this.ligne_curseur+n;
     if (this.xmax>i_max) {
       this.xmax=i_max;
       this.xmin=this.xmax-n;
     }
     
     return;//les 4 cas sont independants
   }
  
  if (this.ligne_curseur<this.xmin){
     
     
     this.xmax=this.ligne_curseur;
     this.xmin=this.ligne_curseur-n;
     if (this.xmin<0) {
       this.xmin=0;
       this.xmax=n;
     }
     
     return;//les 4 cas sont independants
   }
  
   
  
  
}
  
  
calcul_nbre_cellules_max()  {
  let taillecol2matrix = document.getElementById("taillecol2matrix").offsetWidth;
  // let tailleLes2colmatrix = document.getElementById("tailleLes2colmatrix").offsetWidth;
  let largeur_cellule=65;//60+5 de bordure
  
 

   this.n_max=int((taillecol2matrix-30)/largeur_cellule);//bordure de 30, 15 15
   if (this.n_max>this.dim) this.n_max=this.dim;
  
   else if (this.n_max<=4) this.n_max=this.dim;
  
}
  
affiche_matrice_generee(){
  
  
  // let taillecol1matrix = document.getElementById("taillecol1matrix").offsetWidth;
  
  
  
  // print("ltaille1=",taillecol1matrix,"taille2",taillecol2matrix,"tailleLes2",tailleLes2colmatrix,"nmax=" ,n_max)
  
  //let n=matrice_generee.length;
  
   
   
  
  
   let nbre_cellules=1+this.ymax-this.ymin;
  
  
  
  
  let matrixContainer = document.getElementById("matrix");
   // Définir le style de la grille pour qu'elle soit carrée
    matrixContainer.style.display = "grid";
    matrixContainer.style.gridTemplateColumns = `repeat(${nbre_cellules}, 1fr)`;
    matrixContainer.style.gap = "5px"; // Espacement entre les cases

    // Nettoyer la matrice précédente
    matrixContainer.innerHTML = '';
  
  
 
    print("affichage matrice pour  x de ",this.xmin," a ",this.xmax)
  print("affichage matrice pour  y de ",this.ymin," a ",this.ymax)

    // Générer la matrice
     for (let ligne =this.xmin; ligne <= (this.xmax); ligne++)
       for (let colonne = this.ymin; colonne <=(this.ymax); colonne++){
  
  
    
      
        let cell = document.createElement("div");
        cell.className = "matrix-cell"; // Classe CSS pour le style
        

       
      
         cell.textContent =matrice_generee[ligne][colonne].texte_complexe(1,true,true);
      
      matrixContainer.appendChild(cell);
      
      
      
      

       
    }
}

  
  setMatrixValue(x,y) {
    //let n = Math.sqrt(document.querySelectorAll(".matrix-cell").length);
    //let index = x * n + y;
    let nbre_cellules=1+this.ymax-this.ymin;
    
    let index =(x-this.xmin)*nbre_cellules+(y-this.ymin);
    
    let cells = document.querySelectorAll(".matrix-cell");
    if (cells[index]) {
      let type_affichage_matrice=document.getElementById('selectnotationcoeff').value;
        cells[index].textContent = matrice_generee[x][y].texte_complexe(type_affichage_matrice,true,true);
    }
}


 setMatrixColor(x,y,enbleu=false) {
    //let n = Math.sqrt(document.querySelectorAll(".matrix-cell").length);
   // let index = x * n + y;
   
   let nbre_cellules=1+this.ymax-this.ymin;
   
   
   let index =(x-this.xmin)*nbre_cellules+(y-this.ymin);
   
  //if (enbleu==true) print('cellbleu',x,y,index)
   
   
    let cells = document.querySelectorAll(".matrix-cell");
    if (cells[index]) {
        
        if (enbleu==true){
        cells[index].style.backgroundColor = "rgb(23,186,219)"; 
        cells[index].style.color = "white";
        } else
          {
        cells[index].style.backgroundColor = "white"; 
        cells[index].style.color = "black";
        }
    }
}

 
  
  
  
}


