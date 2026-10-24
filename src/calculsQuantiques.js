/* QAlgo — moteur : vecteur d'état, application des portes, mesures, oracle
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

//retourne [a1,b1,a2,b2] les coefficents complexes du qbit
function convertit_Bloch_complexe(teta,phi){//teta et phi sont en rad
 
 //retourne teta et phi [teta,phi] les coefficients de bloch
function  convertit_complexe_Bloch(Sommet){//teta et phi sont en rad
      
//retourne un nombre aleatoire correspondant a l indice dans la liste probs en fonction du vecteur de probas (dont la somme est 1)
function tirageAleatoire(probs) {
//retourne un nombre aleatoire correspondant a l indice dans la liste du nQbits fonction du vecteur de probas (dont la somme est 1)
function tirageAleatoire_etat_dun_nQbits(nQbits) {
function mise_a_jour_oracle(Sommet){
//retourne une liste de resultats de f(x) pour n qbits d entrée de l oracle
function F_oracle(n_qbits){
//calcule la distance entre un point(X,Y) et l'arete definie par ses coordonnees
function  distance_a_une_droite(xA, yA, xB, yB, X, Y) {

function convertit_nombreDecimal_En_StringNombre_binaire(nombreDecimal,nbits){

function retourne_liste_lignes_quantiques(C){//C est un circuit quantique de type graph, comme G
function convertit_nombreDecimal_En_StringNombre_binaire(nombreDecimal,nbits)

function convertit_StringNombre_binaire_En_nombreDecimal(binaryString){




function retourne_vecteur_nQbits_dentree(LigneQuantique){


function affichage_dans_console_probas_du_nQbit(n_Qbits,nbre_Qbits){

function calcul_probas_pour_un_Qbit_numeroQbit_du_nQbit(n_Qbits,numeroQbit,nbre_Qbits){


function calcul_probas_pour_chaque_Qbit_du_nQbit(n_Qbits,nbre_Qbits){//fait comme son nom l indique


function inverse_bit_a_index_pour_un_nbre_binaire(binaireString, index) {

function cette_porte_est_desactive_par_un_controle(etat,Liste_controle){

function applique_Porte_X(n_Qbits,index,nbre_Qbits,L_aretes_controle){//applique une porte X au bit correspondant a l index et retourne un nouveau n_Qbits modifié



function applique_Porte_SWAP(n_Qbits,index,nbre_Qbits,L_aretes_controle){//applique une porte SWAP au bit correspondant a l index et retourne un nouveau n_Qbits modifié



function applique_Porte_Y(n_Qbits,index,nbre_Qbits,L_aretes_controle){//applique une porte Y au bit correspondant a l index et retourne un nouveau n_Qbits modifié


function applique_Porte_Z(n_Qbits,index,nbre_Qbits,L_aretes_controle){//applique une porte Z au bit correspondant a l index et retourne un nouveau n_Qbits modifié

function applique_Porte_H(n_Qbits,index,nbre_Qbits,L_aretes_controle){//applique une porte H au bit correspondant a l index et retourne un nouveau n_Qbits modifié
  

function applique_Porte_BitMesure(BitMesure,n_Qbits,index,nbre_Qbits){//applique le bit mesure

function extrait_bits_particuliers_qui_sont_a_position(L1,positions){

function applique_Porte_Oracle(n_Qbits,L_index,nbre_Qbits,L_aretes_controle){//applique une porte Oracle au bit correspondantaux positions dans L_index et retourne un nouveau n_Qbits modifié


//on suppose que la transformee de Fourier s'applique sur l'ENSEMBLE du nQbits.
//sur le vecteur (x0,x1,x2....xn-1) et retourne le vecteur  (y0,y1,y2....yn-1)
function Fourier(n_Qbits,inverse=false){
function applique_Porte_Racine_X(n_Qbits,L_index,nbre_Qbits,L_aretes_controle){
function applique_Porte_Racine_SWAP(n_Qbits,L_index,nbre_Qbits,L_aretes_controle){

function applique_Porte_Universelle(n_Qbits,L_index,nbre_Qbits,matrice=undefined,L_aretes_controle){

//on suppose que la matrice s'applique sur l'ENSEMBLE du nQbits.
//sur le vecteur (x0,x1,x2....xn-1) et retourne le vecteur  (y0,y1,y2....yn-1)
//la matrice est une matrice carré nxn et ressort un vecteur 
function applique_matrice(n_Qbits,matrice){

*/

let oracle_en_attente_de_fonction=undefined;//quand on lance un oracle il se met dedans pour initialiser son f_oracle


//retourne un nombre aleatoire correspondant a l indice dans la liste probs en fonction du vecteur de probas (dont la somme est 1)
function tirageAleatoire(probs) {
  let r = random(1); // Générer un nombre aléatoire entre 0 et 1
  let somme = 0;     // Variable pour suivre la somme cumulative des probabilités
  
  for (let i = 0; i < probs.length; i++) {
    somme += probs[i]; // Ajouter la probabilité à la somme cumulative
    
    if (r < somme) {
      return i; // Si le nombre aléatoire est inférieur à la somme cumulative, on renvoie l'indice
    }
    
   
  }
  
   if (somme==0) print("gros bug function tirageAleatoire(probs)!!!!!!!!!!!!",somme)
    return 0; //ne devrait jamais arrivé ici
  
  
}



//retourne un nombre aleatoire correspondant a l indice dans la liste du nQbits fonction du vecteur de probas (dont la somme est 1)
/* ---------------------------------------------------------------------------
   Le vecteur d etat : les 2^n amplitudes du registre.

   Trois tableaux de flottants au lieu d un tableau de 2^n objets complexe. Un
   complexe coute 204 octets mesures, parce que V8 ne range pas ses champs dans
   l objet mais boite chaque double dans un HeapNumber separe : a 18 qbits le
   vecteur pesait 51 Mo, contre 6 Mo ici. C est ce qui borne le simulateur, et
   non la vitesse.

   re et im sont les parties reelle et imaginaire ARRONDIES a 10 decimales,
   comme les champs x et y de complexe. pr est la probabilite, calculee sur les
   valeurs d AVANT l arrondi, exactement comme le faisait complexe : les deux ne
   sont donc pas tout a fait coherentes, et c est voulu -- c est ce que le
   moteur a toujours calcule, et les empreintes des tests en dependent.

   vivant[i] vaut 0 quand l amplitude a ete supprimee par une mesure, ce que
   l ancienne representation marquait par un undefined dans le tableau. Il
   reste a null tant qu aucune amplitude n a ete supprimee.                   */
class vecteur_etat {
  constructor(taille){
    this.length=taille;
    this.re=new Float64Array(taille);
    this.im=new Float64Array(taille);
    this.pr=new Float64Array(taille);
    this.vivant=null;//null = toutes les amplitudes sont vivantes
    this.jeton=null;//complexe de pret-a-lire pour l affichage, voir plus bas
  }

  /* Un complexe portant l amplitude de rang i, pour l affichage.
     ATTENTION : c est toujours le MEME objet qui est rendu, rempli a neuf a
     chaque appel. C est ce qui evite 2^n allocations dans les boucles
     d affichage, mais il ne faut ni le conserver ni en demander deux a la
     fois : pour cela, passer par complexe_depuis_vecteur. */
  complexe_au_rang(i){
    if (this.jeton===null) this.jeton=new complexe(0,0);
    let c=this.jeton;
    c.xbrut=this.re[i];
    c.ybrut=this.im[i];
    c.x=this.re[i];
    c.y=this.im[i];
    c.proba=this.pr[i];
    return c;
  }

  //ecrit l amplitude x+yi au rang k, exactement comme le faisait
  //new complexe(x,y) : re et im arrondis, pr calcule avant l arrondi
  ecrit(k,x,y){
    this.re[k]=Math.round(x*1e10)/1e10;
    this.im[k]=Math.round(y*1e10)/1e10;
    this.pr[k]=x*x+y*y;
  }

  //pose telle quelle l amplitude d un complexe deja construit, probabilite
  //comprise : l ancien code rangeait l objet lui meme dans le vecteur, sans le
  //recalculer, et sa probabilite avait ete obtenue avant arrondi
  pose(k,c){
    this.re[k]=c.x;
    this.im[k]=c.y;
    this.pr[k]=c.proba;
  }

  est_vivant(i){
    return (this.vivant===null)||(this.vivant[i]===1);
  }

  //marque l amplitude comme supprimee par une mesure
  tue(i){
    if (this.vivant===null){
      this.vivant=new Uint8Array(this.length);
      this.vivant.fill(1);
    }
    this.vivant[i]=0;
    this.re[i]=0;
    this.im[i]=0;
    this.pr[i]=0;
  }
}


//un vecteur d etat depuis un tableau de complexe, undefined valant une
//amplitude supprimee par une mesure
function convertit_complexes_en_vecteur_etat(tableau){
  let v=new vecteur_etat(tableau.length);
  for (let i = 0; i <tableau.length; i++){
    let c=tableau[i];
    if (c==undefined){ v.tue(i); continue; }
    v.re[i]=c.x;
    v.im[i]=c.y;
    v.pr[i]=c.proba;
  }
  return v;
}


//l inverse : un tableau de complexe, pour l affichage
function convertit_vecteur_etat_en_complexes(v){
  if ((v instanceof vecteur_etat)==false) return v;//deja un tableau de complexe
  let tableau=new Array(v.length);
  for (let i = 0; i <v.length; i++){
    if (v.est_vivant(i)==false){ tableau[i]=undefined; continue; }
    tableau[i]=complexe_depuis_vecteur(v.re[i],v.im[i],v.pr[i]);
  }
  return tableau;
}


//retourne un nombre aleatoire correspondant a l indice dans la liste du nQbits fonction du vecteur de probas (dont la somme est 1)
function tirageAleatoire_etat_dun_nQbits(nQbits) {
  let r = random(1); // Generer un nombre aleatoire entre 0 et 1
  let somme = 0;     // Variable pour suivre la somme cumulative des probabilites

  //TRANSITION : appelee sur un vecteur_etat comme sur un tableau de complexe
  let est_un_vecteur=(nQbits instanceof vecteur_etat);

  for (let i = 0; i < nQbits.length; i++) {
    somme += est_un_vecteur ? nQbits.pr[i] : nQbits[i].proba; // Ajouter la probabilite a la somme cumulative

    if (r < somme) {
      return i; // Si le nombre aleatoire est inferieur a la somme cumulative, on renvoie l indice
    }

  }

   if (somme==0) print("gros bug function tirageAleatoire_etat_dun_nQbits(nQbits)!!!!!!!!!!!!",somme)
    return 0; //ne devrait jamais arrive ici

}

function convertit_Bloch_complexe(teta,phi){//teta et phi sont en rad
      let a1=Math.cos(teta/2);let b1=0;
      let a2=Math.sin(teta/2)*Math.cos(phi);let b2=Math.sin(teta/2)*Math.sin(phi);
      return [a1,b1,a2,b2];
    }  
