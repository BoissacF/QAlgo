/* QAlgo — bascule français <-> anglais de toute l'interface
 *
 * Simulateur de circuits quantiques pour l'enseignement — https://www.qalgo.org
 * Code source : https://github.com/BoissacF/QAlgo
 *
 * Copyright (C) 2025-2026 Frédéric Boissac
 * Logiciel libre sous licence GNU AGPL version 3 ou ultérieure ;
 * voir le fichier LICENSE à la racine du dépôt.
 */
let langue=0;//1:english 0 : français

function changeLanguage(element=undefined) {
 

            var language = "";
          
  if ((element==undefined)||(element.id=="boutondrapeau")){
    if (langue==0) language="2"; else language="1";
   
  }
  else{
    
 
    language = document.getElementById("languageSelect").value;
  }
  
  
            // Exemple de contenu à changer selon la langue
            if (language === "1") {
             document.getElementById("languageSelect").value="1";
              langue=0;
              document.getElementById('imagedrapeau').innerHTML='<img src="assets/img/petitfrance.png" alt="Image" style="max-width: 100%; max-height: 100%; object-fit: contain;" />'
    
            } else {
             document.getElementById("languageSelect").value="2";
               langue=1;
              document.getElementById('imagedrapeau').innerHTML='<img src="assets/img/petitangleterre.png" alt="Image" style="max-width: 100%; max-height: 100%; object-fit: contain;" />'
            }
  
 // print("langue=",langue)
  changer_les_tooltips();
  change_aide();
  change_menu();
  change_jumbotron_texte();
  change_jumbotron_parametres();
  change_jumbotron_parametresQbits();
  changer_jumbotron_phaseR();
  changer_jumbotron_oracle();
  changerdestextesicioula();
  if (typeof mettreAJourBoutonPleinEcran === 'function')
    mettreAJourBoutonPleinEcran();//le libelle du bouton suit la langue
        }



