/* QAlgo — réglages, nombres complexes, enregistrement et chargement, export CSV
 *
 * Simulateur de circuits quantiques pour l'enseignement — https://www.qalgo.org
 * Code source : https://github.com/BoissacF/QAlgo
 *
 * Copyright (C) 2025-2026 Frédéric Boissac
 * Logiciel libre sous licence GNU AGPL version 3 ou ultérieure ;
 * voir le fichier LICENSE à la racine du dépôt.
 */
//INTERFACE
/*


//fait une copie profonde de nQbitoriginal, mais attention les deux nqbits doivent avoir la même taille
function copie_profonde_nqbit(nQbit_original,nQbit_copie){

//comme precedemment mais genere fait une copie profonde de nQbitoriginal, 
function genere_copie_profonde_nqbit(nQbit_original){
  

class complexe {// c est un des coefficient du qbit de la forme x+yi




function change_Taille_sommets_Graphe(coeff) { //si des sommets debordent on essaie de recadrer en diminuant toutes les aretes

function roundToDecimals(value, decimals) {

function zoom(element){




function choix_type(element){

function initialise_tout(){

function fait_les_mesures_ligne_quantique(num_ligne){

function Bouton_relance_mesures(){
function effaceOuAfficheBoutonsmesures(){

 function initialise_mesures() {//a true ou false
 
 function initialise(){
 

function fleche(xA, yA, xB, yB, ArrowLength, ArrowWidth, couleur, epaisseur) {

function CodeFonctionEtatEncsv(){
  


function saveAmplitudesFile(){



//FUNCTION 1
function saveTextAsFile() {

function simuleCliCdeInput() {
  

//FUNCTION
function loadFileAsText() {


function transforme_pointvirgule_arobase(chaine){
  

function transforme_arobase_pointvirgule_(chaine){
 

//FUNCTION 1
function DeCodeStringEnGraph(code)



function CodeGraphEnString() {
function chargeFichierExemple(element) {
*/


//let msg = null;

let HauteurfenetreSecondaire = 0;
let ouverture_de_fichier_en_cours=false;
let texte_explication_algo="";
let erreurdansoracle=false;
let  LeTexteDeFonctionOracle=
         `function f(X) {

        return 0;
    }`;

function debugage(){//se lance avec la touche d
  
   let L=retourne_liste_lignes_quantiques(G);
  let n_Qbits=retourne_vecteur_nQbits_dentree(L);
  
  print("nQbits entree",n_Qbits);
  
  let n_Qbits_sortie=Fourier(n_Qbits,true);
  
  print("nQbits sortie",n_Qbits_sortie);
  
  
  
  /*
  a=new complexe(1,1);
  print("a=",a)
  b=new complexe(1,0);
  print("b=",b)
  c=a.mul(b)
  print("c=",c)
  */
  
  
     //Diminue_Graphe(0.8)
  
   //print("les lignes2",G.lignes_quantiques)
  
 //let Liste_ordonnee_pour_intrication=G.genere_liste_ordonnees_elemts_intrication(G.lignes_quantiques,0);
  //  G.lignes_quantiques = retourne_liste_lignes_quantiques(G); //reinitialise les lignes quantiques
    
  // print(Liste_ordonnee_pour_intrication)
  
// print(G.lignes_quantiques)
  
 // print("bug ",distance_a_une_droite(5, 100, 100, 100, 150, 110))
  
  /*
  let L=retourne_liste_lignes_quantiques(G);
  let n_Qbits=retourne_vecteur_nQbits_dentree(L);
  
  
  print("le nQbit d entree est ",n_Qbits)
  let nbre_Qbits=L.length;
  
  let Sommet=G.TabSommets[2];
  let L_index=Sommet.num_ligne;
  */
  //print("L_index",L_index)
  
  
  //n_Qbits=[1,2,3,4,5,6,7,8];
 // L_index=[0,1,-1,-1,-1,-1,-1,-1,-1,-1,-1];
 // let nbre_Qbits=3;
 
 // n_Qbits=applique_Porte_Diffuseur_grover(n_Qbits,L_index,nbre_Qbits);//,type_control,num_bit_control)
  
 // print("nouveau Qbit",n_Qbits)
 // n_Qbits=applique_Porte_H(n_Qbits,0,nbre_Qbits);
  
  
  
  
 // let type_control=16;//16 pour control avec 1 et 17 pour control avec 0
 // let num_bit_control=0;
 // calcul_probas_pour_chaque_Qbit_du_nQbit(n_Qbits,L.length);
  //applique_Porte_Z(n_Qbits,index,nbre_Qbits,type_control,num_bit_control)
 
 // n_Qbits=applique_Porte_H(n_Qbits,0,nbre_Qbits);
 //  print("apres H nQbits=",n_Qbits)
  //n_Qbits=applique_Porte_X(n_Qbits,1,nbre_Qbits,16,0);
  // print("apres CNOT nQbits=",n_Qbits)
  
  
 // n_Qbits=applique_Porte_BitMesure("1",n_Qbits,0,nbre_Qbits)
  // print("apres impose 1 sur 1ere ligne nQbits=",n_Qbits)
 // calcul_probas_pour_chaque_Qbit_du_nQbit(n_Qbits,L.length);
  
  //n_Qbits=applique_Porte_X(n_Qbits,0,nbre_Qbits);
   //print("apres NOT sur 0 nQbits=",n_Qbits)
  
 // n_Qbits=applique_Porte_X(n_Qbits,1,nbre_Qbits,16,0);
 //  print("apres CNOT nQbits=",n_Qbits)
  // n_Qbits=applique_Porte_H(n_Qbits,0,nbre_Qbits);
  // print("apres H sur 0 nQbits=",n_Qbits)
  // n_Qbits=applique_Porte_X(n_Qbits,1,nbre_Qbits,16,0);
  // print("apres CNOT nQbits sur le deuxieme=",n_Qbits)
// n_Qbits=applique_Porte_H(n_Qbits,0,nbre_Qbits);
 //  print("apres H nQbits=",n_Qbits)
  
 // affichage_dans_console_probas_du_nQbit(n_Qbits);
  
  
  

}

//fait une copie profonde de nQbitoriginal, mais attention les deux nqbits doivent avoir la même taille
function copie_profonde_nqbit(nQbit_original,nQbit_copie){
  
  
  for (let i = 0; i <nQbit_original.length; i++) { 
    
    nQbit_copie[i].coeff_complexe(nQbit_original[i].x,nQbit_original[i].y);
  
  
}

}


//comme precedemment mais genere fait une copie profonde de nQbitoriginal, 
function genere_copie_profonde_nqbit(nQbit_original){
  
  nQbit_copie=[];
  for (let i = 0; i <nQbit_original.length; i++) { 
    
    nQbit_copie.push(new complexe(nQbit_original[i].x,nQbit_original[i].y));
  
  
}
  return nQbit_copie;

}


/*
function deepCopy(obj) {
    if (Array.isArray(obj)) {
        // Si l'objet est un tableau, on l'itère pour chaque élément
        return obj.map(item => deepCopy(item)); // Appel récursif pour chaque élément
    } else if (obj !== null && typeof obj === 'object') {
        // Si l'objet est un objet, on copie chaque propriété
        let copy = {};
        for (let key in obj) {
            if (obj.hasOwnProperty(key)) {
                copy[key] = deepCopy(obj[key]); // Appel récursif pour chaque propriété
            }
        }
        return copy;
    }
    return obj; // Si c'est une valeur primitive (pas un objet ni un tableau), on la retourne
}

*/

