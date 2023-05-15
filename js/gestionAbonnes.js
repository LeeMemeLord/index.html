"use strict";

const CLE_AUTHENTIFIE = "ABONNE_AUTHENTIFIE_";
const CLE_PREFIXE_ABONNE = "ABONNE_";
const idInscription = document.getElementById("indentifiant");
const idAuthentification = document.getElementById("indentifiants");
let estConecte = false;
/*
    Pour les tests, on crée déjà 3 abonnés (hardcoding).
    Éventuellement, les abonnés seront créés par une fonction constructeur.
*/
function initAbonnesDepart() {
    let user = null;
    estConnecter();
   /*
   if (typeof (localStorage) != "undefined") {
        // Le mot de passe non-crypté de user1 est "Ave Maria".
        user = {nom: "user1", pseudonyme: "Agathe", motDePasseCrypte: "f24d1a09990934170bbeeed20ab85758"};
        localStorage.setItem(CLE_PREFIXE_ABONNE + user.nom, JSON.stringify(user));


        // Le mot de passe non-crypté de user2 est "Banana split".
        user = {nom: "user2", pseudonyme: "Brenda", motDePasseCrypte: "8656cc8ebb46e96ab90ad17008d9d870"};
        localStorage.setItem(CLE_PREFIXE_ABONNE + user.nom, JSON.stringify(user));

        // Le mot de passe non-crypté de user3 est "Casa Loma".
        user = {nom: "user3", pseudonyme: "Celine", motDePasseCrypte: "56628af0d9a167d119068049184246b8"};
        localStorage.setItem(CLE_PREFIXE_ABONNE + user.nom, JSON.stringify(user));
    }
    */
}

function Abonne(nom,pseudonyme,motDePass) {
    this.nom = nom;
    this.pseudonyme = pseudonyme;
    this.motDePass = motDePass;

}
function estConnecter() {
    estConecte = sessionStorage.length !== 0;
    return estConecte;
}

function changerMotDePass(motDePass) {
        return CryptoJS.MD5(motDePass).toString();
    }
function validerMotDePassIdentiques (chaineMdp,chaineCmdp){
        return chaineMdp === chaineCmdp;
    }
function verificationInputPassword(){
    let abonne = setAbonnerInscription();
    const motDePassConfiramtion = document.getElementById("cmdp").value;

    if(!verificationLMotDePass(abonne.motDePass)){
        affichageErreurModal(7);
        resetPageInscription();
        return;
    }
    if(verficationEspace(abonne.motDePass)){
        affichageErreurModal(8);
        resetPageInscription()
        return;
    }
    if(!verificationNmbMot(abonne.motDePass)){
        affichageErreurModal(9);
        resetPageInscription();
        return;
    }
    if(!verificationNmbA(abonne.motDePass)) {
        affichageErreurModal(10);
        resetPageInscription();
        return;
    }
    if(!validerMotDePassIdentiques(abonne.motDePass, motDePassConfiramtion)){
        affichageErreurModal(11);
        resetPageInscription();
        return;
    }
    return true;
}
function verificationLMotDePass(chaine){
    return !(chaine.length < 5 || chaine.length > 20);
}
function verficationEspace(chaine){
    return !(/\s/.test(chaine));
}
function verificationNmbMot(chaine){
    let nmbMots = chaine.split(" ");
    if(nmbMots.length === 2 && nmbMots[1]=== "" ){
        return false;
    }
    else return (nmbMots.length <= 2 || nmbMots.length >= 2);

}
function verificationNmbA(chaine){
    let compteur =0;
    for(let i = 0; i< chaine.length;i++){
        if(chaine[i] === "a" || chaine[i] === "A"){
            compteur++;
        }
    }
    return compteur === 3;
}

function verificationIdentifiant(chaine){
    return !(chaine.length < 2 || chaine.length > 10);
}
function verificationPseudonyme(chaine){
    return !(chaine.length < 2 || chaine.length > 10);
}

function getAbonne(nom){
    return trouverNom(nom)
}
function getPseudo(nom) {
    if(getAbonne(nom)) {
        return getAbonne(nom).pseudonyme;
    }
    else return false;
}