function changerdestextesicioula(){//a faire en dernier
  
  
   "Mesure"; 
   if (langue==1){
     
      document.getElementById('textematrice').textContent="Build your gate by modifying the coefficients of the matrix M. The QAlgo simulator automatically normalizes the qubits at the gate output. For a complex coefficient α, the effect of α x M |ψ⟩ will be identical to M |ψ⟩. Therefore, you can simplify M. (e.g., For Hadamard, (1,1,1,-1))";
     
     
     document.getElementById('tradicioula1').textContent="Creation of a quantum gate";
     document.getElementById('tradicioula2').textContent="Number of quantum lines";
document.getElementById('tradicioula3').textContent="Symbol";
document.getElementById('tradicioula4').textContent="Coefficient format";
document.getElementById('boutonOkmatrice').textContent="Validate";
document.getElementById('boutonAnnulermatrice').textContent="Cancel";
     
      document.getElementById('boutongenerematrice').textContent="Automatically generate the matrix of the current circuit";
     
     
     
     
   } else{
     
     document.getElementById('textematrice').textContent="Construis ta porte en modifiant les coefficients de la matrice M. Le simulateur QAlgo normalise automatiquement les qbits en sortie de porte, pour un coefficient complexe α l'effet de α x M |ψ⟩ sera identique à M |ψ⟩. Tu peux donc simplifier M. (ex Pour Hadamard, (1,1,1,-1))";
     
     
     document.getElementById('tradicioula1').textContent="Création d'une porte quantique";
      document.getElementById('tradicioula2').textContent="Nombre de lignes quantiques";
     document.getElementById('tradicioula3').textContent="Symbole";
     document.getElementById('tradicioula4').textContent="Format des coefficients";
     document.getElementById('boutonOkmatrice').textContent="Valider";
     document.getElementById('boutonAnnulermatrice').textContent="Annuler";
     
     document.getElementById('boutongenerematrice').textContent=
     "Générer automatiquement la matrice du circuit actuel"; 
     
    
     
   }


  
  
}
function changer_les_tooltips(){
  if (langue==1){
    document.getElementById('boutondrapeau').title="English";
    document.getElementById('type1').title="Qubit in state |1⟩";
document.getElementById('type2').title="Qubit in state (|0⟩+|1⟩)/√2";
document.getElementById('type22').title="Qubit in state (|0⟩-|1⟩)/√2";
document.getElementById('type0').title="Qubit in state |0⟩";
document.getElementById('type3').title="NOT gate: swaps |0⟩ and |1⟩";
document.getElementById('type4').title="Z gate: applies a phase of -1 to |1⟩";
document.getElementById('type6').title="Y gate: transforms |0⟩ into i|1⟩ and |1⟩ into -i|0⟩";
document.getElementById('type5').title="Hadamard gate: transforms |0⟩ into (|0⟩+|1⟩)/√2 and |1⟩ into (|0⟩-|1⟩)/√2";
document.getElementById('type16').title="Control: acts on a target qubit if the control qubit is in state |1⟩";
document.getElementById('type17').title="Anti-control: acts on a target qubit if the control qubit is in state |0⟩";
document.getElementById('type64').title="Qubit state and probabilities";
document.getElementById('type12').title="SWAP gate: swaps 2 qubits";
document.getElementById('type7').title="Phase shift gate (Double-click to change φ)";
document.getElementById('type10').title="Oracle with auxiliary qubit (Double-click to change f(x))";
document.getElementById('type11').title="Grover's diffusion operator";
document.getElementById('type13').title="Quantum Fourier Transform";
document.getElementById('type14').title="Inverse Quantum Fourier Transform";
    
    document.getElementById('type15').title= "Square root of the SWAP Gate"
   document.getElementById('type32').title= "Square root of the X Gate"
    
    
    
    
    
document.getElementById('typepara').title="Display settings";
document.getElementById('init').title="Initialize the quantum circuit";
document.getElementById('mesuretout').title="Perform the measurements of all the qubits";
    
 document.getElementById('mesuretout').textContent="Measure";   
 document.getElementById('effaceqbits').title="Clear the last qubit measurements";
  
    document.getElementById('refaitmesures').title="Redo the latest Qbits measurements";   
    
    
document.getElementById('boutonaide').title="Description of general commands";
    document.getElementById('boutonaide').textContent="Help";
document.getElementById('boutonTexte').title="Text to describe the principle of your algorithm";
document.getElementById('bouton2+').title="Change the gate size";
document.getElementById('bouton2-').title="Change the gate size";
document.getElementById('boutonporte').title="Create a quantum gate from its matrix";
document.getElementById('boutonAnnuler').title="Undo the last action (Ctrl+Z)";
document.getElementById('boutonRefaire').title="Redo the undone action (Ctrl+Y)";
    document.getElementById('boutonporte').textContent="Create/Gate";
  
    document.getElementById('boutonbloch').title="Simulation with the Bloch Sphere";
    
  }else{
    
    document.getElementById('boutondrapeau').title="Français";
      document.getElementById('type1').title="Qbit à l'état |1⟩";
    document.getElementById('type2').title="Qbit à l'état (|0⟩+|1⟩)/√2";
    document.getElementById('type22').title="Qbit à l'état (|0⟩-|1⟩)/√2";
    document.getElementById('type0').title="Qbit à l'état |0⟩";
    document.getElementById('type3').title="Porte NOT : inverse |0⟩ et |1⟩";
    document.getElementById('type4').title="Porte Z : applique une phase de -1 à |1⟩";
    document.getElementById('type6').title="Porte Y : change |0⟩ en i|1⟩ et |1⟩ en -i|0⟩";
    document.getElementById('type5').title="Porte de Hadamar :  transforme  |0⟩ en  (|0⟩+|1⟩)/√2 et |1⟩ en (|0⟩-|1⟩)/√2";
    document.getElementById('type16').title="Controle : agit sur un qubit cible si le qubit de contrôle est dans l'état |1⟩ ";
    document.getElementById('type17').title="Anticontrole : agit sur un qubit cible si le qubit de contrôle est dans l'état |0⟩";
    document.getElementById('type64').title="Etat du Qbit et probabilités" ;
    document.getElementById('type12').title="Porte SWAP, intervertit 2 qBits";
    document.getElementById('type7').title="Porte à changement de phase (Double-Clic pour changer φ)";
    document.getElementById('type10').title="Oracle à qubit auxiliaire (Double-Clic pour changer f(x))";
    document.getElementById('type11').title="Operateur de diffusion de Grover";
    document.getElementById('type13').title="Transformée de Fourier";
    document.getElementById('type14').title="Transformée de Fourier inverse";
    
    document.getElementById('type15').title= "Racine carré de la Porte SWAP";
    document.getElementById('type32').title= "Racine carré de la Porte X"
    
    
    document.getElementById('typepara').title="Paramètres d'affichage";
    document.getElementById('init').title="initialise le circuit quantique";
    document.getElementById('mesuretout').title="Effectue les mesures de tous les Qbits";
    
    document.getElementById('mesuretout').textContent="Mesure";  
    
    document.getElementById('effaceqbits').title="Efface les dernières mesures de Qbits";
  
    document.getElementById('refaitmesures').title="Refait les dernières mesures de Qbits";
    
    document.getElementById('boutonaide').title="Description des commandes générales";
    
    document.getElementById('boutonaide').textContent="Aide";  
    
    document.getElementById('boutonTexte').title="Texte pour décrire le principe de ton algorithme";
    document.getElementById('bouton2+').title="Change la dimension des portes";
    document.getElementById('bouton2-').title="Change la dimension des portes";
    
    document.getElementById('boutonporte').title="Créer une porte quantique à partir de sa matrice";
    document.getElementById('boutonAnnuler').title="Annuler la dernière action (Ctrl+Z)";
    document.getElementById('boutonRefaire').title="Refaire l'action annulée (Ctrl+Y)";
    
    document.getElementById('boutonporte').textContent="Créer/Porte";
    
    document.getElementById('boutonbloch').title="Simulation avec la sphère de Bloch";
    
    
  }
  
  
}
function changer_jumbotron_oracle(){

  if (langue==1){document.getElementById('affichageFonction').innerHTML='<div class="mt-4 p-5 bg-secondary text-white rounded"><h2>Function f(x) Parameters of the Oracle</h2>Action of the oracle on two quantum registers ∣x⟩ and ∣y⟩ :<strong><a>O<sub>f</sub>|x⟩|y⟩ = |x⟩|y ⊕ f(x)⟩</a></strong><hr class="my-1" /><div class="align-line"><span>Number of qubits in register |y⟩: </span><input type="number" id="nbreqbitsregistre" class="form-control selectpetit" min="1" max="10" value="1" onchange="nbreQbitsregistreY()"></div><hr class="my-1" /><a>Choose a function f(x) from the examples below or create it yourself from scratch (in JavaScript).</a><br><a>x corresponds to the decimal number of register |x⟩ (e.g., 3 for |011⟩)</a><hr class="my-1" /><div class="form-group"><label for="selectOption">Examples of function f(x):</label><select class="form-control" id="selectOption" onchange="changerTexte(this)"><option value="1">Function that searches for a value (e.g., Grover s Algorithm) x</option><option value="2">Function that searches for the index of an element (e.g., Grover s Algorithm) x</option><option value="3">f(x) = constant</option><option value="4">f(x) is balanced (0 if x is even, 1 if odd)</option><option value="5">f(x) = XOR of all qubits</option><option value="6">Your function f(x)</option></select></div><hr class="my-1" /><div class="form-group"><textarea class="form-control" id="fonctionTextarea" rows="5">function f(x) { if (x == 5) return 1; else return 0; }</textarea></div><hr class="my-4" /><button type="button" id="boutonOkfonction" class="btn btn-success btn-lg mb-2" onclick="fermeraffichagecommande(this)">Validate</button><button type="button" id="boutonAnnulerfonction" class="btn btn-danger btn-lg mb-2" onclick="fermeraffichagecommande(this)">Cancel</button></div>';
                 }else{document.getElementById('affichageFonction').innerHTML='<div class="mt-4 p-5 bg-secondary text-white rounded"><h2>Paramètres de la fonction f(x) de l oracle</h2>Action de l oracle sur deux registres quantiques ∣x⟩ et ∣y⟩ :<strong><a>O<sub>f</sub>|x⟩|y⟩ = |x⟩|y ⊕ f(x)⟩</a></strong><hr class="my-1" /><div class="align-line"><span>Nombre de qbits du registre |y⟩ : </span><input type="number" id="nbreqbitsregistre" class="form-control selectpetit" min="1" max="10" value="1" onchange="nbreQbitsregistreY()"></div><hr class="my-1" /><a>Choisis une fonction f(x) dans les exemples ci-dessous ou crée-la toi-même de A à Z (en JavaScript).</a><br><a>x correspond au nombre décimal du registre |x⟩ (ex : 3 pour |011⟩)</a><hr class="my-1" /><div class="form-group"><label for="selectOption">Exemples de fonction f(x) :</label><select class="form-control" id="selectOption" onchange="changerTexte(this)"><option value="1">Fonction qui cherche une valeur (ex : Algorithme de Grover) x</option><option value="2">Fonction qui cherche l indice d un élément (ex : Algorithme de Grover) x</option><option value="3">f(x) = constante</option><option value="4">f(x) est équilibrée (0 si x est pair, 1 si impair)</option><option value="5">f(x) = XOR entre tous les q-bits</option><option value="6">Ta fonction f(x)</option></select></div><hr class="my-1" /><div class="form-group"><textarea class="form-control" id="fonctionTextarea" rows="5">function f(x) { if (x == 5) return 1; else return 0; }</textarea></div><hr class="my-4" /><button type="button" id="boutonOkfonction" class="btn btn-success btn-lg mb-2" onclick="fermeraffichagecommande(this)">Valider</button><button type="button" id="boutonAnnulerfonction" class="btn btn-danger btn-lg mb-2" onclick="fermeraffichagecommande(this)">Annuler</button></div>';
   }

}

