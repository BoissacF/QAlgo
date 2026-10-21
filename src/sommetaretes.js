/* QAlgo — classes Sommet (qubit, porte, mesure) et Arete (fil, fil de contrôle)
 *
 * Simulateur de circuits quantiques pour l'enseignement — https://www.qalgo.org
 * Code source : https://github.com/BoissacF/QAlgo
 *
 * Copyright (C) 2025-2026 Frédéric Boissac
 * Logiciel libre sous licence GNU AGPL version 3 ou ultérieure ;
 * voir le fichier LICENSE à la racine du dépôt.
 */
//INTERFACE DE SOMMETS
/*


 //a partir de (x+yi)|0>+(z+wi)|1> calcul this.Qbit[n][coeff1,ceoff2,P0,P1]
  calcul_coeff_Qbit(x,y,z,w,n){


//pour avoir lindice dans arete entrante ou sortante qui correspond a ce num de ligne quantique
  indice_dune_ligne(num_ligne){

calcul_Rayon(){
    
changeDiametre(d) {

 changePositionRayon(x, y,creation_Sommet=false) {

choisis_couleurQbit(n) {

//Methode affiche coefficients du QQBIT
  affiche_coefficients_du_Qbit() {
  
affiche_pourcentage() {

afficheSommet() {

testToucheSommet(a, b) {

*/
// Arete class
class Arete {
  constructor(numSommetDepart, numSommetArrive, xA, yA, xB, yB) {
    this.numSommetDepart = numSommetDepart; //num du noeud de depart
    this.numSommetArrive = numSommetArrive; //num du noeud d arrivé

    this.couleur = couleur_default_arete; //couleur_Contours; //noir par defaut
    this.epaisseur = epaisseur_default_arete; //epaisseur_Contours;

    this.numero_ligne_quantique=-1;///mis a jour perpetuellement dans retourne_liste_lignes_quantiques(C)
    this.modifieCoordonnees( xA, yA, xB, yB);
    
    //this.suiv=undefined;//arete suivante sur la même ligne
    //this.prec=undefined;//arete precedente sur la même ligne
    
    
  }
  /*
  ajoute_suiv(ar){
    this.suiv=ar;
    ar.prec=this;
  }
  suppr_suiv(){
    if (this.suiv!=undefined){
      this.suiv.prec=undefined;
      this.suiv=undefined;
    }
    
  }
  ajoute_prec(ar){
    this.prec=ar;
    ar.suiv=this;
  }
  suppr_prec(){
     if (this.prec!=undefined){
      this.prec.suiv=undefined;
      this.prec=undefined;
    }
  }*/
  modifieCoordonnees( xA, yA, xB, yB){
    //coordonnées point de depart et d arrivée de l arete ( compliqué car depend de la porte logique)
    this.xA = xA;
    this.yA = yA;
    

    this.xB = xB;
    this.yB = yB;

    this.xfleche = this.xB / 2 + this.xA / 2;
    this.yfleche = this.yB / 2 + this.yA / 2;
  }
}

