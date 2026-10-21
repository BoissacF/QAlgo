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
function tirageAleatoire_etat_dun_nQbits(nQbits) {
  let r = random(1); // Générer un nombre aléatoire entre 0 et 1
  let somme = 0;     // Variable pour suivre la somme cumulative des probabilités
  
  for (let i = 0; i < nQbits.length; i++) {
    somme += nQbits[i].proba; // Ajouter la probabilité à la somme cumulative
    
    if (r < somme) {
      return i; // Si le nombre aléatoire est inférieur à la somme cumulative, on renvoie l'indice
    }
    
   
  }
  
   if (somme==0) print("gros bug function tirageAleatoire_etat_dun_nQbits(nQbits)!!!!!!!!!!!!",somme)
    return 0; //ne devrait jamais arrivé ici
  
  
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


function initialise_tableaux_des_conversions(nbits){
  decimal_to_string=[];
  //string_to_decimal={};
  
  for (let i = 0; i < 2**nbits; i++) {
      let binaryString = i.toString(2).padStart(nbits, '0');
      decimal_to_string.push(binaryString);
  }
  
}



 function convertit_nombreDecimal_En_StringNombre_binaire(nombreDecimal,nbits){
   
   
   if  (decimal_to_string[nombreDecimal].length==nbits)
  return decimal_to_string[nombreDecimal];
 
  
   
 
let binaryString = nombreDecimal.toString(2).padStart(nbits, '0'); // Ajoute des zéros à gauche pour avoir n bits
//console.log(binaryString); // "00001010"
  
 // decimal_to_string.push(binaryString);
  //string_to_decimal[binaryString]=i;
  
  
  return binaryString;
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
  let n_Qbits=[];//sera le vecteur du produit tensoriel des n q bits d entree

  let n = LigneQuantique.length;//nbre de qbits
  if (n==0) return n_Qbits;

  let taille_finale=2**n;
  n_Qbits=new Array(taille_finale);
  let fige=new Uint8Array(taille_finale);//1 = etat arrete sur un coefficient nul

  //premier qbit : on prend ses deux coefficients tels quels, sans multiplier
  //(c est ce que faisait le cas j==0 de l ancienne boucle)
  let Qbit0=LigneQuantique[0][0].Qbit[0][0];//c est un complexe x+yi devant |0>
  let Qbit1=LigneQuantique[0][0].Qbit[0][1];//c est un complexe x+yi devant |1>
  n_Qbits[0]=Qbit0;
  n_Qbits[1]=Qbit1;
  fige[0]=((Qbit0.x==0)&&(Qbit0.y==0))?1:0;
  fige[1]=((Qbit1.x==0)&&(Qbit1.y==0))?1:0;

  //qbits suivants : chaque etat deja forme en engendre deux
  for (let j = 1; j <n; j++) {

    Qbit0=LigneQuantique[j][0].Qbit[0][0];
    Qbit1=LigneQuantique[j][0].Qbit[0][1];

    let Qbit0_est_nul=((Qbit0.x==0)&&(Qbit0.y==0));//si a zero on ne multiplie pas : ca donnerait tjs zero
    let Qbit1_est_nul=((Qbit1.x==0)&&(Qbit1.y==0));

    //on remonte de la fin pour pouvoir doubler dans le meme tableau : les cases
    //ecrites, 2k et 2k+1, sont toujours au dela de celles qui restent a lire
    for (let k = (1<<j)-1; k >=0; k--) {

      let coeff=n_Qbits[k];

      if (fige[k]==1){//etat deja arrete sur un zero : il se recopie a l identique
        n_Qbits[2*k]=coeff;
        n_Qbits[2*k+1]=coeff;
        fige[2*k]=1;
        fige[2*k+1]=1;
        continue;
      }

      if (Qbit0_est_nul){ n_Qbits[2*k]=Qbit0; fige[2*k]=1; }
      else { n_Qbits[2*k]=coeff.mul(Qbit0); fige[2*k]=0; }

      if (Qbit1_est_nul){ n_Qbits[2*k+1]=Qbit1; fige[2*k+1]=1; }
      else { n_Qbits[2*k+1]=coeff.mul(Qbit1); fige[2*k+1]=0; }

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
  
          //cree un masque 0001000000 ou 1 est la position du qbit qui passe dans la porte, donc celui a inversé ou a traitersi besoin, evite de creer etat=|0001100110> et de regarder si le bit numero i est a 1 ou 0 
  //attention (masque_index_a_traiter&i) renvoie 0 ou un nbre qui est une puissance de 2, pas 1....
  let  masque_index_a_traiter = 2**(nbre_Qbits-1-numeroQbit);
  
  
      
  
      let P1=0;//proba d avoir 1
      for (let i = 0; i <n_Qbits.length; i++) 
      if (n_Qbits[i]!=undefined)
      
      {
        
        
             // ce st beaucoup plus rapide de faire un et que de convertir !!!!!
            if ((masque_index_a_traiter&i)!=0)  P1=P1+100*n_Qbits[i].proba;
        
       
        
          // let etat=convertit_nombreDecimal_En_StringNombre_binaire(i,nbre_Qbits);
        
       // print("numeroqbit=",numeroQbit,"i=",i,"nbre_equiv",nbre_equivalent_numeroQbit,"etat",etat,"test",((nbre_equivalent_numeroQbit&i)!=0)," autre",(etat[numeroQbit]=="1") )
        
           //if (etat[numeroQbit]=="1")  P1=P1+100*n_Qbits[i].proba;
    
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

function applique_Porte_X(n_Qbits,index,nbre_Qbits,L_aretes_controle){//applique une porte X au bit correspondant a l index et retourne un nouveau n_Qbits modifié
  

  
   //Liste_controle=[[type_control1,num_bit_control1],[type_control2,num_bit_control2]] //renvoie la liste des controles sur la porte en indiquantb leur type (16 ou 17) et le numero de la ligne quntiqUE OU SEN TROUVE LE CONTROLE
  let Liste_controle=calcul_Liste_controle(L_aretes_controle);  
  
  
    //cree un masque 0001000000 ou 1 est la position du qbit qui passe dans la porte, donc celui a inversé ou a traitersi besoin, evite de creer etat=|0001100110> et de regarder si le bit numero i est a 1 ou 0 
  //attention
  let  masque_index_a_traiter = 2**(nbre_Qbits-1-index);
  
  
  
  //cree le nouveau n_Qbit de même taille initailsé à -1
 /* let nouveau_n_Qbits=[];
  for (let i = 0; i <n_Qbits.length; i++) { 
    
    nouveau_n_Qbits.push(new complexe(0,0));
  }*/
  
  let nouveau_n_Qbits=new Array(n_Qbits.length);
  
  
  //on parcourt chaque etat du n_qbit
  for (let i = 0; i <n_Qbits.length; i++) {
    
    
    let numero_etat;
    //let etat=convertit_nombreDecimal_En_StringNombre_binaire(i,nbre_Qbits);
    
    
    
    
    
    if ((Liste_controle)&&(cette_porte_est_desactive_par_un_controle(i,Liste_controle,nbre_Qbits))){
  // if ((Liste_controle)&&(cette_porte_est_desactive_par_un_controle(etat,Liste_controle))){
      numero_etat=i;
      
      
    }
    
    else {
      //etat=inverse_bit_a_index_pour_un_nbre_binaire(etat, index);//porte X : inverse le bit a index
    
       //numero_etat=convertit_StringNombre_binaire_En_nombreDecimal(etat);//trouve son numero dans le nouveau n_qbit
      
      
      
      //va plus vite que de convertir en string comme ci dessous
         // Applique l'inversion du bit à l'index spécifié
         numero_etat= i ^  masque_index_a_traiter;
    }
    
    //print(i,"etat",etat)
    
    
   // print("le nouveau Qbit",etat,numero_etat," est egale au vieux Qbit",i, "qui a pour valeur",n_Qbits[i])
    
    //fait la correspondance en echangeant les amplitudes
    
    nouveau_n_Qbits[ numero_etat]=new complexe(n_Qbits[i].x,n_Qbits[i].y);
   // nouveau_n_Qbits[numero_etat].coeff_complexe(n_Qbits[i].x,n_Qbits[i].y); 
    
  
    
  }
  
  return nouveau_n_Qbits;
  
}



function applique_Porte_SWAP(n_Qbits,index1,index2,nbre_Qbits,L_aretes_controle){//applique une porte SWAP au bit correspondant a l index et retourne un nouveau n_Qbits modifié
  
//ATTENTION NE DOIT SE LANCER QUE SI LA PORTE A SES DEUX ENTREES, SINON ON LANCE pAS cette fonction, c est inutile
  
   //Liste_controle=[[type_control1,num_bit_control1],[type_control2,num_bit_control2]] //renvoie la liste des controles sur la porte en indiquantb leur type (16 ou 17) et le numero de la ligne quntiqUE OU SEN TROUVE LE CONTROLE
  let Liste_controle=calcul_Liste_controle(L_aretes_controle);  
   print("je lance swap")
  print("la liste de controles est",Liste_controle)
  //index1 et index2 sont les deux indices a intervertir si et seulement si ils sont differents
  
  
  //cree le nouveau n_Qbit de même taille initailsé à -1
  /*let nouveau_n_Qbits=[];
  for (let i = 0; i <n_Qbits.length; i++) { 
    
    nouveau_n_Qbits.push(new complexe(0,0));
  }*/
  
  
   let nouveau_n_Qbits=new Array(n_Qbits.length);
 
  
  
  
  //on parcourt chaque etat du n_qbit
  for (let i = 0; i <n_Qbits.length; i++) {
    
   
    let numero_etat;
    let etat=convertit_nombreDecimal_En_StringNombre_binaire(i,nbre_Qbits);
    
    
    if (((Liste_controle)&&(cette_porte_est_desactive_par_un_controle(i,Liste_controle,nbre_Qbits)))
   
    ||
      (etat[index1]==etat[index2])){
   //si y a control et sic est le bon bit de control aucun changement
      numero_etat=i;
     // print("yo controle",i,"etat",etat,"index1",index1,"  index2",index2,etat[index1]==etat[index2],cette_porte_est_desactive_par_un_controle(i,Liste_controle,nbre_Qbits))
      
    }
    
    else {//on inverse les deux bits des deux lignes si ils sont differents
      
    //  print("yo pas de controle",i,"etat",etat)
      etat=inverse_bit_a_index_pour_un_nbre_binaire(etat, index1);// inverse le bit a index1
      etat=inverse_bit_a_index_pour_un_nbre_binaire(etat, index2);// inverse le bit a index1
    
       numero_etat=convertit_StringNombre_binaire_En_nombreDecimal(etat);//trouve son numero dans le nouveau n_qbit
    }
    
    //print(i,"etat",etat)
    
    
   // print("le nouveau Qbit",etat,numero_etat," est egale au vieux Qbit",i, "qui a pour valeur",n_Qbits[i])
    
    //fait la correspondance en echangeant les amplitudes
    
     
  nouveau_n_Qbits[ numero_etat]=new complexe(n_Qbits[i].x,n_Qbits[i].y);
  //  nouveau_n_Qbits[numero_etat].coeff_complexe(n_Qbits[i].x,n_Qbits[i].y); 
    
  //  print(nouveau_n_Qbits,n_Qbits)
    
  }
  
  return nouveau_n_Qbits;
  
}







function applique_Porte_Y(n_Qbits,index,nbre_Qbits,L_aretes_controle){//applique une porte X au bit correspondant a l index et retourne un nouveau n_Qbits modifié
  

  
   //Liste_controle=[[type_control1,num_bit_control1],[type_control2,num_bit_control2]] //renvoie la liste des controles sur la porte en indiquantb leur type (16 ou 17) et le numero de la ligne quntiqUE OU SEN TROUVE LE CONTROLE
  let Liste_controle=calcul_Liste_controle(L_aretes_controle);  
  
  
  
  
  
  //cree le nouveau n_Qbit de même taille initailsé à -1
 /* let nouveau_n_Qbits=[];
  for (let i = 0; i <n_Qbits.length; i++) { 
   
    nouveau_n_Qbits.push(new complexe(0,0));
  }*/
   let nouveau_n_Qbits=new Array(n_Qbits.length);
  
  
  
  
  
  
  //on parcourt chaque etat du n_qbit
  for (let i = 0; i <n_Qbits.length; i++) {
    
    
    let numero_etat;
    let etat=convertit_nombreDecimal_En_StringNombre_binaire(i,nbre_Qbits);
    
    
       if ((Liste_controle)&&(cette_porte_est_desactive_par_un_controle(i,Liste_controle,nbre_Qbits))){
     //if ((Liste_controle)&&(cette_porte_est_desactive_par_un_controle(etat,Liste_controle))){
     
      numero_etat=i;
     // nouveau_n_Qbits[numero_etat].coeff_complexe(n_Qbits[i].x,n_Qbits[i].y); 
        
      
  nouveau_n_Qbits[ numero_etat]=new complexe(n_Qbits[i].x,n_Qbits[i].y);  
        
      
    }
    
    else {
      
      let bit_depart=etat[index];
      etat=inverse_bit_a_index_pour_un_nbre_binaire(etat, index);//porte X : inverse le bit a index
    
       numero_etat=convertit_StringNombre_binaire_En_nombreDecimal(etat);//trouve son numero dans le nouveau n_qbit
      
      //f (bit_depart==0) nouveau_n_Qbits[numero_etat].coeff_complexe(-n_Qbits[i].y,n_Qbits[i].x); 
     // else nouveau_n_Qbits[numero_etat].coeff_complexe(n_Qbits[i].y,-n_Qbits[i].x); 
      
      
      
      if (bit_depart==0)
  nouveau_n_Qbits[ numero_etat]=new complexe(-n_Qbits[i].y,n_Qbits[i].x);
       else
  nouveau_n_Qbits[ numero_etat]=new complexe(n_Qbits[i].y,-n_Qbits[i].x);
      
      
       
      
      
      
      
    }
    
    //print(i,"etat",etat)
    
    
   // print("le nouveau Qbit",etat,numero_etat," est egale au vieux Qbit",i, "qui a pour valeur",n_Qbits[i])
    
    //fait la correspondance en echangeant les amplitudes
    
    //nouveau_n_Qbits[ numero_etat]=n_Qbits[i];
    
    
  //  print(nouveau_n_Qbits,n_Qbits)
    
  }
  
  return nouveau_n_Qbits;
  
}



function applique_Porte_Z(n_Qbits,index,nbre_Qbits,L_aretes_controle){//applique une porte Z au bit correspondant a l index et retourne un nouveau n_Qbits modifié
  
  
   //Liste_controle=[[type_control1,num_bit_control1],[type_control2,num_bit_control2]] //renvoie la liste des controles sur la porte en indiquantb leur type (16 ou 17) et le numero de la ligne quntiqUE OU SEN TROUVE LE CONTROLE
  let Liste_controle=calcul_Liste_controle(L_aretes_controle);  
  
  
  //cree le nouveau n_Qbit de même taille initailsé à -1
  let nouveau_n_Qbits=[];
  for (let i = 0; i <n_Qbits.length; i++) { 
    //nouveau_n_Qbits.push(-1);
     nouveau_n_Qbits.push(new complexe(0,0));
  }
  
  //on parcourt chaque etat du n_qbit
  for (let i = 0; i <n_Qbits.length; i++) {
    
    let etat=convertit_nombreDecimal_En_StringNombre_binaire(i,nbre_Qbits);
    
    if ((Liste_controle)&&(cette_porte_est_desactive_par_un_controle(i,Liste_controle,nbre_Qbits))){
     //if ((Liste_controle)&&(cette_porte_est_desactive_par_un_controle(etat,Liste_controle))){ 
    //nouveau_n_Qbits[i]=n_Qbits[i];//desactivé par le bit de controle
      nouveau_n_Qbits[i].coeff_complexe(n_Qbits[i].x,n_Qbits[i].y); 
      
      
    }
    else
      {//Porte Z activé
    
    
    
    
    
    
    //Z change la phase (signe de l amplitude) si c est |1> sinon fait rien
        //nouveau_n_Qbits[i]=n_Qbits[i];
        if (etat[index]=="1")  nouveau_n_Qbits[i].coeff_complexe(-n_Qbits[i].x,-n_Qbits[i].y);
        else nouveau_n_Qbits[i].coeff_complexe(n_Qbits[i].x,n_Qbits[i].y); 
    
   // if (etat[index]=="1") nouveau_n_Qbits[i]=-1*n_Qbits[i];
   // else nouveau_n_Qbits[i]=n_Qbits[i];
      }
    
  }
  
  return nouveau_n_Qbits;
  
}

function applique_Porte_R(n_Qbits,index,nbre_Qbits,phase,L_aretes_controle){//applique une porte R au bit correspondant a l index et retourne un nouveau n_Qbits modifié
  
  
 
   //Liste_controle=[[type_control1,num_bit_control1],[type_control2,num_bit_control2]] //renvoie la liste des controles sur la porte en indiquantb leur type (16 ou 17) et le numero de la ligne quntiqUE OU SEN TROUVE LE CONTROLE
  let Liste_controle=calcul_Liste_controle(L_aretes_controle);  
  
  
  //cree le nouveau n_Qbit de même taille initailsé à -1
  let nouveau_n_Qbits=[];
  for (let i = 0; i <n_Qbits.length; i++) { 
    //nouveau_n_Qbits.push(-1);
     nouveau_n_Qbits.push(new complexe(0,0));
  }
  
  //on parcourt chaque etat du n_qbit
  for (let i = 0; i <n_Qbits.length; i++) {
    
    let etat=convertit_nombreDecimal_En_StringNombre_binaire(i,nbre_Qbits);
    
     if ((Liste_controle)&&(cette_porte_est_desactive_par_un_controle(i,Liste_controle,nbre_Qbits))){
    //if ((Liste_controle)&&(cette_porte_est_desactive_par_un_controle(etat,Liste_controle))){  
    //nouveau_n_Qbits[i]=n_Qbits[i];//desactivé par le bit de controle
      nouveau_n_Qbits[i].coeff_complexe(n_Qbits[i].x,n_Qbits[i].y); 
      
      
    }
    else
      {//Porte Z activé
    
    
    
    
    
    
    //R change la phase (signe de l amplitude) en multipliant par exp(iphi) le coeff de ket 1 
        if (etat[index]=="1")  {
          let x= n_Qbits[i].x*Math.cos(phase)-n_Qbits[i].y*Math.sin(phase);
          let y= n_Qbits[i].x*Math.sin(phase)+n_Qbits[i].y*Math.cos(phase);
          nouveau_n_Qbits[i].coeff_complexe(x,y);
                                
        }
        else nouveau_n_Qbits[i].coeff_complexe(n_Qbits[i].x,n_Qbits[i].y); 
    
   // if (etat[index]=="1") nouveau_n_Qbits[i]=-1*n_Qbits[i];
   // else nouveau_n_Qbits[i]=n_Qbits[i];
      }
    
  }
  print("nouveau nqbits", nouveau_n_Qbits)
  return nouveau_n_Qbits;
  
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



function applique_Porte_H(n_Qbits,index,nbre_Qbits,L_aretes_controle){//applique une porte H au bit correspondant a l index et retourne un nouveau n_Qbits modifié
  
  
   //Liste_controle=[[type_control1,num_bit_control1],[type_control2,num_bit_control2]] //renvoie la liste des controles sur la porte en indiquantb leur type (16 ou 17) et le numero de la ligne quntiqUE OU SEN TROUVE LE CONTROLE
  let Liste_controle=calcul_Liste_controle(L_aretes_controle);  
  
  
   //cree un masque 0001000000 ou 1 est la position du qbit qui passe dans la porte, donc celui a inversé ou a traitersi besoin, evite de creer etat=|0001100110> et de regarder si le bit numero i est a 1 ou 0 
  let  masque_index_a_traiter = 2**(nbre_Qbits-1-index);
  
  
  //cree le nouveau n_Qbit de même taille initailsé à 0
  let nouveau_n_Qbits=[];
  for (let i = 0; i <n_Qbits.length; i++) { 
    nouveau_n_Qbits.push(new complexe(0,0));
  }
  
 //pas ici !!! let nouveau_n_Qbits=new Array(n_Qbits.length);
 
  
  
  //on parcourt chaque etat du n_qbit
  for (let i = 0; i <n_Qbits.length; i++) {
    
    //let etat=convertit_nombreDecimal_En_StringNombre_binaire(i,nbre_Qbits);
    
    //let etat="";
     
    
    
    
    
         
    
    
    
    
    if ((Liste_controle)&&(cette_porte_est_desactive_par_un_controle(i,Liste_controle,nbre_Qbits))){
   //if ((Liste_controle)&&(cette_porte_est_desactive_par_un_controle(etat,Liste_controle))){   
    //nouveau_n_Qbits[i]=n_Qbits[i];//desactivé par le bit de controle
    // nouveau_n_Qbits[i].coeff_complexe(n_Qbits[i].x,n_Qbits[i].y); 
     
     
     
  nouveau_n_Qbits[i]=new complexe(n_Qbits[i].x,n_Qbits[i].y);
      
     
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
     //   print( "etat",etat,"index",index,"etatindex",etat[index],"nbre", i&masque_index_a_traiter)
      
    if ((masque_index_a_traiter&i)==0){
    //if (etat[index]=="0") {//H : si 0 on transforme en (0+1)*racine 2
       // etat0=etat;
        //etat1=inverse_bit_a_index_pour_un_nbre_binaire(etat, index);
        numero_etat0=i;
       // numero_etat1=convertit_StringNombre_binaire_En_nombreDecimal(etat1);
       
       //va plus vite que de convertir en string comme ci dessous
         // Applique l'inversion du bit à l'index spécifié
         numero_etat1= i ^  masque_index_a_traiter;
      
      //fait la correspondance en echangeant les amplitudes
      
       x=nouveau_n_Qbits[ numero_etat0].x+n_Qbits[i].x/sqrt(2);
       y=nouveau_n_Qbits[ numero_etat0].y+n_Qbits[i].y/sqrt(2);
      
       nouveau_n_Qbits[numero_etat0].coeff_complexe(x,y);
      
      
       x=nouveau_n_Qbits[ numero_etat1].x+n_Qbits[i].x/sqrt(2);
       y=nouveau_n_Qbits[ numero_etat1].y+n_Qbits[i].y/sqrt(2);
       nouveau_n_Qbits[numero_etat1].coeff_complexe(x,y);
      
      
      
      
      
      
     // print("coeff",coeff,etat0,etat1,numero_etat0,numero_etat1,"nouvel valeur pour 0",nouveau_n_Qbits[ numero_etat0],"nouvel valeur pour 1",nouveau_n_Qbits[ numero_etat1],nouveau_n_Qbits)
      
    }else{//H : si 1 on transforme en (0-1)*racine 2
      
       // etat1=etat;
        //etat0=inverse_bit_a_index_pour_un_nbre_binaire(etat, index);
        numero_etat1=i;
       // numero_etat0=convertit_StringNombre_binaire_En_nombreDecimal(etat0);
      
        //va plus vite que de convertir en string
      numero_etat0= i ^  masque_index_a_traiter;
      
    
      
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


//calcule le nQbit apres une mesure surun des qbit
function applique_Porte_BitMesure(BitMesure,n_Qbits,index,nbre_Qbits){//applique le bit mesure
 // print("c est parti, vla le Qbit de depart",n_Qbits)
   
  //cree le nouveau n_Qbit de même taille initailsé à -1
 
  
  /*
  let nouveau_n_Qbits=[];
  for (let i = 0; i <n_Qbits.length; i++) { 
    nouveau_n_Qbits.push(new complexe(0,0));
  }
  */
  
  let nouveau_n_Qbits=new Array(n_Qbits.length);
  
  //let array = new Array(100000);//cree un tableau qui contient rien , a undefined
  //let array = new Array(100000).fill(null);//cree un tableauinitialisé a null, un peu plus long..
  
  
  let somme_carre=0;
  BitMesure=String(BitMesure);
  
  //print("ici bit mesure est",BitMesure)
  //on parcourt chaque etat du n_qbit
  for (let i = 0; i <n_Qbits.length; i++) 

  
  {
    
    if (n_Qbits[i]==undefined) {
      nouveau_n_Qbits[i]=undefined;//a deja été supprimé avant
      continue;
    } 
    
    let numero_etat;
   
    
    let etat=convertit_nombreDecimal_En_StringNombre_binaire(i,nbre_Qbits);
    
   //  print("etat",etat,"index",index,"etat[index]",etat[index])
    if (etat[index]!=BitMesure) {
     
       
      
      nouveau_n_Qbits[i]=undefined;//on le supprimme new complexe(0,0);
    }
    else{
     nouveau_n_Qbits[i]=new complexe(n_Qbits[i].x,n_Qbits[i].y);
      
     // nouveau_n_Qbits[i].coeff_complexe(n_Qbits[i].x,n_Qbits[i].y); 
      somme_carre=somme_carre+nouveau_n_Qbits[i].proba;
     
    }
    
    
   
    
  }
  
  
  
   //print("somme carre",somme_carre)
  //on normalise le nouveau Qbit 
   for (let i = 0; i <n_Qbits.length; i++) {
     if (nouveau_n_Qbits[i]!=undefined)
     if ((nouveau_n_Qbits[i].x!=0)||(nouveau_n_Qbits[i].y!=0))
    //if (nouveau_n_Qbits[i]!=0)
     //nouveau_n_Qbits[i]=nouveau_n_Qbits[i]/sqrt(somme_carre);
     
     nouveau_n_Qbits[i].coeff_complexe(nouveau_n_Qbits[i].x/sqrt(somme_carre),nouveau_n_Qbits[i].y/sqrt(somme_carre));
   }
  
 // print("ligne a modifier = ",index," bit a imposer=",BitMesure," nouveau nQbit=",nouveau_n_Qbits)
  
 return nouveau_n_Qbits;
  
  
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
  //applique une porte Operateur de diffusion de Grover au bit correspondantaux positions dans L_index et retourne un nouveau n_Qbits modifié
   // rappels :on a L_index= this.num_ligne = [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1]; //numero de la ligne quantique a laquelle apparait ce sommet
  
  // JE FAIS LES CALCULS CI DESSOUS de façon indépendante POUR LA PARTIE RELLE Et IMAGINAIRE
  // JE CALCUL DEUX MOYENNES
  
  
  //ex ici la porte s applique sur les deux premiers qbit et f(x) = 1 siX =3
  
 // |ψ⟩ =  + 0.25|0000⟩ - 0.25|0001⟩ + 0.25|0010⟩ - 0.25|0011⟩ + 0.25|0100⟩ - 0.25|0101⟩ - 0.25|0110⟩ + 0.25|0111⟩ + 0.25|1000⟩ - 0.25|1001⟩ + 0.25|1010⟩ - 0.25|1011⟩ + 0.25|1100⟩ - 0.25|1101⟩ + 0.25|1110⟩ - 0.25|1111⟩ 
  
  //1ere étape : 
 // on extrait les qbits qui ne passent pas par la porte, ici le dernier
  //|ψ⟩ =  ( + 0.25|000⟩  + 0.25|001⟩  + 0.25|010⟩  - 0.25|011⟩ + 0.25|100⟩  + 0.25|101⟩  + 0.25|110⟩  + 0.25|111⟩  )*|0> 
  //+ 
   // (  - 0.25|000⟩  - 0.25|001⟩  - 0.25|010⟩  + 0.25|011⟩  - 0.25|100⟩ - 0.25|101⟩  - 0.25|110⟩  - 0.25|111⟩ )*|1>
  
  //2eme etape
 // on calcule les moyennes correspondant à chaque factorisation
 // moyenne_0 = (0.25*7-0.25)/8 = 0.1875
  //moyenne_1  =(-0.25*7+0.25)/8 = -0.1875
    
  //3eme etape
  //pour chaque coeff du qbit on applique la formule : 2*moyenne - coeff,
   // ce qui inverse les valeurs par rapport a leur moyenne, on obtient
    //|ψ⟩ =  ( + 0.125|000⟩  + 0.125|001⟩  + 0.125|010⟩  + 0.625|011⟩ + 0.125|100⟩  + 0.125|101⟩  + 0.125|110⟩  + 0.125|111⟩  )*|0> 
 // + 
   // (  - 0.125|000⟩  - 0.125|001⟩  - 0.125|010⟩  - 0.125|011⟩  - 0.125|100⟩ - 0.125|101⟩  - 0.625|110⟩  - 0.125|111⟩ )*|1>
    
   // ce qui a augmenté relativement l amplitude des |110⟩ correspondant a f(3)

    // 1ere Etape 
    //on cree un masque pour trouver les qbits quine passent pas dans le grover
    
  //print("debut porte diffuseyur")
 // print("qbit",n_Qbits,"lindex=",L_index,"nbreqbits=",nbre_Qbits);
  
  
  let masque=0;
  let i=0;
  while  ((i<=14) &&(L_index[i]!=-1)){
    masque=masque+Math.pow(2,nbre_Qbits-1-L_index[i]);
    i=i+1;
  }
  // print("masque negatif=",masque)
  let n= Math.pow(2, nbre_Qbits)-1;

  masque = masque^n;
//  print("masque positif=",masque)
  
  //2eme etape on cree un dictionnaire de moyenne, dans lequel les clés seront les bits qui ne seront pas dans l 'état du qbits ( dans notre exemple |0> et |1>)'
    let moyenne_reel = {};//partie reelle
    let moyenne_img = {};//partie imaginaire
  
    for (let i = 0; i <n_Qbits.length; i++) {
       let Bits_en_dehors_porte=masque&i;
     // print("i=",i,"bits en dehors=",Bits_en_dehors_porte,"val=", n_Qbits[i])
      
      if (!moyenne_reel[Bits_en_dehors_porte]) {
    moyenne_reel[Bits_en_dehors_porte] = n_Qbits[i].x; // Initialiser 
  } else
    moyenne_reel[Bits_en_dehors_porte] = n_Qbits[i].x+moyenne_reel[Bits_en_dehors_porte];
      
    
  if (!moyenne_img[Bits_en_dehors_porte]) {
    moyenne_img[Bits_en_dehors_porte] = n_Qbits[i].y; // Initialiser 
  } else
    moyenne_img[Bits_en_dehors_porte] = n_Qbits[i].y+moyenne_img[Bits_en_dehors_porte];
      
    }
    
 
  
  //calcul du nbre d element dans chaque cle du dictionnaire
  let nbre_reel=n_Qbits.length/Object.keys(moyenne_reel).length;
    
 for (let key in moyenne_reel) {
  moyenne_reel[key] = moyenne_reel[key]/nbre_reel; //on calcul la moyenne pour chaque etat
}
 let nbre_img=n_Qbits.length/Object.keys(moyenne_img).length;
    
 for (let key in moyenne_img) {
  moyenne_img[key] = moyenne_img[key]/nbre_img; //on calcul la moyenne pour chaque etat
}



//print("moyenne",moyenne)
  //3eme etape
  //application de la formule 2⟨ψ|ψ⟩-I pour chaque etat du dictionnaire : 2* moyenne - valeur du ceff
 // on cree le nouveau n_Qbit ou on multuplie le rapport avec la nouvelle amplitude
 
  let nouveau_n_Qbits=[];
  let norme=0;
  for (let i = 0; i <n_Qbits.length; i++) { 
    let Bits_en_dehors_porte=masque&i;
    let calcul_reel=2*moyenne_reel[Bits_en_dehors_porte]-n_Qbits[i].x;
    let calcul_img=2*moyenne_img[Bits_en_dehors_porte]-n_Qbits[i].y;
        
        
   
    
    nouveau_n_Qbits.push(new complexe(calcul_reel,calcul_img));
    //norme=norme+calcul*calcul;
    norme=norme+nouveau_n_Qbits[nouveau_n_Qbits.length-1].proba;
    
    
  
    
  }
// print("nouveau qbit",nouveau_n_Qbits)
 //print("norme au carré",norme)
  
  let nm=round(norme,3);
  if (nm!=1)
  for (let i = 0; i <n_Qbits.length; i++) { 
    //nouveau_n_Qbits[i]=nouveau_n_Qbits[i]/(sqrt(norme));
    nouveau_n_Qbits[i].coeff_complexe(nouveau_n_Qbits[i].x/sqrt(norme),nouveau_n_Qbits[i].y/sqrt(norme));
    
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
  
 
  
  //L_code code donné par les (n-nbre_registre2) premiers bits d entrées de l oracle
  //ici on isole la chaine de caractere
  let Liste_etats=[];
  for (let i = 0; i <n_Qbits.length; i++) {
    
    
  
    let etat=convertit_nombreDecimal_En_StringNombre_binaire(i,nbre_Qbits);
    Liste_etats.push(etat);
  }
  
  let L_etats_premier_registre=extrait_bits_particuliers_qui_sont_a_position(Liste_etats,L_pos);
  let L_etats_deuxieme_registre=extrait_bits_particuliers_qui_sont_a_position(Liste_etats,num_lignes_quantiques_registre2);
 let L_code=L_etats_premier_registre.slice()
 
 
 
 //print("etats du 1er registre",L_etats_premier_registre);

  
 //let Lbubug=L_code.slice();
 // print("L_code1",Lbubug)
//  Lbubug=L_etats_deuxieme_registre.slice();
//  print("L_etats deuxieme registre",Lbubug)
  
 // print("foracle",f_oracle)
  //cree le nouveau n_Qbit de même taille initailsé à -1
 
 let nouveau_n_Qbits=new Array(n_Qbits.length);
 
  //let nouveau_n_Qbits=[];
  for (let i = 0; i <n_Qbits.length; i++) { 
   
   // nouveau_n_Qbits.push(new complexe(0,0));
    
    L_code[i]=convertit_StringNombre_binaire_En_nombreDecimal(L_code[i]);
    
    L_code[i]=f_oracle[L_code[i]];
    L_etats_deuxieme_registre[i]=convertit_StringNombre_binaire_En_nombreDecimal(L_etats_deuxieme_registre[i]);
    
  }
  
  
  
 // print("etats du 2er registre",L_etats_deuxieme_registre);
//print("lcode=",L_code);
//return n_Qbits
  
  //print("   ")
 // Lbubug=L_code.slice();
  //print("L_code2",Lbubug)
  //Lbubug=L_etats_deuxieme_registre.slice();
 // print("L_etats deuxieme registre2",Lbubug)
  
 // print("L_code2",L_code)
  //on parcourt chaque etat du n_qbit
  for (let i = 0; i <n_Qbits.length; i++) {
    
    
    let numero_etat;
    
       if ((Liste_controle)&&(cette_porte_est_desactive_par_un_controle(i,Liste_controle,nbre_Qbits))){
      //if ((Liste_controle)&&(cette_porte_est_desactive_par_un_controle(Liste_etats[i],Liste_controle))) {
      numero_etat=i;
     }
    
    else { //pas controlée
      
      //calcul des valeurs des  lignes d oracle qui doivent etre calculées
      
      // Étape 1 : Calculer le XOR de n1 et n2
       const xorResult = L_code[i] ^ L_etats_deuxieme_registre[i];
      
      
     // if (L_etats_deuxieme_registre[i]==0)//if (i<=15)
      //print("x=",L_etats_premier_registre[i],"resultat f(x)=",xorResult);

       // Étape 2 : Convertir le résultat en binaire
        let binaryString = xorResult.toString(2);

  // Étape 3 : Compléter avec des zéros non significatifs pour atteindre n bits
      if (binaryString.length != nbre_registre2)
        {
              if (binaryString.length < nbre_registre2){
                while (binaryString.length < nbre_registre2) {
                      binaryString = "0" + binaryString;
                  }
              }else{ //on enleve
                binaryString=binaryString.slice(0, -(binaryString.length - nbre_registre2));
               // print("nouvelle taille",binaryString)
              }
       
      
          
        }
      
      
      //let etat=Liste_etats[i];//convertit_nombreDecimal_En_StringNombre_binaire(i,nbre_Qbits);
  
   
      
      let etat="";
      //si oracle commence pas a la ligne 0 on ajoute le debut de l etat
      if (indice_debut_oracle!=0) etat = Liste_etats[i].slice(0, indice_debut_oracle);
      
      
      
      
      etat=etat+L_etats_premier_registre[i]+binaryString;
      //si oracle finit pas a la dernière ligne on ajoute la fin de l etat
      if (indice_fin_oracle!= nbre_Qbits-1 ) etat=etat+Liste_etats[i].slice(indice_fin_oracle+1);
      
       //attention : ici etat peut valoir 4 alors qu on n en selectionnera que 3
     // if (L_etats_deuxieme_registre[i]==0)//if (i<=15)
     // print("i=",i,"binary=",binaryString," etat=",etat,"longueur max registre 2",nbre_registre2)
      numero_etat=convertit_StringNombre_binaire_En_nombreDecimal(etat);//trouve son numero dans le nouveau n_qbit
      /*
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
      */
     
      
      
       
    }
    
    //print(i,"etat",etat)
    
    
   // print("le nouveau Qbit",etat,numero_etat," est egale au vieux Qbit",i, "qui a pour valeur",n_Qbits[i])
    
    //fait la correspondance en echangeant les amplitudes
    
    
    //nouveau_n_Qbits[numero_etat].coeff_complexe(n_Qbits[i].x,n_Qbits[i].y);
    
    
    nouveau_n_Qbits[numero_etat]= new complexe(n_Qbits[i].x,n_Qbits[i].y);
    
    
 //
    
  }
  
 // print("fin oracle",nouveau_n_Qbits,n_Qbits)
  
  return nouveau_n_Qbits;
  
}


function applique_Porte_Transformee_Fourier(n_Qbits,L_index,nbre_Qbits,inverse=false){
  //applique une porte Transformee de Fourier aux bits correspondant aux positions dans L_index et retourne un nouveau n_Qbits modifié
   // rappels :on a L_index= this.num_ligne = [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1]; //numero de la ligne quantique a laquelle apparait ce sommet
  
  
  
  //ex ici la porte s applique sur les deux premiers qbit et f(x) = 1 siX =3
  
 // |ψ⟩ =  + 0.25|0000⟩ - 0.25|0001⟩ + 0.25|0010⟩ - 0.25|0011⟩ + 0.25|0100⟩ - 0.25|0101⟩ - 0.25|0110⟩ + 0.25|0111⟩ + 0.25|1000⟩ - 0.25|1001⟩ + 0.25|1010⟩ - 0.25|1011⟩ + 0.25|1100⟩ - 0.25|1101⟩ + 0.25|1110⟩ - 0.25|1111⟩ 
  
  //1ere étape : 
 // on extrait les qbits qui ne passent pas par la porte, ici le dernier
  //|ψ⟩ =  ( + 0.25|000⟩  + 0.25|001⟩  + 0.25|010⟩  - 0.25|011⟩ + 0.25|100⟩  + 0.25|101⟩  + 0.25|110⟩  + 0.25|111⟩  )*|0> 
  //+ 
   // (  - 0.25|000⟩  - 0.25|001⟩  - 0.25|010⟩  + 0.25|011⟩  - 0.25|100⟩ - 0.25|101⟩  - 0.25|110⟩  - 0.25|111⟩ )*|1>
  
  
 
  
  
  
  
  let masque=0;
  let i=0;
  while  ((i<=14) &&(L_index[i]!=-1)){
    masque=masque+Math.pow(2,nbre_Qbits-1-L_index[i]);
    i=i+1;
  }
   //print("masque negatif=",masque)
  let n= Math.pow(2, nbre_Qbits)-1;

  masque = masque^n;
 // print("masque positif=",masque)
  
  //2eme etape on cree un dictionnaire de nQbits, dans lequel les clés seront les bits qui ne seront pas dans l 'état du qbits ( dans notre exemple |0> et |1>)
  // les valeurs seront une liste dont
 // - le 1er element est la liste des indices dans le qbit de depart
  // - le 2e element est la liste des coeffs du nqbit qui entre dans la porte F
  // Dico_de_n_Qbits[Bits_en_dehors_porte] =[[i,....] , [n_Qbits[i],....]];
   
    let Dico_de_n_Qbits = {};
    
  
    for (let i = 0; i <n_Qbits.length; i++) {
       let Bits_en_dehors_porte=masque&i;
     // print("i=",i,"bits en dehors=",Bits_en_dehors_porte,"val=", n_Qbits[i])
      
      if ((Bits_en_dehors_porte in Dico_de_n_Qbits)==false){
      
      //if (!Dico_de_n_Qbits[Bits_en_dehors_porte]) {
    Dico_de_n_Qbits[Bits_en_dehors_porte] =[[i] , [n_Qbits[i]]]; // Initialiser 
  } else{
      Dico_de_n_Qbits[Bits_en_dehors_porte][0].push(i);
      Dico_de_n_Qbits[Bits_en_dehors_porte][1].push(n_Qbits[i]);
  }
     
      
    }
    
 //
  /*
  for (let key in Dico_de_n_Qbits){
    
    let liste_indices=Dico_de_n_Qbits[key][0];
    let Qbit_qui_sort_de_fourier=Dico_de_n_Qbits[key][1];
    print("dico clé=",key,"  liste indices=",liste_indices)
    print("dico clé=",key,"  qbit quientre=",Qbit_qui_sort_de_fourier)
    print("  ")
    
  }
  */
  
  //print("nqbit",n_Qbits)
  //return n_Qbits;
  
 //3e etape //on applique la transformee de fourier sur les nqbits de ce dictionnaire
  
  for (let key in Dico_de_n_Qbits){
    
    let Qbit_qui_entre_dans_fourier=Dico_de_n_Qbits[key][1];
    Dico_de_n_Qbits[key][1]=Fourier(Qbit_qui_entre_dans_fourier,inverse);
  }
  /*
  print("apres")
for (let key in Dico_de_n_Qbits){
    
    let liste_indices=Dico_de_n_Qbits[key][0];
    let Qbit_qui_sort_de_fourier=Dico_de_n_Qbits[key][1];
    print("dico clé=",key,"  liste indices=",liste_indices)
    print("dico clé=",key,"  qbit quientre=",Qbit_qui_sort_de_fourier)
    print("  ")
    
  }
  */


  //4eme etape
  
 // on recree le nouveau n_Qbit 
 
 
  /*
  let nouveau_n_Qbits=[];
  for (let i = 0; i <n_Qbits.length; i++) { 
    
     nouveau_n_Qbits.push("");
  }
  */
  
  let nouveau_n_Qbits=new Array(n_Qbits.length);
  
  
   for (let key in Dico_de_n_Qbits){
    let liste_indices=Dico_de_n_Qbits[key][0];
    let Qbit_qui_sort_de_fourier=Dico_de_n_Qbits[key][1];
     
     for (let i = 0; i <liste_indices.length; i++) { 
       
       nouveau_n_Qbits[liste_indices[i]]=Qbit_qui_sort_de_fourier[i];
       
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
  
  let nouveau_n_Qbits=[];
  let cst=2*Math.PI/N;
  
 
  
  if (inverse==true) cst=-1*cst;
  
 // print("cst=",cst)
  
  let liste_des_n_pas_nuls=[];
  
  for (let k = 0; k <N; k++){
    
    
     
    
     let  y_k_x=0;//partie reelle de y_k
     let  y_k_y=0;//partie imaginaire de y_k
      
     
    
     if (k!=0){
       
       for (let i = 0; i <liste_des_n_pas_nuls.length; i++) { 
       
       let n= liste_des_n_pas_nuls[i];
       
       let x_n=n_Qbits[n];
       
       
       
       
       
       let alpha=cst*k*n;
       
       let w_N_kn_x=Math.cos(alpha);//partie relle de W_N_kn
       let w_N_kn_y=Math.sin(alpha);//partie imaginaire de W_N_kn
       
       //yk = yk + xn*w_N_kn en tenant compte des complexes dont i*i = -1
       
        
         // print("pour k=",k,"pour n",n, "coefx=",x_n.x*w_N_kn_x - x_n.y*w_N_kn_y," coefy=",x_n.x*w_N_kn_y + x_n.y*w_N_kn_x)
        if (x_n.y==0){
          
           y_k_x=y_k_x + x_n.x*w_N_kn_x ;
           y_k_y=y_k_y + x_n.x*w_N_kn_y ;
        }else
        if (x_n.x==0){
             y_k_x=y_k_x  - x_n.y*w_N_kn_y;
             y_k_y=y_k_y  + x_n.y*w_N_kn_x;
          
        }else{
           y_k_x=y_k_x + x_n.x*w_N_kn_x - x_n.y*w_N_kn_y;
           y_k_y=y_k_y + x_n.x*w_N_kn_y + x_n.y*w_N_kn_x;
        }
       
       
       
    
  
      } //fin de boucle n
       
       
     }
    
   
     else//pour k= 0 on calcule apres on regarde seulement les valeurs de n pas nuls
     for (let n = 0; n <N; n++) 
     if ((n_Qbits[n].x!=0)||(n_Qbits[n].y!=0)){ //tester si = 0 gagne bcp de temps
       
       liste_des_n_pas_nuls.push(n);
       
       let x_n=n_Qbits[n];
       
       
       
       
       
       let alpha=cst*k*n;
       
       let w_N_kn_x=Math.cos(alpha);//partie relle de W_N_kn
       let w_N_kn_y=Math.sin(alpha);//partie imaginaire de W_N_kn
       
       //yk = yk + xn*w_N_kn en tenant compte des complexes dont i*i = -1
       
        
         // print("pour k=",k,"pour n",n, "coefx=",x_n.x*w_N_kn_x - x_n.y*w_N_kn_y," coefy=",x_n.x*w_N_kn_y + x_n.y*w_N_kn_x)
        if (x_n.y==0){
          
           y_k_x=y_k_x + x_n.x*w_N_kn_x ;
           y_k_y=y_k_y + x_n.x*w_N_kn_y ;
        }else
        if (x_n.x==0){
             y_k_x=y_k_x  - x_n.y*w_N_kn_y;
             y_k_y=y_k_y  + x_n.y*w_N_kn_x;
          
        }else{
           y_k_x=y_k_x + x_n.x*w_N_kn_x - x_n.y*w_N_kn_y;
           y_k_y=y_k_y + x_n.x*w_N_kn_y + x_n.y*w_N_kn_x;
        }
       
       
       
    
  
      } //fin de boucle n
    
      if (liste_des_n_pas_nuls.length==0) {
        
        return n_Qbits;//pas de changement , inutile de continuer
      }
    
      y_k_x=y_k_x/(racine_N);
      y_k_y=y_k_y/(racine_N);
    
      let yk= new complexe(y_k_x,y_k_y);
      nouveau_n_Qbits.push(yk);
    
   }//fin de boucle k
  
  
 
  return nouveau_n_Qbits;
  
}



function applique_Porte_Racine_X(n_Qbits,L_index,nbre_Qbits,L_aretes_controle){
  
  let matrice = [];
  let dim=2;

  for (let i = 0; i < dim; i++) {
    // Créer un tableau de taille n rempli de zéros
    matrice[i] = new Array(dim).fill(0);
  }
 
  //matrice racine X
  matrice[0][0]=new complexe(1,1);
  matrice[0][1]=new complexe(1,-1);
  matrice[1][0]=new complexe(1,-1);
  matrice[1][1]=new complexe(1,1);
  
 
  
  
  return applique_Porte_Universelle(n_Qbits,L_index,nbre_Qbits,matrice,L_aretes_controle);
  
}  
  
 
function applique_Porte_Racine_SWAP(n_Qbits,L_index,nbre_Qbits,L_aretes_controle){
  
  let matrice = [];
  let dim=4;

  for (let i = 0; i < dim; i++) {
    // Créer un tableau de taille n rempli de zéros
    matrice[i] = new Array(dim).fill(0);
  }
 
  //matrice racine swap
  matrice[0][0]=new complexe(1,0);
  matrice[0][1]=new complexe(0,0);
  matrice[0][2]=new complexe(0,0);
  matrice[0][3]=new complexe(0,0);
  
  matrice[1][0]=new complexe(0,0);
  matrice[1][1]=new complexe(0.5,0.5);
  matrice[1][2]=new complexe(0.5,-0.5);
  matrice[1][3]=new complexe(0,0);
  
  matrice[2][0]=new complexe(0,0);
  matrice[2][1]=new complexe(0.5,-0.5);
  matrice[2][2]=new complexe(0.5,0.5);
  matrice[2][3]=new complexe(0,0);
  
  matrice[3][0]=new complexe(0,0);
  matrice[3][1]=new complexe(0,0);
  matrice[3][2]=new complexe(0,0);
  matrice[3][3]=new complexe(0,1);
  
  
  return applique_Porte_Universelle(n_Qbits,L_index,nbre_Qbits,matrice,L_aretes_controle);
  
}  
    
    
    

function applique_Porte_Universelle(n_Qbits,L_index,nbre_Qbits,matrice=undefined,L_aretes_controle){
  //applique une matrice aux bits correspondant aux positions dans L_index et retourne un nouveau n_Qbits modifié
   // rappels :on a L_index= this.num_ligne = [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1]; //numero de la ligne quantique a laquelle apparait ce sommet
  
  
  
  //ex ici la porte s applique sur les deux premiers qbit et f(x) = 1 siX =3
  
 // |ψ⟩ =  + 0.25|0000⟩ - 0.25|0001⟩ + 0.25|0010⟩ - 0.25|0011⟩ + 0.25|0100⟩ - 0.25|0101⟩ - 0.25|0110⟩ + 0.25|0111⟩ + 0.25|1000⟩ - 0.25|1001⟩ + 0.25|1010⟩ - 0.25|1011⟩ + 0.25|1100⟩ - 0.25|1101⟩ + 0.25|1110⟩ - 0.25|1111⟩ 
  
  //1ere étape : 
 // on extrait les qbits qui ne passent pas par la porte, ici le dernier
  //|ψ⟩ =  ( + 0.25|000⟩  + 0.25|001⟩  + 0.25|010⟩  - 0.25|011⟩ + 0.25|100⟩  + 0.25|101⟩  + 0.25|110⟩  + 0.25|111⟩  )*|0> 
  //+ 
   // (  - 0.25|000⟩  - 0.25|001⟩  - 0.25|010⟩  + 0.25|011⟩  - 0.25|100⟩ - 0.25|101⟩  - 0.25|110⟩  - 0.25|111⟩ )*|1>
  
  
 
  
  
  
   //Liste_controle=[[type_control1,num_bit_control1],[type_control2,num_bit_control2]] //renvoie la liste des controles sur la porte en indiquantb leur type (16 ou 17) et le numero de la ligne quntiqUE OU SEN TROUVE LE CONTROLE
  let Liste_controle=calcul_Liste_controle(L_aretes_controle);  
  
  
  let masque=0;
  let i=0;
  while  ((i<=14) &&(L_index[i]!=-1)){
    masque=masque+Math.pow(2,nbre_Qbits-1-L_index[i]);
    i=i+1;
  }
   //print("masque negatif=",masque)
  let n= Math.pow(2, nbre_Qbits)-1;

  masque = masque^n;
 // print("masque positif=",masque)
  
  //2eme etape on cree un dictionnaire de nQbits, dans lequel les clés seront les bits qui ne seront pas dans l 'état du qbits ( dans notre exemple |0> et |1>)
  // les valeurs seront une liste dont
 // - le 1er element est la liste des indices dans le qbit de depart
  // - le 2e element est la liste des coeffs du nqbit qui entre dans la porte
  // Dico_de_n_Qbits[Bits_en_dehors_porte] =[[i,....] , [n_Qbits[i],....]];
   
    let Dico_de_n_Qbits = {};
  let nouveau_n_Qbits=new Array(n_Qbits.length);
    //

  
    for (let i = 0; i <n_Qbits.length; i++) 
    
    if ((Liste_controle)&&(cette_porte_est_desactive_par_un_controle(i,Liste_controle,nbre_Qbits)))     {//etat controlé on copie nouveau qbits simplement
      nouveau_n_Qbits[ i]=new complexe(n_Qbits[i].x,n_Qbits[i].y);
      
    }
    
    else //etat pas controlé
    
    
    {
       let Bits_en_dehors_porte=masque&i;
     // print("i=",i,"bits en dehors=",Bits_en_dehors_porte,"val=", n_Qbits[i])
      
      if ((Bits_en_dehors_porte in Dico_de_n_Qbits)==false){
      
      //if (!Dico_de_n_Qbits[Bits_en_dehors_porte]) {
    Dico_de_n_Qbits[Bits_en_dehors_porte] =[[i] , [n_Qbits[i]]]; // Initialiser 
  } else{
      Dico_de_n_Qbits[Bits_en_dehors_porte][0].push(i);
      Dico_de_n_Qbits[Bits_en_dehors_porte][1].push(n_Qbits[i]);
  }
     
      
    }
    
 //
  
  
  
  
 //3e etape //on applique la matrice sur les nqbits de ce dictionnaire
  
  for (let key in Dico_de_n_Qbits){
    
    let Qbit_qui_entre_dans_matrice=Dico_de_n_Qbits[key][1];
    Dico_de_n_Qbits[key][1]=applique_matrice( Qbit_qui_entre_dans_matrice,matrice);
  }
  


  //4eme etape
  
 // on recree le nouveau n_Qbit 
 
 
  
  
  
  
  let somme_carre=0;
  
  
   for (let key in Dico_de_n_Qbits){
    let liste_indices=Dico_de_n_Qbits[key][0];
    let  Qbit_qui_sort_de_matrice=Dico_de_n_Qbits[key][1];
     
     for (let i = 0; i <liste_indices.length; i++) { 
       
       nouveau_n_Qbits[liste_indices[i]]=Qbit_qui_sort_de_matrice[i];
       
       somme_carre=somme_carre+nouveau_n_Qbits[liste_indices[i]].proba;
       
     }
     
     
    
  }
  
 
    
 //il faut le normaliser deja fait normalement
  
  for (let i = 0; i <nouveau_n_Qbits.length; i++) {
     if ((nouveau_n_Qbits[i].x!=0)||(nouveau_n_Qbits[i].y!=0))
    nouveau_n_Qbits[i].coeff_complexe(nouveau_n_Qbits[i].x/sqrt(somme_carre),nouveau_n_Qbits[i].y/sqrt(somme_carre));
   }
  
  
  
  return nouveau_n_Qbits;
  
}



//on suppose que la matrice s'applique sur l'ENSEMBLE du nQbits.
//sur le vecteur (x0,x1,x2....xn-1) et retourne le vecteur  (y0,y1,y2....yn-1)
//la matrice est une matrice carré nxn et ressort un vecteur 
function applique_matrice(n_Qbits,matrice){
    // Assurez-vous que M est une matrice carrée et que A est un vecteur de dimension appropriée
    const n = matrice.length; // Nombre de lignes (et de colonnes) de la matrice
    if (n_Qbits.length !== n) {
        print("bug La dimension du vecteur A doit être égale à celle de la matrice M");
       return undefined;
    }
  
  
  

    // Initialisation du vecteur de sortie nouveau_n_Qbits
    //let nouveau_n_Qbits = new Array(n).fill(new complexe(0,0));//attention c est le même complexe 0,0 pour tout le vecteur, cela ne marche pas, il faut faire comme en dessous
  let nouveau_n_Qbits =[];
  for (let i = 0; i < n; i++) nouveau_n_Qbits.push(new complexe(0,0));
  
    let somme_carre_initial=0;//la matrice ne doit pas changer la norme du nqbit, qui n est pas forcemment 1 car on a decomposé le nqbit inital ! il faut conserve rla valeur
    let somme_carre=0;

    // Calcul de nouveau_n_Qbits = M * (n_Qbits
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) 
          if ((n_Qbits[j].x!=0)||(n_Qbits[j].y!=0))
           if ((matrice[i][j].x!=0)||(matrice[i][j].y!=0)) //tester si = 0 gagne bcp de temps
       
           
        
        {
            nouveau_n_Qbits[i] = nouveau_n_Qbits[i].add( n_Qbits[j].mul(matrice[i][j]));
            if (j==n-1){
                       somme_carre=somme_carre+nouveau_n_Qbits[i].proba;
                       somme_carre_initial=somme_carre_initial+n_Qbits[i].proba;
                       }          
          
        }
    }
  
  
  
  
  
  
  
  
     print("sommecarre",somme_carre,"   ",somme_carre_initial)
   
  
  //on renormalise le nouveau Qbit a son ancienne valeur
  if (somme_carre!=somme_carre_initial){
   // print("je renormalise a l ancienne valeur",somme_carre,"   ",somme_carre_initial);
    let rapport=sqrt(somme_carre_initial/somme_carre);
   for (let i = 0; i <nouveau_n_Qbits.length; i++) {
     if ((nouveau_n_Qbits[i].x!=0)||(nouveau_n_Qbits[i].y!=0))
                nouveau_n_Qbits[i]=new complexe(nouveau_n_Qbits[i].x*rapport,nouveau_n_Qbits[i].y*rapport);
     
              //print("rapport",rapport,"nouveau",nouveau_n_Qbits[i])
   }
  }
  

    return nouveau_n_Qbits;
}






  