function  convertit_complexe_Bloch(C1,C2){//teta et phi sont en rad
      
 // let C1=Q[0];//complexe 0 devant |0>
  //let C2=Q[1];//complexe 1 devant |1>
        
      let teta=0;
        let phi=0;
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
    
  
      if (phi<0) phi=2*Math.PI + phi;//pour garder des valeurs positives
  
      return [teta,phi];
    }  




function mise_a_jour_oracle(Sommet){
  let nbre= Sommet.nAretes_entrantes-Sommet.phase_nombre;
  
  let n= Math.pow(2, nbre);
  
  let ancien_nbre=Sommet.f_oracle.length;
  
  
   // print(Sommet.nAretes_entrantes,"  ",Sommet.phase_nombre,"yoyomise a jour oracle",nbre,"   ",n,"",ancien_nbre);
  
  if (n>ancien_nbre){
    
   // print("mise a jour oracle",n,"   ",ancien_nbre);
    Sommet.f_oracle=F_oracle(nbre);
  }
  
  
}




//retourne une liste de resultats de f(x) pour n qbits d entrée de l oracle
function F_oracle(n_qbits){
  
 
  
  
  let L=[];
  let n= Math.pow(2, n_qbits);
  //print("n=",n)
  try{
    
    // Récupérer le code de l'utilisateur
  userCode = document.getElementById('fonctionTextarea').value;
   // userCode = document.getElementById('fonctionTextarea').textContent;
  
     eval(userCode); 
        
    // Exemple d'exécution de la fonction f(x) pour un certain x
     for (let i = 0; i <n; i++) {
       //print("i=",i)
       let result = f(i);  // Appeler la fonction définie par l'utilisateur
       L.push(result);
     }
   
   // print("resultat=",L)
    
    
    
    return L;
    
  }catch{
    
   return -1;//erreur
    
  }
  
  
  
}
/*
function F_oracle(X){
  let L=[];
  
  let n= Math.pow(2, X);
  print("n=",n)
  
  try{
    
    // Récupérer le code de l'utilisateur
  userCode = document.getElementById('fonctionTextarea').value;
  
    eval(userCode); 
    // Exemple d'exécution de la fonction f(x) pour un certain x
    
    let result = f(X);  // Appeler la fonction définie par l'utilisateur
    //print(result);
    return result;
    
  }catch{
    
   // alert("Ta fonction est mal défini");
    return -1;
    
  }
  
  
  
}

*/
//calcule la distance entre un point(X,Y) et l'arete definie par ses coordonnees
//renvoie d=[distance de la droite, coordX du point de projection,CoordY]
function  distance_a_une_droite(xA, yA, xB, yB, X, Y) {
    // Calcul de la pente de la droite (a)
    let a = (yB - yA) / (xB - xA);

    // Calcul de l'ordonnée à l'origine (b) de la droite
    let b = yA - a * xA;

    

    // Calcul de la distance entre le point (X, Y) et la droite
    let distance = Math.abs(a * X -1 * Y + b) / Math.sqrt(a*a + 1);
  
    //point de la droite le plus proche
    let Xp = (X + a * Y - a * b) / (a*a + 1);
    let Yp = a*Xp+b;
  
    if ((Xp<min(xA,xB))||(Xp>max(xA,xB))) return [256,256,256];//projection trop loin en dehors de la droite
    if ((Yp<min(yA,yB))||(Yp>max(yA,yB))) return [256,256,256];//projection trop loin en dehors de la droite

    return [distance,Xp,Yp];
}
/*
function point_de_la_droite_le_plus_proche(xA, yA, xB, yB, X, Y){
    // Calcul des coordonnées du point projeté sur la droite
  
  // Calcul de la pente de la droite (m)
    let m = (yB - yA) / (xB - xA);

    // Calcul de l'ordonnée à l'origine (b) de la droite
    let b = yA - m * xA;
  
  
    let Xp = (X + m * Y - m * b) / (m * m + 1);
    let Yp = (m * X + Y + m * m * b) / (m * m + 1);

    // Retourne la distance et les coordonnées du point projeté sous forme de tuple
    return [Xp, Yp];
}

*/
/* Signature de tout ce dont depend le vecteur d etat : la suite des sommets
   traverses par chaque ligne quantique, dans l ordre, et les fils de controle.

   Les lignes quantiques sont DEDUITES du dessin. Deplacer un qbit d entree sans
   changer l ordre des lignes, ou redimensionner une porte sans changer les
   lignes qu elle traverse, donne donc exactement le meme resultat : comparer
   deux signatures evite un calcul qui tient 5 s a 22 qbits et 22 s a 24.

   Le cout est celui d un parcours du graphe, O(sommets) -- quelques dizaines
   d operations, a comparer aux millions du calcul evite.

   Ne depend volontairement pas des coordonnees : seul l ORDRE compte. Et pas
   non plus des coefficients des qbits ni des parametres des portes, qui sont
   modifies par d autres chemins, lesquels relancent le calcul directement. */
function signature_du_circuit(C){

  let L=retourne_liste_lignes_quantiques(C);

  let morceaux=[];
  for (let i = 0; i <L.length; i++){
    let ligne=L[i];
    let numeros=[];
    for (let j = 0; j <ligne.length; j++) numeros.push(ligne[j].numeroSommet);
    morceaux.push(numeros.join(","));
  }

  //un fil de controle agit par la ligne ou se trouve son depart : on le retient
  let controles=[];
  for (let i = 0; i <C.TabSommets.length; i++){
    let S=C.TabSommets[i];
    if (S==undefined) continue;
    for (let j = 0; j <S.nAretes_controle; j++)
      controles.push(i+"<"+S.aretes_controle[j].numSommetDepart);
  }

  return morceaux.join(";")+"|"+controles.join(",");
}


function retourne_liste_lignes_quantiques(C){//C est un circuit quantique de type graph, comme G
  
  //une ligne quantique peut etre definit comme ceci:
 // _ le 1er element est un qbit d entrée
 // _ a chaque fois il entre dans un element, dont la 1ere sortie est la suite de la ligne jusqu a la fin(onne passe pas par les controles qui permettent de passer a une autre ligne)
  //les lignes sont numérotées de 0 à n , verticalement. 0 etant le plus haut sur l ecran
  
  let LigneQuantique=[];//ce seront les lignes quantiques qui contiendront tous les elements
  let portefils;
    let arete;
  
  
 // print("nbre de sommets",C.TabSommets.length)
  
  //on reinitialise
  
  
  //on numérote d abord les lignes

    for (let i = 0; i < C.TabSommets.length; i++) 
      if (C.TabSommets[i] != undefined) {
        //mise a jour pour un sommet
        let Qbit = C.TabSommets[i];
        //on reinitialise
        Qbit.num_ligne=[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1];
       
        
        //Qbit.num_ligne[0] = -1;//on initialise la 1ere 
        
        //on initialise ses lignes quantiques precedente
        for (let j = 0; j <= (Qbit.nAretes_entrantes-1); j++) 
              Qbit.num_ligne[j] = -1;
        
        //on initialise le numero de la ligne de ses aretes sortantes
         for (let j = 0; j < Qbit.nAretes_sortantes; j++) 
            Qbit.aretes_sortantes[j].numero_ligne_quantique = -1;
        
        

        if (Qbit.type <= 2) {
            LigneQuantique.push(Qbit);
          }
        
      }
  
  //on les trie de 0 à n-1 en fonction de leur position sur l ecran, q0,q1,q2,q3,q4......qn-1
    // Tri en fonction de l'attribut y en ordre croissant
LigneQuantique.sort((a, b) => a.y - b.y);
  
  //print("  ");print("debut")
  //je transforme LigneQuantique en une liste de liste d'elements qui constitueront la ligne
   for (let i = 0; i < LigneQuantique.length; i++) {
     LigneQuantique[i]=[LigneQuantique[i]];
   }
  
  
  //ensuite on remplit chaque liste avec les elements qui suivent (pas en allant dans les controles ! ), donc la 1ere sortie de chaque element rencontré dont le numero_ligne_quantique est -1
  
  for (let i = 0; i < LigneQuantique.length; i++) {
  
    LigneQuantique[i][0].num_ligne[0]=i;
    let curseur=LigneQuantique[i][0];//Qbit d entrée de ligne
    
    
   /* il faut ne pas pouvoir supprimmerune mesure 65 sauf si on suppremme toute la ligen quantique
    de cette façon le nombre d entrant sortant sera tjs identique et la numerotation des lignes se fera correctement . Alors que si on supprimme la fin, la numerotation devient incoherente*/
    
    while (curseur.nAretes_sortantes>0){
     // print(" ")
     // print("deb")
      //print(curseur)
    
      let num_arete=0;
      while (curseur.aretes_sortantes[num_arete].numero_ligne_quantique!= -1) num_arete=num_arete+1;
    //  print("type=",curseur.type,"numero ligne=",i,"numero arete",num_arete)
      
      let arete=curseur.aretes_sortantes[num_arete];//la 1ere sortie pas deja utilisée est la suite de la ligne quantique
      arete.numero_ligne_quantique=i;
      
    //  print("larete",arete)
      
    //  print("le sommet arrive",C.TabSommets[arete.numSommetArrive])
     // print("lson multiple",C.TabSommets[arete.numSommetArrive].porte_multiple)
     // print("ligne",C.TabSommets[arete.numSommetArrive].num_ligne[0])
      
      if (C.TabSommets[arete.numSommetArrive].porte_multiple==false)
      C.TabSommets[arete.numSommetArrive].num_ligne[0]=i;//modif.num_ligne[0]=i
      else {
        let index = C.TabSommets[arete.numSommetArrive].num_ligne.indexOf(-1);//renvoie la 1ere occurrence de -1, donc le numero de ligne quantique recherché
        C.TabSommets[arete.numSommetArrive].num_ligne[index]=i;
      }
      curseur=C.TabSommets[arete.numSommetArrive];
     // print('je mets la suite type',curseur.type,"dans la ligne",i)
      LigneQuantique[i].push(curseur);
      
    }
    
  }
  
  
  
  
  
  /*
  for (let i = 0; i < LigneQuantique.length; i++) {
    print("ligne ",i, LigneQuantique[i]);
  }
  */
  return LigneQuantique;
}

let decimal_to_string=[];
//let string_to_decimal={};trop long


/* Les 2^n ecritures binaires des etats, gardees d avance pour que l affichage
   n ait pas a les refabriquer a chaque redessin.

   La table ne depasse plus TAILLE_MAX_TABLE_CONVERSIONS entrees : a 22 qbits
   elle pesait 281 Mo, soit presque trois fois le vecteur d etat lui meme, pour
   des chaines que seul l affichage lit. Au dela de la borne elle reste vide et
   convertit_nombreDecimal_En_StringNombre_binaire fabrique la chaine a la
   demande -- le resultat est le meme, au caractere pres. */
const TAILLE_MAX_TABLE_CONVERSIONS=65536;//2^16, environ 4 Mo