// Sommet class nbre_qbits_max=16 QBITS AU MAXIMUM
class Sommet {
  constructor(numeroSommet, x, y, d,type) {
    //typeSelectionne; //  0:+|0> ; 1:+|1> ; 2:+0.707|0> + 0.707|1> ; 3 porte X ; 4:porte Z ; 5:porte H

    //pour 0,1,2,22 ce sont des Qbits on les mets tous à this.type=0;on se sert juste d e1 et 2 pour l initialisation
    
    //ATTRIBUTS A ENREGISTRER
    
    
    
    if (type <= 2 || type== 22) this.type = 0;
    else this.type = type;

    this.x = x;
    this.y = y;
    
    this.diametre=d;
    this.couleur = couleur_default_sommet;
    this.numeroSommet = numeroSommet; //son nulero d entrée ds la liste du graphe est son numero d identification
    
    //ON SUPPOSERA QU ON PEUT GERER  16  QBITS !
    
    
    this.num_ligne = [-1]; //numero de la ligne quantique a laquelle apparait ce sommet,c est une liste car ce peut etre une porte a plusieurs entrées, hormi le qbit d entrée, le nbre de lignes quantique correspond au nombre d aretes entrantes
    //c est calculé dans outils/retourne_liste_lignes_quantiques(
  //  print(this.num_ligne[0])
    
    
    
    this.nAretes_sortantes = 0; //nbres d aretes effectives (celles qui sont effacées sont ds la liste) qui partent de ce noeud
    
     this.aretes_sortantes = []; //liste des aretes qui partent de ce noeud, on mets les objets aretes qui contiennent lesnuméros des noeuds (sommets) liés à ce sommet

    
     this.nAretes_entrantes = 0; //nbres d aretes effectives (celles qui sont effacées sont ds la liste) qui entrent dans ce noeud

    
    this.aretes_entrantes = []; //liste des aretes qui entrent dans ce noeud, on mets les objets aretes qui contiennent lesnuméros des noeuds (sommets) liés à ce sommet
  
    
    this.nAretes_controle = 0; //nbres d aretes de controle (entree ou sortie sir c est un controle)
    
    this.aretes_controle = []; //liste des aretes de controle liés à ce sommet. Si c est un controle arete sortante sinon entrantes

    this.accepte_controle=true;//on peut faire un controle sur cette porte

    
    this.Coeff_hauteur=0;//pour changer la hauteur d un qbit , par exoracle
    //AUTRES ATTRIBUTS
    this.calcul_Rayon();
    
    
    
    
    
    this.texte = undefined; //permet d ajouter un label au sommet
    
    //this.multiple=[numero_ligne_quantique,mesure,indiceQbit_affiche_ou_mesure ]
    
    this.visit=false;//sert lors des parcours, ici pour ordonner les portes...
    this.mesure=[false];//initialise les mesures,c est une liste car ce peut etre une porte a plusieurs entrées
    this.val_instant_mesure = [0]; //c est l indice du Qbit affiché ou du Qbit si on le mesure c est une liste car ce peut etre une porte a plusieurs entrées
    
    this.Qbit =[[new complexe(1,0),new complexe(0,0),1,0]];// ce sont les deux coeff complexes //(x+yi)|0> + (c+di)|1> et les deux probas P0 et P1
    
    
    
    
    
    // [[1, 0, 1, 0],[1, 0, 1, 0],[1, 0, 1, 0],[1, 0, 1, 0],[1, 0, 1, 0],[1, 0, 1, 0],[1, 0, 1, 0],[1, 0, 1, 0],[1, 0, 1, 0],[1, 0, 1, 0],[1, 0, 1, 0],[1, 0, 1, 0],[1, 0, 1, 0],[1, 0, 1, 0],[1, 0, 1, 0]]; //qbit= a.|0>+b|1> , c est les coeffs a et b du Qbit et apres c est les probas donc a et b au carré,le Qbit etant normalisé on doit avoir this.a*this.a+this.b.this.b = 1,c est une liste car ce peut etre une porte a plusieurs entrées
 

   
 
    this.ancienne_proba=undefined;//reserve aux portes 64 et 65 pour memoriser leur valeur de proba avant mesure partielle afin de pouvoir les remettre
    
   
    this.entrantes_possible=false;//peut avoir ou pas  une arete entrante
    this.sortantes_possible=false;//peut avoir ou pas  une arete sortante
    
    this.porte_multiple=false;//porte qui a plusieurs entrees et plusieurs sortiescomme oracle
    
    this.f_oracle=undefined;
    this.phase_nombre=undefined;// phase en radian de certaines portes ou nombre (comme pour l oracle, nombre de qbits du 2e registre)
    this.texte_indice=undefined;
    this.texte_annexe="";
    this.matrice=undefined;
    this.nAretes_max=-1;//sert lorsque c est une porte générée par une matrice ou si y a une limite comme swap
    
    this.nAretes_min=1;//sert lorsque c est une porte générée par une matrice ou si y a une limite comme swap
    
    switch (type) {
      case 0: //+|0>
        //this.Qbit[0] = [1, 0, 1, 0];
        this.Qbit[0][0].coeff_complexe(1,0);this.Qbit[0][2]=this.Qbit[0][0].proba;
        this.Qbit[0][1].coeff_complexe(0,0);this.Qbit[0][3]=this.Qbit[0][1].proba;
        this.sortantes_possible=true;//peut avoir ou pas  une arete sortante
    
        break;
      case 1: //+|1>
        //this.Qbit[0] = [0, 1, 0, 1];
        this.Qbit[0][0].coeff_complexe(0,0);this.Qbit[0][2]=this.Qbit[0][0].proba;
        this.Qbit[0][1].coeff_complexe(1,0);this.Qbit[0][3]=this.Qbit[0][1].proba;
        this.sortantes_possible=true;//peut avoir ou pas  une arete sortante
        break;

      case 2: //+0.707|0> + 0.707|1>
       // this.Qbit[0] = [1 / sqrt(2), 1 / sqrt(2), 0.5, 0.5];
        this.Qbit[0][0].coeff_complexe(1 / sqrt(2),0);this.Qbit[0][2]=this.Qbit[0][0].proba;
        this.Qbit[0][1].coeff_complexe(1 / sqrt(2),0);this.Qbit[0][3]=this.Qbit[0][1].proba;
        this.sortantes_possible=true;//peut avoir ou pas  une arete sortante
    
        break;
      case 22: //+0.707|0> - 0.707|1>
        //this.Qbit[0] = [1 / sqrt(2), -1 / sqrt(2), 0.5, 0.5];
        this.Qbit[0][0].coeff_complexe(1 / sqrt(2),0);this.Qbit[0][2]=this.Qbit[0][0].proba;
        this.Qbit[0][1].coeff_complexe(-1 / sqrt(2),0);this.Qbit[0][3]=this.Qbit[0][1].proba;
        this.sortantes_possible=true;//peut avoir ou pas  une arete sortante
        break;
      case 3: //porte X
        //this.Qbit[0] = [undefined, undefined, undefined, undefined];
        this.Qbit[0][0].coeff_complexe(undefined);this.Qbit[0][2]=this.Qbit[0][0].proba;
        this.Qbit[0][1].coeff_complexe(undefined);this.Qbit[0][3]=this.Qbit[0][1].proba;
        this.texte = "X";
        this.entrantes_possible=true;//peut avoir ou pas  une arete entrante
        this.sortantes_possible=true;

        break;
        
        

      case 4: //porte Z
        //this.Qbit[0] = [undefined, undefined, undefined, undefined];
        this.Qbit[0][0].coeff_complexe(undefined);this.Qbit[0][2]=this.Qbit[0][0].proba;
        this.Qbit[0][1].coeff_complexe(undefined);this.Qbit[0][3]=this.Qbit[0][1].proba;
        this.texte = "Z";
        this.entrantes_possible=true;//peut avoir ou pas  une arete entrante
        this.sortantes_possible=true;
        break;
      case 5: //porte H
        //this.Qbit[0] = [undefined, undefined, undefined, undefined];
        this.Qbit[0][0].coeff_complexe(undefined);this.Qbit[0][2]=this.Qbit[0][0].proba;
        this.Qbit[0][1].coeff_complexe(undefined);this.Qbit[0][3]=this.Qbit[0][1].proba;
        this.texte = "H";
        this.entrantes_possible=true;//peut avoir ou pas  une arete entrante
        this.sortantes_possible=true;
        break;
        
        case 6: //porte Y
        //this.Qbit[0] = [undefined, undefined, undefined, undefined];
        this.Qbit[0][0].coeff_complexe(undefined);this.Qbit[0][2]=this.Qbit[0][0].proba;
        this.Qbit[0][1].coeff_complexe(undefined);this.Qbit[0][3]=this.Qbit[0][1].proba;
        this.texte = "Y";
        this.entrantes_possible=true;//peut avoir ou pas  une arete entrante
        this.sortantes_possible=true;

        break;
        
         case 7: //porte R_phi
        this.Qbit[0][0].coeff_complexe(undefined);this.Qbit[0][2]=this.Qbit[0][0].proba;
        this.Qbit[0][1].coeff_complexe(undefined);this.Qbit[0][3]=this.Qbit[0][1].proba;
        this.texte = "R";
        this.texte_indice="0";
        this.phase_nombre=0;//phase de la porte
        this.entrantes_possible=true;//peut avoir ou pas  une arete entrante
        this.sortantes_possible=true;

        break;
        
        case 8 : //porte SIMPLE cree par un bouton "boutonCree"+numeroBoutonCree.toString();
          
          
          this.Qbit[0][0].coeff_complexe(undefined);this.Qbit[0][2]=this.Qbit[0][0].proba;
          this.Qbit[0][1].coeff_complexe(undefined);this.Qbit[0][3]=this.Qbit[0][1].proba;
          this.texte = boutonSelectionne.symbole;
          this.entrantes_possible=true;//peut avoir ou pas  une arete entrante
          this.sortantes_possible=true;
          this.nAretes_max=boutonSelectionne.nAretes_max;
          this.porte_multiple=false;
          this.matrice=boutonSelectionne.matrice;
          this.phase_nombre=boutonSelectionne.numero;//permet d identifier quel bouton a srvi a la creation
          
        
        
        
        break;
        case 9 : //porte MULTIPLE cree par un bouton "boutonCree"+numeroBoutonCree.toString();
          
          
          this.Qbit[0][0].coeff_complexe(undefined);this.Qbit[0][2]=this.Qbit[0][0].proba;
          this.Qbit[0][1].coeff_complexe(undefined);this.Qbit[0][3]=this.Qbit[0][1].proba;
          this.phase_nombre=boutonSelectionne.numero;//permet d identifier quel bouton a srvi a la creation
          this.texte = boutonSelectionne.symbole;
          this.entrantes_possible=true;//peut avoir ou pas  une arete entrante
          this.sortantes_possible=true;
        
          this.porte_multiple=true;
          this.nAretes_max=boutonSelectionne.nAretes_max;
          this.matrice=boutonSelectionne.matrice;
          this.nAretes_min=this.nAretes_max;
        
       
        
        
        
        break;
         case 10: //oracle
        //this.Qbit[0] = [undefined, undefined, undefined, undefined];
        this.Qbit[0][0].coeff_complexe(undefined);this.Qbit[0][2]=this.Qbit[0][0].proba;
        this.Qbit[0][1].coeff_complexe(undefined);this.Qbit[0][3]=this.Qbit[0][1].proba;
        this.texte = "O";
        this.texte_indice="f";
        this.phase_nombre=1;//nombre de qbits du deuxieme registre (normalement tres souvent 1)
        this.entrantes_possible=true;//peut avoir ou pas  une arete entrante
        this.sortantes_possible=true;
        this.porte_multiple=true;
        this.nAretes_min=1+this.phase_nombre;
       
        this.f_oracle= F_oracle(8);//pour 8 qbits par defaut
      
        break;
        case 11: //Operateur de diffusion de Grover
        //this.Qbit[0] = [undefined, undefined, undefined, undefined];
        this.Qbit[0][0].coeff_complexe(undefined);this.Qbit[0][2]=this.Qbit[0][0].proba;
        this.Qbit[0][1].coeff_complexe(undefined);this.Qbit[0][3]=this.Qbit[0][1].proba;
        this.texte = "2|ψ⟩⟨ψ|-I";
        this.entrantes_possible=true;//peut avoir ou pas  une arete entrante
        this.sortantes_possible=true;
        this.porte_multiple=true;
       
       this.accepte_controle=false;
      
        break;
        
        
        case 12: //porte swap
        //this.Qbit[0] = [undefined, undefined, undefined, undefined];
        this.Qbit[0][0].coeff_complexe(undefined);this.Qbit[0][2]=this.Qbit[0][0].proba;
        this.Qbit[0][1].coeff_complexe(undefined);this.Qbit[0][3]=this.Qbit[0][1].proba;
        this.texte = "SWAP";//pas de texte, juste 2 croix
        this.entrantes_possible=true;//peut avoir ou pas  une arete entrante
        this.sortantes_possible=true;
        this.porte_multiple=true;
         this.nAretes_max=2;
       this.nAretes_min=2;
      
        break;
         
        case 13: //Fourier
        
        this.Qbit[0][0].coeff_complexe(undefined);this.Qbit[0][2]=this.Qbit[0][0].proba;
        this.Qbit[0][1].coeff_complexe(undefined);this.Qbit[0][3]=this.Qbit[0][1].proba;
        this.texte = "F";
        this.entrantes_possible=true;//peut avoir ou pas  une arete entrante
        this.sortantes_possible=true;
        this.porte_multiple=true;
       
        this.accepte_controle=false;
      
        break;
         
        case 14: //Fourier inverse
       
        this.Qbit[0][0].coeff_complexe(undefined);this.Qbit[0][2]=this.Qbit[0][0].proba;
        this.Qbit[0][1].coeff_complexe(undefined);this.Qbit[0][3]=this.Qbit[0][1].proba;
        this.texte = "F";
        this.texte_indice="-1";
        this.entrantes_possible=true;//peut avoir ou pas  une arete entrante
        this.sortantes_possible=true;
        this.porte_multiple=true;
       
       
        this.accepte_controle=false;
        break;
        
        case 15: //porte racine carré de swap
        //this.Qbit[0] = [undefined, undefined, undefined, undefined];
        this.Qbit[0][0].coeff_complexe(undefined);this.Qbit[0][2]=this.Qbit[0][0].proba;
        this.Qbit[0][1].coeff_complexe(undefined);this.Qbit[0][3]=this.Qbit[0][1].proba;
        this.texte = "SWAP";//pas de texte, juste 2 croix
        this.texte_indice="1/2";
        this.entrantes_possible=true;//peut avoir ou pas  une arete entrante
        this.sortantes_possible=true;
        this.porte_multiple=true;
        this.nAretes_max=2;
        this.nAretes_min=2;
            break;
      case 16: //control
        //this.Qbit[0] = [undefined, undefined, undefined, undefined];
        this.Qbit[0][0].coeff_complexe(undefined);this.Qbit[0][2]=this.Qbit[0][0].proba;
        this.Qbit[0][1].coeff_complexe(undefined);this.Qbit[0][3]=this.Qbit[0][1].proba;
        this.couleur = 0;
        this.entrantes_possible=true;//peut avoir ou pas  une arete entrante
        this.sortantes_possible=true;
        break;

      case 17: //anticontrol
        //this.Qbit[0] = [undefined, undefined, undefined, undefined];
        this.Qbit[0][0].coeff_complexe(undefined);this.Qbit[0][2]=this.Qbit[0][0].proba;
        this.Qbit[0][1].coeff_complexe(undefined);this.Qbit[0][3]=this.Qbit[0][1].proba;
        this.entrantes_possible=true;//peut avoir ou pas  une arete entrante
        this.sortantes_possible=true;
        break;
        
        
        case 32: //porte racine carré de X
        //this.Qbit[0] = [undefined, undefined, undefined, undefined];
        this.Qbit[0][0].coeff_complexe(undefined);this.Qbit[0][2]=this.Qbit[0][0].proba;
        this.Qbit[0][1].coeff_complexe(undefined);this.Qbit[0][3]=this.Qbit[0][1].proba;
        this.texte = "X";
        this.texte_indice="1/2";
        this.entrantes_possible=true;//peut avoir ou pas  une arete entrante
        this.sortantes_possible=true;
        this.porte_multiple=false;
        
         break;
      case 64: //etat et proba de Qbit
        
       
        
        //this.Qbit[0] = [undefined, undefined, undefined, undefined];
        this.Qbit[0][0].coeff_complexe(undefined);this.Qbit[0][2]=this.Qbit[0][0].proba;
        this.Qbit[0][1].coeff_complexe(undefined);this.Qbit[0][3]=this.Qbit[0][1].proba;
        
         this.ancienne_proba=[this.Qbit[0][2],this.Qbit[0][3]];
        
        this.entrantes_possible=true;//peut avoir ou pas  une arete entrante
        this.sortantes_possible=true;
        break;
      case 65: //mesure du Qbit
        //this.Qbit[0] = [undefined, undefined, undefined, undefined];
        this.Qbit[0][0].coeff_complexe(undefined);this.Qbit[0][2]=this.Qbit[0][0].proba;
        this.Qbit[0][1].coeff_complexe(undefined);this.Qbit[0][3]=this.Qbit[0][1].proba;
        
        this.ancienne_proba=[this.Qbit[0][2],this.Qbit[0][3]];
        this.entrantes_possible=true;//peut avoir ou pas  une arete entrante
        break;
        
        case 128:
          this.texte = "Alice";
       
       break;
       case 129:
          this.texte = "Bob";
       
       break;
       case 130:
          this.texte = "Gerard";
        
       break;
    }

   
    
  if (this.porte_multiple==true)//si porte multiple on doit pouvoir gerer jusqu a nbre_qbits_max qbits donc on ajoute  
   for (let k = 1; k <nbre_qbits_max; k++){
     this.Qbit.push([new complexe(1,0),new complexe(0,0),1,0]);
     
     //l.push
     this.num_ligne.push(-1);
     this.mesure.push(false);
     this.val_instant_mesure.push(0);
     
   }
    
    
    
    

  }
  