class Reglages {
  constructor(){
    
    
this.affiche_coefficients_Qbit=true;
this.affiche_coefficients_et_Probas_nQbit=true;
this.couleur_Fond ="#c8c8c8"; //200gris clair
this.on_est_dans_une_fenetre=false;
this.type_affichage_qBit=1;//1: complexe ; 2: trigo 3 : bloch
this.unite_angle=1;//1 degre 2//rad 3//multiple de PI
this.affiche_decimal=false;//affcihe les etats |0111> en decimal

this.option_superposition=false;
this.active_Bloch=false;

this.Graphique_visible=false;
    
this.ancien_affiche_coefficients_et_Probas_nQbit=true;    
this.ancien_active_Bloch=false;
this.ancienGraphique_visible=false;

    
  }
  supprimme_affichages(){//supprimme mais memorise les dernieres valeurs pour les remettre apres
    
    this.ancien_active_Bloch=this.active_Bloch;
    
    
    if (this.active_Bloch==true) simuleBloch();//supprimme l affichage
    
    
   
    
    
    this.ancienGraphique_visible=this.Graphique_visible;
    
   
     if (this.Graphique_visible==true)  graphique();//supprimme l affichage 
    
  }
  remet_parametres_affichages(){
    
    if (this.active_Bloch!=this.ancien_active_Bloch) simuleBloch();
    
    
    
    if (this.Graphique_visible!=this.ancienGraphique_visible) graphique();
  }
  
  
}

class complexe {// c est un des coefficient du qbit de la forme x+yi
  //champs : xbrut, ybrut (avant arrondi), x, y (arrondis a 10 decimales), proba
  //accesseurs calcules a la lecture : r (module), theta_rad, theta_deg, k
  constructor(x,y=undefined) {
    this.coeff_complexe(x,y);
    
  }
  
  
  //modifie les coefficients. Seuls x, y et proba sont calcules tout de suite :
  //le module et l argument ne servent qu a l affichage, ils sont calcules a la
  //lecture par les accesseurs ci dessous. Un sqrt et un atan2 par complexe,
  //sur les 3,7 millions que cree un circuit a 18 qbits, coutaient 75% du temps.
  coeff_complexe(x,y=undefined){
    
    //x et y AVANT arrondi : proba, le module et l argument s en servent, et le
    //test x==0 de l argument doit porter sur la valeur brute, pas sur l arrondi
    this.xbrut = x;
    this.ybrut = y;
    
    if (x==undefined){
      this.x=undefined;
      this.y=undefined;
      this.proba=undefined;
      return;
    }
    
    this.x=Math.round(x*1e10)/1e10;
    this.y=Math.round(y*1e10)/1e10;
    
    this.proba=x*x+y*y;
    
  }
  
  
  //l argument non reduit, en radians. Sert aux trois accesseurs qui suivent
  argument_brut(){
    if (this.xbrut==0) return Math.acos(this.xbrut);
    return Math.atan2(this.ybrut, this.xbrut);
  }
  
  
  //le module
  get r(){
    if (this.xbrut==undefined) return undefined;
    return Math.sqrt(this.proba);
  }
  
  
  //l argument en radians, ramene dans ]-2pi,2pi[
  get theta_rad(){
    if (this.xbrut==undefined) return undefined;
    return this.argument_brut()%(2*Math.PI);
  }
  
  
  //l argument en degres, ramene dans ]-360,360[
  get theta_deg(){
    if (this.xbrut==undefined) return undefined;
    return (this.argument_brut()*(180/Math.PI))%360;
  }
  
  
  //l argument en multiples de pi, pour l affichage trigonometrique
  get k(){
    if (this.xbrut==undefined) return undefined;
    return (this.argument_brut()%(2*Math.PI))/Math.PI;
  }
  
  
  add(c){//retourne un complexe correspondant à l'addition de deux complexes
  
  return new complexe(this.x+c.x,this.y+c.y);
  
}


mul(c){//retourne un complexe correspondant à la multilication de deux complexes
  
  return new complexe(this.x*c.x-this.y*c.y,this.x*c.y+this.y*c.x);
  
}

texte_complexe(type_affichage,sans_plus_depart=false,affichage_simple_sans_pharentheses=false){//retourne le texte du complexe (a+bi)  //R.type_affichage_qBit
  if (this.x == undefined) return "";
  
  if ((this.x==0)&&(this.y==0)) {
    if (affichage_simple_sans_pharentheses==false)
    return "";
    else return"0";
    
  }
    
    let texte="";
    
   // texte= String(abs(roundToDecimals(this.r, 2)))+".e(i"+String(abs(roundToDecimals(this.theta_deg, 2)))+")";
  //return texte;
    
  if (type_affichage==1)//complexe a+bi
     {
  
    if ((this.x!=0)&&(this.y!=0)) {//affichage avec parenthéses
      
        if (affichage_simple_sans_pharentheses==false)
        if (sans_plus_depart==true) texte="("; else
        texte="+(";
      
        if (this.x<0)texte=texte+"-";
        texte = texte + String(abs(roundToDecimals(this.x, precision_coeff)));
        if (this.y<0)texte=texte+"-"; else texte=texte+"+";
        texte = texte + String(abs(roundToDecimals(this.y, precision_coeff)))+"i";
        if (affichage_simple_sans_pharentheses==false) texte=texte+")";
        return texte;
        
      }
      
      
    else{//affichage sans parenthèse donc un des deux est nul
      
      if (this.x==0){//x=0
        if (this.y<0)texte=texte+"-";else if (sans_plus_depart==false) texte=texte+"+"; 
        texte = texte + String(abs(roundToDecimals(this.y, precision_coeff)))+"i";
        
      } else{//y=0
        if (this.x<0)texte=texte+"-";else  if (sans_plus_depart==false) texte=texte+"+"; 
        texte = texte + String(abs(roundToDecimals(this.x, precision_coeff)));
        
      }
      
      
      
      return texte;
    }
  
}//fin affichage normal a+bi
  else //if (R.type_affichage_qBit==2 ou 3)//complexe
     {
       
       if (R.unite_angle==1)
      texte = "+"+String((roundToDecimals(this.r, precision_coeff)))+"E("+ String((roundToDecimals(this.theta_deg, precision_coeff)))+"i)";
       else if (R.unite_angle==2)
         texte = "+"+String((roundToDecimals(this.r, precision_coeff)))+"E("+ String((roundToDecimals(this.theta_rad, precision_coeff)))+"i)";
       else{
         
         let coeff=roundToDecimals(this.k, precision_coeff);
       
         
         if (coeff==0) texte = "+"+String((roundToDecimals(this.r, precision_coeff)))+"E(0i)";
         else if (coeff==1) texte="+"+String((roundToDecimals(this.r, precision_coeff)))+"E(πi)";
         else if (coeff==-1) texte = "+"+String((roundToDecimals(this.r, precision_coeff)))+"E(-πi)";
         else texte = "+"+String((roundToDecimals(this.r, precision_coeff)))+"E("+ String(coeff)+"πi)";
         
       }
       
       
       
       return texte;
     }
      
}   
      
      
}



