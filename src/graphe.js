/* QAlgo — classe Graph : le circuit, ses lignes quantiques, l'enchaînement des calculs
 *
 * Simulateur de circuits quantiques pour l'enseignement — https://www.qalgo.org
 * Code source : https://github.com/BoissacF/QAlgo
 *
 * Copyright (C) 2025-2026 Frédéric Boissac
 * Logiciel libre sous licence GNU AGPL version 3 ou ultérieure ;
 * voir le fichier LICENSE à la racine du dépôt.
 */

/*INTERFACE
GRAPHE

//renvoie si elle existe le numero de l arete qui relie 2 sommets, renvoie -1 sinon
  numeroAreteQuiRelieLes2Sommets(sommet1_depart, sommet2_arrive) 

 

//donne la liste des numeros de sommets suceptibles de participer à un controle dans la bande verticale ou se trouve la souris avec sommet de numero
ListeNumDesSommetsPouvantControleDansLaBandeVerticaleQueToucheSouris(type)


initialise_visit() 

 //ajoute ou enleve les aretes traversées apres un redimensionnement
  //ne conserve que l arete 0 sortante et l arete 0 entrante !
  ajouteAretesSommetApresRedimensionnement(num_sommet) {

  
  //ajouter un sommet s il n est pas deja ds le graphe; au departses aretes (les noeuds ou autres sommets qui lui sont liés) , est un tableau vide
ajouteSommet(x, y, diametre,type,option_fichier=false) {
   
   
   //donne l index dans la ligne sortante ou entrante ou controle de larete qui contient ce sommet
  index_ligne_arete(ligne,num_sommet){
    
   
  //Supprime les aretes en rapport avec un sommet et refait des aretes entre les sommets d avant et ceux d apres le sommet num : permet d inserer ou de supprimmer
  SupprimeToutesLesAretesenRapportAvecSommetEtReconstruitArete(num){
    
 supprimeSommet(num)
 
 afficheArete(i, j, optionCercle, control)
 
  afficheGraphe() 
  
  
  //si la ligne est mesuree (pariellement) on la fixe
  //pour les autres on bloque leurs lecteurs de chance et on recalcule mes valeurs mesurees en fonction des probas uniquement
  //on modifie rien ! ni les lignes quantiques, ni les calculs !!!
  //les calculs de probas sont fait pour les fins de lignes
  calcul_nQbits_mesure_fixe_valeurs_mesurees_et_calcule_valeurs_instantannees_pour_les_autres_lignes(){
  
//actualise la valeur this.val_instant_mesure[0] de tous les QBIT
  //qui serait celle affichée à l instant ou mesurée, 0 pour [0> et 1 pour |1>)
  actualise_valeur_instantanee_affichée_Ou_mesuree_de_tous_les_Qbit()  
  

 //donne le numero du sommet s il y en a un a cet endroit de la souris
  NumSommetQuiTouche() 
  
  //donne la liste des numeros de sommets suceptibles de participer à un controle dans la bande verticale ou se trouve la souris avec sommet de numero
   ListeNumDesSommetsPouvantControleDansLaBandeVerticaleQueToucheSouris(type) 
     
     
 //donne le numero du sommet s il y en a un a cet endroit de la souris
   NumDesSommetsDontLAreteToucheSouris() {
   
   
    //METHODE DE LA CLASS
  //donne l identifiant de l arete il y en a un a cet endroit de la souris
  //detecte si la souris est sur le cercle gris
  NumAreteQuiTouchePetitCercle() {
         
  SupprimeAreteDeControle(    
  
  ajouteAreteDeControle(
  
   //insere un sommet entre 2 sommets en supprimant l arete qui les reliait et en recréant deux aretes aux mêmes endroits des listes aretes sortantes et entrantes
  insereSommet_entre_2_sommets(num_sommet_depart, num_sommet_arrive,Nouveau_Sommet){
  
  
  SupprimeArete(num_sommet_depart, num_sommet_arrive,option_fichier=false) {
  
  ajouteArete(num_sommet_depart, num_sommet_arrive,option_fichier=false) {
  
  calcul_nQbits_apres_passage_dune_porte(porte,Qbit_entrant,num_Qbit_entree,nbre_Qbits_entree) {
  
  //fct recursive qui ajoute les portes dans l orde dans lequel on doit les etudier pour gerer l intrication, donc les controles avant les portes controlées, les lignes de  l oracle avant la fonction de l oracle....
 // Principe : on etudie une porte e, on mets son visit a true, puis on l enleve de la ligne quantique
  //apres cette procedure recursive les lignes quantiues seront vides il faudra les reconstruire
  genere_liste_ordonnees_elemts_intrication(lignes_quantiques,numero_ligne){
  
  
   //initialise et calcul les lignes quantiques
  //Doit se faire apres :
  //- ajout sommet
 // - suppression sommet
 // - modification ordre des qbits par deplacement
  //Mais pas apres suppression ou insertion arete !!!!
  
  calcul_LignesQuantiQues_nQbitsEntree_nQbitsSortie(){
  
   //apres un changement : arete , modification parametres, supprimmer etc... on doit recalculer  tous les Qbits sauf ceux de type 0,1,2

  calcul_les_Qbits_de_sorties_de_tous_les_elements() {
  
  //Methode affiche coefficients du QQBIT
  affiche_du_nQbit_de_sortie_et_des_probas() {
  
*/
let bubug=false;
let compteurbug=0;
let debug_affiche_creation_daretes=false;
let debug_affiche_listegenere_lignesquantiques=false;
let debug_affiche_nQbits=false;

let Change_textes_des_Qbits = 0; //0 ou 1, c est le 1er etat ou le deuxieme etat possible du Qbit qui est affiché
let temps_superposition = 0; //c est le temps depuis le dernier affichage d un etat de superposition
let periode_affichage_superposition = 100; //c est la periode a laquelle on change la ffichage de l etat en ms

let affiche_connexion_bit_control = false;

function affiche_etat_superposition_des_Qbits() {
  var temps = millis();

  if (temps - temps_superposition > periode_affichage_superposition) {
    temps_superposition = temps;
    Change_textes_des_Qbits = 1 ^ Change_textes_des_Qbits;
  }
}

// create a graph class
//voir ici https://medium.com/@ziyoshams/graphs-in-javascript-cc0ed170b156
//ou alors ici https://www.geeksforgeeks.org/implementation-graph-javascript/
class Graph {
  constructor() {
    this.TabSommets = []; // tableau d objets sommets. Chaque sommetsera identifié par son numéro d entrée ds cette liste. Si on le supprime on mets a NONE, maison change pas les numéros
  //  this.nSommets = 0; //nombre de sommets du graphe

    this.change_texte_Qbit = -10000; //0 ou 1 change le texte affiché pour chaque Qbit ou a la sortie de chaque porte, ou mesures,je mets -1000 pour que ça s affiche la 1ere fois. Ca lance l initialisation

    //let n_Qbits=retourne_vecteur_nQbits_dentree(L);
    //calcul_probas_pour_chaque_Qbit_du_nQbit(n_Qbits,L.length);

    //n_Qbits=applique_Porte_H(n_Qbits,1,L.length);

    //calcul_probas_pour_chaque_Qbit_du_nQbit(n_Qbits,L.length);

    // print(n_Qbits)

    //une ligne quantique peut etre definit comme ceci:
    // _ le 1er element est un qbit d entrée
    // _ a chaque fois il entre dans un element, dont la 1ere sortie est la suite de la ligne jusqu a la fin(onne passe pas par les controles qui permettent de passer a une autre ligne)
    //les lignes sont numérotées de 0 à n , verticalement. 0 etant le plus haut sur l ecran

    this.lignes_quantiques = []; //change si modification sommet, arete, creation, suppression
  
    this.n_Qbits_sortie = []; //sera le vecteur du produit tensoriel des n q bits de sortie
    this.n_Qbits_mesure=[];//sera le nqbits si mesure partielle ou totale
    this.Qbits_pouraffichage_graphics=[];//meme chose que this.n_Qbits_mesure mais on a supprimé les etats mesurés, donc nqbit plus court
    this.Probas_mesure=[];//sera les probas lors d une mesure partielle ou totale d avoir tel ou tel état. donc ce sont les coeffs de this.n_Qbits_mesure au carré
    this.Liste_ordonnee_pour_intrication=[];//liste ordonnee de tous les éléments du graphe, placés dans l, ordre, de facon à gerr les controles , portes multiples et autres intrication
  }

  //METHODE DE LA CLASS
  //renvoie si elle existe le numero de l arete qui relie 2 sommets, renvoie -1 sinon
  numeroAreteQuiRelieLes2Sommets(sommet1_depart, sommet2_arrive) {
    var n = -1;

    for (let j = 0; j < this.TabSommets[sommet1_depart].nAretes_sortantes; j++) {
      if (
        this.TabSommets[sommet1_depart].aretes_sortantes[j].numSommetArrive == sommet2_arrive
      ) {
        return j;
      }
    }
    
    if ((this.TabSommets[sommet1_depart].type==16)||(this.TabSommets[sommet1_depart].type==17))
    
    for (let j = 0; j < this.TabSommets[sommet1_depart].nAretes_controle; j++) {
      if (
        this.TabSommets[sommet1_depart].aretes_controle[j].numSommetArrive == sommet2_arrive
      ) {
        return j;
      }
    }  
      
    return n;
  }
/*
  //METHODE DE LA CLASS
  metAreteACouleur(numSommet, numArete, couleur) {
    this.TabSommets[numSommet].aretes_sortantes[numArete].couleur = couleur;
  }

  //METHODE DE LA CLASS
  metAreteAEpaisseur(numSommet, numArete, epaisseur) {
    this.TabSommets[numSommet].aretes_sortantes[numArete].epaisseur = epaisseur;
  }
*/
  
//METHODE DE LA CLASS
  initialise_visit() {
    
    for (let i = 0; i < this.TabSommets.length; i++)
      if (this.TabSommets[i] != undefined)
        this.TabSommets[i].visit=false;
    
  }
  
  //METHODE DE LA CLASS
  //ajoute ou enleve les aretes traversées apres un redimensionnement
  //ne conserve que l arete 0 sortante et l arete 0 entrante !
  ajouteAretesSommetApresRedimensionnement(num_sommet) {
    
     if (OnFaitLesMesures!=0) initialise_mesures();//on fait pas de mesure si on change un sommet, redimensionne
    
    print("je redimensionne")
   //return
   
    let Sommet=this.TabSommets[num_sommet];
    
    //on va supprimer toutes ses aretes, puis on va les reconstruire
    
    //DEBUT SUPRESSION DES ARETES
    
    this.SupprimeToutesLesAretesenRapportAvecSommetEtReconstruitArete(num_sommet);
   // print("hey j ai tout effacé",Sommet)
    
    
    //FIn DE SUPPRESSION DES ARETES
    
    
    //DEBUT DETECTION DES NOUVELLES ARETES
    
   
    
    // print("corddu sommet",Sommet.x,Sommet.y,"type=",Sommet.type)
    
    let nbre_Qbits_entree = this.lignes_quantiques.length;
    
  
    //if (Sommets_Voisins.length==1) return; //c est la 1ere arete
   // print("les lignes en entree de fonction sont",this.lignes_quantiques)
    
    
    for (let j = 0; j <nbre_Qbits_entree; j++){
      let ligne=this.lignes_quantiques[j];
      for (let i = 0; i <(ligne.length-1); i++){
        let S=ligne[i];
        //print(" redimension ligne numero",j,"sommet",S)
        // print("sommets",S.type,S.nAretes_sortantes)
        if (S.numeroSommet!=num_sommet)
          for (let k = 0; k <S.nAretes_sortantes; k++)
          
          if (S.aretes_sortantes[k].numero_ligne_quantique==j)
          
          {
            
         //   print("verif",S.numeroSommet,S.type,"k=",k,"arete",S.aretes_sortantes[k],)
            let arete=S.aretes_sortantes[k];
           // print(arete.xA,arete.xB,arete.yA,arete.yB,Sommet.xmin,Sommet.xmax,Sommet.ymin,Sommet.ymax)
            if ((arete.xA<Sommet.xmin)&&(arete.xB>Sommet.xmax))
              if ((arete.yA>Sommet.ymin)&&(arete.yB<Sommet.ymax)){
                 
   // print(arete)
                let numSommetDepart = arete.numSommetDepart;
         let numSommetArrive = arete.numSommetArrive;
                
                
             //   print("traverse les sommets",this.TabSommets[numSommetDepart].type,this.TabSommets[numSommetArrive].type,"ligne=",j,"numq=",S.aretes_sortantes[k].numero_ligne_quantique);
                
              // let y_milieu=(arete.yA+arete.yB)/2;
                
                //on insere
                if (numSommetArrive!=num_sommet){
                  
                  this.insereSommet_entre_2_sommets(numSommetDepart, numSommetArrive,Sommet,arete.numero_ligne_quantique);
                  
                  
                  //si c est une swap et que c est la deuxieme insertion on de casse
                  //car une sawap a que deux entrees
                  //ou une porte cree 9 qui est a son max
                 
                  /*
                  if (
                    ((Sommet.type==12)&&(Sommet.nAretes_entrantes==2))
                    ||
                    ((Sommet.type==9)&&(Sommet.nAretes_entrantes==Sommet.nAretes_max))
                  )
                  {*/
                    
                   if (Sommet.nAretes_entrantes==Sommet.nAretes_max){
                    //this.calcul_LignesQuantiQues_nQbitsEntree_nQbitsSortie();
                    return;
                  }
                  
                  
                  
                  break;//on onsere une seule arete par ligne
                  
                   //print("yo j insere ",numSommetDepart, numSommetArrive)
                  /*
                   //on supprimme l arete
       this.SupprimeArete(numSommetDepart, numSommetArrive);
       //on cree les deux aretes pour inserer le sommet
       this.ajouteArete(numSommetDepart, Sommet.numeroSommet);
                  
        let n=Sommet.aretes_entrantes.length-1;
        let ar=Sommet.aretes_entrantes[n];
        ar.modifieCoordonnees( ar.xA, ar.yA, ar.xB, y_milieu);          
                  
                  
      this.ajouteArete(Sommet.numeroSommet, numSommetArrive);
                  
        n=Sommet.aretes_entrantes.length-1;
       ar=Sommet.aretes_sortantes[n];
        ar.modifieCoordonnees( ar.xA, y_milieu, ar.xB, ar.yB);            
                */ 
                }
               
                
                
              }
          }
      }
      
    }

   
    if (Sommet.type==10) mise_a_jour_oracle(Sommet);
    
    
   // this.calcul_LignesQuantiQues_nQbitsEntree_nQbitsSortie();
      
    
  }



