"use strict";

// Initialisations générales (pour toutes les pages) lorsqu'une page est chargée.
window.addEventListener(
    "load",
    function () {
        initAbonnesDepart();
         afficherPseudo();
    }
);

const URL_ACCUEIL = "index.html";
const URL_JEU = "jogger.html";

const PAGE_ACCUEIL = 'accueil';
const PAGE_JEU = 'jeu';

// Booléen indiquant si une partie est en cours.
// Il servira entre autres à avertir l'utilisateur que la partie se terminera s'il tente de revenir à la page
// d'accueil pendant une partie.
let partieEnCours;

// Fonction qui sera appelée lorsque l'on veut changer de page.
// Elle contient la logique pour vérifier si le changement de page doit être effectué.
function naviguerPage(destination) {
    let continuer = true;
    switch (destination) {
        case PAGE_ACCUEIL:
            window.location.replace(URL_ACCUEIL);
            break;

        case PAGE_JEU:
            window.location.replace(URL_JEU);

            break;
    }
}
function afficherPseudo(){
    if(sessionStorage.length === 0){
        return false;
    }
    else{
        let cle = sessionStorage.key(0);
        let chaine = sessionStorage.getItem(cle);
        let chaineTraite = JSON.parse(chaine);
        let chaineFiltre = chaineTraite['pseudonyme'];

        let pseudo = document.getElementById("lePseudo");
        pseudo.innerHTML = chaineFiltre;
        pseudo.style.visibility="visible";
        pseudo.style.color="black";
        pseudo.style.display="inline-block";

        let bouton = document.getElementById("buttonX");
        bouton.innerHTML = "Quitter";
        bouton.style.visibility="visible";
        bouton.style.color="black";
        bouton.style.display="inline-block";
    }
}
function quitterJeu(){
    sessionStorage.clear();
    naviguerPage(PAGE_ACCUEIL);

}