function change_Taille_sommets_Graphe(coeff) { //si des sommets debordent on essaie de recadrer en diminuant toutes les aretes
  
  noLoop();
   for (let i = 0; i < G.TabSommets.length; i++)
      if (G.TabSommets[i] != undefined) {
        let S=G.TabSommets[i];
        S.x = coeff*S.x;
        S.y = coeff*S.y;
        
        S.changeDiametre(coeff*S.diametre);
        
        //S.changePositionRayon(coeff*S.x,coeff*S.y);
       
        diametre_default_sommet=S.diametre;
        
        }  
  
  
  
  for (let i = 0; i < G.TabSommets.length; i++)
    if (G.TabSommets[i] != undefined) { 
    

    for (let j = 0; j < G.TabSommets[i].nAretes_sortantes; j++) {
      let arete=G.TabSommets[i].aretes_sortantes[j];
      arete.modifieCoordonnees( coeff*arete.xA, coeff*arete.yA, coeff*arete.xB, coeff*arete.yB);
    }
    
      if ((G.TabSommets[i].type==16)||(G.TabSommets[i].type==17))
 for (let j = 0; j < G.TabSommets[i].nAretes_controle; j++) {
      let arete=G.TabSommets[i].aretes_controle[j];
      arete.modifieCoordonnees( coeff*arete.xA, coeff*arete.yA, coeff*arete.xB, coeff*arete.yB);
    } 
    

    }
  
  
  
  
        
  loop();

}




function roundToDecimals(value, decimals) {
  let factor = Math.pow(10, decimals);
  return round(value * factor) / factor;
}

function zoom(element){
  
  //return;
  //print(element.id)
  print(diametre_default_sommet)
   switch (element.id) {
    
    
   
    case "bouton2+"://+|1>
       if (diametre_default_sommet>80) return;
      change_Taille_sommets_Graphe(1.1);
      
       
      break;
     case "bouton2-"://+|1>
       if (diametre_default_sommet<10) return;
      change_Taille_sommets_Graphe(0.9);
      
       
      break; 
    
}
    
  
}



function choix_type(element){
  
  if (demarrage==false) return;
  
   element.blur();
  
 

  
  
  
  
  print("id=",element.id);
  
  
  
  
 // "boutonCree"+numeroBoutonCree.toString();
  
  if (element.id.startsWith("bout")){
    
    
    
    let numerobouton=parseInt(element.id.substr(10));
    print("numerobouton=",numerobouton)
    boutonSelectionne= liste_boutons_crees[numerobouton];
    if (boutonSelectionne.nAretes_max==1)  typeSelectionne =8;else typeSelectionne =9;
    
  }
  
  
  else
   switch (element.id) {
    
    case "type0"://+|0>
       
       
       if (G.lignes_quantiques.length>=18) if (langue!=1)
       {alert('Désolé, Pour l instant QAlgo ne peut calculer que les circuits comprenant 18 qbits au maximum');return;}else
       {alert('Sorry, for now QAlgo can only calculate circuits with a maximum of 18 qubits');return;}
       
      typeSelectionne =0;
      

      break;
    case "type1"://+|1>
       
       if (G.lignes_quantiques.length>=18) if (langue!=1)
       {alert('Désolé, Pour l instant QAlgo ne peut calculer que les circuits comprenant 18 qbits au maximum');return;}else
       {alert('Sorry, for now QAlgo can only calculate circuits with a maximum of 18 qubits');return;}
       
       
       typeSelectionne =1;
       
       
      
      break;
      
    case "type2"://+0.707|0> + 0.707|1>
       if (G.lignes_quantiques.length>=18) if (langue!=1)
       {alert('Désolé, Pour l instant QAlgo ne peut calculer que les circuits comprenant 18 qbits au maximum');return;}else
       {alert('Sorry, for now QAlgo can only calculate circuits with a maximum of 18 qubits');return;}
       
       typeSelectionne =2;
      
      break;
       case "type3"://porte X
       typeSelectionne =3;
      
      break;
    
      case "type2"://+0.707|0> + 0.707|1>
       typeSelectionne =2;
      
      break;
      
       case "type22"://+0.707|0> - 0.707|1>
       if (G.lignes_quantiques.length>=18) if (langue!=1)
       {alert('Désolé, Pour l instant QAlgo ne peut calculer que les circuits comprenant 18 qbits au maximum');return;}else
       {alert('Sorry, for now QAlgo can only calculate circuits with a maximum of 18 qubits');return;}
       
       
       
       typeSelectionne =22;
      
      break;
      
      case "type4"://porte Z
       typeSelectionne =4;
      
      break;
      
      case "type5"://porte H
       typeSelectionne =5;
      
      break;
      case "type10"://Oracle
       typeSelectionne =10;
      
      break;
      case "type11"://Operateur de diffusion de Grover
       typeSelectionne =11;
      
      break;
      
      case "type12"://Porte SWAP
       typeSelectionne =12;
      
      break;
      
      
       case "type16"://control
       typeSelectionne =16;
      
      break;
      
       case "type17"://anti control
       typeSelectionne =17;
      
      break;
      
      case "type64"://Mesure
       typeSelectionne =64;
      
      break;
      
      case "type65"://Mesure
       typeSelectionne =65;
      
      break;
      
      case "type128"://Alice
       typeSelectionne =128;
      
      break;
       case "type129"://Bob
       typeSelectionne =129;
      
      break;
       case "type130"://Gerard
       typeSelectionne =130;
      
      break;
      
      case "type6"://Y
       typeSelectionne =6;
      
      break;
      
      case "type7"://R phi
       typeSelectionne =7;
      
      break;
      case "type13"://F fourier
       typeSelectionne =13;
      
      break;
      case "type14"://F Fourier inverse
       typeSelectionne =14;
      
      break;
      
       break;
      case "type15"://racine carré de swap
       typeSelectionne =15;
      
      break;
      
       break;
      case "type32"://racine carré de X
       typeSelectionne =32;
      
      break;
  
}
    print("typeSelectionne=",typeSelectionne);
  
}
function bouton_efface_tout(){
 
    let reval="";
    
    if (langue==1){
       retVal = confirm("WARNING,\n This action erases and deletes the existing quantum circuit. Are you sure you want to continue?");
    }
    else
   retVal = confirm("ATTENTION,\n Cette action efface et supprime le circuit quantique existant. Es-tu sur de vouloir continuer ? ");
     if( retVal == false )return ;
     
     initialise_tout();
  
  
}

    




let OnFaitLesMesures=0;//0 on les fait pas  //1 on mesure tout   //2 mesure partielle

function initialise_tout(){
  
  
    
  
    G = new Graph();
   OnFaitLesMesures=0;//0 on les fait pas  //1 on mesure tout   //2 mesure partielle;
  
  effaceOuAfficheBoutonsmesures();
  
   initialise_variables_clic();
  G.affiche_du_nQbit_de_sortie_et_des_probas();
}


