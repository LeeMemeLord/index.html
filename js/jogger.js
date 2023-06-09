"use strict";

// Initialisations spécifiques au jeu lorsque la page est chargée (ajout des listener, etc).
window.addEventListener(
    "load",
    function () {
        zoneJeu.init();
        personnage.init();
    }
);

function qualite(){
    document.body.style.userSelect = "none";
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Tab') {
            e.preventDefault();
        }
        if (e.key === "ArrowUp"){
            e.preventDefault();
        }
    });
}

// OBJET "partie" : propriétés et méthodes pour gérer une partie.
let partie = {
    // Durée maximale d'une partie en secondes.
    DUREE_MAX: 180,

    // Nombre d'entrées conservées dans le tableau des meilleurs scores.
    MAX_RECORD: 5,

    /*
      Le jeu dure 3 minutes. À chaque 30 secondes, on augmente le niveau de difficulté.
      La gestion des niveaux se fait grâce aux 4 paramètres suivants.
       - delaiMinObstacle = Temps minimal (en secondes) entre la création de 2 obstacles consécutifs.
       - probObstacle = Probabilité (0 à 1) de générer un nouvel obstacle une fois que le délai minimal est passé.
       - delaiMinRecompense = Temps minimal (en secondes) entre la création de 2 récompenses consécutives.
       - probRecompense = Probabilité (0 à 1) de générer une nouvelle récompense une fois que le délai minimal est passé.
    */
    NIVEAUX: [
        // Paramètres temporaires pour voir rapidement des obstacles et des récompenses
        /*
        {delaiMinObstacle: 1, probObstacle: 0.5, delaiMinRecompense: 1, probRecompense: 0.5},
        {delaiMinObstacle: 4, probObstacle: 0.3, delaiMinRecompense: 2, probRecompense: 0.6},
        {delaiMinObstacle: 3, probObstacle: 0.4, delaiMinRecompense: 1, probRecompense: 0.4},
        {delaiMinObstacle: 2, probObstacle: 0.5, delaiMinRecompense: 1, probRecompense: 0.5},
        {delaiMinObstacle: 1, probObstacle: 0.6, delaiMinRecompense: 1, probRecompense: 0.6},

         */

        // Paramètres +réalistes (à activer lorsque votre code sera terminé.

        {delaiMinObstacle: 5, probObstacle: 0.2, delaiMinRecompense: 2, probRecompense: 0.2},
        {delaiMinObstacle: 4, probObstacle: 0.3, delaiMinRecompense: 2, probRecompense: 0.6},
        {delaiMinObstacle: 3, probObstacle: 0.4, delaiMinRecompense: 1, probRecompense: 0.4},
        {delaiMinObstacle: 2, probObstacle: 0.5, delaiMinRecompense: 1, probRecompense: 0.5},
        {delaiMinObstacle: 1, probObstacle: 0.6, delaiMinRecompense: 1, probRecompense: 0.6}

    ],

    // Niveau actuel de la partie (0, 1, 2, ...)
    niveau: 0,

    // TimeStamp au moment du début de la partie.
    timeDebut: null,
    // "Handle" du processus répétitif de mise à jour du chronomètre de la partie.
    // Devrait être exécuté 1 fois par seconde pendant une partie.
    threadRebours: null,

    // Méthode appelée au début d'une partie.
    debuter: function () {
        this.timeDebut = new Date();
        this.niveau = 0;

        // On invoque la méthode "reset" sur différents composants du jeu pour les remettre dans leur état initial.
        obstacles.reset();
        zoneJeu.reset();

        // On démarre le processus itératif pour le compte à rebours de la partie.
        // La méthode est appelée à toutes les secondes.
        this.threadRebours = setInterval(
            function () {
                partie.majRebours();
            },
            1000
        );

        // On démarre le processus itératif pour animer les obstacles.
        // La méthode est appelée à toutes les 10 millisecondes pour les faire bouger de quelques pixels.
        obstacles.threadAnimer = setInterval(
            function () {
                obstacles.animer();
            },
            10
        );

        // On démarre le processus itératif pour créer de nouveaux obstacles.
        // La méthode est appelée à toutes les secondes.
        obstacles.threadCreer = setInterval(
            function () {
                obstacles.creer();
            },
            1000
        );

        partieEnCours = true;

        window.addEventListener("keydown", function(e) {
            clavier.traiter(e);
        });

        window.addEventListener("keyup", function(e) {
            clavier.traiter(e);
        });
    },

    // Méthode appelée à la fin d'une partie (temps écoulé ou collision avec un obstacle).
    // Le paramètre est un booléen initialisé à true lorsqu'il y a eu collision.
    terminer: function (perdu) {
        // On arrête les processus répétitifs responsables des obstacles.
        obstacles.arreterAnimation();

        partieEnCours = false;
    },

    /*
        Méthode appelée à toutes les secondes pendant une partie.
        Elle permet de :
            - Mettre à jour le chronomètre
            - Mettre à jour le pointage (car un point est donné à chaque seconde)
            - Mettre à jour le niveau (on augmente le niveau à chaque 30 seconde)
            - Vérifier si la fin de la partie est atteinte (temps écoulé)
    */
    majRebours: function () {
        let duree = this.DUREE_MAX - this.getDureeEnSecondes();

        // Ajustement du niveau à chaque 30 secondes
        this.niveau = Math.min(Math.trunc((this.DUREE_MAX - duree) / 30), this.NIVEAUX.length - 1);

        zoneJeu.majRebours();
    },

    // Méthode qui permet d'arrêter le processus itératif du chronomètre.
    arreterRebours: function () {
        clearInterval(this.threadRebours);
    },

    // Méthode qui retourne le temps écoulé en secondes depuis le début de la partie.
    getDureeEnSecondes() {
        return getTempsEcouleEnSecondes(this.timeDebut);
    },

    // Méthode qui retourne le tableau des meilleurs scores.
    getRecords() {

    },

    /*
        Méthode qui permet de mettre à jour le tableau des meilleurs scores.
        Les scores sont stockés sous la forme d'un objet sérialisé (en String) dans le localStorage de l'application.
        Le nouveau score est reçu en paramètre.
        S'il fait partie des 5 meilleurs, le localStorage est ajusté.
        La méthode retourne true si le nouveau pointage fait partie des meilleurs scores et false autrement.
            Ce booléen permettra de déterminer si les record doivent être affichés à la fin de la partie.
    */
    majRecords(pPointage) {

    },

    // Méthode qui permet d'afficher les meilleurs scores.
    // Elle sera appelée automatiquement à la fin d'une partie lorsqu'un meilleur score vient d'être obtenu,
    //  ou encore à la demande du joueur lorsqu'il clique sur le bouton.
    afficherRecords() {

    }
};