function changer_jumbotron_phaseR(){
  if (langue==1){
    document.getElementById('affichagePhasedeR').innerHTML='<div class="mt-4 p-5 bg-secondary text-white rounded"><h2>Phase of R<sub>&#934</sub></h2><hr class="my-1" /><p>Choose the unit and phase of &#934</p><hr class="my-1" /><div class="d-flex align-items-center"><label for="unitePhase" class="me-3 fw-bold">Phase unit</label><select class="form-control selectunite" id="unitePhase" onclick="changerAngle(this)"><option value="1">Degree</option><option value="2">Radian</option><option value="3">k.&pi; Radian</option></select></div><div class="grosgras align-line"><span>&#934 = </span><input type="text" class="form-control input-small" id="phiPhaseR" value="0" style="width: 100px;"><span class="affichePi" style="display:none">&pi;</span></div><hr class="my-4" /><button type="button" id="boutonphaseR" class="btn btn-success btn-lg mb-2" onclick="fermeraffichagecommande(this)">Close</button></div>';
;
  }else{
    
    document.getElementById('affichagePhasedeR').innerHTML='<div class="mt-4 p-5 bg-secondary text-white rounded"><h2>Phase de R<sub>&#934</sub></h2><hr class="my-1" /><p>Choisis l unité et la phase de &#934</p><hr class="my-1" /><div class="d-flex align-items-center"><label for="unitePhase" class="me-3 fw-bold">Unité de la phase</label><select class="form-control selectunite" id="unitePhase" onclick="changerAngle(this)"><option value="1">Degré</option><option value="2">Radian</option><option value="3">k.&pi; Radian</option></select></div><div class="grosgras align-line"><span>&#934 = </span><input type="text" class="form-control input-small" id="phiPhaseR" value="0" style="width: 100px;"><span class="affichePi" style="display:none">&pi;</span></div><hr class="my-4" /><button type="button" id="boutonphaseR" class="btn btn-success btn-lg mb-2" onclick="fermeraffichagecommande(this)">Fermer</button></div>';

    
  }
  
  
}