function fait_les_mesures_ligne_quantique(num_ligne){
  
  let ancien_etat=G.lignes_quantiques[num_ligne][G.lignes_quantiques[num_ligne].length-1].mesure[0];
  let nouvel_etat;
  if (ancien_etat==true) nouveletat=false; else {
    nouveletat=true;
    OnFaitLesMesures=2;//mesure partielle
  }
  
  print("ancien",ancien_etat,"nouveau",nouveletat)
  
  
  for (let i = 0; i < G.lignes_quantiques[num_ligne].length; i++){
    let Sommet=G.lignes_quantiques[num_ligne][i];

    let index=Sommet.indice_dune_ligne(num_ligne);
    
    Sommet.mesure[index]=nouveletat;
    
  }
  
  
 /* 
  
  for (let i = 0; i < G.TabSommets.length; i++)
      if (G.TabSommets[i] != undefined){
        
        for (let k = 0; k < G.TabSommets[i].num_ligne.length; k++){
           if (G.TabSommets[i].num_ligne[k]==-1) break;
          
           if (G.TabSommets[i].num_ligne[k]==num_ligne){
             G.TabSommets[i].mesure[k]=nouveletat;
              break;
             
           }
          
        }
        
         
      }
  */
  
  if ((OnFaitLesMesures!=0)&&(nouveletat==false)){//on verifie si on est toujours dans une mesure partielle
    let ya_encore_un_true=false;
    for (let i = 0; i < G.lignes_quantiques.length; i++){
      
      if (G.lignes_quantiques[i][G.lignes_quantiques[i].length-1].mesure[0]==true){
        ya_encore_un_true=true;break;
      }
    }
    
    if (ya_encore_un_true==false){
      print("y a plus de mesure partielle")
      initialise_mesures();//on reinitialise les mesures
      return;
    }
    
  }
  
  
      
  if (OnFaitLesMesures!=0){
  G.calcul_nQbits_mesure_fixe_valeurs_mesurees_et_calcule_valeurs_instantannees_pour_les_autres_lignes();
    
  
   } else
     {
       remet_les_probas_calculees_aux_sorties65_etportechance64();
       /*essai 20 fevrier je ne suis pas sur que ça sert a quelque chose de recalculer
      G.lignes_quantiques = retourne_liste_lignes_quantiques(G); //initialise les lignes quantiques
   
      G.n_Qbits_entree = retourne_vecteur_nQbits_dentree(G.lignes_quantiques);
     
      G.calcul_les_Qbits_de_sorties_de_tous_les_elements();
      */
       
     }
  
 
  
}

//lors des mesures partielles les probas des lecteurs de chance et sorties sont modifiées,
//il faut les remettre aux valeurs calculées lors du calcul de toutes les portes
function remet_les_probas_calculees_aux_sorties65_etportechance64(){
  for (let i = 0; i < G.TabSommets.length; i++)
      if (G.TabSommets[i] != undefined)
    if ((G.TabSommets[i].type==64)|| (G.TabSommets[i].type==65)) {
      
        G.TabSommets[i].Qbit[0][2] = G.TabSommets[i].ancienne_proba[0];
        G.TabSommets[i].Qbit[0][3] = G.TabSommets[i].ancienne_proba[1];
      
    }
}




function Bouton_relance_mesures(){
  
  if (G==undefined) return;
  if (G.TabSommets.length==0) return;
  couleur_mesure=250;
  G.calcul_nQbits_mesure_fixe_valeurs_mesurees_et_calcule_valeurs_instantannees_pour_les_autres_lignes(true);
  
 
 G.affiche_du_nQbit_de_sortie_et_des_probas();
  
  
  
  
  
}


function effaceOuAfficheBoutonsmesures(){
   if (OnFaitLesMesures==0) {document.getElementById("boutoneffacemesures_et_mesurespartielles").style.display = "none";
  document.getElementById("boutonmesuretotale").style.display = "inline";
                            }else
                              {document.getElementById("boutoneffacemesures_et_mesurespartielles").style.display = "inline";
  document.getElementById("boutonmesuretotale").style.display = "none";
                            }
}


  function initialise_mesures() {//a true ou false
    //0 on les fait pas  //1 on mesure tout   //2 mesure partielle
    let res=false;
   if (OnFaitLesMesures==0){OnFaitLesMesures=1;res=true;} else
    { OnFaitLesMesures=0;res=false;}
    
    
  
    
    effaceOuAfficheBoutonsmesures();
    
  
    
   // print("onfaitlesmesyre",OnFaitLesMesures,res)
    
    for (let i = 0; i < G.TabSommets.length; i++)
      if (G.TabSommets[i] != undefined)
       { 
         
         
         for (let k = 0; k < G.TabSommets[i].num_ligne.length; k++){
           if (G.TabSommets[i].num_ligne[k]==-1) break;
           G.TabSommets[i].mesure[k]=res;
          
        }
         
         
         
         
       
       }
    
    
    
    if (OnFaitLesMesures!=0){
     
  G.calcul_nQbits_mesure_fixe_valeurs_mesurees_et_calcule_valeurs_instantannees_pour_les_autres_lignes();
      
      G.affiche_du_nQbit_de_sortie_et_des_probas();
    
   } else
     {
       
       
     
         
       
      /* /*essai 20 fevrier je ne suis pas sur que ça sert a quelque chose de recalculer
      G.lignes_quantiques = retourne_liste_lignes_quantiques(G); //initialise les lignes quantiques
   
      G.n_Qbits_entree = retourne_vecteur_nQbits_dentree(G.lignes_quantiques);
     
      G.calcul_les_Qbits_de_sorties_de_tous_les_elements();
      */
        remet_les_probas_calculees_aux_sorties65_etportechance64();
        G.affiche_du_nQbit_de_sortie_et_des_probas();
     }
    
  
      /*
    
    
    */
    
   
  }




function initialise(){
  
   
  G = new Graph();
  
  background(R.couleur_Fond);
  
  

 Pause=true
document.getElementById("boutonpause").style.background = '#FF6633'

//gestion de l affichage
 hauteur = windowHeight-150;
  largeur= windowWidth-50;
   
  

  document.getElementById('vitesse').value=0;
  
 windowResized();
  
  
  
}



  function f(X) {
            let binaire = X.toString(2);
            let resultat = 0;

   
             for (let bit of binaire) {
                  resultat ^= parseInt(bit); 
              }

             return resultat;
        };
  
  





function fleche(xA, yA, xB, yB, ArrowLength, ArrowWidth, couleur, epaisseur) {
  if (ArrowLength === undefined) {
    ArrowLength = 10;
  }
  if (ArrowWidth === undefined) {
    ArrowWidth = 8;
  }

  // Calculs des coordonnées des points C, D et E (sur l axe et les2 //extremites
  stroke(couleur);
  strokeWeight(epaisseur);

  line(xA, yA, xB, yB);

  //trace la fleche au 2/3
  // xB = 2 * xB / 3 + xA / 3;
  //yB = 2 * yB / 3 + yA / 3;

  xB = xB / 2 + xA / 2;
  yB = yB / 2 + yA / 2;

  AB = Math.sqrt(Math.pow(xB - xA, 2) + Math.pow(yB - yA, 2));

  xC = xB + (ArrowLength * (xA - xB)) / AB;
  yC = yB + (ArrowLength * (yA - yB)) / AB;
  xD = xC + (ArrowWidth * -(yB - yA)) / AB;
  yD = yC + (ArrowWidth * (xB - xA)) / AB;
  xE = xC - (ArrowWidth * -(yB - yA)) / AB;
  yE = yC - (ArrowWidth * (xB - xA)) / AB;
  // et on trace le segment [AB], et sa flèche:
  line(xD, yD, xB, yB);
  line(xE, yE, xB, yB);

  noStroke();

  strokeWeight(epaisseur_Contours);
}