/*
    OBJET "zoneJeu" : propriétés et méthodes pour contrôler l'interface du jeu (sauf le personnage, les obstacles
    et les récompenses qui sont gérés par des objets spécifiques.
*/
let zoneJeu = {
    // Propriétés pour conserver un accès aux objets des éléments de la page. 
    planDOM: null,
    zoneNiveauDOM: null,
    zonePointageDOM: null,
    zoneReboursDOM: null,
    zoneAideDOM: null,
    btnAideDOM: null,
    btnGoDOM: null,
    btnRecordDOM: null,

    /*
        Méthode appelée lorsque la page du jeu est chargée.
        On initialise les objets du DOM et on ajoute les "listener" d'événements.    
    */
    init: function () {
        this.planDOM = document.getElementById("zoneJeu");
        this.zoneNiveauDOM = document.getElementById("zoneNiveau");
        this.zonePointageDOM = document.getElementById("zonePointage");
        this.zoneReboursDOM = document.getElementById("zoneRebours");
        this.btnGoDOM = document.getElementById("btnGo");
        this.btnRecordDOM = document.getElementById("btnRecords");

        // Listener déclenché lorsqu'une fenêtre modale vient de s'afficher.
        $('#idFenetre').on('shown.bs.modal', function () {

        });

        // Listener déclenché lorsqu'une fenêtre modale vient de se refermer.
        $('#idFenetre').on('hidden.bs.modal', function () {

        });

        this.btnGoDOM.addEventListener(
            "click",
            function () {
                partie.debuter();
                personnage.threadVerifierDirection = setInterval(function (){
                    personnage.verifierChangementDirection(clavier.touchesAppuyees);
                },1);
               /* obstacles.threadVerifierColision = setInterval(function (){
                    obstacles.verifierColision();
                },10);

                */
            }
        );

        this.majRebours()
    },

    // Méthode qui permet de mettre à jour l'interface (zone Niveau).
    majNiveau: function () {

    },

    // Méthode qui permet de mettre à jour l'interface (zone Pointage).
    majPointage: function () {

    },

    // Méthode qui permet de mettre à jour l'interface (zone du Compte à rebours).
    majRebours: function () {
        let duree = partie.DUREE_MAX - partie.getDureeEnSecondes();
        let dureeMinute = Math.trunc(duree / 60);
        let dureeSeconde = duree % 60;
        this.zoneReboursDOM.firstElementChild.innerText = ("00" + dureeMinute).slice(-2) + ":" + ("00" + dureeSeconde).slice(-2);
    },

    // Méthode qui permet de réinitialiser la zone du jeu au début d'une partie (zones, boutons, etc).
    reset() {

    },

    // Méthode invoquée lors de la fin d'une animation CSS.
    traiterFinAnimation(e) {

    }
};