function change_aide(){
  
  if (langue==1){
    document.getElementById('t9').innerHTML = '<h2>Main Commands</h2><p>Drop or remove Qbits or gates: <strong>Click and Drag</strong></p><p>Select and move: <strong>Left Click</strong></p><p>Partial measurement: <strong>Double click on measurement</strong></p><p>Resize: <strong>Left Click + Scroll wheel</strong></p><p>Change color: <strong>Right Click</strong></p><p>Change qBit coefficients: <strong>Double Click</strong></p><p>Modify f(x) Oracle: <strong>Double Click</strong></p><p>Modify &#934 of R<sub>&#934</sub>: <strong>Double Click</strong></p><p>Delete: <strong>"Delete" or "Del" on keyboard</strong></p><p>Undo, redo: <strong>Ctrl+Z, Ctrl+Y</strong></p><hr class="my-4" /><button type="button" id="boutonok" class="btn btn-success btn-lg mb-2" onclick="fermeraffichagecommande(this)">Close</button>';

  }
  else{
  document.getElementById('t9').innerHTML='<h2>Commandes principales</h2><p>Déposer ou supprimer des Qbits ou portes : <strong>Cliquer Glisser</strong> </p><p>Selectionner et déplacer : <strong>Clic Gauche</strong></p><p>Mesure partielle : <strong>Double clic sur mesure</strong></p><p>Modifier taille : <strong>Clic Gauche + roulette</strong> </p><p>Modifier couleur : <strong>Clic droit</strong> </p><p>Modifier coefficients qBit : <strong>Double Clic</strong> </p><p>Modifier f(x)  Oracle  : <strong>Double Clic</strong> </p><p>Modifier  &#934  de R<sub> &#934</sub>  : <strong>Double Clic</strong> </p><p>Supprimer :  <strong>"Efface" ou "Suppr" au clavier</strong></p><p>Annuler, refaire : <strong>Ctrl+Z, Ctrl+Y</strong></p><hr class="my-4" /><button type="button" id="boutonok" class="btn btn-success btn-lg mb-2" onclick="fermeraffichagecommande(this)">Fermer</button>';
  }
}