  //METHODE DE LA CLASS

  //METHODE DE LA CLASS
  //ajouter un sommet s il n est pas deja ds le graphe; au departses aretes (les noeuds ou autres sommets qui lui sont liés) , est un tableau vide
  ajouteSommet(x, y, diametre,type,option_fichier=false) {
    
    
     if (OnFaitLesMesures!=0) initialise_mesures();//on fait pas de mesure si on change un sommet
     // print("ajouteu sommet type=",type)
    let Nouveau_Sommet=new Sommet(this.TabSommets.length, x, y, diametre,type);
    
    
    
    
    let Sommets_Voisins=undefined;
    let L_controle=undefined;//liste eventuelle des controles possibles
    
    //on regarde s i il doit s inserer dans une ligne, si il le peut c est obligatoire
    if (option_fichier==false)
     if ((Nouveau_Sommet.entrantes_possible==true)&&(Nouveau_Sommet.sortantes_possible==true)){
       
       
       //si souris touche arete, donne le numero du sommet de depart, du sommet d arrivées, les coordonnées xy de projection sur l arete,et le numero de la ligne de l arete
       Sommets_Voisins=this.NumDesSommetsDontLAreteToucheSouris();
       
      // print(type,"les voisins sont",Sommets_Voisins)
       
       
       
     if (Sommets_Voisins==undefined) return ;
     
       
       
     //on regarde si y a un controle possible avec une porte
     let num_ligne=this.TabSommets[Sommets_Voisins[0]].num_ligne[0];
      L_controle=this.ListeNumDesSommetsPouvantControleDansLaBandeVerticaleQueToucheSouris(type,num_ligne);
      //print("les controles",L_controle)
       
     //fin du controle possible
     
     Nouveau_Sommet.changePositionRayon(Sommets_Voisins[2],Sommets_Voisins[3],true);
    // print("les voisins sont",Sommets_Voisins)
     }
    
    
    
    
    
  
    this.TabSommets.push(Nouveau_Sommet);
 
    
    if (option_fichier==false)
    if (Nouveau_Sommet.type==0)
    
    if (Nouveau_Sommet.x<(largeur-2*Nouveau_Sommet.diametre))
    
    {//si c est un Qbit, on ajoute une lesure en fin d ecran pour visualiser la ligne quantique
      let x65= largeur-2*Nouveau_Sommet.diametre;
      
      if (((x65-250)-Nouveau_Sommet.x)>400) x65=x65-250;//popur laisser de la place a l ecran graphique
      
      
      let Sommet_mesure=new Sommet(this.TabSommets.length,x65, y, diametre,65);
    this.TabSommets.push(Sommet_mesure);
      
      this.ajouteArete(Nouveau_Sommet.numeroSommet, Sommet_mesure.numeroSommet);
      
      
    }
   
    
    
    //on regarde s i il s insere dans une ligne
     if (option_fichier==false)
     if (Sommets_Voisins!=undefined){//il faut inserer le sommet entre ses deux voisins
       
       let num_sommet_depart=Sommets_Voisins[0];
       let num_sommet_arrive=Sommets_Voisins[1];
       
       
       
       
       this.insereSommet_entre_2_sommets(num_sommet_depart, num_sommet_arrive,Nouveau_Sommet,Sommets_Voisins[4]);
       /*
       //print("voisins,",num_sommet_depart,num_sommet_arrive,Nouveau_Sommet.numeroSommet)
       //on supprimme l arete
       let ar=this.SupprimeArete(num_sommet_depart, num_sommet_arrive);
       //on cree les deux aretes pour inserer le sommet
      let ar_ajoute=this.ajouteArete(num_sommet_depart, Nouveau_Sommet.numeroSommet);
       
       if (this.TabSommets[num_sommet_depart].nAretes_sortantes>1){//porte avec multiples sorties, on doit recentrer l arete a la bonne position y
         ar_ajoute.modifieCoordonnees( ar_ajoute.xA, ar.yB, ar_ajoute.xB, ar_ajoute.yB);
       }
       
       ar_ajoute=this.ajouteArete(Nouveau_Sommet.numeroSommet, num_sommet_arrive);
       
       //iprint("nouveau sommet",Nouveau_Sommet)
      
       
       if (this.TabSommets[num_sommet_arrive].nAretes_entrantes>1){//porte avec multiples entrees, on doit recentrer l arete a la bonne position y
         ar_ajoute.modifieCoordonnees( ar_ajoute.xA, ar_ajoute.yA, ar_ajoute.xB, ar.yB);
       }
       */
       
       //il faut aussi ajouter ses eventuels controles
       
     
      if (L_controle!=undefined)
         for (let j = 0; j < L_controle.length; j++) {
           let numD;
           let numA;
           let SomD;
           let SomA;
           if ((type==16)||(type==17)){
             numD=Nouveau_Sommet.numeroSommet;
             numA=L_controle[j];
        
           }else{
             numA=Nouveau_Sommet.numeroSommet;
             numD=L_controle[j];
             
           }
           
          
          this.ajouteAreteDeControle(numD,numA,false);
         }
            
       
       
     }
    
    
   if (option_fichier==false) this.calcul_LignesQuantiQues_nQbitsEntree_nQbitsSortie();
    
    
    
  }
  
  //donne l index dans la ligne sortante ou entrante ou controle de larete qui contient ce sommet
  index_ligne_arete(ligne,num_sommet){
    for (let i = 0; i < ligne.length; i++){
      if (ligne[i].numSommetDepart==num_sommet) return i;
      if (ligne[i].numSommetArrive==num_sommet) return i;
    }
    return -1;
  }
  
  SupprimeToutesLesAretesenRapportAvecSommetEtReconstruitArete(num,efface_controle=false){
   
   
    let Sommet=this.TabSommets[num];
    
    
   
  
     //1er on efface tous les controles possibles s il y en a 
     if ((efface_controle==true)&&(Sommet.nAretes_controle>0)){
       
       for (let i = 0; i < Sommet.nAretes_controle; i++){
        
          let arete = Sommet.aretes_controle[i];
          let autre;
          if (arete.numSommetDepart==num) autre=arete.numSommetArrive; else autre=arete.numSommetDepart;
        
         
          let index=this.index_ligne_arete(this.TabSommets[autre].aretes_controle,num)
          this.TabSommets[autre].nAretes_controle--;
          this.TabSommets[autre].aretes_controle.splice(index, 1);
         
        
      }
       
       Sommet.nAretes_controle=0;
       Sommet.aretes_controle=[];
       
     }
    
    
    
    //si c est un Qbit d entree (sans entrante) ou une mesure ou image (sans sortante)
    //ya pas d insertion, on se contente de supprimmer
    if ((Sommet.entrantes_possible==false)||(Sommet.sortantes_possible==false)) {
      
      for (let i = 0; i < Sommet.nAretes_entrantes; i++){
          let arete = Sommet.aretes_entrantes[i];
          let numSommetDepart = arete.numSommetDepart;
          let index=this.index_ligne_arete(this.TabSommets[numSommetDepart].aretes_sortantes,num)
          this.TabSommets[numSommetDepart].nAretes_sortantes--;
          this.TabSommets[numSommetDepart].aretes_sortantes.splice(index, 1);
      }
      
      for (let i = 0; i < Sommet.nAretes_sortantes; i++){
          let arete = Sommet.aretes_sortantes[i];
          let numSommetArrive = arete.numSommetArrive;
          let index=index_ligne_arete(this.TabSommets[numSommetArrive].aretes_entrantes,num)
          this.TabSommets[numSommetArrive].nAretes_entrantes--;
          this.TabSommets[numSommetArrive].aretes_entrantes.splice(index, 1);
      }
      this.TabSommets[num].nAretes_sortantes = 0; 
      this.TabSommets[num].aretes_sortantes = []; 
      this.TabSommets[num].nAretes_entrantes = 0; 
      this.TabSommets[num].aretes_entrantes = [];
      
      return;
      
    }//fin de qbit entree ou image
    
    
    //print("entrant,sortant",this.TabSommets[num].nAretes_entrantes,this.TabSommets[num].nAretes_sortantes)
    
    
    
    //A PARTIR D ICI C EST FORCEMMENT UNE porte entre deux portes donc a inserer
   //on repere d abord les 2 numeros des aretet, pour l arete sortante et l arete etrante
    //meme nombre d aretes entrates que sortantes
     for (let i = 0; i < this.TabSommets[num].nAretes_entrantes; i++)
    {
      //on met en memoire les 2 sommets de arete de la meme ligne quantique qu'on va supprimmer
      
      let arete1 = this.TabSommets[num].aretes_entrantes[i];
      let sommet1=this.TabSommets[arete1.numSommetDepart];
      let arete2 = this.TabSommets[num].aretes_sortantes[i];
      let sommet2=this.TabSommets[arete2.numSommetArrive];
      let index1=this.index_ligne_arete(sommet1.aretes_sortantes,num);
      let index2=this.index_ligne_arete(sommet2.aretes_entrantes,num)
      //on refait la liaison entre sommet 1 et sommet2 en virant sommet
      
      
      //print("pour1",arete1,sommet1,index1)
     // print("pour2",arete2,sommet2,index1)
      
      
     
      let arete = new Arete(sommet1.numeroSommet, sommet2.numeroSommet, arete1.xA,arete1.yA,arete2.xB,arete2.yB);
      //on lui met le numero de la ligne quantique sinon ca bug dans le redimensionnement
      arete.numero_ligne_quantique=arete1.numero_ligne_quantique;
      sommet1.aretes_sortantes[index1]=arete;
      sommet2.aretes_entrantes[index2]=arete;
    }
    
    this.TabSommets[num].nAretes_sortantes = 0; 
      this.TabSommets[num].aretes_sortantes = []; 
      this.TabSommets[num].nAretes_entrantes = 0; 
      this.TabSommets[num].aretes_entrantes = [];
    
    
    
    
    
    
  }
  
 
  //METHODE DE LA CLASS
  supprimeSommet(num) {
    
    if (OnFaitLesMesures!=0) initialise_mesures();//on fait pas de mesure si on change un sommet
    // print("num a supprimmer",num)
    
      //si ce sommet est un Qbit ! je supprimme toute sa ligne quantique
    //sinon la numerotation des lignes quantiques devient incoherente
    
    //si dans sa ligne quantique y a des sommets a entrees multiples on le vire en priroté
    if (this.TabSommets[num].type==0){//efface qbit entree
       let sommetprioritaireAeffacer=[];
       let sommetAeffacer=[];
      
      let n=this.TabSommets[num].num_ligne[0];
      
       for (let i = 1; i < (this.lignes_quantiques[n].length); i++){
         if (this.lignes_quantiques[n][i].nAretes_entrantes>1)
           sommetprioritaireAeffacer.push(this.lignes_quantiques[n][i]);
         else
           sommetAeffacer.push(this.lignes_quantiques[n][i]);
       }
      
       for (let i = 0; i < (sommetprioritaireAeffacer.length); i++){
         this.supprimeSommet(sommetprioritaireAeffacer[i].numeroSommet);
       }
      
      
      //et apres on efface les autres
      for (let i = 0; i < (sommetAeffacer.length); i++){
         this.supprimeSommet(sommetAeffacer[i].numeroSommet);
       }
      
    }//fin de efface qbit entree
    
    else //eface porte
      {
        this.SupprimeToutesLesAretesenRapportAvecSommetEtReconstruitArete(num,true);
        
      }
  
    
    //on supprime le sommet en mettant undefined
    delete this.TabSommets[num]; //mets ds la liste le mot clé undefine
    
    this.calcul_LignesQuantiQues_nQbitsEntree_nQbitsSortie();
    
  }

  //METHODE DE LA CLASS
  afficheArete(i, j, optionCercle, control) {
    //affiche la jeme Arete du  ieme sommet

    let arete;
    if (control == true) arete = this.TabSommets[i].aretes_controle[j];
    else arete = this.TabSommets[i].aretes_sortantes[j];
    let a = arete.xA;
    let b = arete.yA;
    let c = arete.xB;
    let d = arete.yB;
    let xfleche = arete.xfleche;
    let yfleche = arete.yfleche;

    if (optionCercle == "cercle") {
      //trace la fleche au 2/3
      //var xfleche =  c / 2 + a / 2;
      //var yfleche =  d / 2 + b / 2;

      let X = mouseX;
      let Y = mouseY;
      if (
        X < xfleche + 30 &&
        X > xfleche - 30 &&
        Y > yfleche - 30 &&
        Y < yfleche + 30
      ) {
        fill(couleurRondFleche);

        noStroke();
        circle(xfleche, yfleche, 30);
      }
    }

   //if (arete.numero_ligne_quantique==0) arete.couleur=[255,0,0];
    else  if (arete.numero_ligne_quantique==1) arete.couleur=[0,255,0];
    else if (arete.numero_ligne_quantique==2) arete.couleur=[0,0,255];
    
    
    fleche(a, b, c, d, 5, 5, arete.couleur, arete.epaisseur);
  }