function initialise_tableaux_des_conversions(nbits){
  decimal_to_string=[];

  let taille=2**nbits;
  if (taille>TAILLE_MAX_TABLE_CONVERSIONS) return;//trop gros : on convertira a la demande

  for (let i = 0; i < taille; i++) {
      let binaryString = i.toString(2).padStart(nbits, '0');
      decimal_to_string.push(binaryString);
  }

}



 function convertit_nombreDecimal_En_StringNombre_binaire(nombreDecimal,nbits){

   //la table peut etre vide, ou plus courte que l indice demande : elle n est
   //gardee que pour les registres assez petits, voir ci dessus
   let memorise=decimal_to_string[nombreDecimal];
   if ((memorise!=undefined)&&(memorise.length==nbits)) return memorise;

  return nombreDecimal.toString(2).padStart(nbits, '0'); // Ajoute des zeros a gauche pour avoir n bits
}

function convertit_StringNombre_binaire_En_nombreDecimal(binaryString){
  
 // return string_to_decimal[binaryString];
  /*
  if (binaryString in string_to_decimal) {
    
      //let decimal = parseInt(binaryString, 2); 
      //let a= string_to_decimal[binaryString];
    
    
      return string_to_decimal[binaryString];
    
    
  }
  */
  
  
  
//let binaryString = "1010"; // Chaîne binaire
let decimal = parseInt(binaryString, 2); // Convertir en décimal
  
//string_to_decimal[binaryString]=decimal;
//console.log(decimal); // 10
  return decimal;
  
}



/* Produit tensoriel des n qbits d entree, construit par doublement.

   La version precedente reprenait le produit a zero pour chacun des 2^n etats :
   elle faisait n*2^n multiplications complexes. Ici le vecteur double de taille
   a chaque qbit ajoute, ce qui en fait 2*2^n, soit n/2 fois moins (9 fois a 18
   qbits), pour exactement les memes nombres : le qbit j est multiplie a DROITE
   du produit deja forme, donc l ordre d association des multiplications est
   inchange, et les flottants avec.

   Le qbit ajoute devient le bit de poids faible, et les precedents remontent
   d un rang : apres les n etapes, le qbit 0 est bien le bit de poids fort,
   comme le veut le masque 2^(n-1-j) utilise partout ailleurs.

   Le raccourci de l ancienne boucle est conserve lui aussi : des qu un
   coefficient rencontre est nul, c est l objet complexe de ce coefficient qui
   est rendu tel quel et les qbits suivants ne sont plus multiplies. Le tableau
   fige retient quels etats sont ainsi arretes, puisque c est le premier zero
   rencontre qui doit l emporter. */
function retourne_vecteur_nQbits_dentree(LigneQuantique){

  let n = LigneQuantique.length;//nbre de qbits
  if (n==0) return [];

  let taille_finale=2**n;

  /* Raccourci : si TOUS les qbits d entree sont exactement |0> ou |1>, le
     produit tensoriel n a qu une amplitude non nulle, et son rang est le nombre
     binaire forme par les kets, la premiere ligne donnant le bit de poids fort.
     Inutile de parcourir les 2^n rangs pour y ecrire des zeros : a 24 qbits la
     boucle ci dessous fait une centaine de millions d ecritures, et reserve en
     plus les 16 Mo du tableau `fige`.

     Le resultat est identique au bit pres. Les seuls produits en jeu valent
     1x1, l arrondi a dix decimales ne change rien a 1, la probabilite 1x1+0x0
     vaut 1, et toutes les autres cases valent zero -- ce qu un Float64Array
     neuf donne deja. Il faut n>=2 : a une seule ligne la boucle ne tourne pas
     et les coefficients sont poses tels quels, probabilite du qbit comprise.

     Tout le reste -- |+>, |->, un qbit dont on a change les coefficients --
     repasse par la boucle, inchangee. */
  if (n>=2){
    let rang=0;
    let que_des_etats_de_base=true;
    for (let j = 0; j <n; j++) {
      let c0=LigneQuantique[j][0].Qbit[0][0];
      let c1=LigneQuantique[j][0].Qbit[0][1];
      if ((c0.x===1)&&(c0.y===0)&&(c1.x===0)&&(c1.y===0)) rang=rang*2;       //|0>
      else if ((c0.x===0)&&(c0.y===0)&&(c1.x===1)&&(c1.y===0)) rang=rang*2+1;//|1>
      else { que_des_etats_de_base=false; break; }
    }
    if (que_des_etats_de_base===true){
      let un_seul=new vecteur_etat(taille_finale);
      un_seul.ecrit(rang,1,0);
      if (debug_affiche_nQbits==true) print("le nqbits est",un_seul);
      return un_seul;
    }
  }

  let n_Qbits=new vecteur_etat(taille_finale);
  let fige=new Uint8Array(taille_finale);//1 = etat arrete sur un coefficient nul

  //premier qbit : on prend ses deux coefficients tels quels, sans multiplier
  //(c est ce que faisait le cas j==0 de l ancienne boucle, qui rangeait l objet
  //complexe du qbit lui meme dans le vecteur, probabilite comprise)
  let Qbit0=LigneQuantique[0][0].Qbit[0][0];//c est un complexe x+yi devant |0>
  let Qbit1=LigneQuantique[0][0].Qbit[0][1];//c est un complexe x+yi devant |1>
  n_Qbits.pose(0,Qbit0);
  n_Qbits.pose(1,Qbit1);
  fige[0]=((Qbit0.x==0)&&(Qbit0.y==0))?1:0;
  fige[1]=((Qbit1.x==0)&&(Qbit1.y==0))?1:0;

  //qbits suivants : chaque etat deja forme en engendre deux
  for (let j = 1; j <n; j++) {

    Qbit0=LigneQuantique[j][0].Qbit[0][0];
    Qbit1=LigneQuantique[j][0].Qbit[0][1];

    let Qbit0_est_nul=((Qbit0.x==0)&&(Qbit0.y==0));//si a zero on ne multiplie pas : ca donnerait tjs zero
    let Qbit1_est_nul=((Qbit1.x==0)&&(Qbit1.y==0));

    let a0x=Qbit0.x, a0y=Qbit0.y, a1x=Qbit1.x, a1y=Qbit1.y;

    //on remonte de la fin pour pouvoir doubler dans le meme vecteur : les cases
    //ecrites, 2k et 2k+1, sont toujours au dela de celles qui restent a lire
    for (let k = (1<<j)-1; k >=0; k--) {

      let x=n_Qbits.re[k];
      let y=n_Qbits.im[k];
      let p=n_Qbits.pr[k];

      if (fige[k]==1){//etat deja arrete sur un zero : il se recopie a l identique
        n_Qbits.re[2*k]=x;   n_Qbits.im[2*k]=y;   n_Qbits.pr[2*k]=p;
        n_Qbits.re[2*k+1]=x; n_Qbits.im[2*k+1]=y; n_Qbits.pr[2*k+1]=p;
        fige[2*k]=1;
        fige[2*k+1]=1;
        continue;
      }

      //le produit, puis l arrondi : c est exactement ce que faisait complexe.mul
      if (Qbit0_est_nul){ n_Qbits.pose(2*k,Qbit0); fige[2*k]=1; }
      else { n_Qbits.ecrit(2*k,x*a0x-y*a0y,x*a0y+y*a0x); fige[2*k]=0; }

      if (Qbit1_est_nul){ n_Qbits.pose(2*k+1,Qbit1); fige[2*k+1]=1; }
      else { n_Qbits.ecrit(2*k+1,x*a1x-y*a1y,x*a1y+y*a1x); fige[2*k+1]=0; }

    }

  }

  if (debug_affiche_nQbits==true)
  print("le nqbits est",n_Qbits)

   return n_Qbits;
}








function affichage_dans_console_probas_du_nQbit(n_Qbits,nbre_Qbits){
  let total=0;
  //affichage du n_Qbits et des probabilités de chaque etat
  for (let i = 0; i <n_Qbits.length; i++) {
    
    let etat=convertit_nombreDecimal_En_StringNombre_binaire(i,nbre_Qbits);
    print(n_Qbits[i],"|"+etat+"> : ",String(abs(roundToDecimals(100*n_Qbits[i]**2, 2))),"%");
    
    total=total+100*n_Qbits[i]**2;
  }
  print("verification total=",abs(roundToDecimals(total, 2)),"%");
}

function calcul_probas_pour_un_Qbit_numeroQbit_du_nQbit(n_Qbits,numeroQbit,nbre_Qbits){

          //cree un masque 0001000000 ou 1 est la position du qbit qui passe dans la porte, donc celui a inverse ou a traiter si besoin, evite de creer etat=|0001100110> et de regarder si le bit numero i est a 1 ou 0
  //attention (masque_index_a_traiter&i) renvoie 0 ou un nbre qui est une puissance de 2, pas 1....
  let  masque_index_a_traiter = 2**(nbre_Qbits-1-numeroQbit);

  let P1=0;//proba d avoir 1

  if (n_Qbits instanceof vecteur_etat){

    /* Les etats dont le bit vaut 1 sont exactement les blocs contigus
       [masque, 2*masque[, puis [3*masque, 4*masque[, etc : un paquet de
       `masque` rangs sur deux. On ne parcourt donc que ceux la, dans l ordre
       croissant. C est la moitie des rangs, et des plages contigues plutot
       qu un rang sur deux, ce qui pour les lignes de poids fort lit deux fois
       moins de lignes de cache. Les termes additionnes et leur ordre sont les
       memes qu avec un parcours complet filtre par un et binaire : la somme
       est donc identique au bit pres.

       Le test de vie est sorti de la boucle : il est le meme pour tout le
       vecteur, et `vivant` ne vaut autre chose que null que sur le vecteur
       d une mesure partielle. */

    let L=n_Qbits.length;
    let masque=masque_index_a_traiter;

    /* Masque hors bornes : numeroQbit vaut -1 pour une porte non raccordee, et
       le masque vaut alors 2^nbre_Qbits, soit L -- aucun rang ne porte ce bit.
       Un numeroQbit trop grand donne un masque fractionnaire, que le et
       binaire ramenait a 0. Ces deux cas rendaient [100,0], on le garde. */
    if ((masque>=1)&&(masque<L)){

      let pr=n_Qbits.pr;
      let vivant=n_Qbits.vivant;
      let pas=2*masque;

      if (vivant===null){
        for (let debut = masque; debut < L; debut += pas){
          let fin=debut+masque;
          if (fin>L) fin=L;//vecteur dont la taille n est pas une puissance de 2
          for (let i = debut; i < fin; i++)  P1=P1+100*pr[i];
        }
      } else {
        for (let debut = masque; debut < L; debut += pas){
          let fin=debut+masque;
          if (fin>L) fin=L;
          for (let i = debut; i < fin; i++)
            if (vivant[i]===1)  P1=P1+100*pr[i];
        }
      }

    }

  } else {

    //TRANSITION : appelee aussi sur un tableau de complexe (le vecteur mesure,
    //une fois reconverti pour l affichage)
    for (let i = 0; i <n_Qbits.length; i++)
      if (n_Qbits[i]!=undefined)
        if ((masque_index_a_traiter&i)!=0)  P1=P1+100*n_Qbits[i].proba;

  }

  return [100-P1,P1];

}