function change_menu(){
  if (langue==1){
    document.getElementById('t1').textContent="Examples";
    
    document.getElementById('bell1').textContent="Bell State ∣Φ+⟩";
   
    document.getElementById('bell2').textContent="Bell State ∣Φ-⟩";
    document.getElementById('bell3').textContent="Bell State ∣Ψ+⟩";
    
    document.getElementById('bell4').textContent="Bell State ∣Ψ-⟩";
   
    document.getElementById('toffoli').textContent="Toffoli Gate";
    
    document.getElementById('codagesuperdense').textContent="Superdense Coding";
    
    document.getElementById('deutschjozsa').textContent="Deutsch-Jozsa Algorithm";
   
    document.getElementById('grover3bits').textContent="Grover's Algorithm with 3 qbits";
   
    document.getElementById('grover6bits').textContent="Grover's Algorithm with 6 qbits";
   
    
    document.getElementById('teleportation').textContent="Quantum Teleportation";
    
    document.getElementById('shor4bits').textContent="Shor's Algorithm for 15";
   
    document.getElementById('shor9bits').textContent="Shor's Algorithm for 21";
    document.getElementById('shor11bits').textContent="Shor's Algorithm for 39";
    
    document.getElementById('t2').textContent="File";
    
    document.getElementById('t3').textContent="Open File";
    
    //document.getElementById('inputFileNameToSaveAs').placeholder="Enter a file name";
   
    document.getElementById('t4').textContent="Save";
    
   
document.getElementById('t5').textContent="Video";
   
    document.getElementById('t6').textContent="Code/License";
document.getElementById('titrePalette1').textContent="Qubits";
document.getElementById('titrePalette2').textContent="Gates";
document.getElementById('titrePalette3').textContent="Controls & display";
document.getElementById('titrePalette4').textContent="Circuit & measurements";
document.getElementById('titrePalette5').textContent="Characters";
document.getElementById('titrePalette6').textContent="Tools";
  
    document.getElementById('t7').textContent="Author: Frédéric Boissac";
   

document.getElementById('t8').innerHTML="Free software under the GNU AGPL version 3 licence (<a href=\"https://www.gnu.org/licenses/agpl-3.0.html\" target=\"_blank\" rel=\"noopener\">read the licence</a>)";
document.getElementById('t11').textContent="Access the code";
 

document.getElementById('t10').textContent= "Export to amplitudes.csv";
 document.getElementById('boutongraphic').title= "View graphs";

  } else {
    
    
    
    
  
    document.getElementById('t1').textContent="Exemples";
    
   
    document.getElementById('bell1').textContent="Etat de Bell ∣Φ+⟩";
    
    
    document.getElementById('bell2').textContent="Etat de Bell ∣Φ-⟩";
    
    document.getElementById('bell3').textContent="Etat de Bell ∣Ψ+⟩";
    
   
    document.getElementById('bell4').textContent="Etat de Bell ∣Ψ-⟩";
    
   
    document.getElementById('toffoli').textContent="Porte de Toffoli";
    
   
    document.getElementById('codagesuperdense').textContent="Codage Super dense";
    
    document.getElementById('deutschjozsa').textContent="Algorithme de Deutsch-Jozsa";
   
    document.getElementById('grover3bits').textContent="Algorithme de Grover avec 3 qbits";
    
    document.getElementById('grover6bits').textContent="Algorithme de Grover avec 6 qbits";
    
   
    document.getElementById('teleportation').textContent="Téléportation quantique";
    
   
    document.getElementById('shor4bits').textContent="Algorithme de Shor pour 15";
    
  
    document.getElementById('shor9bits').textContent="Algorithme de Shor pour 21";
    document.getElementById('shor11bits').textContent="Algorithme de Shor pour 39";
    
 
    document.getElementById('t2').textContent="Fichier";
    
   
    document.getElementById('t3').textContent="Ouvrir Fichier";
    
    //document.getElementById('inputFileNameToSaveAs').placeholder="Entre un nom de fichier";
  
    document.getElementById('t4').textContent="Enregistrer";
   

    document.getElementById('t5').textContent="Vidéo";
   
    document.getElementById('t6').textContent="Code/Licence";
    document.getElementById('titrePalette1').textContent="Qubits";
    document.getElementById('titrePalette2').textContent="Portes";
    document.getElementById('titrePalette3').textContent="Contrôles et affichage";
    document.getElementById('titrePalette4').textContent="Circuit et mesures";
    document.getElementById('titrePalette5').textContent="Personnages";
    document.getElementById('titrePalette6').textContent="Outils";
    
    
    document.getElementById('t7').textContent="Auteur : Frédéric Boissac";



    document.getElementById('t8').innerHTML="Logiciel libre sous licence GNU AGPL version 3 (<a href=\"https://www.gnu.org/licenses/agpl-3.0.html\" target=\"_blank\" rel=\"noopener\">lire la licence</a>)";
    document.getElementById('t11').textContent="Accéder au code";


document.getElementById('t10').textContent= "Exporter vers amplitudes.csv";

  document.getElementById('boutongraphic').title= "Visualiser les graphiques";
    
    
    
     
    
    
    
  }
  
  
}





function change_jumbotron_texte(){
 if (langue==1){
     document.getElementById('explication').innerHTML = '<div class="mt-4 p-5 bg-secondary text-white rounded"><h2>Principle of the algorithm</h2><hr class="my-1"/><div class="form-group"><textarea class="form-control" id="explicationAlgo" rows="5">Here, you can explain the principle of your algorithm. The explanations will be saved at the same time as your file.</textarea></div><hr class="my-4"/><button type="button" id="boutonOkexplication" class="btn btn-success btn-lg mb-2" onclick="fermeraffichagecommande(this)">Close</button></div>';

 } else{
   document.getElementById('explication').innerHTML = '<div class="mt-4 p-5 bg-secondary text-white rounded"><h2>Principe de l algorithme</h2><hr class="my-1"/><div class="form-group"><textarea class="form-control" id="explicationAlgo" rows="5">Ici, tu peux expliquer le principe de ton algorithme. Les explications seront enregistrées en même temps que ton fichier.</textarea></div><hr class="my-4"/><button type="button" id="boutonOkexplication" class="btn btn-success btn-lg mb-2" onclick="fermeraffichagecommande(this)">Fermer</button></div>';
  
    
   
   
 }
   




}