  //METHODE DE LA CLASS
  //pour afficher le graphe
  afficheGraphe() {
    
    if (OnFaitLesMesures==0) //on ne change les lignes quantiques et on calcule  que si on est pas dans une mesure
    this.lignes_quantiques = retourne_liste_lignes_quantiques(this); 
    
    
    //on affiche ensuite les aretes qui partent de chaque sommet
    for (let i = 0; i < this.TabSommets.length; i++)
      if (this.TabSommets[i] != undefined) {
        // print("num du sommet",i);
        for (let j = 0; j < this.TabSommets[i].nAretes_sortantes; j++) {
          //print("sommet",i,"num de l arete",j);
          this.afficheArete(i, j, "cercle", false);
        }
      }

    //CONTROLE : aretes de controles : on affiche ensuite les aretes qui partent de chaque controle
    for (let i = 0; i < this.TabSommets.length; i++)
      if (this.TabSommets[i] != undefined)
        if (this.TabSommets[i].type == 16 || this.TabSommets[i].type == 17) {
          //bit de controle

          // print("num du sommet",i,this.TabSommets[i].nAretes_controle);
          for (let j = 0; j < this.TabSommets[i].nAretes_controle; j++) {
            // print("sommet",i,"num de l arete",j);
            this.afficheArete(i, j, "cercle", true);
          }
        }

    //centre_texte_centre_noeud
    //on affiche d abord les sommets

    for (let i = 0; i < this.TabSommets.length; i++) {
      if (this.TabSommets[i] != undefined) {
        this.TabSommets[i].afficheSommet();
      }
    }

    //CHOIX du ket affiché ou mesuré si on faisait une mesure
    if (this.change_texte_Qbit != Change_textes_des_Qbits) {
      this.actualise_valeur_instantanee_affichée_Ou_mesuree_de_tous_les_Qbit();
      this.change_texte_Qbit = Change_textes_des_Qbits;
    }
    
    

    /* 
  if ((R.on_est_dans_une_fenetre==false)&&(Selection<0)&&( R.affiche_coefficients_et_Probas_nQbit==true)&&(this.n_Qbits_sortie.length>0) )
   { 
    
     if (OnFaitLesMesures!=0) this.affiche_du_nQbit_de_sortie_et_des_probas(this.n_Qbits_mesure);
    else this.affiche_du_nQbit_de_sortie_et_des_probas(this.n_Qbits_sortie);
  }
  */
  }

  //Methode graphe
  //dit si la porte controlée fonctionne (true) ou est bloquée par un de ses controles (false)
  porte_controle_active(porte) {
    //print(porte)
    // print("nbre",porte.nAretes_controle)
    if (porte.nAretes_controle == 0) return true;
    
    //si un de ses controles la bloque on retourne false
    for (let j = 0; j < porte.nAretes_controle; j++){
      let SommetControle = this.TabSommets[porte.aretes_controle[j].numSommetDepart];
      
      if (
      (SommetControle.type == 16 &&
        SommetControle.val_instant_mesure[0] == 0) ||
      (SommetControle.type == 17 &&
        SommetControle.val_instant_mesure[0] == 1)
    ) {
      // print("true")
      return false;//porte bloquée
    }
      
    }
    
    
    
    //  print("sommetcontrole",SommetControle)
    

    // print("false")
    return true;//porte qui fonctionne non bloquée
  }

  
 
  //recalcule dans quel etat de mesure on est //attention ça ne doit pas etre le mode de calcuil principal car c est un ordre au depart. si on mets un on veut une mesure totale, cette focntion verifie juste
  calcul_si_mesure_patielle_totale_ou_pas(){
    let n_false=0;
    let n_true=0;
    
    for (let i = 0; i < this.TabSommets.length; i++)
      if (this.TabSommets[i] != undefined)
        if (this.TabSommets[i].type==65)
        if (this.TabSommets[i].mesure[0]==false)
          {   n_false++;
          }
      else 
        n_true++;
    
    
    if (n_true!=0){
      if (n_false==0) return 1;//mesure totale
      return 2;//mesure partielle;
      
    }
    return 0;//pas de mesure
    
    
  }
  
  //si la ligne est mesuree (pariellement) on la fixe
  //pour les autres on bloque leurs lecteurs de chance et on recalcule mes valeurs mesurees en fonction des probas uniquement
  //on modifie rien ! ni les lignes quantiques, ni les calculs !!!
  calcul_nQbits_mesure_fixe_valeurs_mesurees_et_calcule_valeurs_instantannees_pour_les_autres_lignes(JeRecalculeToutesLesMesuresPartielles=false){
    
   
    print("yo je lance calcul_nQbits_mesure_fixe_valeurs_mesurees_et_calcule_valeurs_instantannees_pour_les_autres_lignes")
    
    
    
    this.Qbits_pouraffichage_graphics=[];//meme chose que this.n_Qbits_mesure mais on a supprimé les etats mesurés, donc nqbit plus court
    
    
    let t1=millis();
    
   let nbre_de_ligne=this.lignes_quantiques.length;
    
    
    
    
    
    //ETAPE 0
     //1ere etape BIS on recalcule l etat de mesure , partiell, totale ou pas 2,1,0
    //car il peut avoir changé !par exemple si totale et on enleve une mesure, ça devient partiel....
    print("ancien etat de  on faitlesmesure=",OnFaitLesMesures);
    
    OnFaitLesMesures=this.calcul_si_mesure_patielle_totale_ou_pas();
    
    
    print("nouvel etat de  on faitlesmesure=",OnFaitLesMesures);
     
    //si mesure totale apres recalcul
    
    if (OnFaitLesMesures==1){//MESURE TOTALE apres recalcul, on fait ce qu il y a en dessous et on se casse
         this.Probas_mesure=[];
          for (let i = 0; i <this.n_Qbits_sortie.length; i++) {    
            this.Probas_mesure.push(this.n_Qbits_sortie[i].proba);
    
            }
      
      
          //ontire une mesure au hasard du vecteur de probas mesurees
             let indice=tirageAleatoire(this.Probas_mesure);
           
           //print("indice=",indice,"probas=",this.Probas_mesure)
           
           //on calcule la proba a 1 de sortie et on mets le nqbits mesure a zero pour l affichage
           this.n_Qbits_mesure=[];
       for (let i = 0; i <this.n_Qbits_sortie.length; i++) { 
    
         if (i!=indice) this.Probas_mesure[i]=0; else this.Probas_mesure[i]=1;
    
         this.n_Qbits_mesure.push(new complexe(0,0));
             }
      
      
          //on recalcule les valeurs instantannées mesurées pour que ça soit bien comforme
  let etat_mesure=convertit_nombreDecimal_En_StringNombre_binaire(indice,nbre_de_ligne);
  for (let i = 0; i < this.TabSommets.length; i++)
      if (this.TabSommets[i] != undefined) if (this.TabSommets[i].type==65) {
      let index=this.TabSommets[i].num_ligne[0];
         this.TabSommets[i].val_instant_mesure[0]=parseInt(etat_mesure[index], 10)
    }
           
      return;
      
    }//FIN MESURE TOTALE
    
    
    /*
    
     
    
    //ETAPE 0
     //1ere etape BIS
     //on doit d abord verifié si toutels les portes 65 sont  mesurées !
         //car dans ce cas on tire un etat du nqbits avec les probas, on calcule pas un par un sinon ça bug et puis on se casse
       
    print("nouvel etat de  on faitlesmesure=",OnFaitLesMesures);
    
    let toutes_les_portes_65_sont_mesurees=true;
    
       if (OnFaitLesMesures!=1)//si c est une mesure partielle on regarde si tout a été mesuré, si mesure totale c est deja le cas
          for (let i = 0; i < this.TabSommets.length; i++)
      if (this.TabSommets[i] != undefined)
        if (this.TabSommets[i].type==65)
        if (this.TabSommets[i].mesure[0]==false)
          {   toutes_les_portes_65_sont_mesurees=false;
              break;
          }
    
    
     print("nouvel etat de  on faitlesmesure=",OnFaitLesMesures,toutes_les_portes_65_sont_mesurees);
    
    
         if (toutes_les_portes_65_sont_mesurees==true) {
           
             //si mesure partielle on mets toutes les mesures a true ppur pas etre embeté
            if (OnFaitLesMesures!=1)
              for (let i = 0; i < this.TabSommets.length; i++)if (this.TabSommets[i] != undefined)this.TabSommets[i].mesure[0]=true;
           
             
             this.Probas_mesure=[];
  for (let i = 0; i <this.n_Qbits_sortie.length; i++) {    
    this.Probas_mesure.push(this.n_Qbits_sortie[i].proba);
    
  }
             
           
           
           
           
           //ontire une mesure au hasard du vecteur de probas mesurees
             let indice=tirageAleatoire(this.Probas_mesure);
           
           //print("indice=",indice,"probas=",this.Probas_mesure)
           
           //on calcule la proba a 1 de sortie et on mets le nqbits mesure a zero pour l affichage
           this.n_Qbits_mesure=[];
  for (let i = 0; i <this.n_Qbits_sortie.length; i++) { 
    
    if (i!=indice) this.Probas_mesure[i]=0; else this.Probas_mesure[i]=1;
    
    this.n_Qbits_mesure.push(new complexe(0,0));
    
    
    
  }

           
           //on recalcule les valeurs instantannées mesurées pour que ça soit bien comforme
  let etat_mesure=convertit_nombreDecimal_En_StringNombre_binaire(indice,nbre_de_ligne);
  for (let i = 0; i < this.TabSommets.length; i++)
      if (this.TabSommets[i] != undefined) if (this.TabSommets[i].type==65) {
      let index=this.TabSommets[i].num_ligne[0];
         this.TabSommets[i].val_instant_mesure[0]=parseInt(etat_mesure[index], 10)
    }
           
           
  
           OnFaitLesMesures=1;
           return;//on se casse
         }//fin de "toutes les lignes ont ete mesurees"
    
  
    
    //FIN ETAPE 0
    
    */
    
    //EN DESSUS C EST UNE MESURE PARTIELLEv !
    
    //2ere etape on calcule le Qbit de sortie mesuree en fixant les lignes mesurees
    //cree le nouveau n_Qbit copie du 1er
 
   
  
    //on initialise this.n_Qbits_mesure en le copiant sur la sortie
    this.n_Qbits_mesure=[];
  for (let i = 0; i <this.n_Qbits_sortie.length; i++) { 
    
    this.n_Qbits_mesure.push(new complexe(this.n_Qbits_sortie[i].x,this.n_Qbits_sortie[i].y));
    
    
    
  }
    
    // this.n_Qbits_mesure=deepCopy(this.n_Qbits_sortie) 2 fois plus long
  
    
   
    
    
    /*
    let L_bubug=[]
    for (let i = 0; i <this.n_Qbits_mesure.length; i++) { 
     L_bubug.push(this.n_Qbits_mesure[i].proba) 
   }
    print("onfaitlesmesures=",OnFaitLesMesures," debugage proba mesure en debut de fonction=",L_bubug)
    
    */
    
   
        
    
    
    
    
  //3e etapepreparatoire, on fait une mesure totale, mais on ne va garder par la suite que les bits mesurees des lignes   mesurees. 
    //Ici l objectif est de recalculer avec le bouton retry toutes les mesures partielles précédentes
    let etat_mesure="";
    if (JeRecalculeToutesLesMesuresPartielles==true)
      {
    
    let indice=tirageAleatoire_etat_dun_nQbits(this.n_Qbits_sortie);
     etat_mesure=convertit_nombreDecimal_En_StringNombre_binaire(indice,nbre_de_ligne);
    
    //print("l etat mesure est",etat_mesure)
      }
    
    
    
    
    //3e etape pour les portes 65 de mesures qui sont mesurees, on fixe la valeur du n_qbits mesures
    
    for (let i = 0; i < this.TabSommets.length; i++)
      if (this.TabSommets[i] != undefined)
        
        //En cas de mesure partielle, les sondes de probabilite situees en milieu de circuit (pas celles juste avant un 65) affichent des valeurs fausses a cause de l intrication : on les neutralise en les mettant toutes a true
    if (this.TabSommets[i].type==64)  {
      
      
      
      if (this.TabSommets[i].mesure[0]==false){
        let Sommet_dapres=this.TabSommets[this.TabSommets[i].aretes_sortantes[0].numSommetArrive];
        if  ((Sommet_dapres.type!=65)||(Sommet_dapres.mesure[0]==true))
        {this.TabSommets[i].mesure[0]=true;}
      }
      
    }      
     else   
    //porte 65 on calcul la valeur mesurée si il est a true
    
       if (this.TabSommets[i].type==65) 
      {
     
        
        if (this.TabSommets[i].mesure[0]==true){
          
          let index=this.TabSommets[i].num_ligne[0]; 
          
           //on recalcule les valeurs instantannées des portes 65 mesurées pour que ça soit bien comforme
          //si on recalcule tout on doit recalculer les valeurs mesurées pour chacun
          if (JeRecalculeToutesLesMesuresPartielles==true)
          this.TabSommets[i].val_instant_mesure[0]=parseInt(etat_mesure[index], 10)
          
          
          let BitMesure= this.TabSommets[i].val_instant_mesure[0];
       
       
      // print("applique bit mesure",BitMesure,"a index=",index,"nbre=",this.n_Qbits_sortie.length)
      this.n_Qbits_mesure=applique_Porte_BitMesure(BitMesure,this.n_Qbits_mesure,index,nbre_de_ligne);
    
      
      
    }
      }
    
    
    
   
   //  print('yoyojecalcule')
    // print("yo, voila le nqbits mesure",this.n_Qbits_mesure,"et sonvecteur proba",this.Probas_mesure);
    //ICI LE QNQBIT DE SORTIE MESURE EST CALCULEE
    
    //3e etape 
    //on recalcule les probas des portes 64 et 65 pas mesurées
    
   
    for (let i = 0; i < this.TabSommets.length; i++)
      if (this.TabSommets[i] != undefined)
        if (this.TabSommets[i].mesure[0]==false)
    if ((this.TabSommets[i].type==64)|| (this.TabSommets[i].type==65)) {
      let index=this.TabSommets[i].num_ligne[0];
    
       let P = calcul_probas_pour_un_Qbit_numeroQbit_du_nQbit(this.n_Qbits_mesure,index,nbre_de_ligne);
        this.TabSommets[i].Qbit[0][2] = P[0] / 100;
        this.TabSommets[i].Qbit[0][3] = P[1] / 100;
      
    }
    
    
    
    
    
    
    
    
     //4e etape, on supprimme tous les états qui ne peuvent pas exists car on a deja fait une mesure dans this.n_Qbitsmesure qui sont a undefined
    
    this.Qbits_pouraffichage_graphics=[];//meme chose que this.n_Qbits_mesure mais on a supprimé les etats mesurés, donc nqbit plus court
     for (let i = 0; i < this.n_Qbits_mesure.length; i++){
       if (this.n_Qbits_mesure[i]==undefined){
         // c est un etat supprimé
         
       } else {//c est un des états qui reste
          this.Qbits_pouraffichage_graphics.push(this.n_Qbits_mesure[i]);
     }
     }
    
    
    //print(this.n_Qbitsmesure)
    //5e etape 
    //on calcule le vecteur proba mesure
    
   
    
   
    this.Probas_mesure=[];
  for (let i = 0; i <this.n_Qbits_mesure.length; i++) { 
    if (this.n_Qbits_mesure[i]==undefined)
      this.Probas_mesure.push(0);
   
     else this.Probas_mesure.push(this.n_Qbits_mesure[i].proba);
    
  }
    
    
    
    
    
    
    
    
    let t2=millis();
    print("duree calculnqbitsmesure",t2-t1);
   
  }
  
  
  
  
  
 
  
  
  //METHODE Graphe
  //actualise la valeur this.val_instant_mesure[0] de tous les QBIT
  //qui serait celle affichée à l instant ou mesurée, 0 pour [0> et 1 pour |1>)
  
