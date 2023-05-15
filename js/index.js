"use strict";

// Initialisations spécifiques à la page de connexion lorsque la page est chargée (ajout des listener, etc).
window.addEventListener("load",
    function () {
            // Listener déclenché lorsqu'une zone collapsible de la page a été affichée.
            $(".collapse").on("shown.bs.collapse", function (e) {

            });

            // Listener déclenché lorsqu'une fenêtre modale vient de s'afficher.
            $('#idFenetre').on('shown.bs.modal', function () {

            });

            // Listener déclenché lorsqu'une fenêtre modale vient de se refermer.
            $('#idFenetre').on('hidden.bs.modal', function () {

            });
            const valideurAUthentification = document.getElementById('validerAutentification');

            valideurAUthentification.addEventListener("click", function (e) {
                    e.preventDefault();
                    validerConecter();
            });

            const validateurInscription = document.getElementById('valideurInsription');
            validateurInscription.addEventListener("click", function (e) {
                    e.preventDefault();
                    enregistrerAbonne();


            });
        freezePage();
        afficherPseudo();
    }
);
function resetPageInscription(){
    const input = document.getElementById("identifiant");
    const form = document.getElementById("form-inscription");
    form.reset();
    input.focus();
    return false;
}
function resetPageAuthentification(){
    const input = document.getElementById("identifiants");
    const form = document.getElementById("form-authentification");
    form.reset();
    input.focus();
    return false;
}
function freezePage(){
    const inputs = document.querySelectorAll("input, select");
    for (let i = 0; i < inputs.length; i++) {
        if(estConecte) {
            inputs[i].disabled = true;
            inputs[i].style.backgroundColor ="white";
            inputs[i].setAttribute("placeholder","");

        }else {
            return false
        }
    }
    return false;
}

function enregistrerAbonne(){
    if(typeof(Storage) !== "undefined") {
        let abonne = setAbonnerInscription();
        if(estAuthentifie(abonne.nom)){
           affichageErreurModal(4);
            resetPageInscription();
            return;
        }
        if(!verificationIdentifiant(abonne.nom)){
            affichageErreurModal(5);
            resetPageInscription();
            return;
        }
        if(!verificationPseudonyme(abonne.pseudonyme)){
            affichageErreurModal(6);
            resetPageInscription();
            return;
        }
        if(!verificationInputPassword()){
            resetPageInscription();
            return;
        }
        abonne.motDePass = changerMotDePass(abonne.motDePass);
        setAuthentifie(abonne);
        naviguerPage(PAGE_JEU);

    }
}
function validerConecter() {
    let abonneConection =setAbonnerAuthentification();
    let nom = abonneConection.nom;
    let motDePass = abonneConection.motDePass;
    motDePass = changerMotDePass(motDePass);
    let abonne = trouverNom(nom);
    if (estAuthentifie(nom)) {
        if(validerMotDePassIdentiques(abonne.motDePass,motDePass)) {
            abonneConection.motDePass = motDePass;
            setAuthentifie(abonneConection);
            naviguerPage(PAGE_JEU);
            let pseudo = document.getElementById("lePseudo");
            pseudo.innerHTML = abonneConection.pseudonyme;
        }else {
            affichageErreurModal(2);
            resetPageAuthentification();
        }
    } else {
        affichageErreurModal(1);
        resetPageAuthentification();
    }
}

function setAbonnerInscription() {
    const nom = document.getElementById("identifiant").value;
    const pseudonyme = document.getElementById("pseudo").value;
    const motDePasse = document.getElementById("mdp").value ;
    return new Abonne(nom, pseudonyme, motDePasse);
}
function setAbonnerAuthentification () {
    const nom = document.getElementById("identifiants").value;
    const motdePass = document.getElementById("mdps").value;
    const pseud = getPseudo(nom);
    return new Abonne(nom, pseud, motdePass);
}
function trouverNom(nom){
    if(estAuthentifie(nom)){
        const abonneJson = localStorage.getItem(CLE_PREFIXE_ABONNE+nom);
        return  JSON.parse(abonneJson);
    }
    return false;
}

function estAuthentifie (nom) {
    return localStorage.getItem(CLE_PREFIXE_ABONNE + nom) !== null;
}

function setAuthentifie(abonne) {
    const utilisateurJson = JSON.stringify(abonne);
    abonne.motDePass = changerMotDePass(abonne.motDePass);
    console.log(abonne.motDePass);
    localStorage.setItem(CLE_PREFIXE_ABONNE + abonne.nom, utilisateurJson);
    sessionStorage.setItem(CLE_AUTHENTIFIE + abonne.nom, utilisateurJson);
}

function permissionD_Entree(){
    if(estConnecter()){
        naviguerPage(PAGE_JEU);
    }else{
        affichageErreurModal(3);
    }
}

function affichageErreurModal(codeErreur){
    const msgErreurModal = document.getElementById('msgErreurModal');
    let utilisateur = document.getElementById("identifiants").value;

    switch (codeErreur){
        case 1:
            msgErreurModal.textContent="L ABONNE " + utilisateur + " N'EST PAS AUTHENTIFIER";
            break;
        case 2:
            msgErreurModal.textContent="le mot de pass n est pas correct";
            break;
        case 3:
            msgErreurModal.textContent="Vous n'etes pas encore connecte";
            break;
        case 4:
            msgErreurModal.textContent="Cet abonne est deja authentifier";
            break;
        case 5:
            msgErreurModal.textContent="ENTRE UN IDENTIFIANT ENTRE 2 ET 10 CHARACTERE";
            break;
        case 6:
            msgErreurModal.textContent="ENTRE UN PSEUDONYME ENTRE 2 ET 10 CHARACTERE";;
            break;
        case 7:
            msgErreurModal.textContent="ENTREZ UN MOT DE PASS ENTRE 5 ET 20 CHARACTERE";
            break;
        case 8:
            msgErreurModal.textContent="ENTREZ AU MOIN UN ESPACE DANS VOTRE MOT DE PASSE";
            break;
        case 9:
            msgErreurModal.textContent="ENTREZ AU MOIN  DEUX MOTS DANS VOTRE MOT DE PASSE";
            break;
        case 10:
            msgErreurModal.textContent="ENTREZ AU MOIN 3 OCURENCES DE LA LETTRE a/A";
            break;
        case 11:
            msgErreurModal.textContent="ENTREZ DES MOTS DE PASS SIMULAIRE";
            break;
    }
    $('#maFenetreErreur').modal('show');
    return false;
}