function change_jumbotron_parametres(){
  
  
  
  if (langue==1){
    document.getElementById('affichageParametresAffichage').innerHTML = `
<div class="mt-4 p-5 bg-secondary text-white rounded">
  <h2>Display Settings</h2>
  <hr class="my-1" />

  <div class="d-flex align-items-center">
    <!-- Label properly aligned -->
    <label for="selectQbitAffichage" class="me-3 fw-bold">Amplitude Representation</label>
    <!-- Select input limited to 150px wide -->
    <select class="form-control" id="selectQbitAffichage" onchange="changerOptionQbit(this)">
      <option value="1">Complex: a + b x i</option>
      <option value="2">Trigonometric: r.exp(i&#952)</option>
    </select>
  </div>

  <div class="d-flex align-items-center">
    <!-- Label properly aligned -->
    <label for="uniteaffichage" class="me-3 fw-bold">&nbsp;&nbsp;&nbsp;Angle Units</label>
    <!-- Select input limited to 150px wide -->
    <select class="form-control selectunite" id="uniteaffichage" onclick="changerAngle(this)">
      <option value="1">Degree</option>
      <option value="2">Radian</option>
      <option value="3">k.&pi; Radian</option>
    </select>
  </div>

  <hr class="my-4" />

  <div class="d-flex align-items-center">
    <!-- Label properly aligned to the left -->
    <label class="me-3 fw-bold">Display Qbit States on Quantum Lines</label>
    <!-- Radio buttons well spaced -->
    <div class="form-check me-3">
      <input class="form-check-input" type="radio" name="etatQBits" id="radioOui" checked>
      <label class="form-check-label" for="radioOui">Yes</label>
    </div>
    <div class="form-check">
      <input class="form-check-input" type="radio" name="etatQBits" id="radioNon">
      <label class="form-check-label" for="radioNon">No</label>
    </div>
  </div>

  <div class="d-flex align-items-center">
    <!-- Label properly aligned to the left -->
    <label class="me-3 fw-bold">Display in Superposition Mode</label>
    <!-- Radio buttons well spaced -->
    <div class="form-check me-3">
      <input class="form-check-input" type="radio" name="Super" id="radioOuiSuper">
      <label class="form-check-label" for="radioOuiSuper">Yes</label>
    </div>
    <div class="form-check">
      <input class="form-check-input" type="radio" name="Super" id="radioNonSuper" checked>
      <label class="form-check-label" for="radioNonSuper">No</label>
    </div>
  </div>

  <hr class="my-4" />

  <div class="d-flex align-items-center">
    <!-- Label properly aligned to the left -->
    <label class="me-3 fw-bold">Display State and Probability Windows</label>
    <!-- Radio buttons well spaced -->
    <div class="form-check me-3">
      <input class="form-check-input" type="radio" name="probas" id="radioOuiProba" checked>
      <label class="form-check-label" for="radioOuiProba">Yes</label>
    </div>
    <div class="form-check">
      <input class="form-check-input" type="radio" name="probas" id="radioNonProba">
      <label class="form-check-label" for="radioNonProba">No</label>
    </div>
  </div>

  <div class="d-flex align-items-center">
    <!-- Label properly aligned to the left -->
    <label class="me-3 fw-bold">Display States in Decimal Notation</label>
    <!-- Radio buttons well spaced -->
    <div class="form-check me-3">
      <input class="form-check-input" type="radio" name="decimal" id="radioOuidecimal">
      <label class="form-check-label" for="radioOuidecimal">Yes</label>
    </div>
    <div class="form-check">
      <input class="form-check-input" type="radio" name="decimal" id="radioNondecimal" checked>
      <label class="form-check-label" for="radioNondecimal">No</label>
    </div>
  </div>

  <div class="d-flex align-items-center">
    <!-- Label properly aligned to the left -->
    <label class="me-3 fw-bold">Probability Precision (Decimal Places)</label>
    <input type="number" id="precisionChiffresApresVirgule" class="form-control selectpetit" min="0" max="6" value="1">
  </div>

  <hr class="my-4" />

  <div class="color-picker-container">
    <!-- Label for background color -->
    <label for="colorPicker" class="me-3 fw-bold">Background Color</label>
    <input type="color" id="colorPicker" class="form-control" value="#ff0000">
  </div>

  <hr class="my-4" />
  <button type="button" id="boutonparametreaffichage" class="btn btn-success btn-lg mb-2" onclick="fermeraffichagecommande(this)">
    Close
  </button>
</div>
`;
  }else{
  
  document.getElementById('affichageParametresAffichage').innerHTML = `
<div class="mt-4 p-5 bg-secondary text-white rounded">
  <h2>Paramètres d'affichage</h2>
  <hr class="my-1" />

  <div class="d-flex align-items-center">
    <label for="selectQbitAffichage" class="me-3 fw-bold">Représentation des amplitudes</label>
    <select class="form-control" id="selectQbitAffichage" onchange="changerOptionQbit(this)">
      <option value="1">Complexe : a + b x i</option>
      <option value="2">Trigonométrique : r.exp(i&#952)</option>
    </select>
  </div>

  <div class="d-flex align-items-center">
    <label for="uniteaffichage" class="me-3 fw-bold">&nbsp;&nbsp;&nbsp;Unité des angles</label>
    <select class="form-control selectunite" id="uniteaffichage" onclick="changerAngle(this)">
      <option value="1">Degré</option>
      <option value="2">Radian</option>
      <option value="3">k.&pi; Radian</option>
    </select>
  </div>

  <hr class="my-4" />

  <div class="d-flex align-items-center">
    <label class="me-3 fw-bold">Affichage des états des Qbits sur les lignes quantiques</label>
    <div class="form-check me-3">
      <input class="form-check-input" type="radio" name="etatQBits" id="radioOui" checked>
      <label class="form-check-label" for="radioOui">Oui</label>
    </div>
    <div class="form-check">
      <input class="form-check-input" type="radio" name="etatQBits" id="radioNon">
      <label class="form-check-label" for="radioNon">Non</label>
    </div>
  </div>

  <div class="d-flex align-items-center">
    <label class="me-3 fw-bold">Affichage en mode Superposition</label>
    <div class="form-check me-3">
      <input class="form-check-input" type="radio" name="Super" id="radioOuiSuper">
      <label class="form-check-label" for="radioOuiSuper">Oui</label>
    </div>
    <div class="form-check">
      <input class="form-check-input" type="radio" name="Super" id="radioNonSuper" checked>
      <label class="form-check-label" for="radioNonSuper">Non</label>
    </div>
  </div>

  <hr class="my-4" />

  <div class="d-flex align-items-center">
    <label class="me-3 fw-bold">Affichage des fenêtres d'états et de probabilités</label>
    <div class="form-check me-3">
      <input class="form-check-input" type="radio" name="probas" id="radioOuiProba" checked>
      <label class="form-check-label" for="radioOuiProba">Oui</label>
    </div>
    <div class="form-check">
      <input class="form-check-input" type="radio" name="probas" id="radioNonProba">
      <label class="form-check-label" for="radioNonProba">Non</label>
    </div>
  </div>

  <div class="d-flex align-items-center">
    <label class="me-3 fw-bold">Affichage des états en notation décimale</label>
    <div class="form-check me-3">
      <input class="form-check-input" type="radio" name="decimal" id="radioOuidecimal">
      <label class="form-check-label" for="radioOuidecimal">Oui</label>
    </div>
    <div class="form-check">
      <input class="form-check-input" type="radio" name="decimal" id="radioNondecimal" checked>
      <label class="form-check-label" for="radioNondecimal">Non</label>
    </div>
  </div>

  <div class="d-flex align-items-center">
    <label class="me-3 fw-bold">Précision des probabilités (nombre de décimales)</label>
    <input type="number" id="precisionChiffresApresVirgule" class="form-control selectpetit" min="0" max="6" value="1">
  </div>

  <hr class="my-4" />

  <div class="color-picker-container">
    <label for="colorPicker" class="me-3 fw-bold">Couleur de fond</label>
    <input type="color" id="colorPicker" class="form-control" value="#ff0000">
  </div>

  <hr class="my-4" />
  <button type="button" id="boutonparametreaffichage" class="btn btn-success btn-lg mb-2" onclick="fermeraffichagecommande(this)">
    Fermer
  </button>
</div>
`;
  
  }
}