  //ça calcule porte.val_instant_mesure[0]
  //uniquement pour les lecteurs de change, n intervient pas dans le calcul du nqbit
  actualise_valeur_instantanee_affichée_Ou_mesuree_de_tous_les_Qbit() {
    //on lit les sommets et on les traite dans l ordre des lignes quantiques
    //c est obligatoire , on ne peut pas faire dans l ordre des intrications car une porte multiple apparait sur plusieurs lignes qaubntiques, il, faut gerer toutes ses lignes!!!!!!!!!!!!!!!!!!!!!
    //methode similaire au calcul du nQbit

    //pour chaque QBIT 0,1,2 je pars de lui et je recalcule toute ses sorties
    
    let nbre_Qbits_entree = this.lignes_quantiques.length;

    if (nbre_Qbits_entree == 0) return;
    
    
        //si mesure partielle ou totale, on se contente de calculer la proba de sortie avec le nqbitmesure
      // et on en deduit une valeur affiché pour les porte 64 et 65 non mesurees
       if (OnFaitLesMesures!=0){//DEBUT DE MESURE OU MESURE PARTIELLE
         
         
        
         
         
         
         
      
         //ontire une mesure au hasard du vecteur de probas mesurees
       let indice=tirageAleatoire(this.Probas_mesure);
//if (indice==undefined)print("yoyo20 c est le bug",this.Probas_mesure)
   let etat_mesure=convertit_nombreDecimal_En_StringNombre_binaire(indice,nbre_Qbits_entree);

      
         //pour toutes les portes 64 et 65 non mesurees , on affecte la valeur mesuree de la ligne quantique dans etat_mesure
         for (let i = 0; i < this.TabSommets.length; i++)
      if (this.TabSommets[i] != undefined)
        if (this.TabSommets[i].mesure[0]==false)
          
    if ((this.TabSommets[i].type==64)|| (this.TabSommets[i].type==65)) {
      let index=this.TabSommets[i].num_ligne[0];
         this.TabSommets[i].val_instant_mesure[0]=parseInt(etat_mesure[index], 10)
    }
      else if (this.TabSommets[i].type ==0)  {
          if (random(1) <= this.TabSommets[i].Qbit[0][2])
              this.TabSommets[i].val_instant_mesure[0] = 0;
            else this.TabSommets[i].val_instant_mesure[0] = 1;
      }
      
          return;
       }//FIn DE MESURE OU MESURE PARTIELLE
       
    
    
    
    
    
    
    
    
    
    
    
    
    
    //le bug est si le controle est en dessous, il n influence pas la valeur affichée

    

    for (let num_Qbit_entree = 0;num_Qbit_entree < nbre_Qbits_entree;num_Qbit_entree++) {
      
      let ligneQuantique = this.lignes_quantiques[num_Qbit_entree];
      
      
  
      
      
      
      
      
      
      
      // print(ligneQuantique)
     if (ligneQuantique[0].mesure[0]==false)
      for (let i = 0; i < ligneQuantique.length; i++) {
        
        let porte = ligneQuantique[i];
        
        
        
        
        switch (porte.type) {
          case 0: //Qbit de type a|0> + b.707|1>
            if (random(1) <= porte.Qbit[0][2])
              porte.val_instant_mesure[0] = 0;
            else porte.val_instant_mesure[0] = 1;
            break;
            case 6://porte Y, même chose que pour X on intervertit ket 0 et ket 1
          case 3: //porte X
            //l inverse de l entrant
            if (porte.nAretes_entrantes > 0) {
              
              
              if (this.porte_controle_active(porte) == false) { //dit si la porte controlée fonctionne (true) ou est bloquée par son controle (false)
                //porte controlée
                
                let sommet_avt=this.TabSommets[porte.aretes_entrantes[0].numSommetDepart];
                let indice_avt=sommet_avt.indice_dune_ligne(num_Qbit_entree);
                porte.val_instant_mesure[0] =sommet_avt.val_instant_mesure[indice_avt];
                
              
              } else {
                
                let sommet_avt=this.TabSommets[porte.aretes_entrantes[0].numSommetDepart];
                let indice_avt=sommet_avt.indice_dune_ligne(num_Qbit_entree);
                porte.val_instant_mesure[0] =1^sommet_avt.val_instant_mesure[indice_avt];
                
                
              //  porte.val_instant_mesure[0] =1 ^this.TabSommets[porte.aretes_entrantes[0].numSommetDepart].val_instant_mesure[0];
              }
             
            }
            break;

          case 4: //porte Z elle laisse ket 0 inchangé et change ket 1 en - ket 1 donc ça change pas la valeur affichée
            
           
            if (porte.nAretes_entrantes > 0) {
              
              let sommet_avt=this.TabSommets[porte.aretes_entrantes[0].numSommetDepart];
                let indice_avt=sommet_avt.indice_dune_ligne(num_Qbit_entree);
                porte.val_instant_mesure[0] =sommet_avt.val_instant_mesure[indice_avt];
             // porte.val_instant_mesure[0] =this.TabSommets[porte.aretes_entrantes[0].numSommetDepart].val_instant_mesure[0];
            }

            break;
            
            case 7: //porte R elle laisse ket 0 inchangé et multiplie ket 1 par exp(iphi) donc ça change pas la valeur affichée, que la phase
            if (porte.nAretes_entrantes > 0) {
              
              let sommet_avt=this.TabSommets[porte.aretes_entrantes[0].numSommetDepart];
                let indice_avt=sommet_avt.indice_dune_ligne(num_Qbit_entree);
                porte.val_instant_mesure[0] =sommet_avt.val_instant_mesure[indice_avt];
             // porte.val_instant_mesure[0] =this.TabSommets[porte.aretes_entrantes[0].numSommetDepart].val_instant_mesure[0];
            }

            break;

          case 5: //porte H change ket 0 en (ket0+ket1)/racine 2 et k1 en (ket0-ket1)/racine 2
            if (porte.nAretes_entrantes > 0) {
              if (this.porte_controle_active(porte) == false) {
                //porte controlée
                let sommet_avt=this.TabSommets[porte.aretes_entrantes[0].numSommetDepart];
                let indice_avt=sommet_avt.indice_dune_ligne(num_Qbit_entree);
                porte.val_instant_mesure[0] =sommet_avt.val_instant_mesure[indice_avt];

                //porte.val_instant_mesure[0] = this.TabSommets[porte.aretes_entrantes[0].numSommetDepart].val_instant_mesure[0];
              } else {
                if (random(1) <= porte.Qbit[0][2])
                  porte.val_instant_mesure[0] = 0;
                else porte.val_instant_mesure[0] = 1;
              }
            }

            break;

          case 16:
          case 17:
          case 65 ://mesure
          case 64: //proba ou mesure = qbitentrant ou controle anticontrole
            //print(porte.type)
            if (porte.nAretes_entrantes > 0) {
              
               let sommet_avt=this.TabSommets[porte.aretes_entrantes[0].numSommetDepart];
                let indice_avt=sommet_avt.indice_dune_ligne(num_Qbit_entree);
              porte.val_instant_mesure[0] =sommet_avt.val_instant_mesure[indice_avt];
           
            //if (porte.type==64)print("lili",porte.val_instant_mesure[0])
            } else porte.val_instant_mesure[0] = undefined;
            
            break;
            
            
            
            case 10://oracle a plusieurs entrées
            
             //indice des aretes de cette ligne quantique
             let indice=porte.indice_dune_ligne(num_Qbit_entree);
            // print("indice",indice,"numqbitentree",num_Qbit_entree)
             //si une seule entré ou sur les n-1 premieres lignes l oracle ne fonctionne pas
             if ((indice==0) || (indice<(porte.nAretes_entrantes-porte.phase_nombre))){
              
                  let sommet_avt=this.TabSommets[porte.aretes_entrantes[indice].numSommetDepart];
             
                  let indice_avt=sommet_avt.indice_dune_ligne(num_Qbit_entree);
                  porte.val_instant_mesure[indice] = sommet_avt.val_instant_mesure[indice_avt]; 
               
                }
            
            
            
            else {//derniere ligne, on calcule la proba
               if (random(1) <= porte.Qbit[indice][2])
                  porte.val_instant_mesure[indice] = 0;
                else porte.val_instant_mesure[indice] = 1;
              
            }
           
            
            
            
            break;
            
            case 11://diffuseur de grover
            
            //indice des aretes de cette ligne quantique
             let ind=porte.indice_dune_ligne(num_Qbit_entree);
             if (random(1) <= porte.Qbit[ind][2])
                  porte.val_instant_mesure[ind] = 0;
                else porte.val_instant_mesure[ind] = 1;
            
            
            break;
            
            
            case 8://porte simple créée
            case 9://porte multiple créée
            case 15://porte racine swap matrice
            case 32://porte racine x matrice
             case 12://porte swap
            
            //indice des aretes de cette ligne quantique
             let ind2=porte.indice_dune_ligne(num_Qbit_entree);
             if (random(1) <= porte.Qbit[ind2][2])
                  porte.val_instant_mesure[ind2] = 0;
                else porte.val_instant_mesure[ind2] = 1;
            
            
            break;
            
            case 13://Fourier
            
            //indice des aretes de cette ligne quantique
             let indF=porte.indice_dune_ligne(num_Qbit_entree);
             if (random(1) <= porte.Qbit[indF][2])
                  porte.val_instant_mesure[indF] = 0;
                else porte.val_instant_mesure[indF] = 1;
            
            
            break;
            
            
            case 14://Fourier inverse
            
            //indice des aretes de cette ligne quantique
             let indFi=porte.indice_dune_ligne(num_Qbit_entree);
             if (random(1) <= porte.Qbit[indFi][2])
                  porte.val_instant_mesure[indFi] = 0;
                else porte.val_instant_mesure[indFi] = 1;
            
            
            break;
            
            
            
            
            
        }
      }
    }
  }
  
 
  
  
  

  //METHODE DE LA CLASS
  //donne le numero du sommet s il y en a un a cet endroit de la souris
  NumSommetQuiTouche() {
    for (let i = 0; i < this.TabSommets.length; i++) {
      if (this.TabSommets[i] != undefined)
        if (this.TabSommets[i].testToucheSommet(mouseX, mouseY) == true) {
          return i;
        }
    }
    return -1;
  }
 
   //donne la liste des numeros de sommets suceptibles de participer à un controle dans la bande verticale ou se trouve la souris avec sommet de numero
   ListeNumDesSommetsPouvantControleDansLaBandeVerticaleQueToucheSouris(type,num_ligne) {
    
    let L=[];
    //1er cas outype est un controle
     if ((type==16)||(type==17)){
       
       
       for (let i = 0; i < this.TabSommets.length; i++) 
      if (this.TabSommets[i] != undefined)
        if (this.TabSommets[i].type<64)//pas une mesure, image etc...
          if (this.TabSommets[i].type!=0)//pas un qbit
           
            if (num_ligne!=this.TabSommets[i].num_ligne[0])
            if (abs(this.TabSommets[i].x-mouseX)<this.TabSommets[i].rayon)
             //ici il faut un controle qui sera le sommet de depart
              //et un non controle qui sera le sommet  darrivié
              
               if (this.TabSommets[i].accepte_controle==true)
              if( (this.TabSommets[i].type!=16)&&(this.TabSommets[i].type!=17))
                   {
               
              L.push(i);
            }
          
      }else{//type n est pas un controle
        
        if ((type!=11)&&(type!=13)&&(type!=14))//portes qui n acceptent pas le controle
        for (let i = 0; i < this.TabSommets.length; i++) 
      if (this.TabSommets[i] != undefined)
        if (this.TabSommets[i].type<64)//pas une mesure, image etc...
          if (this.TabSommets[i].type!=0)//pas un qbit
            
            if (num_ligne!=this.TabSommets[i].num_ligne[0])
            if (abs(this.TabSommets[i].x-mouseX)<this.TabSommets[i].rayon)
             //ici il faut un controle qui sera le sommet de depart
              //et un non controle qui sera le sommet  darrivié
              
              if
                ((this.TabSommets[i].type==16)||(this.TabSommets[i].type==17))  {
               
              L.push(i);
            }
        
      }
     
/*
    for (let i = 0; i < this.TabSommets.length; i++) 
      if (this.TabSommets[i] != undefined)
        if (this.TabSommets[i].type<64)//pas une mesure, image etc...
          if (this.TabSommets[i].type!=0)//pas un qbit
            if (this.TabSommets[i].accepte_controle==true)
            if (num_ligne!=this.TabSommets[i].num_ligne[0])
            if (abs(this.TabSommets[i].x-mouseX)<this.TabSommets[i].rayon)
             //ici il faut un controle qui sera le sommet de depart
              //et un non controle qui sera le sommet  darrivié
              
              if( (((type==16)||(type==17))&&((this.TabSommets[i].type!=16)&&(this.TabSommets[i].type!=17)))
                ||
                (((this.TabSommets[i].type==16)||(this.TabSommets[i].type==17))&&((type!=16)&&(type!=17)))    )  {
              
             
                
               
              L.push(i);
            }
              
              
       
     */
     
     
     
     
    return L;
  }
    
  
  
  
   //si souris touche arete, donne le numero du sommet de depart, du sommet d arrivées, les coordonnées xy de projection sur l arete,et le numero de la ligne de l arete
   NumDesSommetsDontLAreteToucheSouris() {
    
    
    var dia = 20;

    for (let i = 0; i < this.TabSommets.length; i++) 
      if (this.TabSommets[i] != undefined)
        for (let j = 0; j < this.TabSommets[i].nAretes_sortantes; j++) {
          let arete = this.TabSommets[i].aretes_sortantes[j];
          let dmin=diametre_default_sommet/2;
          
          if (mouseX>=min(arete.xA,arete.xB)-dmin)
            if (mouseX<=max(arete.xA,arete.xB)+dmin)
              if (mouseY>=min(arete.yA,arete.yB)-dmin)
            if (mouseY<=max(arete.yA,arete.yB)+dmin)
              {
                
                //renvoie d=[distance de la droite, coordX du point de projection,CoordY]
                let d=distance_a_une_droite(arete.xA, arete.yA, arete.xB, arete.yB, mouseX, mouseY);
                
                //print(d[0],d[1],d[2])
                 if ((d[0]<5)||(d[0]<(dmin)))
                
                 
                 {
          //  print("droite et souris",arete.xA, arete.yA, arete.xB, arete.yB, mouseX, mouseY)
           // print("depart=",i,"depart2=",arete.numSommetDepart,"arrive=",arete.numSommetArrive)
           return [i,arete.numSommetArrive,d[1],d[2],arete.numero_ligne_quantique];
          }
                
              }
              
              
         
          
    }
    
    return undefined;
  }
  
  