  //pour avoir lindice dans arete entrante ou sortante qui correspond a ce num de ligne quantique
  indice_dune_ligne(num_ligne){
    
    if ((this.porte_multiple==false)||(this.nAretes_entrantes<=1)) return 0;
    for (let k = 0; k <this.nAretes_entrantes; k++){
       
                 if (this.aretes_entrantes[k].numero_ligne_quantique==num_ligne) return k;
    }
    return -1;
    
  }
  
  //a partir de (x+yi)|0>+(z+wi)|1> calcul this.Qbit[n][coeff1,ceoff2,P0,P1]
  calcul_coeff_Qbit(x,y,z,w,n){
    this.Qbit[n][0].coeff_complexe(x,y);
    this.Qbit[n][1].coeff_complexe(z,w);
    this.Qbit[n][2]=this.Qbit[n][0].proba;
    this.Qbit[n][3]=this.Qbit[n][1].proba;
  }
  
  calcul_Rayon(){
    
    this.rayon = this.diametre/2;
    this.xmax = this.x + this.rayon + 10;
    this.xmin = this.x - this.rayon - 10;
    this.ymax = this.y + (1+this.Coeff_hauteur)*this.rayon  + 10;
    this.ymin = this.y - this.rayon - 10;
  }

  //METHODE SOMMET
  changeDiametre(d) {
    this.diametre=d;
    this.calcul_Rayon();
    /*let r = d / 2;
    this.rayon = r;
    this.xmax = this.x + this.rayon + 10;
    this.xmin = this.x - this.rayon - 10;
    this.ymax = this.y + this.rayon + 10;
    this.ymin = this.y - this.rayon - 10; */ 
  }