function calcul_probas_pour_chaque_Qbit_du_nQbit(n_Qbits,nbre_Qbits){//fait comme son nom l indique
  
  let Probas=[];
  
  
  //affichage pour chaque Qbit de ses probabilités à partir de la lecture du n_Qbit
  for (let numeroQbit = 0; numeroQbit <nbre_Qbits; numeroQbit++) {
    
      let P=[0,0];//proba [P0,P1] d avoir 0 et 1
      
       P=calcul_probas_pour_un_Qbit_numeroQbit_du_nQbit(n_Qbits,numeroQbit,nbre_Qbits)
       Probas.push(P);
    
      //print("qBit numero ",n, "|0> :",abs(roundToDecimals(100-P1, 2)),"% ","    |1> :",abs(roundToDecimals(P1, 2)),"% ")
    
  }
  
  return Probas;
}




function inverse_bit_a_index_pour_un_nbre_binaire(binaireString, index) {
  
  let newBit;
  if (binaireString[index]=="1") newBit="0"; else newBit="1";
  
  // inverse le index-ème caractère en reconstruisant la chaîne
  return binaireString.slice(0, index) + newBit + binaireString.slice(index + 1);
}
/* 
function vieuxcette_porte_est_desactive_par_un_controle(etat,Liste_controle){
  
//etat = |0011000> paar exemple
  //il faut verifier sur les lignes s il y a un controle et s il est actif
 // Liste_controle=[[type_control1,num_bit_control1],[type_control2,num_bit_control2]] //renvoie la liste des controles sur la porte en indiquantb leur type (16 ou 17) et le numero de la ligne quntiqUE OU SEN TROUVE LE CONTROLE
  
   
     
     
     //on parcourt les controles
      for (let j = 0; j < Liste_controle.length; j++) {
        let type_control=Liste_controle[j][0];
        let num_bit_control=Liste_controle[j][1];
        
       
        if (((type_control==16)&& (etat[num_bit_control]=="0"))||((type_control==17)&& (etat[num_bit_control]=="1"))){//si y a control et si le bit de control est a 0 aucun changement
     return true;
      
    } 
      }
      return false;
}
*/

function cette_porte_est_desactive_par_un_controle(etat_nbre_decimal,Liste_controle,nbre_Qbits){
  //etat = |0011000> paar exemple
  //il faut verifier sur les lignes s il y a un controle et s il est actif
 // Liste_controle=[[type_control1,num_bit_control1],[type_control2,num_bit_control2]] //renvoie la liste des controles sur la porte en indiquantb leur type (16 ou 17) et le numero de la ligne quntiqUE OU SEN TROUVE LE CONTROLE
  
   
     
     
     //on parcourt les controles
      for (let j = 0; j < Liste_controle.length; j++) {
        let type_control=Liste_controle[j][0];
        let num_bit_control=Liste_controle[j][1];
        
        let  masque_index_a_traiter = 2**(nbre_Qbits-1-num_bit_control);
         let bit_de_controle= masque_index_a_traiter&etat_nbre_decimal;
        
        
        //if (etat_nbre_decimal==7)
       // print("bit de controle",bit_de_controle,type_control)
        
        
        if (((type_control==16)&& (bit_de_controle==0))||((type_control==17)&& (bit_de_controle!=0))){
       // if (((type_control==16)&& (etat[num_bit_control]=="0"))||((type_control==17)&& (etat[num_bit_control]=="1"))){//si y a control et si le bit de control est a 0 aucun changement
           //if (etat_nbre_decimal==7) print("bibis bit de controle",bit_de_controle,type_control)
          
          return true;
      
    } 
      }
      return false;
}

function calcul_Liste_controle(L_aretes_controle){
  //Liste_controle=[[type_control1,num_bit_control1],[type_control2,num_bit_control2]] //renvoie la liste des controles sur la porte en indiquantb leur type (16 ou 17) et le numero de la ligne quntiqUE OU SEN TROUVE LE CONTROLE
  let Liste_controle = [];
  if (L_aretes_controle.length>0)
    for (let i = 0; i <(L_aretes_controle.length); i++){
      let ar =L_aretes_controle[i];
      let SommetControle = G.TabSommets[ar.numSommetDepart];
      Liste_controle.push([SommetControle.type,SommetControle.num_ligne[0]])
      
    }
  return Liste_controle;
}

function applique_Porte_X(n_Qbits,index,nbre_Qbits,L_aretes_controle){//applique une porte X au bit correspondant a l index et retourne un nouveau n_Qbits modifie

   //Liste_controle=[[type_control1,num_bit_control1],[type_control2,num_bit_control2]] //renvoie la liste des controles sur la porte en indiquantb leur type (16 ou 17) et le numero de la ligne quntiqUE OU SEN TROUVE LE CONTROLE
  let Liste_controle=calcul_Liste_controle(L_aretes_controle);

    //cree un masque 0001000000 ou 1 est la position du qbit qui passe dans la porte, donc celui a inverser : evite de creer etat=|0001100110> et de regarder si le bit numero i est a 1 ou 0
  let  masque_index_a_traiter = 2**(nbre_Qbits-1-index);

  let nouveau_n_Qbits=new vecteur_etat(n_Qbits.length);

  //on parcourt chaque etat du n_qbit
  for (let i = 0; i <n_Qbits.length; i++) {

    let numero_etat;

    if ((Liste_controle)&&(cette_porte_est_desactive_par_un_controle(i,Liste_controle,nbre_Qbits))){
      numero_etat=i;
    }

    else {
      //va plus vite que de convertir en string : applique l inversion du bit a l index specifie
      numero_etat= i ^  masque_index_a_traiter;
    }

    //fait la correspondance en echangeant les amplitudes
    nouveau_n_Qbits.ecrit(numero_etat,n_Qbits.re[i],n_Qbits.im[i]);

  }

  return nouveau_n_Qbits;

}



function applique_Porte_SWAP(n_Qbits,index1,index2,nbre_Qbits,L_aretes_controle){//applique une porte SWAP aux deux bits correspondant aux index et retourne un nouveau n_Qbits modifie

//ATTENTION NE DOIT SE LANCER QUE SI LA PORTE A SES DEUX ENTREES, SINON ON LANCE pAS cette fonction, c est inutile

   //Liste_controle=[[type_control1,num_bit_control1],[type_control2,num_bit_control2]] //renvoie la liste des controles sur la porte en indiquantb leur type (16 ou 17) et le numero de la ligne quntiqUE OU SEN TROUVE LE CONTROLE
  let Liste_controle=calcul_Liste_controle(L_aretes_controle);

  //index1 et index2 sont les deux indices a intervertir si et seulement si ils sont differents
  let  masque_index1 = 2**(nbre_Qbits-1-index1);
  let  masque_index2 = 2**(nbre_Qbits-1-index2);

  let nouveau_n_Qbits=new vecteur_etat(n_Qbits.length);

  //on parcourt chaque etat du n_qbit
  for (let i = 0; i <n_Qbits.length; i++) {

    let numero_etat;

    let bit1=((masque_index1&i)!=0);
    let bit2=((masque_index2&i)!=0);

    if (((Liste_controle)&&(cette_porte_est_desactive_par_un_controle(i,Liste_controle,nbre_Qbits)))
    ||
      (bit1==bit2)){
   //si y a control et si c est le bon bit de control aucun changement, et deux bits egaux s echangent sans rien changer
      numero_etat=i;
    }

    else {//on inverse les deux bits des deux lignes puisqu ils sont differents
      numero_etat= i ^ masque_index1 ^ masque_index2;
    }

    //fait la correspondance en echangeant les amplitudes
    nouveau_n_Qbits.ecrit(numero_etat,n_Qbits.re[i],n_Qbits.im[i]);

  }

  return nouveau_n_Qbits;

}







function applique_Porte_Y(n_Qbits,index,nbre_Qbits,L_aretes_controle){//applique une porte Y au bit correspondant a l index et retourne un nouveau n_Qbits modifie

   //Liste_controle=[[type_control1,num_bit_control1],[type_control2,num_bit_control2]] //renvoie la liste des controles sur la porte en indiquantb leur type (16 ou 17) et le numero de la ligne quntiqUE OU SEN TROUVE LE CONTROLE
  let Liste_controle=calcul_Liste_controle(L_aretes_controle);

  //cree un masque 0001000000 ou 1 est la position du qbit qui passe dans la porte
  let  masque_index_a_traiter = 2**(nbre_Qbits-1-index);

  let nouveau_n_Qbits=new vecteur_etat(n_Qbits.length);

  //on parcourt chaque etat du n_qbit
  for (let i = 0; i <n_Qbits.length; i++) {

    let x=n_Qbits.re[i];
    let y=n_Qbits.im[i];

    if ((Liste_controle)&&(cette_porte_est_desactive_par_un_controle(i,Liste_controle,nbre_Qbits))){
      nouveau_n_Qbits.ecrit(i,x,y);//desactive par le bit de controle
    }

    else {

      //Y inverse le bit et multiplie par i ou par -i selon sa valeur de depart
      let numero_etat= i ^  masque_index_a_traiter;

      if ((masque_index_a_traiter&i)==0) nouveau_n_Qbits.ecrit(numero_etat,-y,x);
      else nouveau_n_Qbits.ecrit(numero_etat,y,-x);

    }

  }

  return nouveau_n_Qbits;

}



function applique_Porte_Z(n_Qbits,index,nbre_Qbits,L_aretes_controle){//applique une porte Z au bit correspondant a l index et retourne un nouveau n_Qbits modifie

   //Liste_controle=[[type_control1,num_bit_control1],[type_control2,num_bit_control2]] //renvoie la liste des controles sur la porte en indiquantb leur type (16 ou 17) et le numero de la ligne quntiqUE OU SEN TROUVE LE CONTROLE
  let Liste_controle=calcul_Liste_controle(L_aretes_controle);

  //cree un masque 0001000000 ou 1 est la position du qbit qui passe dans la porte
  let  masque_index_a_traiter = 2**(nbre_Qbits-1-index);

  /* Z travaille SUR PLACE : elle lit le rang i et reecrit le rang i, tous les
     rangs sont reecrits, et aucun ne depend d un autre. Allouer un vecteur neuf
     reservait et mettait a zero trois Float64Array -- 400 Mo a 24 qbits pour
     une seule porte Z, dont le premier acces coute plus que le calcul.

     Le resultat est identique au bit pres : `ecrit` ne change rien a un re et
     un im deja arrondis, et recalcule la probabilite sur exactement les memes
     valeurs que recevait le vecteur neuf. Comme celui ci on repart sans
     amplitude supprimee, d ou la remise a null de `vivant`.

     Meme raisonnement que pour applique_Porte_BitMesure, deja sur place : le
     seul appelant reaffecte le resultat, et les deux endroits qui gardent le
     vecteur de sortie pendant un calcul en tiennent soit une copie profonde
     (genere_matrice_et_porte_a_partir_circuit_affiche_a_lecran), soit une
     reference sur laquelle le pipeline ne travaille pas (calculeMatrice). */

  //on parcourt chaque etat du n_qbit
  for (let i = 0; i <n_Qbits.length; i++) {

    let x=n_Qbits.re[i];
    let y=n_Qbits.im[i];

    if ((Liste_controle)&&(cette_porte_est_desactive_par_un_controle(i,Liste_controle,nbre_Qbits))){
      n_Qbits.ecrit(i,x,y);//desactive par le bit de controle
    }
    else
      {//Porte Z activee

    //Z change la phase (signe de l amplitude) si c est |1> sinon fait rien
        if ((masque_index_a_traiter&i)!=0) n_Qbits.ecrit(i,-x,-y);
        else n_Qbits.ecrit(i,x,y);

      }

  }

  n_Qbits.vivant=null;

  return n_Qbits;

}