function CodeFonctionEtatEncsv(){
  let F="num;state;Re(amplitude);Im(amplitude);prob(%)";
  
 //  Bouton_relance_mesures() : a revoir
  
  
  let  n_Qbit_a_afficher=undefined;
   
   if (OnFaitLesMesures!=0) n_Qbit_a_afficher=G.n_Qbits_mesure;
    else n_Qbit_a_afficher=G.n_Qbits_sortie; 

    let nbre_Qbits_entree = G.lignes_quantiques.length;

    if (nbre_Qbits_entree == 0) return F;

    if (n_Qbit_a_afficher.length == 0) return F;
    
     let precision_proba =6;
    precision_coeff = precision_proba+2;//car la proba est divisée par 100

  
  
    let etat_mesure="";
  //on calcule les mesures
    if (OnFaitLesMesures!=0){
      
      for (let i = 0; i < nbre_Qbits_entree; i++){
        let S=G.lignes_quantiques[i][G.lignes_quantiques[i].length-1];
      
      if (S.mesure[0]==true) etat_mesure=etat_mesure+S.val_instant_mesure[0].toString();
    }  
    }
  
  print("letatmesure est ",etat_mesure)
    
    for (let i = 0; i < n_Qbit_a_afficher.length; i++) {
      
      
      
      
      
       let x =String(roundToDecimals(n_Qbit_a_afficher[i].x,precision_coeff));
      let y =String(roundToDecimals(n_Qbit_a_afficher[i].y,precision_coeff));
       
     // if ((x==0)&&(y==0))continue;
      
      let proba=String(abs(roundToDecimals(100 * n_Qbit_a_afficher[i] .proba, precision_proba)));
      
     // if (proba==0)continue;
      
      
      let num=String(i);
      
      let etat = convertit_nombreDecimal_En_StringNombre_binaire(i,nbre_Qbits_entree);
      
      
      
     if (OnFaitLesMesures!=0){
         let etat2="";
       
         let etat2mesure="";
    
        for (let j = 0; j < etat.length;j++){
           if (G.lignes_quantiques[j][0].mesure[0]==false)                 etat2=etat2+etat[j];
          else
         etat2mesure=etat2mesure+etat[j];
        }
       
        if (etat_mesure!=etat2mesure) continue;
       
        etat=etat2;
        num=convertit_StringNombre_binaire_En_nombreDecimal(etat);
      }
      
      
      if (etat.length==0) continue;
      
    
      
     F=F+"\n"+num+";|"+etat+">;"+x+";"+y+";"+proba;
      
      
    }


  
  
  return F;
}


function saveAmplitudesFile(){
  var textToWrite = CodeFonctionEtatEncsv(); //on code la fonction d etat en fichier csv

  var textFileAsBlob = new Blob([textToWrite], {
    type: 'text/plain'
  });
 
  var fileNameToSaveAs = "amplitudes.csv";
  
  
  
  var downloadLink = document.createElement("a");
  downloadLink.download = fileNameToSaveAs;
  downloadLink.innerHTML = "Download File";
  if (window.webkitURL != null) {
    // Chrome allows the link to be clicked
    // without actually adding it to the DOM.
    downloadLink.href = window.webkitURL.createObjectURL(textFileAsBlob);
  } else {
    // Firefox requires the link to be added to the DOM
    // before it can be clicked.
    downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
    downloadLink.onclick = destroyClickedElement;
    downloadLink.style.display = "none";
    document.body.appendChild(downloadLink);
  }

  downloadLink.click();
}





//FUNCTION 1
function saveTextAsFile() {
  var textToWrite = CodeGraphEnString(); //on code le graphe et on le mets en memoire

  var textFileAsBlob = new Blob([textToWrite], {
    type: 'text/plain'
  });
  //var fileNameToSaveAs = document.getElementById("inputFileNameToSaveAs").value + ".QT";

  var fileNameToSaveAs = "Simulation.txt";
  
  
  
  var downloadLink = document.createElement("a");
  downloadLink.download = fileNameToSaveAs;
  downloadLink.innerHTML = "Download File";
  if (window.webkitURL != null) {
    // Chrome allows the link to be clicked
    // without actually adding it to the DOM.
    downloadLink.href = window.webkitURL.createObjectURL(textFileAsBlob);
  } else {
    // Firefox requires the link to be added to the DOM
    // before it can be clicked.
    downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
    downloadLink.onclick = destroyClickedElement;
    downloadLink.style.display = "none";
    document.body.appendChild(downloadLink);
  }

  downloadLink.click();
}


//FUNCTION 1
function destroyClickedElement(event) {
  document.body.removeChild(event.target);
}




//FUNCTION 1
// simule le clic du input
function simuleCliCdeInput() {
  print("yo clic detecter")
  document.getElementById("fileToLoad").click();
  print("fin de yo clic detecter")
}

//FUNCTION
function loadFileAsText() {
  initialise_tout();
  

  var fileToLoad = document.getElementById("fileToLoad").files[0];

  var fileReader = new FileReader();
  fileReader.onload = function(fileLoadedEvent) {
    var textFromFileLoaded = fileLoadedEvent.target.result;

    
     //console.log(fileLoadedEvent.target);
   // print(textFromFileLoaded);
    DeCodeStringEnGraph(textFromFileLoaded)
    
    
    // Réinitialiser l'input pour pouvoir recharger le même fichier
    document.getElementById("fileToLoad").value = ""; // Réinitialiser l'input

  };
  fileReader.readAsText(fileToLoad, "UTF-8");
}

//pb de conversion de code js, les points virgules de js ne doivent pas etre des separateurs, on les transforme en @
function transforme_pointvirgule_arobase(chaine){
  c="";
  for (let i = 0; i < (chaine.length); i++){
    if (chaine[i]==";")
    c=c+"@";
    else
    c=c+chaine[i];
  }
  return c;
}

function transforme_arobase_pointvirgule(chaine){
  c="";
  for (let i = 0; i < (chaine.length); i++){
    if (chaine[i]=="@")
    c=c+";";
    else
    c=c+chaine[i];
  }
  return c;
}