  //METHODE SOMMET
  changePositionRayon(x, y,creation_Sommet=false) {
    
    let num_ligne=this.num_ligne[0];
    if  (num_ligne!=-1){
    //  print("num",num_ligne)
    //print("ligne",G.lignes_quantiques)
    let S_qbit=G.lignes_quantiques[num_ligne][0]
    //print(S_qbit,y,S_qbit.y,this.rayon)
    if ((abs(y-S_qbit.y)<=this.rayon)) {
      y =S_qbit.y;
    }
    }
    
    
    
   // print(this.type,"change position",this.x,this.y,x,y)
    this.x = x;
    this.y = y;
    
   // print(this.type,"bouvele position",x,y)
    this.calcul_Rayon();
    //return;
   
    //CONTROLE : aretes de controles : on affiche ensuite les aretes qui partent de chaque controle
    if (this.nAretes_controle > 0) {
      //DEBUT ARETE CONTROLE

      for (let i = 0; i < this.nAretes_controle; i++) {
        let arete = this.aretes_controle[i];

        if (this.type == 16 || this.type == 17) {
          //bit de controle
          arete.xA = x;
          arete.yA = y;
        } else {
          arete.xB = x;
          arete.yB = y;
        }

        arete.xfleche = (arete.xA + arete.xB) / 2;
        arete.yfleche = (arete.yA + arete.yB) / 2;
      }
    } //FIN CONTROLE
    
    //ON ne deplace pas les aretes des portes a dimension variable
    //on les recree
    
    if ((this.type>=9)&&(this.type<=15)) {
    //if ((this.type==10)||(this.type==11)||(this.type==12)) {
       if (creation_Sommet==false){
      G.ajouteAretesSommetApresRedimensionnement(this.numeroSommet);
     // print("change position 10")
     // G.calcul_LignesQuantiQues_nQbitsEntree_nQbitsSortie();
         doit_lancer_calcul_LignesQuantiQues_nQbitsEntree_nQbitsSortie=true;
       }
      return;
      
    }
    
    

    if (this.type == 3 || this.type == 4 || this.type == 5) {
      //la sortie est à 1.5*rayon
      x = this.x + 1.5 * this.rayon;
    }

    for (let i = 0; i < this.nAretes_sortantes; i++) {
      let arete = this.aretes_sortantes[i];
      arete.xA = x;
      arete.yA = y;
      arete.xfleche = (arete.xA + arete.xB) / 2;
      arete.yfleche = (arete.yA + arete.yB) / 2;
    }

    // print("arete entrantes=",this.nAretes_entrantes,this.aretes_entrantes)
    if (this.type == 3 || this.type == 4 || this.type == 5) {
      //l'entree' est à 1.5*rayon
      x = this.x - 1.5 * this.rayon;
    }

    for (let i = 0; i < this.nAretes_entrantes; i++) {
      let arete = this.aretes_entrantes[i];
      arete.xB = x;
      arete.yB = y;
      arete.xfleche = (arete.xA + arete.xB) / 2;
      arete.yfleche = (arete.yA + arete.yB) / 2;
    }

    if (this.type <= 2) {
      //il faut mettre a jour car l ordre des qbits d entrées a peut etre changé
     
      doit_lancer_calcul_LignesQuantiQues_nQbitsEntree_nQbitsSortie=true;
      
      //G.calcul_LignesQuantiQues_nQbitsEntree_nQbitsSortie();
    }
  }