  //METHODE DE LA CLASS
  //donne l identifiant de l arete il y en a un a cet endroit de la souris
  //detecte si la souris est sur le cercle gris
  NumAreteQuiTouchePetitCercle() {
    /*var a;
    var b;
    var c;
    var d;
    var xfleche;
    var yfleche;
    var numSommetArrive;
    */

    var dia = 20;

    for (let i = 0; i < this.TabSommets.length; i++) {
      if (this.TabSommets[i] != undefined){
        
        for (let j = 0; j < this.TabSommets[i].nAretes_sortantes; j++) {
          let arete = this.TabSommets[i].aretes_sortantes[j];

          if (
            mouseX < arete.xfleche + dia &&
            mouseX > arete.xfleche - dia &&
            mouseY < arete.yfleche + dia &&
            mouseY > arete.yfleche - dia) {
            return [i, j,0];//num sommet, num arete, controle ou pas
          }
            
        }
        
        if ((this.TabSommets[i].type==16)||(this.TabSommets[i].type==17))
        for (let j = 0; j < this.TabSommets[i].nAretes_controle; j++) {
          let arete = this.TabSommets[i].aretes_controle[j];

          if (
            mouseX < arete.xfleche + dia &&
            mouseX > arete.xfleche - dia &&
            mouseY < arete.yfleche + dia &&
            mouseY > arete.yfleche - dia) {
            return [i, j,1]; //num sommet, num arete, controle ou pas
           
          }
            
        }
        
        
        
        
      }
    }
    return [-1, -1];
  }

  
  //METHODE CLASSE
  SupprimeAreteDeControle(
    num_sommet_depart,
    num_sommet_arrive,option_fichier=false
  ) {
      
      
    let Sommet_Depart = this.TabSommets[num_sommet_depart];
    let Sommet_Arrive = this.TabSommets[num_sommet_arrive];
      
      
      
    //si l arete de controle existe deja on la supprime
    for (let i = 0; i < Sommet_Depart.nAretes_controle; i++) {
      if (
        Sommet_Depart.aretes_controle[i].numSommetArrive == num_sommet_arrive
      ) {
        //cette arete existe, on la supprime

       // print("cette arete de controle sortante ",num_sommet_depart," ",num_sommet_arrive, "existe je la supprime");
        Sommet_Depart.nAretes_controle--;
        Sommet_Depart.aretes_controle.splice(i, 1);

        //ETj e supprimme l arete entrante
        for (let j = 0; j < Sommet_Arrive.nAretes_controle; j++) {
          if (
            Sommet_Arrive.aretes_controle[j].numSommetDepart ==
            num_sommet_depart
          ) {
            //cette arete existe, on la supprime
          //  print("cette arete entrante de controle existe je la supprime");
            Sommet_Arrive.nAretes_controle--;
            Sommet_Arrive.aretes_controle.splice(j, 1);

           
            //if (option_fichier==false) this.calcul_LignesQuantiQues_nQbitsEntree_nQbitsSortie();
            
            return;
          }
        }
      }
    }

   
 
  }

  //METHODE CLASSE
  ajouteAreteDeControle(
    num_sommet_depart,
    num_sommet_arrive,option_fichier=false
  ) {
      
      
    let Sommet_Depart = this.TabSommets[num_sommet_depart];
    let Sommet_Arrive = this.TabSommets[num_sommet_arrive];
      
    
    Sommet_Depart.nAretes_controle++;
    Sommet_Arrive.nAretes_controle++;

    let a = Sommet_Depart.x;
    let b = Sommet_Depart.y;

    let c = Sommet_Arrive.x;
    let d = Sommet_Arrive.y;

    let arete = new Arete(num_sommet_depart, num_sommet_arrive, a, b, c, d);
    arete.couleur = [255, 0, 0];
    arete.epaisseur = 2 * epaisseur_default_arete;
    Sommet_Depart.aretes_controle.push(arete);

    Sommet_Arrive.aretes_controle.push(arete);
      
      
  return arete;

  
  
      
 
  }
  
  //insere un sommet entre 2 sommets en supprimant l arete qui les reliait et en recréant deux aretes aux mêmes endroits des listes aretes sortantes et entrantes
  insereSommet_entre_2_sommets(num_sommet_depart, num_sommet_arrive,Nouveau_Sommet,num_ligne_quantique){
    
    //on repere d abord les 2 numeros des aretet, pour l arete sortante et l arete etrante
    
    
    //print("INSERE le numero est ",num_sommet_depart, num_sommet_arrive,Nouveau_Sommet.type,num_ligne_quantique)
    
    let Sommet_Depart = this.TabSommets[num_sommet_depart];
    let Sommet_Arrive = this.TabSommets[num_sommet_arrive];
    
   // print("insere",Sommet_Depart,Sommet_Arrive)
  
    let i_depart=undefined;
    let i_arrive=undefined;
    let x_depart;
    let  y_depart;
    let x_arrive;
    let  y_arrive;

    for (let i = 0; i < Sommet_Depart.nAretes_sortantes; i++) 
      if (Sommet_Depart.aretes_sortantes[i].numero_ligne_quantique==num_ligne_quantique)
      if (
        Sommet_Depart.aretes_sortantes[i].numSommetArrive == num_sommet_arrive
      ) {
        
       
        
        
        x_depart=Sommet_Depart.aretes_sortantes[i].xA; 
        y_depart=Sommet_Depart.aretes_sortantes[i].yA; 
        i_depart=i;break;
        
      }
        
      
      for (let i = 0; i < Sommet_Arrive.nAretes_entrantes; i++) 
         if (Sommet_Arrive.aretes_entrantes[i].numero_ligne_quantique==num_ligne_quantique)
          if (
            Sommet_Arrive.aretes_entrantes[i].numSommetDepart ==num_sommet_depart
          ) { 
            
             
            x_arrive=Sommet_Arrive.aretes_entrantes[i].xB; 
        y_arrive=Sommet_Arrive.aretes_entrantes[i].yB; 
            i_arrive=i;break;
          }
      
   
      //on cree l arete entre la position de la sortante et le nouveauSommet  
    
    //Sommet_Depart.nAretes_sortantes++; ici on le remplace donc ça change pas
    Nouveau_Sommet.nAretes_entrantes++;
    
    let y_sommet;
    if (Nouveau_Sommet.porte_multiple==true)
     y_sommet=(y_depart+y_arrive)/2;
    else y_sommet=Nouveau_Sommet.y;
    

    let a = x_depart;//Sommet_Depart.x;
    let b = y_depart;//Sommet_Depart.y;

    let c = Nouveau_Sommet.x;
    let d = y_sommet;//Nouveau_Sommet.y;

    /*
    if (
      Nouveau_Sommet.type == 3 ||
      Nouveau_Sommet.type == 4 ||
      Nouveau_Sommet.type == 5
    ) {
      //la sortie est à 1.5*rayon et l'entree' est à 1.5*rayon
      c = c - 1.5 * Nouveau_Sommet.rayon;
    }

     
    if (
      Sommet_Depart.type == 3 ||
      Sommet_Depart.type == 4 ||
      Sommet_Depart.type == 5
    ) {
      //la sortie est à 1.5*rayon et l'entree' est à 1.5*rayon

      a = a + 1.5 * Sommet_Depart.rayon;
    }
*/
    let arete = new Arete(num_sommet_depart, Nouveau_Sommet.numeroSommet, a, b, c, d);
    
   // print("arete sort",arete)
    Sommet_Depart.aretes_sortantes[i_depart]=arete;
    Nouveau_Sommet.aretes_entrantes.push(arete); 
    
    //print("preier",Sommet_Depart,Nouveau_Sommet)
    //on cree l arete entre  le nouveauSommet  et le sommetarrive
    
     Nouveau_Sommet.nAretes_sortantes++;
    

     a = Nouveau_Sommet.x;
     b = y_sommet;//Nouveau_Sommet.y;

     c = x_arrive;//Sommet_Arrive.x;let  
     d = y_arrive;//Sommet_Arrive.y;
/*
    if (
      Sommet_Arrive.type == 3 ||
      Sommet_Arrive.type == 4 ||
      Sommet_Arrive.type == 5
    ) {
      //la sortie est à 1.5*rayon et l'entree' est à 1.5*rayon
      c = c - 1.5 * Sommet_Arrive.rayon;
    }

    if (
      Nouveau_Sommet.type == 3 ||
      Nouveau_Sommet.type == 4 ||
      Nouveau_Sommet.type == 5
    ) {
      //la sortie est à 1.5*rayon et l'entree' est à 1.5*rayon

      a = a + 1.5 * Nouveau_Sommet.rayon;
    }
*/
    arete = new Arete(Nouveau_Sommet.numeroSommet, num_sommet_arrive, a, b, c, d);
    
   // print("arete arrive",arete)
    Nouveau_Sommet.aretes_sortantes.push(arete);

    Sommet_Arrive.aretes_entrantes[i_arrive]=arete;
    
    //print("deus",Nouveau_Sommet,Sommet_Arrive)
  
       
  }
  
  
  
 
//METHODE SOMMET
  SupprimeArete(num_sommet_depart, num_sommet_arrive,option_fichier=false) {
    // ajoute une arete de ce noeud vers le noeud i

    let Sommet_Depart = this.TabSommets[num_sommet_depart];
    let Sommet_Arrive = this.TabSommets[num_sommet_arrive];
    
    let ar =undefined;//arete supprimée qu on retourne
  
 
    //si l arete existe deja on la supprime

    for (let i = 0; i < Sommet_Depart.nAretes_sortantes; i++) {
      if (
        Sommet_Depart.aretes_sortantes[i].numSommetArrive == num_sommet_arrive
      ) {
        //cette arete existe, on la supprime
        if (debug_affiche_creation_daretes==true)
       print("cette arete sortante ",num_sommet_depart," ",num_sommet_arrive, "existe je la supprime")
        
        
        //je mets a jour les suivants et precedents de cette arete
        ar=Sommet_Depart.aretes_sortantes[i];
        // ar.suppr_suiv();
        // ar.suppr_prec();
   
        
        
        
        
        Sommet_Depart.nAretes_sortantes--;
        Sommet_Depart.aretes_sortantes.splice(i, 1);
        
        
        
        
        
        
        

        //ETj e supprimme l arete entrante
        for (let j = 0; j < Sommet_Arrive.nAretes_entrantes; j++) {
          if (
            Sommet_Arrive.aretes_entrantes[j].numSommetDepart ==
            num_sommet_depart
          ) {
            //cette arete existe, on la supprime
            if (debug_affiche_creation_daretes==true)
              print("cette arete ENTRANTE ",num_sommet_depart," ",num_sommet_arrive, "existe je la supprime")
            Sommet_Arrive.nAretes_entrantes--;

            if (Sommet_Arrive.nAretes_entrantes == 0)
              //Sommet_Arrive.Qbit[0] = [undefined, undefined, undefined, undefined];
            //a partir de (x+yi)|0>+(z+wi)|1> calcul this.Qbit[n][coeff1,ceoff2,P0,P1]
               Sommet_Arrive.calcul_coeff_Qbit(undefined,0,undefined,0,0);
            
            Sommet_Arrive.aretes_entrantes.splice(j, 1);

           
            //if (option_fichier==false) this.calcul_LignesQuantiQues_nQbitsEntree_nQbitsSortie();

            return ar;
          }
        }
      }
    }

   
    return undefined;
   
  }  
  
  //METHODE SOMMET
  ajouteArete(num_sommet_depart, num_sommet_arrive,option_fichier=false) {
    // ajoute une arete de ce noeud vers le noeud i

    let Sommet_Depart = this.TabSommets[num_sommet_depart];
    let Sommet_Arrive = this.TabSommets[num_sommet_arrive];
    
    
  
    
  

    Sommet_Depart.nAretes_sortantes++;
    Sommet_Arrive.nAretes_entrantes++;

    let a = Sommet_Depart.x;
    let b = Sommet_Depart.y;

    let c = Sommet_Arrive.x;
    let d = Sommet_Arrive.y;

    
    /*
    if (
      Sommet_Arrive.type == 3 ||
      Sommet_Arrive.type == 4 ||
      Sommet_Arrive.type == 5
    ) {
      //la sortie est à 1.5*rayon et l'entree' est à 1.5*rayon
      c = c - 1.5 * Sommet_Arrive.rayon;
    }

    if (
      Sommet_Depart.type == 3 ||
      Sommet_Depart.type == 4 ||
      Sommet_Depart.type == 5
    ) {
      //la sortie est à 1.5*rayon et l'entree' est à 1.5*rayon

      a = a + 1.5 * Sommet_Arrive.rayon;
    }
    */
    let arete = new Arete(num_sommet_depart, num_sommet_arrive, a, b, c, d);
    if (debug_affiche_creation_daretes==true)
    print("cette arete n existe pas je la cree ",num_sommet_depart," ",num_sommet_arrive)
    Sommet_Depart.aretes_sortantes.push(arete);

    Sommet_Arrive.aretes_entrantes.push(arete);
    
    //if (option_fichier==false)this.calcul_LignesQuantiQues_nQbitsEntree_nQbitsSortie();

   return arete;
  }