//FUNCTION 1
function DeCodeStringEnGraph(code) {
  
 // noLoop();
//il faut descativer l affichge pour les gros calculs  print("ouverture")
  
 
  let t1=millis();
    
    
    
  //print("lecode:",code)
// console.log(code);
  G = new Graph();
  OnFaitLesMesures=0;
  let ya_des_mesures_partielles=false;
  decode = code.split("!") //les 2 premiers sont  le type de graph puis apres ce sont les sommets créées (pas frocement ceux qu il y a !)

  
  
 // print("decode=",decode)
  
 
  let code_nombre=decode[0].split('#');
  
  
 // print("decode0",decode[0],"  ",code_nombre)
  
  let nbreSommetscrees = parseInt(code_nombre[0],10);
  let nbreBoutoncrees=0;
  
  if (code_nombre.length>1) nbreBoutoncrees= parseInt(code_nombre[1],10);
  
  
  
  
  //on decode en premier les éventuels boutons créés
  if (nbreBoutoncrees>0)
    {
      
    
  //on reinitialise da bord la liste des boutons et on efface les anciens boutons
    for (let i = 0; i < liste_boutons_crees.length; i++){
      let buttonId="boutonCree"+i.toString();
      EffaceButton(buttonId);
    }
      
      
      
      
      
      
  liste_boutons_crees=[];
  
  for (let i = 0; i < nbreBoutoncrees; i++)
  
  {
     let codeBouton = decode[1 + i];
    
    codeBouton = codeBouton.split(';');
    let numero=parseInt(codeBouton[0],10);
    let nAretes_max=parseInt(codeBouton[1],10);
    let symbole=codeBouton[2];
    
    let M=[];//matrice
    let n=2**nAretes_max;
    let num=3;
    for (let u = 0; u < n; u++) {
                M.push([]);
                for (let v = 0; v <n; v++){
                  
                     let x=parseFloat(codeBouton[num],10);num=num+1;
                     let y=parseFloat(codeBouton[num],10);;num=num+1;
                     M[u].push(new complexe(x,y));
                     
                     
               }
    }
    
      liste_boutons_crees.push(new BoutonPorte(i,M,symbole,nAretes_max));
    
  }
    }
  //fin decodage des boutons créées
  
  //print("liste des boutons crees",liste_boutons_crees)
  
//  print("nbre de boutons crees",nbreBoutoncrees)
  
 // print("nbre de sommets crees",nbreSommetscrees)
  
  //on LIT DABORD LES SOMMETS;
  for (let i = 0; i < nbreSommetscrees; i++)
    if (decode[1 + i+nbreBoutoncrees].length <= 1) //si c est 1 c est un ?, sommet detruit
  {
    G.TabSommets.push(undefined);
  } else {
    
  
    let codeSommet = decode[1 + i+nbreBoutoncrees];
    
    
  //  print("le code sommet",i,"est",codeSommet)

    codeSommet = codeSommet.split(';');
    
    let indicemax_codeSommet=codeSommet.length-1;
   // print("indicemax",indicemax_codeSommet)
   // print("codesommet",codeSommet)
   
    let coeff_a=undefined;
    let coeff_b=undefined;
    let coeff_a_imaginaire=undefined;
    let coeff_b_imaginaire=undefined;
    let phase_nombre=undefined;
    let code_type=codeSommet[0].split('#');
    let mesuresPartielles=undefined;
        
        
    let type=  parseInt(code_type[0], 10);
    
    
    
    if (code_type.length>1){
      
      if (type==0){
        coeff_a=parseFloat(code_type[1]);
        coeff_b=parseFloat(code_type[2]);
        if (code_type.length>3){
          coeff_a_imaginaire=parseFloat(code_type[3]);
          coeff_b_imaginaire=parseFloat(code_type[4]);
        }
      }
      else
      if ((type==10)){ 
        phase_nombre=parseInt(code_type[1]);
      }else
       if ((type==7)){ 
        phase_nombre=parseFloat(code_type[1]);
      } 
      else
      
      if (type==65){
        
        mesuresPartielles=parseInt(code_type[1]);
        
      
      }   
      
      else
       if ((type==8)||(type==9)){ 
        phase_nombre=parseFloat(code_type[1]);
      } 
      
      
    
      
    }
    
    
    
    let numero_ligne_quantique=parseInt(codeSommet[1], 10);
   
    let x = parseInt(codeSommet[2], 10);
    
    let y = parseInt(codeSommet[3], 10);
   
    let diametre = parseInt(codeSommet[4], 10);
    
    
     if ((type==8)||(type==9)){ //sommet genere par bouton
       boutonSelectionne=liste_boutons_crees[phase_nombre];//on en a besoin pour creer le sommet
     }
    
   
     
    G.ajouteSommet(x, y, diametre,type,true);
    
    
    if (phase_nombre!=undefined) {
      G.TabSommets[i].phase_nombre=phase_nombre;
      if ((type==7)) initialise_texte_R_phi(i);
    }
     
    if (mesuresPartielles!=undefined) {
       G.TabSommets[i].val_instant_mesure[0]=mesuresPartielles;
       G.TabSommets[i].mesure[0]=true;
       ya_des_mesures_partielles=true;
      
    }
    
   // print("le code sommet 5 est",codeSommet[5])
  //  print("son tableau est",codeSommet[5].split(','))
   
  //  print("le sommet est",G.TabSommets[i])
    //G.TabSommets[G.TabSommets.length-1].couleur[0] =150;
    
    G.TabSommets[i].couleur = codeSommet[5].split(',');
    if (G.TabSommets[i].couleur.length == 1)
      G.TabSommets[i].couleur[0] = parseInt(G.TabSommets[i].couleur[0], 10);
    
    
    if (coeff_a!=undefined){
      
      if (coeff_a_imaginaire!=undefined){
        G.TabSommets[i].calcul_coeff_Qbit(coeff_a,coeff_a_imaginaire,coeff_b,coeff_b_imaginaire,0);
      }
      else
        G.TabSommets[i].calcul_coeff_Qbit(coeff_a,0,coeff_b,0,0);
    }
    //G.TabSommets[i].Qbit[0] = [coeff_a, coeff_b, coeff_a * coeff_a, coeff_b * coeff_b];
    
    //a partir de (x+yi)|0>+(z+wi)|1> calcul this.Qbit[n][coeff1,ceoff2,P0,P1]
    
    //print("x=",G.TabSommets[i].x,"y=",G.TabSommets[i].y,"rayon=",G.TabSommets[i].rayon,"nom=",G.TabSommets[i].nom,"couleur=",G.TabSommets[i].couleur,"naretes_sortantes=",G.TabSommets[i].nAretes_sortantes);
    
    if (indicemax_codeSommet>=6) //a mettre pour que les vieilles version de fichier restent compatibles avec les nouvellles
    G.TabSommets[i].Coeff_hauteur=parseInt(codeSommet[6], 10);
    
    if (indicemax_codeSommet>=7)
    G.TabSommets[i].texte_annexe=transforme_arobase_pointvirgule(codeSommet[7]);
     
  }
    
   
  
  
 
  
  
  let indice=nbreSommetscrees+1+nbreBoutoncrees;
  
 // print("indice",indice)
  
 
  
  //ON LIT ENSUITE TOUTES LES ARETES SORTANTES
   for (let i = indice; i <decode.length; i++)
    
  {
    
    let codeSommet = decode[i];
    codeSommet = codeSommet.split(';');
    
   // print(i,"codesommet arete sortante=",codeSommet)
    
    let type_arete= codeSommet[0];   
    
    if (type_arete=="T"){//c est le texte explicatif de l algo
      if (codeSommet[1]!="") {
        texte_explication_algo=codeSommet[1];
        document.getElementById('explicationAlgo').value= texte_explication_algo;
      }
      continue;
    }
   
    
    
    
    
  

    let num_sommet_depart = parseInt(codeSommet[1], 10);
     
      let num_sommet_arrive = parseInt(codeSommet[2], 10);
    
     let Sommet_Depart = G.TabSommets[num_sommet_depart];
    
     let epaisseur=parseInt(codeSommet[3], 10);
      let couleur = codeSommet[4].split(',');
      if (couleur.length==1) couleur=parseInt(couleur, 10);
    
    let arete;
    
    
    if (type_arete=="S"){
      G.ajouteArete(num_sommet_depart, num_sommet_arrive,true);
      arete=Sommet_Depart.aretes_sortantes[Sommet_Depart.nAretes_sortantes-1];
    
      
     
    }else
      if (type_arete=="C"){
        
    //let Sommet_Arrive = G.TabSommets[num_sommet_arrive];
      G.ajouteAreteDeControle(num_sommet_depart,num_sommet_arrive,true);
       arete=Sommet_Depart.aretes_controle[Sommet_Depart.nAretes_controle-1]; 
        
     
    }
    
   //  print("epaisseur=",epaisseur,"coul=",couleur,type_arete,arete,Sommet_Depart) 
     
    //a faire apres couleur et epaisseur
    arete.epaisseur=epaisseur;
    arete.couleur=couleur;
     //if (G.TabSommets[i].aretes_sortantes[j].couleur.length == 1)
      //  G.TabSommets[i].aretes_sortantes[j].couleur = parseInt(G.TabSommets[i].aretes_sortantes[j].couleur, 10);
        
    if (codeSommet.length>5){
      let xA = parseInt(codeSommet[5], 10);let xB = parseInt(codeSommet[6], 10);
      let yA = parseInt(codeSommet[7], 10);let yB = parseInt(codeSommet[8], 10);
      arete.modifieCoordonnees( xA, yA, xB, yB);
    }
    
    
    
    }
      
  
  //ON INITIALISE ET RECALCULE LES LIGNES
 // G.calcul_LignesQuantiQues_nQbitsEntree_nQbitsSortie();
    
  //ON INITIALISE ENSUITE LES PORTES PARTICULIERES
  
  //les oracles redimensionnés et les portes de grover
  let yaeuunemodifdef=false;
   for (let i = 0; i < G.TabSommets.length; i++) 
      if (G.TabSommets[i] != undefined)
        {
        if (G.TabSommets[i].type==10){
          
          
          G.TabSommets[i].nAretes_min=1+G.TabSommets[i].phase_nombre;
          
         G.TabSommets[i].calcul_Rayon(); //initialise les dimensions pour le redimensionnement 
          
          
        
          
          if (G.TabSommets[i].texte_annexe!=""){//il faut calculer la fonction f(X)
            
            LeTexteDeFonctionOracle=G.TabSommets[i].texte_annexe;
        document.getElementById('selectOption').value=6;
           changerTexte(document.getElementById('selectOption'));
            
            let nbre= Math.max(G.TabSommets[i].nAretes_entrantes-G.TabSommets[i].phase_nombre,8);
            G.TabSommets[i].f_oracle= F_oracle(nbre);
            yaeuunemodifdef=true;
           
          }
          
        }
         else if ((G.TabSommets[i].type==11)||(G.TabSommets[i].type==12)||(G.TabSommets[i].type==13)||(G.TabSommets[i].type==14)){//diffueur grover, multiple, fourier etc
         
         G.TabSommets[i].calcul_Rayon(); //initialise les dimensions pour le redimensionnement 
      
         }
  
       }
  
  
   //si on a calcule l oracle une fois, on refait les calculs
  //  if (yaeuunemodifdef==true) G.calcul_LignesQuantiQues_nQbitsEntree_nQbitsSortie();
  
   
  
  G.calcul_LignesQuantiQues_nQbitsEntree_nQbitsSortie(false);
  
  
 // ya_des_mesures_partielles=false;
  if (ya_des_mesures_partielles==true) {
     OnFaitLesMesures=2;//mesure partielle
    //prends 7 s !
    
    
    
    for (let num_ligne = 0; num_ligne < G.lignes_quantiques.length; num_ligne++){
      
      
      
      let ligne=G.lignes_quantiques[num_ligne];
      if (ligne[ligne.length-1].mesure[0]==true) //si mesure 65 est a true
      {
        
        
        
        for (let i = 0; i < ligne.length-2; i++){
           let Sommet=ligne[i];

            let index=Sommet.indice_dune_ligne(num_ligne);
            
            //print("num_ligne",num_ligne,"type",Sommet.type,"index",index)
            Sommet.mesure[index]=true;
    
         }
      }
      
    }
    
    
    
    
   
    //en dessous prend 1,5 s
    effaceOuAfficheBoutonsmesures();
  G.calcul_nQbits_mesure_fixe_valeurs_mesurees_et_calcule_valeurs_instantannees_pour_les_autres_lignes(true);
  
                            
    }
  
  G.affiche_du_nQbit_de_sortie_et_des_probas();
      
  if (R.Graphique_visible==false) graphique(); 
  ouverture_de_fichier_en_cours=false;
  
 //loop();//on remet l affichage
 
  //if (transparencetitre<0) if (Selection<0)
    if (G.lignes_quantiques.length==1) simuleBloch();
  
  let t2=millis();
    
    //loop()
  print("duree telechargement:",t2-t1);
  
  
  
}