function applique_Porte_R(n_Qbits,index,nbre_Qbits,phase,L_aretes_controle){//applique une porte R au bit correspondant a l index et retourne un nouveau n_Qbits modifie

   //Liste_controle=[[type_control1,num_bit_control1],[type_control2,num_bit_control2]] //renvoie la liste des controles sur la porte en indiquantb leur type (16 ou 17) et le numero de la ligne quntiqUE OU SEN TROUVE LE CONTROLE
  let Liste_controle=calcul_Liste_controle(L_aretes_controle);

  //cree un masque 0001000000 ou 1 est la position du qbit qui passe dans la porte
  let  masque_index_a_traiter = 2**(nbre_Qbits-1-index);

  let cosinus=Math.cos(phase);
  let sinus=Math.sin(phase);

  //R travaille SUR PLACE, pour la meme raison que Z juste au dessus
  //on parcourt chaque etat du n_qbit
  for (let i = 0; i <n_Qbits.length; i++) {

    let x=n_Qbits.re[i];
    let y=n_Qbits.im[i];

    if ((Liste_controle)&&(cette_porte_est_desactive_par_un_controle(i,Liste_controle,nbre_Qbits))){
      n_Qbits.ecrit(i,x,y);//desactive par le bit de controle
    }
    else
      {//Porte R activee

    //R change la phase en multipliant par exp(iphi) le coeff de ket 1
        if ((masque_index_a_traiter&i)!=0)
          n_Qbits.ecrit(i,x*cosinus-y*sinus,x*sinus+y*cosinus);
        else n_Qbits.ecrit(i,x,y);

      }

  }

  n_Qbits.vivant=null;

  return n_Qbits;

}

/*
function vieuxapplique_Porte_H(n_Qbits,index,nbre_Qbits,L_aretes_controle){//applique une porte H au bit correspondant a l index et retourne un nouveau n_Qbits modifié
  
  
   //Liste_controle=[[type_control1,num_bit_control1],[type_control2,num_bit_control2]] //renvoie la liste des controles sur la porte en indiquantb leur type (16 ou 17) et le numero de la ligne quntiqUE OU SEN TROUVE LE CONTROLE
  let Liste_controle=calcul_Liste_controle(L_aretes_controle);  
  
  
  //cree le nouveau n_Qbit de même taille initailsé à 0
  let nouveau_n_Qbits=[];
  for (let i = 0; i <n_Qbits.length; i++) { 
    nouveau_n_Qbits.push(new complexe(0,0));
  }
  
 //pas ici !!! let nouveau_n_Qbits=new Array(n_Qbits.length);
 
  
  
  //on parcourt chaque etat du n_qbit
  for (let i = 0; i <n_Qbits.length; i++) {
    
    let etat=convertit_nombreDecimal_En_StringNombre_binaire(i,nbre_Qbits);
    
    // if (((type_control==16)&& (etat[num_bit_control]=="0"))||((type_control==17)&& (etat[num_bit_control]=="1"))){//si y a control et si le bit de control est a 0 aucun changement
   if ((Liste_controle)&&(cette_porte_est_desactive_par_un_controle(etat,Liste_controle))){   
    //nouveau_n_Qbits[i]=n_Qbits[i];//desactivé par le bit de controle
    // nouveau_n_Qbits[i].coeff_complexe(n_Qbits[i].x,n_Qbits[i].y); 
     
     
     
  nouveau_n_Qbits[ numero_etat]=new complexe(n_Qbits[i].x,n_Qbits[i].y);
      
     
    }
    else
      {//Porte H activé
    
    
    
    let etat0;
    let etat1;
    let numero_etat0;
    let numero_etat1;
    //let coeff=n_Qbits[i];
    let x;
    let y;
    
    if (etat[index]=="0") {//H : si 0 on transforme en (0+1)*racine 2
        etat0=etat;
        etat1=inverse_bit_a_index_pour_un_nbre_binaire(etat, index);
        numero_etat0=i;
        numero_etat1=convertit_StringNombre_binaire_En_nombreDecimal(etat1);
       //fait la correspondance en echangeant les amplitudes
         
        // nouveau_n_Qbits[ numero_etat0]=nouveau_n_Qbits[ numero_etat0]+coeff/sqrt(2);
        // nouveau_n_Qbits[ numero_etat1]=nouveau_n_Qbits[ numero_etat1]+coeff/sqrt(2);
      
       x=nouveau_n_Qbits[ numero_etat0].x+n_Qbits[i].x/sqrt(2);
       y=nouveau_n_Qbits[ numero_etat0].y+n_Qbits[i].y/sqrt(2);
      
       nouveau_n_Qbits[numero_etat0].coeff_complexe(x,y);
      
      
       x=nouveau_n_Qbits[ numero_etat1].x+n_Qbits[i].x/sqrt(2);
       y=nouveau_n_Qbits[ numero_etat1].y+n_Qbits[i].y/sqrt(2);
       nouveau_n_Qbits[numero_etat1].coeff_complexe(x,y);
      
      
      
      
      
      
     // print("coeff",coeff,etat0,etat1,numero_etat0,numero_etat1,"nouvel valeur pour 0",nouveau_n_Qbits[ numero_etat0],"nouvel valeur pour 1",nouveau_n_Qbits[ numero_etat1],nouveau_n_Qbits)
      
    }else{//H : si 1 on transforme en (0-1)*racine 2
      
        etat1=etat;
        etat0=inverse_bit_a_index_pour_un_nbre_binaire(etat, index);
        numero_etat1=i;
        numero_etat0=convertit_StringNombre_binaire_En_nombreDecimal(etat0);
      
     //nouveau_n_Qbits[ numero_etat0]=nouveau_n_Qbits[ numero_etat0]+coeff/sqrt(2);
       //  nouveau_n_Qbits[ numero_etat1]=nouveau_n_Qbits[ numero_etat1]-coeff/sqrt(2);
      
      
       x=nouveau_n_Qbits[ numero_etat0].x+n_Qbits[i].x/sqrt(2);
       y=nouveau_n_Qbits[ numero_etat0].y+n_Qbits[i].y/sqrt(2);
       nouveau_n_Qbits[numero_etat0].coeff_complexe(x,y);
      
      
       x=nouveau_n_Qbits[ numero_etat1].x-n_Qbits[i].x/sqrt(2);
       y=nouveau_n_Qbits[ numero_etat1].y-n_Qbits[i].y/sqrt(2);
       nouveau_n_Qbits[numero_etat1].coeff_complexe(x,y);
      
      
      
    }
    
   
    
  }
  
  }
  
 // print("nouveauqbit",nouveau_n_Qbits)
  return nouveau_n_Qbits;
  
}

*/



function applique_Porte_H(n_Qbits,index,nbre_Qbits,L_aretes_controle){//applique une porte H au bit correspondant a l index et retourne un nouveau n_Qbits modifie

   //Liste_controle=[[type_control1,num_bit_control1],[type_control2,num_bit_control2]] //renvoie la liste des controles sur la porte en indiquantb leur type (16 ou 17) et le numero de la ligne quntiqUE OU SEN TROUVE LE CONTROLE
  let Liste_controle=calcul_Liste_controle(L_aretes_controle);

   //cree un masque 0001000000 ou 1 est la position du qbit qui passe dans la porte
  let  masque_index_a_traiter = 2**(nbre_Qbits-1-index);

  //le vecteur de sortie part de zero : H accumule deux contributions par etat
  let nouveau_n_Qbits=new vecteur_etat(n_Qbits.length);

  let racine_de_deux=sqrt(2);

  //on parcourt chaque etat du n_qbit
  for (let i = 0; i <n_Qbits.length; i++) {

    let x_entree=n_Qbits.re[i];
    let y_entree=n_Qbits.im[i];

    if ((Liste_controle)&&(cette_porte_est_desactive_par_un_controle(i,Liste_controle,nbre_Qbits))){
      nouveau_n_Qbits.ecrit(i,x_entree,y_entree);//desactive par le bit de controle
    }
    else
      {//Porte H activee

    let numero_etat0;
    let numero_etat1;

    if ((masque_index_a_traiter&i)==0){
    //H : si 0 on transforme en (0+1)/racine de 2
        numero_etat0=i;
        //va plus vite que de convertir en string : inverse le bit a l index
        numero_etat1= i ^  masque_index_a_traiter;

      //l arrondi a lieu a chaque addition, comme le faisait coeff_complexe
       nouveau_n_Qbits.ecrit(numero_etat0,
                             nouveau_n_Qbits.re[numero_etat0]+x_entree/racine_de_deux,
                             nouveau_n_Qbits.im[numero_etat0]+y_entree/racine_de_deux);

       nouveau_n_Qbits.ecrit(numero_etat1,
                             nouveau_n_Qbits.re[numero_etat1]+x_entree/racine_de_deux,
                             nouveau_n_Qbits.im[numero_etat1]+y_entree/racine_de_deux);

    }else{//H : si 1 on transforme en (0-1)/racine de 2

        numero_etat1=i;
        numero_etat0= i ^  masque_index_a_traiter;

       nouveau_n_Qbits.ecrit(numero_etat0,
                             nouveau_n_Qbits.re[numero_etat0]+x_entree/racine_de_deux,
                             nouveau_n_Qbits.im[numero_etat0]+y_entree/racine_de_deux);

       nouveau_n_Qbits.ecrit(numero_etat1,
                             nouveau_n_Qbits.re[numero_etat1]-x_entree/racine_de_deux,
                             nouveau_n_Qbits.im[numero_etat1]-y_entree/racine_de_deux);

    }

  }

  }

  return nouveau_n_Qbits;

}


//calcule le nQbit apres une mesure surun des qbit
/* Effondre le vecteur sur une valeur mesuree, DANS le vecteur recu.

   Mesurer un circuit a 18 lignes enchaine 18 appels de cette fonction : en
   allouant un vecteur neuf a chaque fois, c etaient 18 fois 6 Mo a reserver et
   a mettre a zero, et le premier acces a chacune de ces pages coutait plus que
   le calcul lui meme. Travailler sur place supprime tout cela.

   Le seul appelant, calcul_nQbits_mesure_..., reaffecte le resultat a
   this.n_Qbits_mesure : rendre le meme objet ne change rien pour lui. Et le
   vecteur de sortie, this.n_Qbits_sortie, n est pas touche -- this.n_Qbits_mesure
   en est une copie, pas une reference. */