  //METHODE CLASS
  calcul_nQbits_apres_passage_dune_porte(porte,Qbit_entrant,num_Qbit_entree,nbre_Qbits_entree) {
    let P; //probas
  // print("porte traitée",porte.type,Qbit_entrant,num_Qbit_entree,nbre_Qbits_entree)
    switch (porte.type) {
        
        
        
        
        
      case 3: //porte X
        if (Qbit_entrant[0].x == undefined || porte.nAretes_controle > 0) {
          //porte.Qbit[0] = [undefined, undefined, undefined, undefined];
          porte.calcul_coeff_Qbit(undefined,0,undefined,0,0);
        } else {
         // porte.Qbit[0] = [Qbit_entrant[1], Qbit_entrant[0], undefined, undefined];
          porte.calcul_coeff_Qbit(Qbit_entrant[1].x,Qbit_entrant[1].y,Qbit_entrant[0].x,Qbit_entrant[0].y,0);
          porte.Qbit[0][2]=undefined;porte.Qbit[0][3]=undefined;//probas
        }

        if (porte.nAretes_controle > 0) {
         
          porte.calcul_coeff_Qbit(undefined,0,undefined,0,0);
      
        
        } //pas de controle
      
        
         this.n_Qbits_sortie = applique_Porte_X(this.n_Qbits_sortie,num_Qbit_entree,nbre_Qbits_entree,porte.aretes_controle);
        
         
       
        P = calcul_probas_pour_un_Qbit_numeroQbit_du_nQbit(this.n_Qbits_sortie,num_Qbit_entree,nbre_Qbits_entree);
        porte.Qbit[0][2] = P[0] / 100;
        porte.Qbit[0][3] = P[1] / 100;
        // if (porte.nAretes_controle>0) //porte controlée
        // this.TabSommets[porte.aretes_controle[0].numSommetDepart].num_ligne[0];

        break;
        
        
        case 6: //porte Y
        if (Qbit_entrant[0].x == undefined || porte.nAretes_controle > 0) {
          porte.calcul_coeff_Qbit(undefined,0,undefined,0,0);
        } else {
          porte.calcul_coeff_Qbit(Qbit_entrant[1].y,-Qbit_entrant[1].x,-Qbit_entrant[0].y,Qbit_entrant[0].x,0);
          porte.Qbit[0][2]=undefined;porte.Qbit[0][3]=undefined;//probas
        }

        if (porte.nAretes_controle > 0) {
         
          porte.calcul_coeff_Qbit(undefined,0,undefined,0,0);
          
        } //pas de controle
       
          
          
          this.n_Qbits_sortie = applique_Porte_Y(this.n_Qbits_sortie,num_Qbit_entree,nbre_Qbits_entree,porte.aretes_controle);
        
       
        P = calcul_probas_pour_un_Qbit_numeroQbit_du_nQbit(this.n_Qbits_sortie,num_Qbit_entree,nbre_Qbits_entree);
        porte.Qbit[0][2] = P[0] / 100;
        porte.Qbit[0][3] = P[1] / 100;
        // if (porte.nAretes_controle>0) //porte controlée
        // this.TabSommets[porte.aretes_controle[0].numSommetDepart].num_ligne[0];

        break;

      case 4: //porte Z elle laisse ket 0 inchangé et change ket 1 en - ket 1
        if (Qbit_entrant[0].x == undefined || porte.nAretes_controle > 0) {
          //porte.Qbit[0] = [undefined, undefined, undefined, undefined];
          porte.calcul_coeff_Qbit(undefined,0,undefined,0,0);
          
          
        } else {
          //porte.Qbit[0] = [Qbit_entrant[0],-Qbit_entrant[1],undefined,undefined];
          
          porte.calcul_coeff_Qbit(Qbit_entrant[0].x,Qbit_entrant[0].y,-Qbit_entrant[1].x,-Qbit_entrant[1].y,0);
          porte.Qbit[0][2]=undefined;porte.Qbit[0][3]=undefined;//probas
        }

        
        
        if (porte.nAretes_controle > 0) {
          
          porte.calcul_coeff_Qbit(undefined,0,undefined,0,0);
         
          
        } //pas de controle
        
          this.n_Qbits_sortie = applique_Porte_Z(this.n_Qbits_sortie,num_Qbit_entree,nbre_Qbits_entree,porte.aretes_controle);
       

        P = calcul_probas_pour_un_Qbit_numeroQbit_du_nQbit(
          this.n_Qbits_sortie,
          num_Qbit_entree,
          nbre_Qbits_entree
        );
        porte.Qbit[0][2] = P[0] / 100;
        porte.Qbit[0][3] = P[1] / 100;

        break;
        
        
          case 7: //porte R elle laisse ket 0 inchangé et multiplie ket 1 par 'exp(iphi)'
        
       
        
        
        if (Qbit_entrant[0].x == undefined || porte.nAretes_controle > 0) {
          //porte.Qbit[0] = [undefined, undefined, undefined, undefined];
          porte.calcul_coeff_Qbit(undefined,0,undefined,0,0);
          
          
        } else {
         
          
          let x= Qbit_entrant[1].x*Math.cos(porte.phase_nombre)-Qbit_entrant[1].y*Math.sin(porte.phase_nombre);
          let y= Qbit_entrant[1].x*Math.sin(porte.phase_nombre)+Qbit_entrant[1].y*Math.cos(porte.phase_nombre);
          
          
          
          
          porte.calcul_coeff_Qbit(Qbit_entrant[0].x,Qbit_entrant[0].y,x,y,0);
         
          
          porte.Qbit[0][2]=undefined;porte.Qbit[0][3]=undefined;//probas
        }

       
        
        if (porte.nAretes_controle > 0) {
           //pssible intrication, impossible a afficher
          porte.calcul_coeff_Qbit(undefined,0,undefined,0,0);
         
        } //pas de controle
       
          this.n_Qbits_sortie = applique_Porte_R(this.n_Qbits_sortie,num_Qbit_entree,nbre_Qbits_entree,porte.phase_nombre,porte.aretes_controle);
       

        P = calcul_probas_pour_un_Qbit_numeroQbit_du_nQbit(
          this.n_Qbits_sortie,
          num_Qbit_entree,
          nbre_Qbits_entree
        );
        porte.Qbit[0][2] = P[0] / 100;
        porte.Qbit[0][3] = P[1] / 100;

        break;

      case 5: //porte H change ket 0 en (ket0+ket1)/racine 2 et k1 en (ket0-ket1)/racine 2
        if (Qbit_entrant[0].x == undefined || porte.nAretes_controle > 0) {
         // porte.Qbit[0] = [undefined, undefined, undefined, undefined];
          
          porte.calcul_coeff_Qbit(undefined,0,undefined,0,0);
         
          
        } else {
          let ket0x = (Qbit_entrant[0].x + Qbit_entrant[1].x) / sqrt(2);
          let ket1x = (Qbit_entrant[0].x - Qbit_entrant[1].x) / sqrt(2);
          let ket0y = (Qbit_entrant[0].y + Qbit_entrant[1].y) / sqrt(2);
          let ket1y = (Qbit_entrant[0].y - Qbit_entrant[1].y) / sqrt(2);
          //porte.Qbit[0] = [ket0, ket1, undefined, undefined];
          
          porte.calcul_coeff_Qbit(ket0x,ket0y,ket1x,ket1y,0);
          porte.Qbit[0][2]=undefined;porte.Qbit[0][3]=undefined;//probas
          
        }
        
        
         
        if (porte.nAretes_controle > 0) {
          //pssible intrication, impossible a afficher
          
          porte.calcul_coeff_Qbit(undefined,0,undefined,0,0);
          
         
        } //pas de controle
        
          this.n_Qbits_sortie = applique_Porte_H(this.n_Qbits_sortie,num_Qbit_entree,nbre_Qbits_entree,porte.aretes_controle);
        
        
        
        
        
        P = calcul_probas_pour_un_Qbit_numeroQbit_du_nQbit(this.n_Qbits_sortie,num_Qbit_entree,nbre_Qbits_entree);
        porte.Qbit[0][2] = P[0] / 100;
        porte.Qbit[0][3] = P[1] / 100;
        break;

      case 16://qbitentrant ou controle ou anticontrole
      case 17: //possiblité intrication, on n affiche pas le Qbit car il peut etre indefini
        //porte.Qbit[0] = [undefined, undefined, Qbit_entrant[2], Qbit_entrant[3]];
        
        porte.calcul_coeff_Qbit(undefined,0,undefined,0,0);
        porte.Qbit[0][2]=Qbit_entrant[2];porte.Qbit[0][3]= Qbit_entrant[3];//probas
        
        
        
        P = calcul_probas_pour_un_Qbit_numeroQbit_du_nQbit(this.n_Qbits_sortie,num_Qbit_entree,nbre_Qbits_entree);
        porte.Qbit[0][2] = P[0] / 100;
        porte.Qbit[0][3] = P[1] / 100;
        break;

      case 64://Proba
      case 65: //mesure
        
        
        
        //porte.Qbit[0] = [Qbit_entrant[0],Qbit_entrant[1],Qbit_entrant[2],Qbit_entrant[3]];
        
        porte.calcul_coeff_Qbit(Qbit_entrant[0].x,Qbit_entrant[0].y,Qbit_entrant[1].x,Qbit_entrant[1].y,0);
        
        
        P = calcul_probas_pour_un_Qbit_numeroQbit_du_nQbit(this.n_Qbits_sortie,num_Qbit_entree,nbre_Qbits_entree);
        porte.Qbit[0][2] = P[0] / 100;
        porte.Qbit[0][3] = P[1] / 100;
        
        porte.ancienne_proba=[porte.Qbit[0][2],porte.Qbit[0][3]];
        
        
        break;
        
        case 8://porte simple cree avec matreice
         case 9: //porte multiple créé avec matrice
              
        
        if (porte.nAretes_entrantes==porte.nAretes_max)
          
           this.n_Qbits_sortie = applique_Porte_Universelle(this.n_Qbits_sortie,porte.num_ligne,nbre_Qbits_entree,porte.matrice,porte.aretes_controle);
        
    
         
        
               for (let k = 0; k <porte.nAretes_entrantes; k++){
       
                    let num_ligne=porte.num_ligne[k];
       
          
                    P = calcul_probas_pour_un_Qbit_numeroQbit_du_nQbit(this.n_Qbits_sortie,num_ligne,nbre_Qbits_entree);
                    porte.calcul_coeff_Qbit(undefined,0,undefined,0,k); 
      
        
      
                    porte.Qbit[k][2] = P[0] / 100;
                    porte.Qbit[k][3] = P[1] / 100;
        
          
               }
        
       
        break;
        
        
        
        
         case 10: //oracle
              
       
       
         // this.n_Qbits_sortie =applique_Porte_Oracle(this.n_Qbits_sortie,porte.num_ligne,nbre_Qbits_entree,porte.f_oracle,porte.aretes_controle);
        
        this.n_Qbits_sortie =applique_Porte_Oracle(this.n_Qbits_sortie,porte.num_ligne,nbre_Qbits_entree,porte.f_oracle,porte.phase_nombre,porte.aretes_controle);
         
        
    for (let k = 0; k <porte.nAretes_entrantes; k++){
       
        let num_ligne=porte.num_ligne[k];
       
          
        P = calcul_probas_pour_un_Qbit_numeroQbit_du_nQbit(this.n_Qbits_sortie,num_ligne,nbre_Qbits_entree);
         porte.calcul_coeff_Qbit(undefined,0,undefined,0,k); 
      
        
        
      //porte.Qbit[k][0] =undefined;
       // porte.Qbit[k][1] = undefined;
      
        porte.Qbit[k][2] = P[0] / 100;
        porte.Qbit[k][3] = P[1] / 100;
        //  print("proba pour lentree",k," =",porte.Qbit[k][2]," et",porte.Qbit[k][3])
        
          
        }
        
       
        
       
        
       
        break;
        
        
        case 11: //diffuseur de grover, gere pas le controle
              
        
          
          this.n_Qbits_sortie =applique_Porte_Diffuseur_grover(this.n_Qbits_sortie,porte.num_ligne,nbre_Qbits_entree);
       
        
    for (let k = 0; k <porte.nAretes_entrantes; k++){
       
        let num_ligne=porte.num_ligne[k];
       
          
        P = calcul_probas_pour_un_Qbit_numeroQbit_du_nQbit(this.n_Qbits_sortie,num_ligne,nbre_Qbits_entree);
      
       // porte.Qbit[k][0] =undefined;
        //porte.Qbit[k][1] = undefined;
        porte.calcul_coeff_Qbit(undefined,0,undefined,0,k); 
      
      
        porte.Qbit[k][2] = P[0] / 100;
        porte.Qbit[k][3] = P[1] / 100;
        //  print("proba pour lentree",k," =",porte.Qbit[k][2]," et",porte.Qbit[k][3])
        
          
        }
        
       
        
       
        
       
        break;
        
        
        
         case 13: //Fourier, gere pas le controle
       
       this.n_Qbits_sortie =applique_Porte_Transformee_Fourier(this.n_Qbits_sortie,porte.num_ligne,nbre_Qbits_entree,false);
        
    for (let k = 0; k <porte.nAretes_entrantes; k++){
       
        let num_ligne=porte.num_ligne[k];
       
          
        P = calcul_probas_pour_un_Qbit_numeroQbit_du_nQbit(this.n_Qbits_sortie,num_ligne,nbre_Qbits_entree);
      
        porte.calcul_coeff_Qbit(undefined,0,undefined,0,k); 
      
      
        porte.Qbit[k][2] = P[0] / 100;
        porte.Qbit[k][3] = P[1] / 100;
        //  print("proba pour lentree",k," =",porte.Qbit[k][2]," et",porte.Qbit[k][3])
        
          
        }
        
       
        
       
        
       
        break;
        
        
         case 14: //Fourier inverse, gere pas le controle
              
        this.n_Qbits_sortie =applique_Porte_Transformee_Fourier(this.n_Qbits_sortie,porte.num_ligne,nbre_Qbits_entree,true);
       
        
    for (let k = 0; k <porte.nAretes_entrantes; k++){
       
        let num_ligne=porte.num_ligne[k];
       
          
        P = calcul_probas_pour_un_Qbit_numeroQbit_du_nQbit(this.n_Qbits_sortie,num_ligne,nbre_Qbits_entree);
      
        porte.calcul_coeff_Qbit(undefined,0,undefined,0,k); 
      
      
        porte.Qbit[k][2] = P[0] / 100;
        porte.Qbit[k][3] = P[1] / 100;
        //  print("proba pour lentree",k," =",porte.Qbit[k][2]," et",porte.Qbit[k][3])
        
          
        }
        
       
        
       
        
       
        break;
        
        
         case 12: //porte swap, gere  le controle
              
         
          if (porte.nAretes_entrantes==2)
          this.n_Qbits_sortie =applique_Porte_SWAP(this.n_Qbits_sortie,porte.num_ligne[0],porte.num_ligne[1],nbre_Qbits_entree,porte.aretes_controle);
       
        
    for (let k = 0; k <porte.nAretes_entrantes; k++){
       
        let num_ligne=porte.num_ligne[k];
       
          
        P = calcul_probas_pour_un_Qbit_numeroQbit_du_nQbit(this.n_Qbits_sortie,num_ligne,nbre_Qbits_entree);
      
       // porte.Qbit[k][0] =undefined;
        //porte.Qbit[k][1] = undefined;
        porte.calcul_coeff_Qbit(undefined,0,undefined,0,k); 
      
      
        porte.Qbit[k][2] = P[0] / 100;
        porte.Qbit[k][3] = P[1] / 100;
        //  print("proba pour lentree",k," =",porte.Qbit[k][2]," et",porte.Qbit[k][3])
        
          
        }
        
       
        
       
        
       
        break;
        
        case 15: //porte racine swap créé avec matrice
        
        if (porte.nAretes_entrantes==porte.nAretes_max)
           this.n_Qbits_sortie =applique_Porte_Racine_SWAP(this.n_Qbits_sortie,porte.num_ligne,nbre_Qbits_entree,porte.aretes_controle);
        
               for (let k = 0; k <porte.nAretes_entrantes; k++){
                    let num_ligne=porte.num_ligne[k];
                    P = calcul_probas_pour_un_Qbit_numeroQbit_du_nQbit(this.n_Qbits_sortie,num_ligne,nbre_Qbits_entree);
                    porte.calcul_coeff_Qbit(undefined,0,undefined,0,k); 
      
                    porte.Qbit[k][2] = P[0] / 100;
                    porte.Qbit[k][3] = P[1] / 100;
               }
        break;
        
        case 32: //porte racine X créé avec matrice
        
        
           this.n_Qbits_sortie =applique_Porte_Racine_X(this.n_Qbits_sortie,porte.num_ligne,nbre_Qbits_entree,porte.aretes_controle);
        
               for (let k = 0; k <porte.nAretes_entrantes; k++){
                    let num_ligne=porte.num_ligne[k];
                    P = calcul_probas_pour_un_Qbit_numeroQbit_du_nQbit(this.n_Qbits_sortie,num_ligne,nbre_Qbits_entree);
                    porte.calcul_coeff_Qbit(undefined,0,undefined,0,k); 
      
                    porte.Qbit[k][2] = P[0] / 100;
                    porte.Qbit[k][3] = P[1] / 100;
               }
        break;
        
    }
    
    
    
    
    
    
    
  }

  
    
    
  //Methode class
  //fct recursive qui ajoute les portes dans l orde dans lequel on doit les etudier pour gerer l intrication, donc les controles avant les portes controlées, les lignes de  l oracle avant la fonction de l oracle....
 // Principe : on etudie une porte e, on mets son visit a true, puis on l enleve de la ligne quantique
  //apres cette procedure recursive les lignes quantiues seront vides il faudra les reconstruire
  genere_liste_ordonnees_elemts_intrication(lignes_quantiques,numero_ligne){
    // print("nbre",numero_ligne)
   // print(lignes_quantiques)
    
    
    
    
    let nbre_elements = lignes_quantiques[numero_ligne].length;
    
   
    
    
    
     if (nbre_elements==0) {//des qu on trouve une ligne pas vide on y va
       
       for (let i = 0; i < lignes_quantiques.length; i++){
        
         if ((lignes_quantiques[i].length)>0) return this.genere_liste_ordonnees_elemts_intrication(lignes_quantiques,i);
       }
       
       //sinon la recursivité s arrete si toutes les lignes sont vides, on retourne liste vide
       return [];//liste vide
    
     }
      
     let e=lignes_quantiques[numero_ligne][0];
    
    //on initialise les visites au debut
    if ((numero_ligne==0)&&(e.type==0)) this.initialise_visit();
    
    
    
   
     //si pas de controle on ajoute dans la liste, pas oracle ni porte multiple
     if ((e.nAretes_controle==0) &&(e.porte_multiple==false)){//PORTE NON MULTIPLE ET NON CONTROLEE
       
       e=lignes_quantiques[numero_ligne].shift();//on l enleve de sa ligne quantique
        e.visit=true;//sommet visité donc traité
       return [e].concat(this.genere_liste_ordonnees_elemts_intrication(lignes_quantiques,numero_ligne)); 
     }//FIN DE PORTE NON MULTIPLE ET NON CONTROLEE
    
    //EN DESSOUS c est soit un controle branchée a une porte soit une porte branchéee ave un controle
    //soit une porte multiple
    
    
     //si controle on le mets dans la liste et on va dans la liste ou y a la porte controlée
    //on trouve son numero
     if ((e.type==16)||(e.type==17)){//ETUDE CONTROLE 16 OU 17
         e=lignes_quantiques[numero_ligne].shift();//on l enleve
         e.visit=true;//sommet visité donc traité
       
       
         //on va dans la 1ere de ses portes contolés (inutile d aller dans la deuxieme, ça ira par la suite)
         
       
       //si il est branché avec une porte , on l ajoute  et on va dans la ligne de sa porte
       //si elle fait deja partie d'une ligne
       let numPorteControlee=e.aretes_controle[0].numSommetArrive;
       let num_ligne_suivante=this.TabSommets[numPorteControlee].num_ligne[0];
       
       if (num_ligne_suivante!=undefined)
        return [e].concat(this.genere_liste_ordonnees_elemts_intrication(lignes_quantiques,num_ligne_suivante)); 
       
       else//si cette porte n est pas dans une ligne on change pas de ligne
        return [e].concat(this.genere_liste_ordonnees_elemts_intrication(lignes_quantiques,numero_ligne)); 
       
     }////FIN DE ETUDE CONTROLE 16 OU 17
    
    
    // ICI C est une porte controlée
     //si c'est une porte controlée on la mets si et seulement si son controle est deja ds la liste sinon on va
    //a la liste de son controle
    
    //ETUDE DUNE PORTE CONTROLEE
    if (e.nAretes_controle>0){
      
      //on teste si un de ses controles n a pas été visité sinon on doit y aller 
      //avant de traiter cette porte (car une porte comme toffoli peut avoir 2 contrioles 16)
      for (let k = 0; k < e.nAretes_controle; k++){
        //on teste si son controle 16 ou 17 a été visité, sinon on va dans sa ligne s il en a une
        let numControle=e.aretes_controle[k].numSommetDepart;
        
        if ((this.TabSommets[numControle].num_ligne[0]>=0)&&(this.TabSommets[numControle].visit==false)){
       let num_ligne_suivante=this.TabSommets[numControle].num_ligne[0];
             // print("je vais",num_ligne_suivante)
        return this.genere_liste_ordonnees_elemts_intrication(lignes_quantiques,num_ligne_suivante); 
       }
           
         }
       
      
      
       //en dessous, forcemment son ou ses controles ont tous été visité donc on traite la porte controlée
      //si ce n est pas une porte multiple ; le cas des portes multiples est traite plus bas, sinon le resultat est faux
      
      if (e.porte_multiple==false){//si prote controlée et pas multiple
       e=lignes_quantiques[numero_ligne].shift();//on l enleve
       e.visit=true;//on a traité ce sommet
      
     
    
      //si son ou ses controles ont été visité mais que l (un d entre eux  est encore lié a d autres portes controlées non visitées on va dans celles ci pour les traiter priortitairement
      //c est important de traiter le bloc des portes controlees et de leur controle en un coup
      for (let k = 0; k < e.nAretes_controle; k++){
          let numControle=e.aretes_controle[k].numSommetDepart;
           if (this.TabSommets[numControle].nAretes_controle>1)//plusieursportes controlées
             if ((this.TabSommets[numControle].num_ligne[0]>=0)&&(this.TabSommets[numControle].visit==true))
      
                 for (let i = 0; i < this.TabSommets[numControle].nAretes_controle; i++) {
                      let arete=this.TabSommets[numControle].aretes_controle[i];
                      let numPorte=arete.numSommetArrive;
                      if (this.TabSommets[numPorte].visit==false){//on va dans cette ligne
                     return               [e].concat(this.genere_liste_ordonnees_elemts_intrication(lignes_quantiques,this.TabSommets[numPorte].num_ligne[0]));
                }
                  }
        
        
        
        
      }
      
    
   
      
      //sinon on poursuit dans cette ligne
  
       return [e].concat(this.genere_liste_ordonnees_elemts_intrication(lignes_quantiques,numero_ligne)); 
      
      }//fin de si porte controlée et pas multiple
      
    }//FIN DE ETUDE DUNE PORTE CONTROLEE
    
    
    
    //ETUDE PORTE MULTIPLE
    if (e.porte_multiple==true){
   
     
      
        //TRAITEMENT DE LORACLE ou de la porte de grover ou de swap ou de fourier , porte multiples
      //la derniere ligne correspond a la fonction, elle doit etre etudiée uniquement si toutes les lignes du dessus ont été visitées. 
      
      //le numero de ligne quantique de loracle est celui de sa derniere arete, donc de la ligne  de la fonction controlée
      
      //PRINCIPE : suppsosont qu il y ait 4 entrees. 
      //Des qu on arrive sur une entrée non visitées on fait le est suivant :
      //      - est ce que toutes les entrées de l oracle sont en debut d'une ligne quantique ?
      //      - si oui, on les traite toutes dans l ordre pour finir dans la ligne de la fonction, etbla porte est traitéé en une fois
      //      - si non, on va dans la 1ere ligne qu on trouve ou cet oracle n est pas au debut de ligne
      
      
        for (let i = 0; i < e.nAretes_entrantes; i++) { //on cherche la 1ere ligne ou y a pas la porte au debut et on y va
          //si le sommet de depart de l arete entrante est visitée, c est que cette entrée est au debut d une ligne quantique, sinon c est qu elle l est pas, alors on y va pour l y mettre
          let ar=e.aretes_entrantes[i];
          let Somm_avt=this.TabSommets[ar.numSommetDepart];
          if (Somm_avt.visit==false){
            
                  let num_ligne_suivante=ar.numero_ligne_quantique;
            //print("je vais direct",num_ligne_suivante)
                  return this.genere_liste_ordonnees_elemts_intrication(lignes_quantiques,num_ligne_suivante); 
          }
          
        }//fin de  //on cherche la 1ere ligne ou y a pas la porte au debut et on y va
      
      
        //ci dessous toute les entrées de la porte sont en debut de ligne ,on les traite toutes d un coup
       for (let i = 0; i < e.nAretes_entrantes; i++) { 
          let ar=e.aretes_entrantes[i];
          let num_ligne=ar.numero_ligne_quantique;
          lignes_quantiques[num_ligne].shift();//on l enleve de cette ligne quantique
          
         
          }
          
        
        //c est fini on traite l oracle et on reste dans cette ligne quantique
         e.visit=true;
      
      
      
      
         return [e].concat(this.genere_liste_ordonnees_elemts_intrication(lignes_quantiques,numero_ligne));
       
      
      
      
      
      
      
    }//FIN DU TRAITEMENT DE LORACLE
    
    
    
  
    
    
     
    
      
    return [];//normalement on arrive jamais ici
  }
  
  
 
  
  