  //Methode
  choisis_couleurQbit(n) {
    //n=0 pour |0> et n=1 pour |1>
    let couleur;

    switch (n) {
      case 0: //+|0>
        couleur = [255, 0, 0];
        /*
        if (this.Qbit[0][0].x == undefined || this.Qbit[0][0].x >= 0) {
          couleur = [255, 0, 0];
        } else {
          couleur = [255, 0, 255];
        }*/

        break;
      case 1: //+|1>
        couleur = [0, 0, 255];
        /*
        if (this.Qbit[0][0].x == undefined || this.Qbit[0][1].x >= 0) {
          couleur = [0, 0, 255];
        } else {
          couleur = [0, 255, 255];
        }*/
        break;
    }

    fill(couleur);
  }
  
    //Methode affiche coefficients du QQBIT
  affiche_coefficients_du_Qbit() {
    //Qbit vide, y a rien
    
   // print("qbit",this.Qbit[0])
    if (this.Qbit[0][0].x == undefined) return;
    
    let Q=this.Qbit[0];
    
    fill(0);
    
    let texte="";
    
    
    let yaeuket0=false;
    
    texte=Q[0].texte_complexe(R.type_affichage_qBit,true);//{//retourne le texte du complexe (a+bi)
    
    
      
     if (texte!=""){
       yaeuket0=true;
       texte=texte+"|0⟩";
     } //fin affichage ket 0
    
    
    let texte2="";
    
    if (yaeuket0==false) texte2=Q[1].texte_complexe(R.type_affichage_qBit,true);
    else texte2=Q[1].texte_complexe(R.type_affichage_qBit,false);
      
    if (texte2!="")texte2=texte2+"|1⟩";
    
    texte=texte+texte2;
    textSize((3 * this.rayon) / 4);

     
      let H = textAscent(); //hauteur d un caractere
    
      let decx=this.x- textWidth(texte)/2; 
      if (decx>0) decx=0;
    
      text(texte, this.x-decx, this.y - this.rayon - H);
    
    
  }
  
  