// OBJET "clavier" : propriétés et méthodes pour gérer l'état des touches du clavier.
let clavier = {
    // Pour marcher dans l'une ou l'autre des directions
    FLECHE_GAUCHE: "ArrowLeft",
    FLECHE_DROITE: "ArrowRight",
    // Pour sauter
    FLECHE_HAUT: "ArrowUp",
    //Pour courir
    MAJUSCULE: "ShiftLeft",

    /*
        Tableau pour conserver le code des touches actuellement appuyées.
        Lors d'un keydown on ajoute la touche si elle n'est pas déja dans le tableau et lors d'un keyup on la retire.
     */
    touchesAppuyees: [],

    /*
        Méthode appelée lors d'un événement keydown ou keyup sur le clavier.
        Elle permet de mettre à jour le tableau des touches appuyées.
    */
    traiter: function (e) {
        if (!clavier.touchesAppuyees.includes(e.code) && e.type === "keydown") {
            clavier.touchesAppuyees.push(e.code);
        }
        else if (clavier.touchesAppuyees.includes(e.code) && e.type === "keyup") {
            clavier.touchesAppuyees.splice(clavier.touchesAppuyees.indexOf(e.code), 1);
        }
    },
}

// OBJET "personnage" : propriétés et méthodes pour gérer le personnage principal.
let personnage = {
    /*
        Constantes qui définissent les états possibles pour le mouvement du personnage.
        Ces valeurs correspondent au nombre de pixels à ajouter à la position horizontale de l'image d'arrière-plan
        pour simuler le mouvement du personnage.
    */
    ARRET: 0,
    GAUCHE_LENT: 1,
    GAUCHE_RAPIDE: 2,
    DROITE_LENT: -1,
    DROITE_RAPIDE: -2,
    DIRECTION_GAUCHE: 1,
    DIRECTION_DROITE: -1,

    // Dossier et fichiers des différentes images du personnage.
    REP_IMAGES: "images/",
    IMAGES: [
        "Marche0.png",
        "Marche1.png",
        "Marche2.png",
        "Marche3.png",
        "Marche4.png"
    ],

    // Propriété pour conserver un accès à l'objet du DOM pour le personnage.
    oDOM: null,

    // Direction actuelle du personnage.
    directionBG: 0,
    // Position actuelle de l'arrière-plan pour simuler le mouvement du personnage.
    bgPositionX: 0,
    // Booléen indiquant si le personnage est actuellement en train de sauter.
    enSaut: false,

    /*
        "Handle" du processus répétitif qui vérifie l'état du clavier et la direction actuelle du personnage pour
        vérifier si un changement de direction ou de vietesse ou un arrêt est requis.
        Ce processus sera exécuté à toutes les millisecondes pendant une partie.
    */
    threadVerifierDirection: null,
    /*
        "Handle" du processus répétitif qui s'exécute pour bouger le personnage (en changeant la position horizontale
        de l'image de background).
        Ce processus sera exécuté à toutes les 8 millisecondes pendant une partie.
    */
    threadBouger: null,
    /*
        "Handle" du processus répétitif qui s'exécute pour animer l'image du personnage pour lui donner un effet de marche ou de course.
        Ce processus sera exécuté à toutes les 60 millisecondes pour la marche et 30 millisecondes pour la course.
    */
    threadMarcherCourir: null,

    // Image actuelle
    imageActuelle: 0,

    /*
        Méthode appelée lorsque la page du jeu est chargée.
        On initialise le personnage dans la zone de jeu (dimension, position, etc).    
    */
    init() {
        const PCT_HAUTEUR = 10.4167;
        const PCT_DIMENSION_VERTICALE = 78.6528;

        this.oDOM = document.getElementById("personnage");
        /*
            On redimensionne l'image et on la positionne verticalement et horizontalement.
            ELle sera toujours à cet endroit, car c'est l'arrière-plan qui bougera pour donner l'effet de mouvement.
        */
        this.oDOM.style.height = Math.round(PCT_HAUTEUR / 100 * getHauteurDOM(zoneJeu.planDOM)) + "px";
        this.oDOM.style.top = Math.round(PCT_DIMENSION_VERTICALE / 100 * getHauteurDOM(zoneJeu.planDOM)) + "px";
        this.oDOM.style.left = Math.round((getLargeurDOM(zoneJeu.planDOM) / 2) - (getLargeurDOM(personnage.oDOM) / 2)) + "px";
        zoneJeu.planDOM.style.backgroundPosition="0px";
    },

    // Méthode qui retourne la direction actuelle du personnage (-1, 0 ou 1).
    getDirection() {
        return personnage.directionBG;
    },

    /*
        Méthode qui vérifie les touches du clavier actuellement appuyées et qui teste si un changement de direction
        ou un arrêt ou un saut est requis. Dans l'affirmative, le mouvement actuel est arrêté et on démarre dans
        l'autre direction au besoin.
    */

    verifierChangementDirection: function (touches) {
        let gauche = touches.includes(clavier.FLECHE_GAUCHE);
        let droite = touches.includes(clavier.FLECHE_DROITE);
        let haut = touches.includes(clavier.FLECHE_HAUT);
        let maj = touches.includes(clavier.MAJUSCULE);

        if (gauche && droite) {
            if (haut) {
                personnage.enSaut = true;
                personnage.sauter();
            } else {
                personnage.enSaut = false;
                clearInterval(personnage.threadMarcherCourir);
                clearInterval(personnage.threadBouger);
            }
            return;
        } else if (gauche) {

            if (haut) {
                personnage.enSaut = true;
                personnage.sauter();

            } else {
                personnage.enSaut = false;
            }
        } else if (droite) {
            if (haut) {
                personnage.enSaut = true;
                personnage.sauter();
            } else {
                personnage.enSaut = false;
            }
        } else if (haut) {
            personnage.enSaut = true;
            personnage.sauter();
        } else {
            personnage.enSaut = false;
            clearInterval(personnage.threadMarcherCourir);
            clearInterval(personnage.threadBouger);
            return;
        }
        let directionAttendue = null;
        if(gauche) {
            directionAttendue = maj ? personnage.GAUCHE_RAPIDE : personnage.GAUCHE_LENT;
        }else if(droite){
            directionAttendue = maj ? personnage.DROITE_RAPIDE : personnage.DROITE_LENT;
        }


        if (directionAttendue !== null && personnage.directionBG !== directionAttendue) {
            clearInterval(personnage.threadBouger);
            clearInterval(personnage.threadMarcherCourir);

            let scaleX = (directionAttendue === personnage.GAUCHE_RAPIDE || directionAttendue === personnage.GAUCHE_LENT) ? -1 : 1;
            this.oDOM.style.transform = 'scaleX(' + scaleX + ')';

            personnage.threadBouger = setInterval(function () {
                personnage.bouger(directionAttendue);
            }, 10);

            if (!personnage.enSaut) {
                personnage.threadMarcherCourir = setInterval(function () {
                    personnage.marcher();
                }, maj ? 30 : 60);
            }
        }
        personnage.directionBG = directionAttendue;
    },

    /*
        Méthode qui permet de bouger de quelques pixels l'image d'arrière-plan pour simuler le déplacement du personnage.
        Les récompenses se déplacent également en synchronisation avec le personnage.
        Le nombre de pixels est reçu en paramètre.
        Cette méthode est appelée à chaque 10 millisecondes et déplace l'arrière-plan de 1 pixel (marcher) ou 2 (courir).
    */
    bouger: function (deltaX) {
        let background = document.getElementById("zoneJeu");
        let currentBackgroundPosition = background.style.backgroundPosition;
        let currentXPosition = parseInt(currentBackgroundPosition.split(" ")[0]);
        let newXPosition = currentXPosition + deltaX;
        background.style.backgroundPosition = newXPosition + "px";
    },




    /*
        Méthode qui permet de changer l'image du personnage pour simuler le mouvement des bras et des jambes.
        On alterne entre les 5 images.
        Par contre, pendant un saut, on ne veut pas bouger les bras et les jambes.

        Cette méthode est appelée à chaque 60 millisecondes lorsque le personnage marche et à chaque 30 millisecondes
        lorsqu'il court.
    */
    marcher: function () {
        document.getElementById("personnage").src = personnage.REP_IMAGES +personnage.IMAGES[personnage.imageActuelle];
        personnage.imageActuelle = (personnage.imageActuelle+1) % personnage.IMAGES.length;
    },

    // Méthode qui permet d'arrêter complètement le personnage dans sa position actuelle, même s'il est en saut.
    arreterAnimation() {

    },

    // Méthode qui permet de déclencher l'animation CSS du saut.
    sauter: function () {
        /*
        let perso = $("#personnage");

        perso.animate({top: "100px"});

         */


        this.oDOM.classList.add("animation")
        setTimeout(function (){
            personnage.oDOM.classList.remove("animation");
        },500);

    },


    /*
        Méthode qui permet de réinitialiser l'objet et le personnage à la fin du saut.
        Cette méthode sera appelée lors de l'événement "animationend" à la fin d'un saut ou lors du début d'une nouvelle
        partie.
     */
    resetSaut: function () {

    },

    // Méthode qui permet de réinitialiser le personage au début d'une partie (image, position, etc).
    reset: function () {

    }
};
//