//FUNCTION
function CodeGraphEnString() {

  code = G.TabSommets.length.toString(); //nature  et nbre de sommets qui ont été crées
  //le nbre de sommets reels est calculé a la création
  
  
  
  
  
  //on code en premier les éventuels boutons créés
  if (liste_boutons_crees.length>0)
    {
  code=code+"#"+liste_boutons_crees.length.toString();
  for (let i = 0; i < liste_boutons_crees.length; i++)
  
  {
    code = code + "!";
    
    let Bouton=liste_boutons_crees[i];
   
    code=code+Bouton.numero.toString()+";"
    code=code+Bouton.nAretes_max.toString()+";"
    code=code+Bouton.symbole+";"
    let M=Bouton.matrice;
    
          for (let u = 0; u < M.length; u++) 
                for (let v = 0; v <M.length; v++){
                     code=code+M[u][v].x.toString()+";"
                     code=code+M[u][v].y.toString()+";"
                     
               }
    
    
    
  }
    }
  //fin des boutons créées
  
  
  
  
  
  
  
  
  
  
  

  //ON CODE DABORD LES SOMMETS
  

  for (let i = 0; i < G.TabSommets.length; i++)
    if (G.TabSommets[i] == undefined) {
      code = code + "!" + "?"; //on code les noeuds supprimés car les futurs noeuds créés ont besoin d etre bien incrémentés
    }
  else {

    let code_type=G.TabSommets[i].type.toString();
    
    
    
    if (code_type=="0"){//si c est un qbit on ajoute ses coeffs
      code_type=code_type+'#'+G.TabSommets[i].Qbit[0][0].x.toString()+'#'+G.TabSommets[i].Qbit[0][1].x.toString()+'#'+G.TabSommets[i].Qbit[0][0].y.toString()+'#'+G.TabSommets[i].Qbit[0][1].y.toString();
    
       
    }
    
    if (code_type=="10"){//si c est un oracle on ajoute le nbre de qbits du deuxieme registre s'il est different de 1, sinon , non
      if (G.TabSommets[i].phase_nombre>1){
        code_type=code_type+'#'+G.TabSommets[i].phase_nombre.toString();
      }     
    }
    
    
    if (code_type=="7"){//si c est une porte r_phi on ajoute sa phase si elle  est differente de 0, sinon , non
      if (G.TabSommets[i].phase_nombre!=0){
        code_type=code_type+'#'+G.TabSommets[i].phase_nombre.toString();
      }     
    }
    
    if ((code_type=="8")||(code_type=="9")){//si c est une porte générée par un bouton on ajoute le numero de son bouton qui est dans phase nombre
     
        code_type=code_type+'#'+G.TabSommets[i].phase_nombre.toString();
           
    }
    
    
    if (code_type=="65"){//si c est une porte 65 et qu elle est mesurée, on ajoute sa mesure sinon non
      if (G.TabSommets[i].mesure[0]==true){
        code_type=code_type+'#'+G.TabSommets[i].val_instant_mesure[0].toString();
      }     
    }
    
    
    
    
   // print(i,G.TabSommets[i])
    //chaque sommet est séparé par !
    //le séparatuer de donné est ;
    //on pourra tout récupérer ds une liste avec .split(";")
    code = code + "!" +  code_type+";"+G.TabSommets[i].num_ligne[0].toString()+";"+Math.round(G.TabSommets[i].x).toString() + ";" + Math.round(G.TabSommets[i].y).toString() + ";" + Math.round(G.TabSommets[i].diametre).toString() + ";" + G.TabSommets[i].couleur.toString()+";"+G.TabSommets[i].Coeff_hauteur+";"+transforme_pointvirgule_arobase(G.TabSommets[i].texte_annexe);
    //les couleurs [100,200,11] seront transformés en string avec une virgule 100,200,11     
    
  }  
    
    //PUIS ON CODE TOUTES LES ARETES SORTANTES UNIQUEMENT
   
  //ou SORTANTES des CONTROLES TYPES 16 et 17
  
  //chaque arrete est séparé par !
    //le séparatuer de donné est ;
    //on pourra tout récupérer ds une liste avec .split(";")
  
  
  //LES ARETES SORTANTES DOIVENT ETRE ENREGISTREES DANS L ORDRE DES LIGNES QUANTIQUES
  //IMPORTANT POUR LES PORTES MULTIPLES
  
  
    let nbre_Qbits_entree = G.lignes_quantiques.length;
    
    for (let j = 0; j <nbre_Qbits_entree; j++){
      let ligne=G.lignes_quantiques[j];
      for (let i = 0; i <(ligne.length-1); i++){
        let S=ligne[i];
          for (let k = 0; k <S.nAretes_sortantes; k++)
          
          if (S.aretes_sortantes[k].numero_ligne_quantique==j)
          
          {
            
        
            let arete=S.aretes_sortantes[k];
            code = code +"!" +"S"+";"+ arete.numSommetDepart.toString() + ";" + arete.numSommetArrive.toString() + ";" + arete.epaisseur.toString() + ";" + arete.couleur.toString() +";" + arete.xA.toString()+ ";" +arete.xB.toString()+";" + arete.yA.toString()+";" + arete.yB.toString();
  
          }
        
      }
    }
  
  
  
  
  
    
   
  
    for (let i = 0; i < G.TabSommets.length; i++)
    if (G.TabSommets[i] != undefined) { 
    
/*
    for (let j = 0; j < G.TabSommets[i].nAretes_sortantes; j++) {
      //print("debut de lenregistrement de l arete",G.TabSommets[i].aretes_sortantes[j])
      code = code +"!" +"S"+";"+ G.TabSommets[i].aretes_sortantes[j].numSommetDepart.toString() + ";" + G.TabSommets[i].aretes_sortantes[j].numSommetArrive.toString() + ";" + G.TabSommets[i].aretes_sortantes[j].epaisseur.toString() + ";" + G.TabSommets[i].aretes_sortantes[j].couleur.toString() +";" + G.TabSommets[i].aretes_sortantes[j].xA.toString()+ ";" +G.TabSommets[i].aretes_sortantes[j].xB.toString()+";" + G.TabSommets[i].aretes_sortantes[j].yA.toString()+";" + G.TabSommets[i].aretes_sortantes[j].yB.toString();
    }
      */
      if ((G.TabSommets[i].type==16)||(G.TabSommets[i].type==17))
 for (let j = 0; j < G.TabSommets[i].nAretes_controle; j++) {
      code = code +"!" +"C"+";" +G.TabSommets[i].aretes_controle[j].numSommetDepart.toString() + ";" + G.TabSommets[i].aretes_controle[j].numSommetArrive.toString() + ";" + G.TabSommets[i].aretes_controle[j].epaisseur.toString() + ";" + G.TabSommets[i].aretes_controle[j].couleur.toString()+";" + G.TabSommets[i].aretes_controle[j].xA.toString()+ ";" +G.TabSommets[i].aretes_controle[j].xB.toString()+";" + G.TabSommets[i].aretes_controle[j].yA.toString()+";" + G.TabSommets[i].aretes_controle[j].yB.toString();
    } 
    

    }
  
  
  
  
  code=code+"!"+"T;"+texte_explication_algo;
  
 // print("le code",code)
  
  return code;
  
  
  
}