  //METHODE SOMMET
  affiche_pourcentage() {
    
  
    if (this.Qbit[0][2] == undefined) return;
    fill(0);
    textSize((3 * this.rayon) / 4);
    let H = textAscent(); //hauteur d un caractere
    textAlign(LEFT, CENTER);
    let decalX;
    if (this.type == 64) decalX = this.rayon;
    else decalX = -2.2 * this.rayon;
    text(
      String(abs(roundToDecimals(100 * this.Qbit[0][3], 2))) + "%",
      this.x + decalX,
      this.y + this.rayon + H / 2 + 1
    );

    textAlign(CENTER, CENTER);
  }
  
  
  
  affiche_indice_exposant(exposant,x,y,coeff=1){//exposant=true sinon c est en indice
    if (exposant==true) {//exp
      let H = textAscent(); //hauteur d un caractere APRES textsize !!
        let largeurTexte = textWidth(this.texte)+5;
        textSize(coeff*this.rayon);
        text(this.texte_indice, x+largeurTexte/2,y-H/2-2);
      
      
      
    }else {//ind
        let H = textAscent(); //hauteur d un caractere APRES textsize !!
        let largeurTexte = textWidth(this.texte);
        textSize(coeff*this.rayon);
        text(this.texte_indice, x+largeurTexte/2, y+H/2+2);
      
    }
  }
  