  //METHODE 
  //initialise et calcul les lignes quantiques
  //Doit se faire apres :
  //- ajout sommet
 // - suppression sommet
 // - modification ordre des qbits par deplacement
  //Mais pas apres suppression ou insertion arete !!!!
  
  calcul_LignesQuantiQues_nQbitsEntree_nQbitsSortie(avecAffichage=true){
    
    doit_lancer_calcul_LignesQuantiQues_nQbitsEntree_nQbitsSortie=false;
    print("calcul_LignesQuantiQues_nQbitsEntree_nQbitsSortie() a été lancé ",compteurbug," fois")
    compteurbug+=1;
    noLoop();
    
    
    
   
    
  //  noLoop();
   // enlever le calcul lors du redimensionnement
    
    //print("yocalcul_LignesQuantiQues_nQbitsEntree_nQbitsSortie")
    //si mesure partielle il ne faut pas changer la valeur nQbit calculé ni les lignes quantiques
     if (OnFaitLesMesures!=0){
  this.calcul_nQbits_mesure_fixe_valeurs_mesurees_et_calcule_valeurs_instantannees_pour_les_autres_lignes();
      
     return;
   }
    
    
    
    
    
    
    let t1=millis();
   
    //print("je reclcule les lignes quantiques")
     this.lignes_quantiques = retourne_liste_lignes_quantiques(this); //initialise les lignes quantiques
    
     initialise_tableaux_des_conversions(this.lignes_quantiques.length)
    
    let t2=millis();//0 s
    
    
    this.n_Qbits_sortie = retourne_vecteur_nQbits_dentree(
      this.lignes_quantiques
    );
    
    
  //  print(" nqbit entree=",this.n_Qbits_sortie)
     
    
    
    
    
    
     let t3=millis();//2.6s
   
    this.calcul_les_Qbits_de_sorties_de_tous_les_elements();
    
   // print(" nqbit sorite=",G.n_Qbits_sortie)
    
     let t4=millis();//16 s
    Selection=-1;
    
    
   
    
    
    print("duree  init:",t2-t1," n_Qbits_entree:",t3-t2," calcul:",t4-t3, "total=",t4-t1)
    
    
    if (avecAffichage==true) this.affiche_du_nQbit_de_sortie_et_des_probas();
    loop();
    
   
    
     
    
  }
  
  
  
  
  calcul_n_Qbits_sortie_apres_passage_toutes_les_portes_de_la_liste_ordonnee_pour_intrication(nbre_Qbits_entree){
    
    for (let num_Qbit = 0;num_Qbit<this.Liste_ordonnee_pour_intrication.length;num_Qbit++){
      let porte=this.Liste_ordonnee_pour_intrication[num_Qbit];
      
      if (porte.type>2)
      if (porte.nAretes_entrantes>0)
      {//pas les Qbits car deja dans this.n_Qbits_sortie
        
        
        //calcul du Qbit enrant dans cette porte 
         //let Qbit_entrant=Liste_ordonnee_pour_intrication[num_Qbit-1];
           let arete = porte.aretes_entrantes[0];
           let numSommetDepart = arete.numSommetDepart;
           let Qbit_entrant=this.TabSommets[numSommetDepart];
        
        
         
          let num_Qbit_entree=porte.num_ligne[0];
          this.calcul_nQbits_apres_passage_dune_porte(porte,Qbit_entrant.Qbit[0],num_Qbit_entree,nbre_Qbits_entree);
          
        
        
      }
       
      
      
    }
  }
  
  
  