// OBJET "obstacles" : propriétés et méthodes pour gérer les obstacles.
let obstacles = {
    /*
        Tableau pour conserver les objets du DOM qui seront créés pour les obstacles.
        Lorsque l'obstacle sort de la zone de jeu (à gauche), on le supprime du tableau.
    */
    LES_OBSTACLES_DOM: [],







    // TimeStamp du moment où le dernier obstacle a été créé. Cela permet de ne pas en générer trop.
    timeDernierObstacle: null,

    /*
        "Handle" du processus répétitif qui permet de faire bouger tous les obstacles.
        Ce processus sera exécuté à toutes les 10 millisecondes pendant une partie.
    */
    threadAnimer: null,
    /*
        "Handle" du processus répétitif qui permet de créer de nouveaux obstacles.
        Ce processus sera exécuté à toutes les secondes pendant une partie.
    */
    threadCreer: null,

    threadVerifierColision: null,

    /*
        Méthode qui permet de créer un nouvel obstacle.
        On vérifie d'abord si le temps écoulé depuis la dernière création dépasse le délai minimal pour le niveau
        actuel du jeu. Si c'est le cas, on génère en fonction d'une probabilité qui est aussi dépendante du
        niveau actuel.
     */
    creer: function () {
        if (this.getDureeDepuisDerniereCreation() >= partie.NIVEAUX[partie.niveau].delaiMinObstacle) {
            let prob = Math.random();
            if (prob <= partie.NIVEAUX[partie.niveau].probObstacle) {
                let nouvelObstacle = new Obstacle();
                zoneJeu.planDOM.appendChild(nouvelObstacle.obstacleDOM);
                this.LES_OBSTACLES_DOM.push(nouvelObstacle.obstacleDOM);
                this.timeDernierObstacle = new Date();
            }
        }
    },

    /*
        Méthode qui permet de déplacer tous les obstacles de quelques pixels vers la gauche.
    */
    animer: function () {
        for (let i = this.LES_OBSTACLES_DOM.length - 1; i >= 0; i--) {
            let unObstacle = this.LES_OBSTACLES_DOM[i];
            /*
                Étant donné que la direction du personage varie entre -2 et 2, la formule suivante nous assure
                que l'obstacle se déplacera toujours vers la gauche, peu importe la vitesse du personnage.
                Ainsi, la valeur soustraite à la position X de l'obstacle sera toujours entre -5 et -1.
             */
            let posXDebutObstacle = getPosXDOM(unObstacle) - 3 + personnage.directionBG;
            unObstacle.style.left = posXDebutObstacle + "px";

            // Détection d'une collision entre l'obstacle et le personnage.
            // À compléter...
            setInterval(function (){
                let persoLeft = parseInt(window.getComputedStyle(personnage.oDOM).getPropertyValue("left"));
                let persoTop = parseInt(window.getComputedStyle(personnage.oDOM).getPropertyValue("top"));
                let obstacleLeft = parseInt(window.getComputedStyle(unObstacle).getPropertyValue("left"));
                let obstacleTop = parseInt(window.getComputedStyle(unObstacle).getPropertyValue("top"));
                let obstacleWidth = unObstacle.offsetWidth;
                let obstacleHeight = unObstacle.offsetHeight;
                let personnageWidth = personnage.oDOM.offsetWidth;
                let personnageHeight = personnage.oDOM.offsetHeight;
                if (obstacleLeft + obstacleWidth <= persoLeft + personnageWidth*2) {
                   alert("allo");
                }
            },10);





            // On supprime l'obstacle s'il a complètement dépassé la frontière de gauche.
            if (posXDebutObstacle + getLargeurDOM(unObstacle) < 0) {
                zoneJeu.planDOM.removeChild(this.LES_OBSTACLES_DOM[i]);
                this.LES_OBSTACLES_DOM.splice(i, 1);
            }
        }
    },
    verifierColision: function (){
        let perso = parseInt(window.getComputedStyle(personnage.oDOM).getPropertyValue("top"));
        let obstacle = parseInt(window.getComputedStyle(obstacles.LES_OBSTACLES_DOM).getPropertyValue("left"));

        console.log(obstacle);
        console.log(perso);
    },

    // Méthode qui permet d'arrêter le mouvement de tous les obstacles. Sera appelée à la fin d'une partie. 
    arreterAnimation: function () {
        // On arrête le processus répétitif responsable du mouvement des obstacles.
        window.clearInterval(obstacles.threadAnimer);
        // On arrête le processus répétitif responsable de la création des obstacles.
        window.clearInterval(obstacles.threadCreer);
        // On arrête également l'animation CSS qui fait tourner les obstacles.
        for (let o of this.LES_OBSTACLES_DOM)
            o.style.animationPlayState = "paused";
    },

    // Méthode qui retourne le nombre de secondes écoulées depuis la création du dernier obstacle.
    getDureeDepuisDerniereCreation() {
        return getTempsEcouleEnSecondes(this.timeDernierObstacle);
    },

    // Méthode qui permet de réinitialiser l'objet obstacles au début d'une partie.
    reset() {
        for (let o of this.LES_OBSTACLES_DOM) {
            o.remove();
        }
        this.LES_OBSTACLES_DOM = [];
        this.timeDernierObstacle = new Date();
    }
};