  affiche_texte_du_sommet(){
     //affichage deu texte de la porte

    if ((this.type >= 3)&&(this.texte!=undefined)) {
      //porte X Z H...

      textSize(2 * this.rayon);
      if (this.type == 10){//ecriture de Of
        let y=(this.ymin+this.ymax)/2;
        text(this.texte, this.x,y );
        /*
        let H = textAscent(); //hauteur d un caractere APRES textsize !!
        let largeurTexte = textWidth(this.texte);
        textSize(this.rayon);
        text(this.texte_indice, this.x+largeurTexte/2,y+H/2+2);
        */
        this.affiche_indice_exposant(false,this.x,y);
        
      }
      else if ((this.type == 11)||(this.type == 12)||(this.type == 15)){
         let H = textAscent(); //hauteur d un caractere APRES textsize !!
        textSize(this.rayon);
        let y=(this.ymin+this.ymax)/2-H/2;
        text(this.texte, this.x,y );
        
        if (this.type == 15) this.affiche_indice_exposant(true,this.x,y,0.5);
      }
      else if ((this.type == 14)||(this.type == 13)){//Fourier inverse -1, swap0.5
        let y=(this.ymin+this.ymax)/2;
        text(this.texte, this.x,y );
        
        if (this.type == 14){//fourier -1 et swap1/2
          
          this.affiche_indice_exposant(true,this.x,y);
          
          
          
        }
        
        
        
      }
       else 
      {text(this.texte, this.x, this.y);
      
      
      if (this.texte_indice!=undefined){
        if (this.type == 32) this.affiche_indice_exposant(true,this.x,this.y,0.5);
        else this.affiche_indice_exposant(false,this.x,this.y);
        
      }
        
      }
      
      
    }
    
  }
  //METHODE SOMMET
  afficheSommet() {
    
    
    
    fill(0);
  
    
    if ((this.type & 128)!=0){//dessin
      
      
      
       //
          if (this.type==128)
  image(alice,this.x-alice.width/2,this.y-alice.height/2)
      else   if (this.type==129)
  image(bob,this.x-bob.width/2,this.y-bob.height/2)
       if (this.type==130)
  image(gerard,this.x-gerard.width/2,this.y-gerard.height/2)
 
      textSize(20);

      text(this.texte, this.x, this.y+55);
      return;
    }
    
    
    fill(this.couleur);
    //stroke(couleur_Contours);
    //strokeWeight(epaisseur_Contours);
    var diametre = 2 * this.rayon;

    noStroke();

    //LE DESSIN

    if (this.type <= 2) {
      //QBIT

      circle(this.x, this.y, diametre);
       
      if (this.mesure[0]==false){
      fill([255, 0, 0]);
      let d1 = diametre * this.Qbit[0][2];
      let d2 = diametre - d1;
      rect(this.x - diametre, this.y - this.rayon, diametre / 4, d1);
      fill([0, 0, 255]);
      rect(this.x - diametre, this.y - this.rayon + d1, diametre / 4, d2);
      this.affiche_pourcentage();
      }
      
    } else if ((this.type>=3 && this.type <=8 )  || ((this.type & 32)!=0)){
      //porte X Z ou H Y X0.5

      rect(this.x - diametre, this.y - diametre, 2 * diametre, 2 * diametre);

      noStroke();

      fill(50);
      circle(this.x - 1.5 * this.rayon, this.y, this.rayon / 2);
      circle(this.x + 1.5 * this.rayon, this.y, this.rayon / 2);

      if (affiche_connexion_bit_control == true) {
        fill([255, 0, 0]);
        circle(this.x, this.y - 1.5 * this.rayon, this.rayon / 2);
      }

      noStroke();
    } 
    
     else if ((this.type>=9)&&(this.type<=15))
   // else if ((this.type==10)||(this.type==11)||(this.type==12)||(this.type==13)||(this.type==14))
    {
      
     // print("affichage avant",this.x,this.y)
      
    // fill(this.couleur);
     // print("typ",this.type,"coul",this.couleur)
      rect(this.x - diametre, this.y - diametre, 2 * diametre, 2*diametre+this.Coeff_hauteur*this.rayon);

      noStroke();

      fill(50);
      
      for (let j = 0; j < this.nAretes_entrantes; j++){
        let y = this.aretes_entrantes[j].yB;
        
        circle(this.x - 1.5 * this.rayon, y, this.rayon / 2);
      circle(this.x + 1.5 * this.rayon, y, this.rayon / 2);
      }
      

      if (affiche_connexion_bit_control == true) {
        fill([255, 0, 0]);
        circle(this.x, this.y - 1.5 * this.rayon, this.rayon / 2);
      }

      
      
      fill(0);  // Noir
      let d= this.rayon/2;
      let h=this.Coeff_hauteur*this.rayon+diametre;
  // Dessiner un triangle dirigé vers le bas
  triangle(this.x-d, this.y + h-d,this.x+d, this.y +h-d,this.x, this.y +h );  // Coordonnées des trois sommets
      
      if (this.nAretes_entrantes<this.nAretes_min){
        fill(255,0,0);
        textSize(0.75*this.rayon);
        
        let texte =this.nAretes_min-this.nAretes_entrantes
       text(texte.toString(), this.x+d+5, this.y +h-d);
       
      }
      
      noStroke();
      
     // print("affichage apres",this.x,this.y)
    }
    
      else
      if (this.type == 64) {
      //etat et probas QBIT

      rect(this.x - this.rayon, this.y - this.rayon, diametre, diametre);
      
      if (this.mesure[0]==false){
      fill([255, 0, 0]);
      let d1 = diametre * this.Qbit[0][2];
      let d2 = diametre - d1;
      rect(this.x + this.rayon, this.y - this.rayon, diametre / 4, d1);
      fill([0, 0, 255]);
      rect(this.x + this.rayon, this.y - this.rayon + d1, diametre / 4, d2);
      this.affiche_pourcentage();
      }
    } else if (this.type == 16 || this.type == 17) {
      //control et anticontrol
      //mesure QBIT
      circle(this.x, this.y, this.rayon, this.rayon);
    } else if (this.type==65){//mesure
      
       // Dimensions et position
  let a=diametre;
  let arcDiameter = a ;  // Diamètre de l'arc (60% du côté du carré)
  
  // Dessin du carré
      
    if (this.mesure[0]==true)  fill([255,0,0]);
  rect(this.x-a/2, this.y-a/2, a, a);
  
  // Dessin de l'arc de cercle
  //noFill();
  stroke(0);
      strokeWeight(2);
  arc(this.x , this.y + a/2, arcDiameter, arcDiameter, PI, 0, OPEN);
  
  // Dessin du segment incliné
  
  line(this.x , this.y+a/4 , this.x +a/4, this.y - a/4);  // Segment incliné
   strokeWeight(epaisseur_Contours);   noStroke(); // Supprime le contour
    }
/*
    if (this.mesure[0]==true){
      fill(0);
      circle(this.x, this.y, this.rayon/2, this.rayon/2);
    }
  */  
    
    
    //FIN DU DESSIN

    let X = mouseX;
    let Y = mouseY;

    //affiche un cercle de selection
    if (this.testToucheSommet(X, Y)) {
      //fill(couleurRondFleche);

      // noStroke();

      // Récupérer la couleur de l'écran sous la souris
      let col = get(mouseX, mouseY);

      // Ajuster la couleur du rectangle en fonction de cette couleur
      fill(col[0] - 40, col[1] - 40, col[2] - 40, 150); // Ajouter de la transparence (alpha)
      noStroke();

      circle(X, Y, 25);
    }

    fill(0);
    
     this.affiche_texte_du_sommet();

   
 
    //AFFICHAGE DU QBIT POUR MESURE ET QBIT type0 1 ou 2

    //this.Qbit[0]=[1/sqrt(2),1/sqrt(2),0.5,0.5];//qbit= a.|0>+b|1> , c est les coeffs a et b du Qbit et apres c est les probas donc a et b au carré,le Qbit etant normalisé on doit avoir this.a*this.a+this.b.this.b = 1
    //Qbit vide sans proba, y a rien on quitte,
    
    
    if (this.Qbit[0][2] == undefined) return;

    //on affiche rien apres une porte
    if (
      this.type == 3 ||
      this.type == 4 ||
      this.type == 5 ||
      this.type == 6 ||
      this.type == 7 ||
      this.type == 16 ||
      this.type == 17
    )
      return;
      
     

    //ICI C est un Qbit ou une Proba 64 ou une mesure 65
    
     
   
      if( (this.type == 64)||(this.type == 0)){
        
        if (this.mesure[0]==true){//on dessine une croix rouge
          // Dessiner la croix rouge
          
           strokeWeight(2);
          let R=this.rayon;
          if (this.type == 0) R=R*(sqrt(2)/2);
  stroke(255, 0, 0); // Contour rouge pour la croix
  line(this.x-R, this.y-R, this.x + R, this.y+R); // Première diagonale
  line(this.x-R, this.y+R, this.x+R, this.y-R); // Deuxième diagonale
          strokeWeight(epaisseur_Contours);   noStroke(); // Supprime le contour
        }
       
       else {
         
          if (R.affiche_coefficients_Qbit == true) this.affiche_coefficients_du_Qbit();
       }
        
        
       
    
        
        
        
        
        if (R.option_superposition==true) {
          textSize(1.6*this.rayon);
          fill(255,0,0,int(this.Qbit[0][2]*255));
         // print(int(this.Qbit[0][2]*255),int(this.Qbit[0][3]*255))
          
          text('0', this.x, this.y);
          fill(0,0,255,int(this.Qbit[0][3]*255));
          textSize(1.3*this.rayon);
          text('1', this.x, this.y);
          
          
          
        }else {
          textSize(this.rayon);
           this.choisis_couleurQbit(this.val_instant_mesure[0]);
          let texteQbit = "|" + String(this.val_instant_mesure[0]) + "⟩";
       text(texteQbit, this.x, this.y);
        }
       
       
      }else  if ((this.type == 65)&&(this.mesure[0]==true)){
        if (couleur_mesure>0) {
          couleur_mesure=couleur_mesure-10;
          fill([255,0,0]);
          textSize(2*this.rayon);
        }else{
          fill(0);
          textSize(1.5*this.rayon);
        }
        
        let texteQbit =String(this.val_instant_mesure[0]);
       text(texteQbit, this.x+1.5*this.rayon+textWidth(texteQbit), this.y);
        
      }
      
      
    

    
  }

  //METHODE SOMMET
  testToucheSommet(a, b) {
    if (a < this.xmax && a > this.xmin && b > this.ymin && b < this.ymax) {
      return true;
    }

    return false;
  }
}