function change_jumbotron_parametresQbits(){
  
  if (langue==1){
     document.getElementById('affichageParametresqbit').innerHTML ='<div class="mt-4 p-5 bg-secondary text-white rounded"><h2>Qubit Parameters</h2><hr class="my-1" /><p>Choose amplitudes (complex, trigonometric, Bloch sphere) for the normalized qubit</p><select class="form-control" id="selectQbit" onchange="changerOptionQbit(this)"><option value="1">Complex: a + b x i (automatic normalization after validation)</option><option value="2">Trigonometric: r.exp(i&#952) (automatic normalization after validation)</option><option value="3">Bloch sphere: cos(&#952/2)|0⟩ + sin(&#952/2) exp(i&#934)|1⟩</option></select><hr class="my-1" /><section id="unite" style="display:none"><div class="d-flex align-items-center"><label for="uniteAngleQbit" class="me-3 fw-bold">Angle unit</label><select class="form-control selectunite" id="uniteAngleQbit" onclick="changerAngle(this)"><option value="1">Degree</option><option value="2">Radian</option><option value="3">k.&pi; Radian</option></select></div></section><div class="grosgras"><section id="complexe" style="display:inline"><div class="align-line"><span>|0⟩ :  </span><input type="text" class="form-control input-small" id="a1" value="1" onkeyup="retourne_coeff_qbit()"><span>+</span><input type="text" class="form-control input-small" id="b1" value="0" onkeyup="retourne_coeff_qbit()"><span> x i</span></div><div class="align-line"><span>|1⟩ :  </span><input type="text" class="form-control input-small" id="a2" value="0" onkeyup="retourne_coeff_qbit()"><span> + </span><input type="text" class="form-control input-small" id="b2" value="0" onkeyup="retourne_coeff_qbit()"><span> x i</span></div></section><section id="trigo" style="display:none"><div class="align-line"><span>|0⟩ :  </span><input type="text" class="form-control input-small" id="rtrigo1" value="1" onkeyup="retourne_coeff_qbit()"><span>.exp(i</span><input type="text" class="form-control input-small" id="tetatrigo1" value="0" onkeyup="retourne_coeff_qbit()"><span class="affichePi" style="display:none">&pi;</span><span>)</span></div><div class="align-line"><span>|1⟩ :  </span><input type="text" class="form-control input-small" id="rtrigo2" value="0" onkeyup="retourne_coeff_qbit()"><span>.exp(i</span><input type="text" class="form-control input-small" id="tetatrigo2" value="0" onkeyup="retourne_coeff_qbit()"><span class="affichePi" style="display:none">&pi;</span><span>)</span></div></section><section id="bloch" style="display:none"><div class="align-line"><span>|0⟩ :  cos(</span><input type="text" class="form-control input-small" id="tetabloch1" value="0" onkeyup="retourne_coeff_qbit()"><span class="affichePi" style="display:none">&pi;</span><span>/2)</span></div><div class="align-line"><span>|1⟩ :  sin(</span><span id="tetabloch2">0</span><span class="affichePi" style="display:none">&pi;</span><span>/2).exp(i</span><input type="text" class="form-control input-small" id="phibloch" value="0" onkeyup="retourne_coeff_qbit()"><span class="affichePi" style="display:none">&pi;</span><span>)</span></div></section></div><br><a id="qbitnormalise"></a><hr class="my-4" /><button type="button" id="boutonparametre" class="btn btn-success btn-lg mb-2" onclick="fermeraffichagecommande(this)">Close</button></div>';
    
  } else {
      document.getElementById('affichageParametresqbit').innerHTML = 
    '<div class="mt-4 p-5 bg-secondary text-white rounded"><h2>Paramètres du qBit</h2><hr class="my-1" /><p>Choisis des amplitudes (complexes, trigonométriques, sphère de Bloch) pour le qBit normalisé</p><select class="form-control" id="selectQbit" onchange="changerOptionQbit(this)"><option value="1">Complexe : a + b x i (normalisation automatique après validation)</option><option value="2">Trigonométrique : r.exp(i&#952) (normalisation automatique après validation)</option><option value="3">Sphère de Bloch : cos(&#952/2)|0⟩ + sin(&#952/2) exp(i&#934)|1⟩</option></select><hr class="my-1" /><section id="unite" style="display:none"><div class="d-flex align-items-center"><label for="uniteAngleQbit" class="me-3 fw-bold">Unité des angles</label><select class="form-control selectunite" id="uniteAngleQbit" onclick="changerAngle(this)"><option value="1">Degré</option><option value="2">Radian</option><option value="3">k.&pi; Radian</option></select></div></section><div class="grosgras"><section id="complexe" style="display:inline"><div class="align-line"><span>|0⟩ :  </span><input type="text" class="form-control input-small" id="a1" value="1" onkeyup="retourne_coeff_qbit()"><span>+</span><input type="text" class="form-control input-small" id="b1" value="0" onkeyup="retourne_coeff_qbit()"><span> x i</span></div><div class="align-line"><span>|1⟩ :  </span><input type="text" class="form-control input-small" id="a2" value="0" onkeyup="retourne_coeff_qbit()"><span> + </span><input type="text" class="form-control input-small" id="b2" value="0" onkeyup="retourne_coeff_qbit()"><span> x i</span></div></section><section id="trigo" style="display:none"><div class="align-line"><span>|0⟩ :  </span><input type="text" class="form-control input-small" id="rtrigo1" value="1" onkeyup="retourne_coeff_qbit()"><span>.exp(i</span><input type="text" class="form-control input-small" id="tetatrigo1" value="0" onkeyup="retourne_coeff_qbit()"><span class="affichePi" style="display:none">&pi;</span><span>)</span></div><div class="align-line"><span>|1⟩ :  </span><input type="text" class="form-control input-small" id="rtrigo2" value="0" onkeyup="retourne_coeff_qbit()"><span>.exp(i</span><input type="text" class="form-control input-small" id="tetatrigo2" value="0" onkeyup="retourne_coeff_qbit()"><span class="affichePi" style="display:none">&pi;</span><span>)</span></div></section><section id="bloch" style="display:none"><div class="align-line"><span>|0⟩ :  cos(</span><input type="text" class="form-control input-small" id="tetabloch1" value="0" onkeyup="retourne_coeff_qbit()"><span class="affichePi" style="display:none">&pi;</span><span>/2)</span></div><div class="align-line"><span>|1⟩ :  sin(</span><span id="tetabloch2">0</span><span class="affichePi" style="display:none">&pi;</span><span>/2).exp(i</span><input type="text" class="form-control input-small" id="phibloch" value="0" onkeyup="retourne_coeff_qbit()"><span class="affichePi" style="display:none">&pi;</span><span>)</span></div></section></div><br><a id="qbitnormalise"></a><hr class="my-4" /><button type="button" id="boutonparametre" class="btn btn-success btn-lg mb-2" onclick="fermeraffichagecommande(this)">Fermer</button></div>';

  }
  
}