// OBJET "recompenses" : propriétés et méthodes pour gérer les récompenses.
let recompenses = {
    /*
      Les récompenses sont des pièces de monnaies de différentes tailles et de différentes valeurs.
      Plus une pièce de monnaie est petite, plus elle a de valeur.
      La constante suivante permet de définir les caractéristiques des 3 types de pièces.
         - La dimension est une valeur en % qui sera appliquée à la hauteur du plan de jeu pour avoir une taille
    */
    INFO_PIECES: [
        {valeur: 3, dimension: 6.944},
        {valeur: 5, dimension: 5.2083},
        {valeur: 10, dimension: 3.4722}
    ],

    /*
       Tableau pour conserver les objets du DOM qui seront créés pour les récompenses.
       Lorsque la récompense est "gagnée" ou qu'elle sort de la zone de jeu (à gauche), on la supprime du tableau.
   */
    LES_RECOMPENSES_DOM: [],

    // Pointage attribué aux récompenses capturées pendant la partie.
    pointage: 0,

    // TimeStamp du moment où la dernière récompense a été créée. Cela permet de ne pas en générer trop.
    timeDerniereRecompense: null,

    /*
        "Handle" du processus répétitif qui permet de créer de nouvelles récompenses.
        Ce processus sera exécuté à toutes les secondes pendant une partie.
    */
    threadCreer: null,
    /*
        "Handle" du processus répétitif qui vérifie les collisions entre les récompenses et le personnage.
        Ce processus sera exécuté à toutes les millisecondes pendant une partie.
    */
    threadVerifier: null,

    // Méthode qui permet de créer une nouvelle récompense.
    creer: function () {
        // On ne veut pas créer de pièces de monnaie si le joueur n'avance pas.
        if (personnage.directionBG >= 0)
            return;

        // À compléter
    },

    /*
        Méthode qui permet de vérifier la position actuelle de toutes les récompenses.
        Si une collision est détectée entre cette récompense et le personnage, les points sont attribués et
        la récompense est retirée.
        Si une récompense sort de la zone de jeu (à gauche), elle est retirée.
    */
    verifier: function () {

    },

    // Méthode qui permet d'arrêter le mouvement de tous les obstacles. Sera appelé à la fin d'une partie.
    arreterAnimation: function () {

    },

    // Méthode qui retourne le nombre de secondes écoulées depuis la création de la dernière récompense.
    getDureeDepuisDerniereCreation() {

    },

    // Méthode qui permet de réinitialiser l'objet recompenses au début d'une partie.
    reset() {

    }
};