//charge le fichier et retourne le texte
//attention pas de majuscules ni d espaces.
//un fichier texte obligatoirement
function chargeFichierExemple(element) {
  
  
  if (R.active_Bloch==true) simuleBloch();
 
  /*
  if (element.id=="shor9bits"){
    affichemessagedattente()
   
    
    let reval="";
    
    if (langue==1){
       retVal = confirm("WARNING,\n this animation handles 18_qBits, the calculation and reaction times are a little long.\n It takes around 20 s to load the file.\n Do you want to continue?");
    }
    else
   retVal = confirm("ATTENTION,\n cette animation gère un 18_qBits, les temps de calculs et de réactions sont un peu longs.\n Il faut environ 20 s pour charger le fichier.\n Voulez vous continuer?");
     if( retVal == false )return ;
    
    
  }*/
  
   if ((element.id=="shor9bits")||(element.id=="shor4bits")){
  
      document.getElementById("radioOuidecimal").checked=true; 
      R.affiche_decimal=true;
     //document.getElementById("precisionChiffresApresVirgule").value=0;
   }else{
     document.getElementById("radioNondecimal").checked=true; 
      R.affiche_decimal=false;
     //document.getElementById("precisionChiffresApresVirgule").value=1;
   }
  
  initialise_tout();
  ouverture_de_fichier_en_cours=true;
  
  let nomFichier = element.id+".txt";
  
  var url = 'examples/fr/' + nomFichier; // + '.txt';

  if (langue==1) url = 'examples/en/' + nomFichier; // + '.txt';
  //console.log(url);

  //envoie une requete et recupere le texte
  fetch(url).then(function(response) {
    response.text().then(function(text) {
      DeCodeStringEnGraph(text);
       
      
    });
  });
   clignote=100;
};


function chargeFichierIntro() {
  
 
  
 
  
  
  initialise_tout();
  ouverture_de_fichier_en_cours=true;
  
  
  
  var url = 'examples/circuitouverture.txt';

 
  //envoie une requete et recupere le texte
  fetch(url).then(function(response) {
    response.text().then(function(text) {
      DeCodeStringEnGraph(text);
       
      
    });
  });
  
};

function rgbToHex(couleur) {
  let r;
  let g;
  let b;
  if (couleur.length == 1){
    r=parseInt(couleur,10);
    g=parseInt(couleur,10);
    b=parseInt(couleur,10);
    
  }else
    {
    r=parseInt(couleur[0],10);
    g=parseInt(couleur[1],10);
    b=parseInt(couleur[2],10);
    
  }
    
  
    return "#" + ((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1).toUpperCase();
}

function hexToRGB(hex) {
    // Retirer le # si présent
    hex = hex.replace(/^#/, '');

    // Convertir les valeurs hexadécimales en entiers
    let r = parseInt(hex.substring(0, 2), 16);
    let g = parseInt(hex.substring(2, 4), 16);
    let b = parseInt(hex.substring(4, 6), 16);

    return [r, g, b];
}