  //METHODE CLASSE
  //apres un changement : arete , modification parametres, supprimmer etc... on doit recalculer  tous les Qbits sauf ceux de type 0,1,2

  calcul_les_Qbits_de_sorties_de_tous_les_elements() {
    //let t1=millis()
    
    //si il y a une seule porte controlée ou un controle dont le numero de ligne quantique est encore à -1 apres la formation des lignes quantiques, c est qu il y a une coupure, le graphe n est pas calculable, on s en va
    for (let i = 0; i < this.TabSommets.length; i++)
      if (this.TabSommets[i] != undefined) 
        if (this.TabSommets[i].num_ligne[0]==-1)
          if (this.TabSommets[i].nAretes_controle>0) return;
    
    
    
    //pour chaque QBIT 0,1,2 je pars de lui et je recalcule toute ses sorties

    // print(this.n_Qbits)
    let nbre_Qbits_entree = this.lignes_quantiques.length;
    if (nbre_Qbits_entree == 0) return;

   // this.n_Qbits_sortie = this.n_Qbits_entree.slice(); //=copieProfonde

   // print("le nQbit d entrée est",this.n_Qbits_entree)
    
     //POUR GERE L INTRICATION les lignes doivent etre etudiées dans un certain ordre, d abord les controles 16 et 17, puis juste apres les portes controlées, des qu on rencontre :
    //- un controle, on le traite
    //_ une porte controlée on la traite si et seulement si son bit de controle a été traité
   
   // print("qbitsortie",this.n_Qbits_sortie);
    
    
    //print("ligne au depart",this.lignes_quantiques)
    //cree la liste ordonnee mais modifie this.lignes_quantiques
    
    this.initialise_visit();//initialise les visites pour le parcours recursif ci dessous
    
    
  this.Liste_ordonnee_pour_intrication=this.genere_liste_ordonnees_elemts_intrication(this.lignes_quantiques,0);
    //il fo tout de suite apres remettre ligne quantique comme au depart
    this.lignes_quantiques = retourne_liste_lignes_quantiques(this); //reinitialise les lignes quantiques
   // print("juste apres",this.lignes_quantiques)
    
  if (debug_affiche_listegenere_lignesquantiques==true)  {//affichage debug
    
    
    
   print("lignes quantiques /ordonnee",this.lignes_quantiques); 
   print("liste ordonnee=",this.Liste_ordonnee_pour_intrication);
   for (let i = 0;i<this.Liste_ordonnee_pour_intrication.length;i++){
     print("numero ligne quantique=",this.Liste_ordonnee_pour_intrication[i].num_ligne[0]," type=",this.Liste_ordonnee_pour_intrication[i].type)
   }
  }//affichage debug 
    
    
    
    //let t2=millis()
    //print("temps=",t2-t1)//prends 0,8 ms !!! pour shor 21
    
    G.calcul_n_Qbits_sortie_apres_passage_toutes_les_portes_de_la_liste_ordonnee_pour_intrication(nbre_Qbits_entree);
    
    
    
    
    //let t3=millis()
    //print("temps2=",t3-t2)//prends 5530 ms !!! pour shor 21
    
   
    
   
    //affichage_dans_console_probas_du_nQbit(this.n_Qbits_sortie,nbre_Qbits_entree);

    //calcul_probas_pour_chaque_Qbit_du_nQbit(this.n_Qbits_sortie,nbre_Qbits_entree);
    // print("probas",Proba)
  }

 
  
    //Methode affiche coefficients du nQBIT de sortie ou de celui mesuré partiellement
/*viueux_affiche_du_nQbit_de_sortie_et_des_probas() {
    print("yo je lance l affichage")
    textContainer1.hide();
    textContainer2.hide();
  
    if (this.TabSommets.length==0) return;
  
  
   if ( R.affiche_coefficients_et_Probas_nQbit==false) return;
   
   if (R.on_est_dans_une_fenetre==true) return;
   
   if (Selection>=0) return;
   
   if (this.n_Qbits_sortie.length<=0) return;
   
   let  n_Qbit_a_afficher=undefined;
   
   
  
   if (OnFaitLesMesures!=0) n_Qbit_a_afficher=this.n_Qbits_mesure;
    else n_Qbit_a_afficher=this.n_Qbits_sortie; 
  
  
     
    //Qbit vide, y a rien

    let nbre_Qbits_entree= this.lignes_quantiques.length;
    
  
    if (nbre_Qbits_entree == 0) return;

    if (n_Qbit_a_afficher.length == 0) return;
    
    
    
    print("la longueur du nqbit est",n_Qbit_a_afficher.length)
    
    let precision_proba = parseInt(document.getElementById("precisionChiffresApresVirgule").value);
    precision_coeff = precision_proba+2;//car la proba est divisée par 100
    

    let texte = "";
    let texte2 = "";
    let mesure="";
  
 
  
  //on calcule les mesures
    if (OnFaitLesMesures!=0){
      
      for (let i = 0; i < this.lignes_quantiques.length; i++){
        let S=this.lignes_quantiques[i][this.lignes_quantiques[i].length-1];
      
      if (S.mesure[0]==true){
        mesure=mesure + S.val_instant_mesure[0].toString()+" ";
        
      }
        else
          mesure=mesure + "_"+" ";
      
    }
      
      
    }
  
  
 
  
  
  
  
  
  
    
 // print("longueur=",n_Qbit_a_afficher.length)

    //affichage du n_Qbits et des probabilités de chaque etat
    for (let i = 0; i < n_Qbit_a_afficher.length; i++) {
      
      
     //if (n_Qbit_a_afficher[i] .proba==0) continue;
      let proba=String(abs(roundToDecimals(100 * n_Qbit_a_afficher[i] .proba, precision_proba)));
      
      if (proba==0) continue;
      
      let coeff =n_Qbit_a_afficher[i].texte_complexe(R.type_affichage_qBit,false); //roundToDecimals(abs(n_Qbit_a_afficher[i]), 2);

      
      if (coeff=="") continue;

      

      let etat = convertit_nombreDecimal_En_StringNombre_binaire(i,nbre_Qbits_entree);

     
      
      if (OnFaitLesMesures!=0){
         let etat2="";
        
        
        for (let j = 0; j < etat.length;j++){
           if (this.lignes_quantiques[j][0].mesure[0]==false)                 etat2=etat2+etat[j];
        }
        
        etat=etat2;
        
      }
      
      
      if (etat.length>0)
        {
          
          
          if (R.affiche_decimal==true){
            if (OnFaitLesMesures==0)
            etat=i.toString();
            else {
              etat=convertit_StringNombre_binaire_En_nombreDecimal(etat);
              etat=etat.toString();
            }
              
            
          
            
          }
      
      texte=texte+coeff+ "|" + etat + "⟩"+" ";
          
      texte2 =texte2 +"|" +etat +"⟩ : " +proba +"% ; ";

     
        }
      
      
    }

   
    
    if (mesure.length>0) mesure="Mesure = "+mesure+"<br>"
    
    if  (texte.length>0) {
      texte=mesure+"|ψ⟩ = "+texte;
      texte2 = "Probabilities : "+texte2;
      textContainer1.show();  // Afficher la fenêtre 1
      textContainer2.show();  // Afficher la fenêtre 2
    } else
      {
        texte=mesure;
        textContainer1.show();  // Afficher la fenêtre 1
      textContainer2.hide();  // Afficher la fenêtre 2
        
      }
      
    
    
    

    
    texte="<strong>"+texte+"</strong>"
    texte2="<strong>"+texte2+"</strong>"
  textContainer1.html(texte);  // Ajouter le texte dans la div
   textContainer2.html(texte2);  // Ajouter le texte dans la div 
    

   
  }
  */
     //Methode affiche coefficients du nQBIT de sortie ou de celui mesuré partiellement
affiche_du_nQbit_de_sortie_et_des_probas() {
  
 
    print("yo je lance l affichage, onfaitlesmesures=",OnFaitLesMesures);
  
  
    textContainer1.style.display = "none";
  textContainer2.style.display = "none"; 
    //textContainer1.hide();
   // textContainer2.hide();
  
    if (this.TabSommets.length==0) return;
  
  
   if ( R.affiche_coefficients_et_Probas_nQbit==false) return;
   
   if (R.on_est_dans_une_fenetre==true) return;
   
   if (Selection>=0) return;
   
   if (this.n_Qbits_sortie.length<=0) return;
   
    let t1=millis();
   
   let  n_Qbit_a_afficher=undefined;
   
   
  
   if (OnFaitLesMesures!=0) n_Qbit_a_afficher=this.Qbits_pouraffichage_graphics;//meme chose que this.n_Qbits_mesure mais on a supprimé les etats mesurés, donc nqbit plus court;
    else n_Qbit_a_afficher=this.n_Qbits_sortie; 
  
 
     //print("mesure",OnFaitLesMesures,"qbit",n_Qbit_a_afficher)
    
  
  //Qbit vide, y a rien

    let nbre_Qbits_entree;

    if (OnFaitLesMesures!=0) {
      
      if (n_Qbit_a_afficher.length==0)
         nbre_Qbits_entree = 0;
      else nbre_Qbits_entree = int(Math. log2(n_Qbit_a_afficher.length));
      
    }
  else nbre_Qbits_entree = this.lignes_quantiques.length;
  
  
  
  print("le nbre de qbits a afficher est",nbre_Qbits_entree);
  //print("yo",n_Qbit_a_afficher)

    //if (nbre_Qbits_entree == 0) return;

    //if (n_Qbit_a_afficher.length == 0) return;
    
    
    
    print("la longueuru du nqbit est",n_Qbit_a_afficher.length)
    
    let precision_proba = parseInt(document.getElementById("precisionChiffresApresVirgule").value);
    precision_coeff = precision_proba+2;//car la proba est divisée par 100
    

    let texte = "";
    let texte2 = "";
    let mesure="";
  
 
  
  //on calcule les mesures
    if (OnFaitLesMesures!=0){
      
      for (let i = 0; i < this.lignes_quantiques.length; i++){
        let S=this.lignes_quantiques[i][this.lignes_quantiques[i].length-1];
      
      if (S.mesure[0]==true){
        mesure=mesure + S.val_instant_mesure[0].toString()+" ";
        
      }
        else
          mesure=mesure + "_"+" ";
      
    }
      
      
    }
  
    
    
 
    //affichage du n_Qbits et des probabilités de chaque etat
    for (let i = 0; i < n_Qbit_a_afficher.length; i++) {
      
      
     //if (n_Qbit_a_afficher[i] .proba==0) continue;
      let proba=String(abs(roundToDecimals(100 * n_Qbit_a_afficher[i] .proba, precision_proba)));
      
      if (proba==0) continue;
      
      let coeff =n_Qbit_a_afficher[i].texte_complexe(R.type_affichage_qBit,false); //roundToDecimals(abs(n_Qbit_a_afficher[i]), 2);

      
      if (coeff=="") continue;

      

      
      let etat;
     
      
     
      
      if (R.affiche_decimal==false)  etat = convertit_nombreDecimal_En_StringNombre_binaire(i,nbre_Qbits_entree);
      else etat=i.toString();
      
      texte=texte+coeff+ "|" + etat + "⟩"+" ";
          
      texte2 =texte2 +"|" +etat +"⟩ : " +proba +"% ; ";
  
      
    }

   
    
    if (mesure.length>0) mesure="Mesure = "+mesure+"<br>"
    
    if  (texte.length>0) {
      texte=mesure+"|ψ⟩ = "+texte;
      texte2 = "Probabilities : "+texte2;
      textContainer1.style.display = "block";
      textContainer2.style.display = "block"; 
      //textContainer1.show();  // Afficher la fenêtre 1
      //textContainer2.show();  // Afficher la fenêtre 2
    } else
      {
        texte=mesure;
        textContainer1.style.display = "block";
        textContainer2.style.display = "none"; 
        //textContainer1.show();  // Afficher la fenêtre 1
     // textContainer2.hide();  // Afficher la fenêtre 2
        
      }
      
    
    
    
   texte2="<strong>"+texte2+"</strong>"
    
    texte="<strong>"+texte+"</strong>"
    
  
//textContainer1.innerHTML = texte;
 // textContainer2.innerHTML = texte2;
  
  // Exemple de texte en gras :
textContainer1.querySelector('.text-content').innerHTML =texte;
textContainer2.querySelector('.text-content').innerHTML = texte2;
  
  
  
  
  //textContainer1.html(texte);  // Ajouter le texte dans la div
  // textContainer2.html(texte2);  // Ajouter le texte dans la div 
    
      let t2=millis();
   Graphes_nQbits.Calcul_Valeurs_Graphe();
     
    let t3=millis();
    
    
    print("duree  affich:",t2-t1," graphic:",t3-t2, "total=",t3-t1)
  } 
  
  
}