/*************************
 FONCTIONS UTILITAIRES
 *************************/
// Fonction qui permet de retourner un nombre entier aléatoire entre min et max.
function genererEntier(min, max) {
    return min + Math.trunc(Math.random() * (max - min + 1))
}

// Fonction qui permet de retourner la largeur en pixels d'un objet du DOM (reçu en paramètre).
function getLargeurDOM(o) {
    return Math.round(parseFloat(window.getComputedStyle(o).getPropertyValue("width")));
}

// Fonction qui permet de retourner la hauteur en pixels d'un objet du DOM (reçu en paramètre).
function getHauteurDOM(o) {
    return Math.round(parseFloat(window.getComputedStyle(o).getPropertyValue("height")));
}

// Fonction qui permet de retourner la position horizontale en pixels d'un objet du DOM (positionné en absolu)
//  par rapport à la frontière gauche de son conteneur.
function getPosXDOM(o) {
    return Math.round(parseFloat(window.getComputedStyle(o).getPropertyValue("left")));
}

// Fonction qui permet de retourner la position verticale en pixels d'un objet du DOM (positionné en absolu)
//  par rapport à la frontière supérieure de son conteneur.
function getPosYDOM(o) {
    return Math.round(parseFloat(window.getComputedStyle(o).getPropertyValue("top")));
}