function applique_Porte_BitMesure(BitMesure,n_Qbits,index,nbre_Qbits){//applique le bit mesure

  let somme_carre=0;
  BitMesure=String(BitMesure);

  //cree un masque 0001000000 ou 1 est la position du qbit mesure : c est
  //beaucoup plus rapide que de convertir chaque etat en chaine binaire pour y
  //lire un seul caractere
  let  masque_index_a_traiter = 2**(nbre_Qbits-1-index);

  //valeur que doit avoir le bit mesure. L ancien code comparait le caractere
  //lu, "0" ou "1", a String(BitMesure) : si BitMesure ne vaut ni 0 ni 1, la
  //comparaison echouait toujours et aucun etat n etait conserve. On garde ce
  //comportement avec -1, qui ne peut egaler aucun bit.
  let bit_voulu;
  if (BitMesure=="0") bit_voulu=0;
  else if (BitMesure=="1") bit_voulu=1;
  else bit_voulu=-1;

  //on parcourt chaque etat du n_qbit
  for (let i = 0; i <n_Qbits.length; i++)
  {

    if (n_Qbits.est_vivant(i)==false) continue;//a deja ete supprime avant

    let bit_de_letat=((masque_index_a_traiter&i)!=0)?1:0;

    if (bit_de_letat!=bit_voulu) {
      n_Qbits.tue(i);//on le supprimme
    }
    else{
      //la probabilite est recalculee sur les parties arrondies, comme le
      //faisait le new complexe(x,y) de l ancienne version
      n_Qbits.ecrit(i,n_Qbits.re[i],n_Qbits.im[i]);
      somme_carre=somme_carre+n_Qbits.pr[i];
    }

  }

  //on normalise le nouveau Qbit
  let norme=sqrt(somme_carre);
   for (let i = 0; i <n_Qbits.length; i++) {
     if (n_Qbits.est_vivant(i))
     if ((n_Qbits.re[i]!=0)||(n_Qbits.im[i]!=0))

     n_Qbits.ecrit(i,n_Qbits.re[i]/norme,n_Qbits.im[i]/norme);
   }

 return n_Qbits;


}


function extrait_bits_particuliers_qui_sont_a_position(L1,positions){
  
 // print("l1pos",L1,positions)
  // Liste L1 d'exemples de chaînes binaires de 8 bits
//const L1 = ['11001010', '01110101', '10110011'];

// Liste L2 pour stocker les nouvelles chaînes de 3 bits
const L2 = [];

// Positions des bits à extraire (en comptant à partir de 1)
//const positions = [1, 2, 3];

// Pour chaque nombre binaire dans L1
L1.forEach(binaire => {
    // Extraire les bits aux positions spécifiées et les assembler
    const nouveau_binaire = positions.map(pos => binaire[pos]).join('');
    L2.push(nouveau_binaire);
});

// Afficher la nouvelle liste L2
//console.log(L2);
  return L2;
}

/*
function vieuxapplique_Porte_Oracle(n_Qbits,L_index,nbre_Qbits,f_oracle,L_aretes_controle) {
  //applique une porte Oracle,L_aretes_controle au bit correspondantaux positions dans L_index et retourne un nouveau n_Qbits modifié
   // rappels :on a L_index= this.num_ligne = [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1]; //numero de la ligne quantique a laquelle apparait ce sommet
  
 //Liste_controle=[[type_control1,num_bit_control1],[type_control2,num_bit_control2]] //renvoie la liste des controles sur la porte en indiquantb leur type (16 ou 17) et le numero de la ligne quntiqUE OU SEN TROUVE LE CONTROLE
  let Liste_controle=calcul_Liste_controle(L_aretes_controle);  
  
  // Trouver l'index de -1
const indexOfMinusOne = L_index.indexOf(-1);

// Si -1 est trouvé dans la liste, tronquer la liste avant -1
let L_pos = indexOfMinusOne !== -1 ? L_index.slice(0, indexOfMinusOne) : L_index;

//console.log(L_pos);
  
  //on recupere et on enleve la dernière ligne qui est celle qui subit la fonction de l oracle, la ligne modifiée sera a index
 let index = L_pos.pop(); 
  
  //print("l indice de f est",index)
  
  //L_code code donné par les (n-1) premiers bits d entrées de l oracle
  //ici on isole la chaine de caractere
  let Liste_etats=[];
  for (let i = 0; i <n_Qbits.length; i++) {
  
    let etat=convertit_nombreDecimal_En_StringNombre_binaire(i,nbre_Qbits);
    Liste_etats.push(etat);
  }
  
  let L_code=extrait_bits_particuliers_qui_sont_a_position(Liste_etats,L_pos);
  
  //print("L_code1",L_code)
  //cree le nouveau n_Qbit de même taille initailsé à -1
  nouveau_n_Qbits=[];
  for (let i = 0; i <n_Qbits.length; i++) { 
    //nouveau_n_Qbits.push(-1);
    nouveau_n_Qbits.push(new complexe(0,0));
    
    L_code[i]=convertit_StringNombre_binaire_En_nombreDecimal(L_code[i]);
    
    L_code[i]=f_oracle[L_code[i]];
    
  }
 // print("L_code2",L_code)
  //on parcourt chaque etat du n_qbit
  for (let i = 0; i <n_Qbits.length; i++) {
    
    
    let numero_etat;
    let etat=Liste_etats[i];//convertit_nombreDecimal_En_StringNombre_binaire(i,nbre_Qbits);
    
    
   // if (((type_control==16)&& (etat[num_bit_control]=="0"))||((type_control==17)&& (etat[num_bit_control]=="1"))){//si y a control et si le bit de control est a 0 aucun changement
      if ((Liste_controle)&&(cette_porte_est_desactive_par_un_controle(etat,Liste_controle))){
     //  if (((type_control==16)&& (etat[num_bit_control]=="0"))){//si y a control et si le bit de control est a 0 aucun changement
      numero_etat=i;
      
      
    }
    
    else {
      
      //calcul de la valeur de la ligne d oracle
      
      
      let n=parseInt(etat[index], 10);
      let nouveau_n=L_code[i]^n;//porteoracle =y (xor) f(x)
      
     // if (i==2) print("etat2",etat,"f(2)=",L_code[i],"n=",n,"nouveau_n",nouveau_n)
      
      //2 solutions 
      //soit ça change pas
      //soit ça change, donc fait l effet d une porte X
      if (n==nouveau_n){//ça change pas
      
        numero_etat=i;
      }
      else{//ça change, donc comme une porte X
        
          //if (i==2) print("etatavant",etat)
          etat=inverse_bit_a_index_pour_un_nbre_binaire(etat, index);
        //if (i==2) print("etatapres",etat)
          numero_etat=convertit_StringNombre_binaire_En_nombreDecimal(etat);//trouve son numero dans le nouveau n_qbit
       // if (i==2) print("numero-etat",numero_etat)
      }
      
     
      
      
       
    }
    
    //print(i,"etat",etat)
    
    
    print("le nouveau Qbit",etat,numero_etat," est egale au vieux Qbit",i, "qui a pour valeur",n_Qbits[i])
    
    //fait la correspondance en echangeant les amplitudes
    
    //nouveau_n_Qbits[ numero_etat]=n_Qbits[i];
    nouveau_n_Qbits[numero_etat].coeff_complexe(n_Qbits[i].x,n_Qbits[i].y);
  //  print(nouveau_n_Qbits,n_Qbits)
    
  }
  
  return nouveau_n_Qbits;
  
}
*/




function applique_Porte_Diffuseur_grover(n_Qbits,L_index,nbre_Qbits){
  //applique une porte Operateur de diffusion de Grover aux bits correspondant aux positions dans L_index et retourne un nouveau n_Qbits modifie
   // rappels :on a L_index= this.num_ligne = [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1]; //numero de la ligne quantique a laquelle apparait ce sommet

  // JE FAIS LES CALCULS CI DESSOUS de façon independante POUR LA PARTIE REELLE Et IMAGINAIRE
  // JE CALCULE DEUX MOYENNES

  //on cree un masque pour trouver les qbits qui ne passent pas dans le grover
  let masque=0;
  let i=0;
  while  ((i<=14) &&(L_index[i]!=-1)){
    masque=masque+Math.pow(2,nbre_Qbits-1-L_index[i]);
    i=i+1;
  }
  let n= Math.pow(2, nbre_Qbits)-1;

  masque = masque^n;

  //on cree un dictionnaire de moyennes, dont les cles sont les bits qui ne
  //passent pas dans la porte
    let moyenne_reel = {};//partie reelle
    let moyenne_img = {};//partie imaginaire

    for (let i = 0; i <n_Qbits.length; i++) {
       let Bits_en_dehors_porte=masque&i;

      /* Attention : le test porte sur la valeur et non sur sa presence. Quand
         la somme courante retombe a zero, elle est donc REMISE a la valeur
         lue au lieu d y etre ajoutee. C est ce que faisait l ancien code et
         les resultats en dependent : ne pas corriger sans refaire les
         references. */
      if (!moyenne_reel[Bits_en_dehors_porte]) {
    moyenne_reel[Bits_en_dehors_porte] = n_Qbits.re[i]; // Initialiser
  } else
    moyenne_reel[Bits_en_dehors_porte] = n_Qbits.re[i]+moyenne_reel[Bits_en_dehors_porte];

  if (!moyenne_img[Bits_en_dehors_porte]) {
    moyenne_img[Bits_en_dehors_porte] = n_Qbits.im[i]; // Initialiser
  } else
    moyenne_img[Bits_en_dehors_porte] = n_Qbits.im[i]+moyenne_img[Bits_en_dehors_porte];

    }

  //calcul du nbre d element dans chaque cle du dictionnaire
  let nbre_reel=n_Qbits.length/Object.keys(moyenne_reel).length;

 for (let key in moyenne_reel) {
  moyenne_reel[key] = moyenne_reel[key]/nbre_reel; //on calcule la moyenne pour chaque etat
}
 let nbre_img=n_Qbits.length/Object.keys(moyenne_img).length;

 for (let key in moyenne_img) {
  moyenne_img[key] = moyenne_img[key]/nbre_img; //on calcule la moyenne pour chaque etat
}

  //application de la formule 2|psi><psi|-I pour chaque etat du dictionnaire :
  //2*moyenne - valeur du coeff, ce qui inverse les valeurs autour de leur moyenne

  let nouveau_n_Qbits=new vecteur_etat(n_Qbits.length);
  let norme=0;
  for (let i = 0; i <n_Qbits.length; i++) {
    let Bits_en_dehors_porte=masque&i;
    let calcul_reel=2*moyenne_reel[Bits_en_dehors_porte]-n_Qbits.re[i];
    let calcul_img=2*moyenne_img[Bits_en_dehors_porte]-n_Qbits.im[i];

    nouveau_n_Qbits.ecrit(i,calcul_reel,calcul_img);
    norme=norme+nouveau_n_Qbits.pr[i];

  }

  let nm=round(norme,3);
  if (nm!=1)
  for (let i = 0; i <n_Qbits.length; i++) {
    nouveau_n_Qbits.ecrit(i,nouveau_n_Qbits.re[i]/sqrt(norme),nouveau_n_Qbits.im[i]/sqrt(norme));

  }

  return nouveau_n_Qbits;

}


