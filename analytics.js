/* QAlgo — chargement différé de Google Analytics, abandonné au bout de 2 secondes
 *
 * Simulateur de circuits quantiques pour l'enseignement — https://www.qalgo.org
 * Code source : https://github.com/BoissacF/QAlgo
 *
 * Copyright (C) 2025-2026 Frédéric Boissac
 * Logiciel libre sous licence GNU AGPL version 3 ou ultérieure ;
 * voir le fichier LICENSE à la racine du dépôt.
 */
// analytics.js - Code complet pour Google Analytics avec Web Worker

// Attendre que la page soit chargée avant d'initialiser GA


window.addEventListener('load', function() {
  
   
    // Charger GA de façon traditionnelle avec timeout de sécurité
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=G-L2VNGMV6YS';
    
    const timeout = setTimeout(() => {
      console.log('Timeout de chargement GA');
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    }, 2000);//temps au bout duquel on abandonne google analytics 
    
    script.onload = () => {
      clearTimeout(timeout);
      window.dataLayer = window.dataLayer || [];
      function gtag() { dataLayer.push(arguments); }
      gtag('js', new Date());
      gtag('config', 'G-L2VNGMV6YS');
    };
    
    document.head.appendChild(script);
  
});