// Fonction qui retourne le nombre de secondes écoulées entre le moment présent et un moment passé.
// Si le temps passé reçu en paramètre est null ou undefined, on retourne 0.
function getTempsEcouleEnSecondes(tsDebut) {
    return (tsDebut === null || tsDebut == undefined ? 0 : Math.trunc((new Date() - tsDebut) / 1000));
}

// Fonction qui permet de retourner un booléen indiquant si un chevauchement existe entre 2 objets du DOM.
// Le 1er objet reçu en paramètre est un cercle.
// Le 2ème objet reçu en paramètre est un rectangle.
function estEnCollision(cercleDOM, rectangleDOM) {

    return false;
}

/*
    Fonction constructeur d'obstacles.
    Les obstacles sont toujours placés au départ à la droite du plan de jeu.
    À la verticale, ils sont toujours à la même hauteur, une position calculée en pourcentage
    par rapport à la hauteur de la zone de jeu.
*/
function Obstacle() {
    const PCT_HAUTEUR = 85.6528;
    const PCT_DIMENSION_VERTICALE = 6.9444;

    this.obstacleDOM = document.createElement("div");
    this.obstacleDOM.className = "obstacle";
    this.obstacleDOM.style.left = getLargeurDOM(zoneJeu.planDOM) + "px";
    this.obstacleDOM.style.top = (PCT_HAUTEUR / 100) * getHauteurDOM(zoneJeu.planDOM) + "px";
    this.obstacleDOM.style.width = (PCT_DIMENSION_VERTICALE / 100) * getHauteurDOM(zoneJeu.planDOM) + "px";
    this.obstacleDOM.style.height = (PCT_DIMENSION_VERTICALE / 100) * getHauteurDOM(zoneJeu.planDOM) + "px";
}

/*
    Fonction constructeur de récompenses.
    On détermine au hasard le type de récompense à créer.
    Les dimensions et la valeur des pièces sont déterminées par les données de la constante INFO_PIECES reçue en paramètre.

    Les récompenses sont toujours placées au départ à la droite du plan de jeu.

    À la verticale, la hauteur est générée aléatoirement pour être au-dessus du personnage, mais pas trop haut pour
    qu'elle puisse être atteinte lors d'un saut. La distance du bas de la récompense, calculée à partir du haut de
    la zone de jeu est calculée en pourcentage par rapport à la hauteur de la zone de jeu. Ces 2 pourcentages sont
    définis avec des constantes dans la méthode.
*/
function Recompense(INFO_PIECES) {
    const PCT_TOP_MINIMAL = 60.764;
    const PCT_TOP_MAXIMAL = 74.653;

    this.uneRecompenseDOM = null;
}