function applique_Porte_Oracle(n_Qbits,L_index,nbre_Qbits,f_oracle,nbre_registre2,L_aretes_controle){//applique une porte Oracle,L_aretes_controle au bit correspondantaux positions dans L_index et retourne un nouveau n_Qbits modifié
   // rappels :on a L_index= this.num_ligne = [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1]; //numero de la ligne quantique a laquelle apparait ce sommet
  
 //Liste_controle=[[type_control1,num_bit_control1],[type_control2,num_bit_control2]] //renvoie la liste des controles sur la porte en indiquantb leur type (16 ou 17) et le numero de la ligne quntiqUE OU SEN TROUVE LE CONTROLE
  let Liste_controle=calcul_Liste_controle(L_aretes_controle);  
 
  // Trouver l'index de -1
const indexOfMinusOne = L_index.indexOf(-1);

// Si -1 est trouvé dans la liste, tronquer la liste avant -1
let L_pos = indexOfMinusOne !== -1 ? L_index.slice(0, indexOfMinusOne) : L_index;
  
let indice_debut_oracle=L_pos[0];//num ligne quantique ou demarre l oracle
  let indice_fin_oracle=L_pos[L_pos.length-1];//num ligne quantique ou fini l oracle  

 
if ((L_pos.length-nbre_registre2)<=0) {//y a pas assez de lignes pour faire fonctionner le deuxieme registre, on change rien
  print("pas assez de lignes sur l oracle pour le deuxieme registre")
  return n_Qbits;
}  
  

//console.log(L_pos);
  
  //on recupere et on enleve les dernières lignes qui sont celle qui subissent la fonction de l oracle, ces lignes du deuxieme registre qui devront etre modifiées seront dans  index
 //let index = L_pos.pop(); 


// Créer une liste avec les nbre_registre2 derniers éléments de L_pos
let num_lignes_quantiques_registre2=L_pos.slice(-nbre_registre2);

// Supprimer les nbre_registre2 derniers éléments de  L_pos
L_pos.splice(-nbre_registre2,nbre_registre2);
  
  
  
  
  
  
 // print("lignes premier registre",L_pos, "demarre a la ligne",indice_debut_oracle)
 // print("lignes deuxiele registre",num_lignes_quantiques_registre2, "fini a la ligne",indice_fin_oracle,"pourune fin a ",nbre_Qbits-1)
  
 
  
  /* L oracle envoie |x>|y> sur |x>|y xor f(x)>, ou x est le premier registre et
     y le second. Il n y a donc que des indices a recalculer : chaque amplitude
     se retrouve telle quelle a une autre place du vecteur.

     La version precedente passait par les chaines de caracteres : elle
     fabriquait les 2^n etats en binaire, en extrayait deux fois autant de
     sous-chaines par map(...).join(''), puis reconvertissait tout en decimal --
     environ 9 millions de chaines a 18 qbits. Tout cela se fait avec des
     masques et des decalages, comme le reste du fichier.

     L etat de sortie est, dans l ordre de lecture : les lignes avant l oracle,
     le premier registre inchange, le second registre recalcule, puis les lignes
     apres l oracle. Les poids ci dessous sont ceux de cette concatenation. */

  let nb_bits_registre1=L_pos.length;
  let nb_bits_registre2=nbre_registre2;
  let nb_bits_apres=nbre_Qbits-1-indice_fin_oracle;//lignes situees apres l oracle

  //pour chaque ligne d un registre : le masque qui isole son bit dans l etat,
  //et le rang qu occupe ce bit dans la valeur du registre
  let masques_registre1=new Array(nb_bits_registre1);
  let rangs_registre1=new Array(nb_bits_registre1);
  for (let k = 0; k <nb_bits_registre1; k++) {
    masques_registre1[k]=2**(nbre_Qbits-1-L_pos[k]);
    rangs_registre1[k]=2**(nb_bits_registre1-1-k);
  }

  let masques_registre2=new Array(nb_bits_registre2);
  let rangs_registre2=new Array(nb_bits_registre2);
  for (let k = 0; k <nb_bits_registre2; k++) {
    masques_registre2[k]=2**(nbre_Qbits-1-num_lignes_quantiques_registre2[k]);
    rangs_registre2[k]=2**(nb_bits_registre2-1-k);
  }

  let poids_avant=2**(nb_bits_registre1+nb_bits_registre2+nb_bits_apres);
  let poids_registre1=2**(nb_bits_registre2+nb_bits_apres);
  let poids_registre2=2**nb_bits_apres;
  let masque_apres=poids_registre2-1;//isole les lignes situees apres l oracle
  let decalage_avant=nbre_Qbits-indice_debut_oracle;//pour isoler celles d avant

  let nouveau_n_Qbits=new vecteur_etat(n_Qbits.length);

  //on parcourt chaque etat du n_qbit
  for (let i = 0; i <n_Qbits.length; i++) {

    let numero_etat;

    if ((Liste_controle)&&(cette_porte_est_desactive_par_un_controle(i,Liste_controle,nbre_Qbits))){
      numero_etat=i;
    }

    else { //pas controlee

      //valeur du premier registre, c est le x de f(x)
      let valeur_registre1=0;
      for (let k = 0; k <nb_bits_registre1; k++)
        if ((i&masques_registre1[k])!=0) valeur_registre1=valeur_registre1+rangs_registre1[k];

      //valeur du second registre, c est le y
      let valeur_registre2=0;
      for (let k = 0; k <nb_bits_registre2; k++)
        if ((i&masques_registre2[k])!=0) valeur_registre2=valeur_registre2+rangs_registre2[k];

      let f_de_x=f_oracle[valeur_registre1];

      if ((f_de_x===0)||(f_de_x===1)){//le cas normal : f rend 0 ou 1

        let nouveau_registre2=f_de_x^valeur_registre2;//y xor f(x)

        //le registre s ecrit sur nb_bits_registre2 bits : s il en faut moins on
        //complete par des zeros non significatifs, ce qui ne change pas la
        //valeur ; s il en faut plus on ne garde que les bits de poids fort
        let nb_bits_utiles=(nouveau_registre2===0)?1:(32-Math.clz32(nouveau_registre2));
        if (nb_bits_utiles>nb_bits_registre2)
          nouveau_registre2=nouveau_registre2>>>(nb_bits_utiles-nb_bits_registre2);

        numero_etat= (i>>>decalage_avant)*poids_avant
                   + valeur_registre1*poids_registre1
                   + nouveau_registre2*poids_registre2
                   + (i&masque_apres);

      } else {

        /* f a rendu autre chose que 0 ou 1 : soit la fonction saisie par
           l utilisateur rend n importe quoi, soit sa table est trop courte et
           f_de_x vaut undefined. Dans ces cas la, l ancien code passait par les
           chaines et aboutissait a un resultat arbitraire -- qu on reproduit
           ici tel quel, pour ne rien changer a ce qui s affichait. */

        let etat_complet=convertit_nombreDecimal_En_StringNombre_binaire(i,nbre_Qbits);
        let chaine_registre2=(f_de_x^valeur_registre2).toString(2);
        if (chaine_registre2.length != nb_bits_registre2){
          if (chaine_registre2.length < nb_bits_registre2){
            while (chaine_registre2.length < nb_bits_registre2) chaine_registre2 = "0" + chaine_registre2;
          } else
            chaine_registre2=chaine_registre2.slice(0, -(chaine_registre2.length - nb_bits_registre2));
        }

        let etat="";
        if (indice_debut_oracle!=0) etat = etat_complet.slice(0, indice_debut_oracle);
        etat=etat
            +valeur_registre1.toString(2).padStart(nb_bits_registre1,'0')
            +chaine_registre2;
        if (indice_fin_oracle!= nbre_Qbits-1 ) etat=etat+etat_complet.slice(indice_fin_oracle+1);

        numero_etat=convertit_StringNombre_binaire_En_nombreDecimal(etat);

      }

    }

    //fait la correspondance en echangeant les amplitudes
    nouveau_n_Qbits.ecrit(numero_etat,n_Qbits.re[i],n_Qbits.im[i]);

  }

  return nouveau_n_Qbits;

}


function applique_Porte_Transformee_Fourier(n_Qbits,L_index,nbre_Qbits,inverse=false){
  //applique une porte Transformee de Fourier aux bits correspondant aux positions dans L_index et retourne un nouveau n_Qbits modifie
   // rappels :on a L_index= this.num_ligne = [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1]; //numero de la ligne quantique a laquelle apparait ce sommet

  let masque=0;
  let i=0;
  while  ((i<=14) &&(L_index[i]!=-1)){
    masque=masque+Math.pow(2,nbre_Qbits-1-L_index[i]);
    i=i+1;
  }
  let n= Math.pow(2, nbre_Qbits)-1;

  masque = masque^n;

  /* On regroupe les etats par la valeur des bits qui NE passent PAS dans la
     porte : chaque groupe forme un petit vecteur d etat sur lequel la
     transformee s applique. Le dictionnaire ne retient plus que les indices,
     les amplitudes etant lues directement dans les tableaux de flottants. */
    let Dico_indices = {};

    for (let i = 0; i <n_Qbits.length; i++) {
       let Bits_en_dehors_porte=masque&i;

      if ((Bits_en_dehors_porte in Dico_indices)==false)
        Dico_indices[Bits_en_dehors_porte]=[i];
      else
        Dico_indices[Bits_en_dehors_porte].push(i);

    }

  let nouveau_n_Qbits=new vecteur_etat(n_Qbits.length);

  for (let cle in Dico_indices){

    let liste_indices=Dico_indices[cle];
    let taille=liste_indices.length;

    //le petit vecteur qui entre dans la transformee. On recopie aussi les
    //probabilites : quand le vecteur est tout nul, Fourier le rend tel quel et
    //ce sont alors ces probabilites d origine qui ressortent
    let Qbit_qui_entre=new vecteur_etat(taille);
    for (let t = 0; t <taille; t++) {
      let rang=liste_indices[t];
      Qbit_qui_entre.re[t]=n_Qbits.re[rang];
      Qbit_qui_entre.im[t]=n_Qbits.im[rang];
      Qbit_qui_entre.pr[t]=n_Qbits.pr[rang];
    }

    let Qbit_qui_sort=Fourier(Qbit_qui_entre,inverse);

    for (let t = 0; t <taille; t++) {
      let rang=liste_indices[t];
      nouveau_n_Qbits.re[rang]=Qbit_qui_sort.re[t];
      nouveau_n_Qbits.im[rang]=Qbit_qui_sort.im[t];
      nouveau_n_Qbits.pr[rang]=Qbit_qui_sort.pr[t];
    }

  }

  return nouveau_n_Qbits;

}


//on suppose que la transformee de Fourier s'applique sur l'ENSEMBLE du nQbits.
//sur le vecteur (x0,x1,x2....xn-1) et retourne le vecteur  (y0,y1,y2....yn-1)
function Fourier(n_Qbits,inverse=false){
  //voir calcul ici fr.wikipedia.org/wiki/Transform%C3%A9e_de_Fourier_quantique

  let N=n_Qbits.length;
  let racine_N=sqrt(N);

  let re=n_Qbits.re;
  let im=n_Qbits.im;

  let nouveau_n_Qbits=new vecteur_etat(N);
  let cst=2*Math.PI/N;

  if (inverse==true) cst=-1*cst;

  let liste_des_n_pas_nuls=[];

  for (let k = 0; k <N; k++){

     let  y_k_x=0;//partie reelle de y_k
     let  y_k_y=0;//partie imaginaire de y_k

     if (k!=0){

       for (let t = 0; t <liste_des_n_pas_nuls.length; t++) {

       let n= liste_des_n_pas_nuls[t];

       let x_n_x=re[n];
       let x_n_y=im[n];

       let alpha=cst*k*n;

       let w_N_kn_x=Math.cos(alpha);//partie reelle de W_N_kn
       let w_N_kn_y=Math.sin(alpha);//partie imaginaire de W_N_kn

       //yk = yk + xn*w_N_kn en tenant compte des complexes dont i*i = -1

        if (x_n_y==0){
           y_k_x=y_k_x + x_n_x*w_N_kn_x ;
           y_k_y=y_k_y + x_n_x*w_N_kn_y ;
        }else
        if (x_n_x==0){
             y_k_x=y_k_x  - x_n_y*w_N_kn_y;
             y_k_y=y_k_y  + x_n_y*w_N_kn_x;
        }else{
           y_k_x=y_k_x + x_n_x*w_N_kn_x - x_n_y*w_N_kn_y;
           y_k_y=y_k_y + x_n_x*w_N_kn_y + x_n_y*w_N_kn_x;
        }

      } //fin de boucle n

     }

     else//pour k= 0 on calcule apres on regarde seulement les valeurs de n pas nuls
     for (let n = 0; n <N; n++)
     if ((re[n]!=0)||(im[n]!=0)){ //tester si = 0 gagne bcp de temps

       liste_des_n_pas_nuls.push(n);

       let x_n_x=re[n];
       let x_n_y=im[n];

       let alpha=cst*k*n;

       let w_N_kn_x=Math.cos(alpha);//partie reelle de W_N_kn
       let w_N_kn_y=Math.sin(alpha);//partie imaginaire de W_N_kn

       //yk = yk + xn*w_N_kn en tenant compte des complexes dont i*i = -1

        if (x_n_y==0){
           y_k_x=y_k_x + x_n_x*w_N_kn_x ;
           y_k_y=y_k_y + x_n_x*w_N_kn_y ;
        }else
        if (x_n_x==0){
             y_k_x=y_k_x  - x_n_y*w_N_kn_y;
             y_k_y=y_k_y  + x_n_y*w_N_kn_x;
        }else{
           y_k_x=y_k_x + x_n_x*w_N_kn_x - x_n_y*w_N_kn_y;
           y_k_y=y_k_y + x_n_x*w_N_kn_y + x_n_y*w_N_kn_x;
        }

      } //fin de boucle n

      if (liste_des_n_pas_nuls.length==0) {

        return n_Qbits;//pas de changement , inutile de continuer
      }

      y_k_x=y_k_x/(racine_N);
      y_k_y=y_k_y/(racine_N);

      nouveau_n_Qbits.ecrit(k,y_k_x,y_k_y);

   }//fin de boucle k

  return nouveau_n_Qbits;

}



function applique_Porte_Racine_X(n_Qbits,L_index,nbre_Qbits,L_aretes_controle){
  
  let dim=2;
  let matrice = new matrice_porte(dim);

  //matrice racine X
  matrice.ecrit(0,0,1,1);
  matrice.ecrit(0,1,1,-1);
  matrice.ecrit(1,0,1,-1);
  matrice.ecrit(1,1,1,1);
  
 
  
  
  return applique_Porte_Universelle(n_Qbits,L_index,nbre_Qbits,matrice,L_aretes_controle);
  
}  
  
 
function applique_Porte_Racine_SWAP(n_Qbits,L_index,nbre_Qbits,L_aretes_controle){
  
  let dim=4;
  let matrice = new matrice_porte(dim);

  //matrice racine swap : les coefficients nuls le sont deja
  matrice.ecrit(0,0,1,0);

  matrice.ecrit(1,1,0.5,0.5);
  matrice.ecrit(1,2,0.5,-0.5);

  matrice.ecrit(2,1,0.5,-0.5);
  matrice.ecrit(2,2,0.5,0.5);

  matrice.ecrit(3,3,0,1);
  
  
  return applique_Porte_Universelle(n_Qbits,L_index,nbre_Qbits,matrice,L_aretes_controle);
  
}  
    
    
    

function applique_Porte_Universelle(n_Qbits,L_index,nbre_Qbits,matrice=undefined,L_aretes_controle){
  //applique une matrice aux bits correspondant aux positions dans L_index et retourne un nouveau n_Qbits modifie
   // rappels :on a L_index= this.num_ligne = [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1]; //numero de la ligne quantique a laquelle apparait ce sommet

   //Liste_controle=[[type_control1,num_bit_control1],[type_control2,num_bit_control2]] //renvoie la liste des controles sur la porte en indiquantb leur type (16 ou 17) et le numero de la ligne quntiqUE OU SEN TROUVE LE CONTROLE
  let Liste_controle=calcul_Liste_controle(L_aretes_controle);

  let masque=0;
  let i=0;
  while  ((i<=14) &&(L_index[i]!=-1)){
    masque=masque+Math.pow(2,nbre_Qbits-1-L_index[i]);
    i=i+1;
  }
  let n= Math.pow(2, nbre_Qbits)-1;

  masque = masque^n;

  /* On regroupe les etats par la valeur des bits qui NE passent PAS dans la
     porte : chaque groupe forme un petit vecteur d etat auquel la matrice
     s applique. Le dictionnaire ne retient plus que les indices, les
     amplitudes etant lues directement dans les tableaux de flottants. */
    let Dico_indices = {};
  let nouveau_n_Qbits=new vecteur_etat(n_Qbits.length);

    for (let i = 0; i <n_Qbits.length; i++)

    if ((Liste_controle)&&(cette_porte_est_desactive_par_un_controle(i,Liste_controle,nbre_Qbits)))     {//etat controle on copie nouveau qbits simplement
      nouveau_n_Qbits.ecrit(i,n_Qbits.re[i],n_Qbits.im[i]);
    }

    else //etat pas controle
    {
       let Bits_en_dehors_porte=masque&i;

      if ((Bits_en_dehors_porte in Dico_indices)==false)
        Dico_indices[Bits_en_dehors_porte]=[i];
      else
        Dico_indices[Bits_en_dehors_porte].push(i);

    }


 //on applique la matrice sur le petit vecteur de chaque groupe, puis on
 //replace les amplitudes obtenues a leur rang d origine

  let somme_carre=0;

  for (let cle in Dico_indices){

    let liste_indices=Dico_indices[cle];
    let taille=liste_indices.length;

    //le petit vecteur qui entre dans la matrice : on recopie aussi les
    //probabilites, dont applique_matrice se sert pour conserver la norme
    let Qbit_qui_entre=new vecteur_etat(taille);
    for (let t = 0; t <taille; t++) {
      let rang=liste_indices[t];
      Qbit_qui_entre.re[t]=n_Qbits.re[rang];
      Qbit_qui_entre.im[t]=n_Qbits.im[rang];
      Qbit_qui_entre.pr[t]=n_Qbits.pr[rang];
    }

    let Qbit_qui_sort=applique_matrice(Qbit_qui_entre,matrice);

    for (let t = 0; t <taille; t++) {
      let rang=liste_indices[t];
      nouveau_n_Qbits.re[rang]=Qbit_qui_sort.re[t];
      nouveau_n_Qbits.im[rang]=Qbit_qui_sort.im[t];
      nouveau_n_Qbits.pr[rang]=Qbit_qui_sort.pr[t];
      somme_carre=somme_carre+nouveau_n_Qbits.pr[rang];
    }

  }

 //il faut le normaliser deja fait normalement

  for (let i = 0; i <nouveau_n_Qbits.length; i++) {
     if ((nouveau_n_Qbits.re[i]!=0)||(nouveau_n_Qbits.im[i]!=0))
    nouveau_n_Qbits.ecrit(i,nouveau_n_Qbits.re[i]/sqrt(somme_carre),nouveau_n_Qbits.im[i]/sqrt(somme_carre));
   }

  return nouveau_n_Qbits;

}



//on suppose que la matrice s'applique sur l'ENSEMBLE du nQbits.
//sur le vecteur (x0,x1,x2....xn-1) et retourne le vecteur  (y0,y1,y2....yn-1)
//la matrice est une matrice carré nxn et ressort un vecteur 
function applique_matrice(n_Qbits,matrice){
    // Assurez-vous que M est une matrice carree et que A est un vecteur de dimension appropriee
    const n = matrice.length; // Nombre de lignes (et de colonnes) de la matrice
    if (n_Qbits.length !== n) {
        print("bug La dimension du vecteur A doit etre egale a celle de la matrice M");
       return undefined;
    }

  //le vecteur de sortie part de zero, comme le tableau de new complexe(0,0)
  let nouveau_n_Qbits=new vecteur_etat(n);

    let somme_carre_initial=0;//la matrice ne doit pas changer la norme du nqbit, qui n est pas forcemment 1 car on a decomposé le nqbit inital ! il faut conserver la valeur
    let somme_carre=0;

    // Calcul de nouveau_n_Qbits = M * n_Qbits
    //les coefficients sont dans deux Float64Array : on les sort de la boucle
    let m_re=matrice.re, m_im=matrice.im;

    for (let i = 0; i < n; i++) {
        let base=i*n;
        for (let j = 0; j < n; j++)
          if ((n_Qbits.re[j]!=0)||(n_Qbits.im[j]!=0))
           if ((m_re[base+j]!=0)||(m_im[base+j]!=0)) //tester si = 0 gagne bcp de temps
        {
            /* nouveau[i] = nouveau[i].add(n_Qbits[j].mul(matrice[i][j]))
               Les deux operations de complexe arrondissaient chacune leur
               resultat a 10 decimales : le produit d abord, la somme ensuite.
               Il faut les deux arrondis, et dans cet ordre. */
            let ax=n_Qbits.re[j], ay=n_Qbits.im[j];
            let bx=m_re[base+j], by=m_im[base+j];

            let produit_x=Math.round((ax*bx-ay*by)*1e10)/1e10;
            let produit_y=Math.round((ax*by+ay*bx)*1e10)/1e10;

            nouveau_n_Qbits.ecrit(i,nouveau_n_Qbits.re[i]+produit_x,nouveau_n_Qbits.im[i]+produit_y);

            if (j==n-1){
                       somme_carre=somme_carre+nouveau_n_Qbits.pr[i];
                       somme_carre_initial=somme_carre_initial+n_Qbits.pr[i];
                       }

        }
    }

  //on renormalise le nouveau Qbit a son ancienne valeur
  if (somme_carre!=somme_carre_initial){
    let rapport=sqrt(somme_carre_initial/somme_carre);
   for (let i = 0; i <n; i++) {
     if ((nouveau_n_Qbits.re[i]!=0)||(nouveau_n_Qbits.im[i]!=0))
                nouveau_n_Qbits.ecrit(i,nouveau_n_Qbits.re[i]*rapport,nouveau_n_Qbits.im[i]*rapport);
   }
  }


    return nouveau_n_Qbits;
}






  


