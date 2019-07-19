
const electron = require('electron');
const {ipcRenderer} = electron;


/*************PAGE D ACCUEIL*******************/

/***********Fonctions de base***********/
 function clearErrors(){
	 alerts = document.getElementsByClassName('alert');

	 for (i = 0 ; i < alerts.length ; i++){
		 alerts[i].style.display = "none";
	 }
 }

 //Quitter l'application
 function exitApp() {
 	ipcRenderer.send('exitApp');
 }

 //Ajouter une liste
 function addList() {
 	ipcRenderer.send('newList');
 }

//Suppression des listes
function delLists() {
    ipcRenderer.send('delLists');
}

//Suppression d'1 liste
function delOneList(idListe) {
    ipcRenderer.send('delOneList', idListe);
}

//Edition d'1 liste
function editOneList(idListe) {
    ipcRenderer.send('editOneList', idListe);
}

//Ajout d'un aliment
function addAnAliment(idCat, listId){
     ipcRenderer.send('addAliment', idCat, listId);
}

//Ajout d'une catégorie
function addCat(idList){
    ipcRenderer.send('addCat',idList);
}

//Ajout d'une catégorie
function clearCats(idList){
    console.log('go clearCats at : '+idList)
}

//Edition d'un aliment
function editOneAliment(idAlim, idCat, listId){
    console.log('go edit aliment at : '+idAlim)
}

//Suppression d'un aliment
function delOneAliment(idAlim, idCat, listId){
    console.log('go del aliment at : '+idAlim)
}

//Edition d'une categorie
function editOneCat(idCat, listId){
    console.log('go edit cat at : '+idCat)
}

//Suppression d'une categorie
function delOneCat(idCat, listId){
    console.log('go del cat at : '+idCat)
}

//Affichage d'un message.. Notamment d'erreur
ipcRenderer.on('alerte', function (e, message) {
    alert(message);
})


/*************NAVIGATION**************/
function returnToLists(){
    document.getElementById('shopListsDic').style.display = "block";
    document.getElementById('categoriesList').style.display = "none";
    document.getElementById('btnLists').style.display = "none";
    document.getElementById('noCategories').style.display = "none";
    /**BOUTONS TOP MENU**/
    document.getElementById('addList').style.display = "block";
    document.getElementById('clearLists').style.display = "block";
    document.getElementById('addCat').style.display = "none";
    document.getElementById('clearCats').style.display = "none";

    document.getElementById('container-cards').innerHTML = "";

    //A IMPLEMENTER LINE 242 main
    ipcRenderer.send("reloadLists");
}

function returnToConnection(){
	document.getElementById('btnConnection').style.display = "none";
    document.getElementById('btnLists').style.display = "none";
    ipcRenderer.send("reloadMain");
}


/*************Affichage et gestion du contenu des listes**************/
function displayList(id){

	document.getElementById('shopListsDic').style.display = "none";
    document.getElementById('categoriesList').style.display = "block";
    document.getElementById('btnLists').style.display = "block";

    /**BOUTONS TOP MENU**/
    document.getElementById('addList').style.display = "none";
    document.getElementById('clearLists').style.display = "none";
    document.getElementById('addCat').style.display = "block";
    document.getElementById('addCat').setAttribute('onclick', 'addCat('+id+')');
    document.getElementById('clearCats').style.display = "block";
    document.getElementById('clearCats').setAttribute('onclick', 'clearCats('+id+')');

    //Appel au main pour qu'il recherche les categories associées
    ipcRenderer.send('categories:get', id);
    //Récupération de l'utilisateur et des categories liées à cette utilisateurs (ainsi que les aliments qui y sont liés)
    ipcRenderer.on('categories:recept', function (e, user) {
        var indexOfShopList = user.shoppingLists.indexOf(user.shoppingLists.find(shopList => shopList.id == id));
        //on récupère les catégories de la liste de courses en question
        var categories = user.shoppingLists[indexOfShopList].listCatgories;
        //console.log(user);
        //Si pas de categories on propose à l'utilisateur d'en créer une facilement
        if (categories.length === 0) {
            document.getElementById('noCategories').style.display = "block";
        }
        //sinon on affiche les categories disponibles
        else {
            //Avant tous on vide tout
            document.getElementById('noCategories').style.display = "none";
            document.getElementById('container-cards').innerHTML = "";

            //Premier element qui récupère les éléments créés
            const sectionReceptive = document.getElementById('container-cards');

            //Pour chaque catégorie on créer une carte
            //console.log(categories);
            for (var category of categories){
                const container = document.createElement('div');
                container.className = 'container-card';

                sectionReceptive.appendChild(container);

                const card = document.createElement('div');
                card.className = 'card categorie_card';

                container.appendChild(card);

                const card_header = document.createElement('div');
                card_header.className = 'card-header';

                card.appendChild(card_header);

                const title = document.createTextNode(
                    category.name
                );

                card_header.appendChild(title);

                const span = document.createElement('span');
                span.className = 'badge badge-primary badge-pill';
                /*const itemNumber = document.createTextNode(
                    "<img src='../img/edit.svg'>"
                );*/
                const editImg = document.createElement('img');
                editImg.src = '../img/edit.svg';
                editImg.width = 20;
                editImg.height = 20;
                editImg.className = 'btnClick';
                editImg.setAttribute('onclick', 'editOneCat('+category.id+', '+id+')');

                span.appendChild(editImg);

                const space = document.createTextNode(" ");
                span.appendChild(space);

                const garbageImg = document.createElement('img');
                garbageImg.src = '../img/garbage.svg';
                garbageImg.width = 25;
                garbageImg.height = 25;
                garbageImg.className = 'btnClick';
                //ONCLICK DELETE AVEC ID
                garbageImg.setAttribute('onclick', 'delOneCat('+category.id+', '+id+')');

                span.appendChild(garbageImg);

                card_header.appendChild(span);

                const card_body = document.createElement('div');
                card_body.className = 'card-body card-body-custom';

                card.appendChild(card_body);

                var aliments = category.listAliments;

                //Pour chaque aliment de la catégorie on rempli la carte
                for (var aliment of aliments){
                    
                    if (aliment.name != null){
                        const alimentLine = document.createElement('div');
                        alimentLine.className = "alimentLine";
                        const subline1 = document.createElement('div');
                        subline1.innerHTML = "<b><u>"+aliment.name+"</u></b> : "+aliment.quantity+" "+aliment.unit;
                        const subline2 = document.createElement('div');
                        subline2.innerHTML = "prix maximal : "+aliment.max_price+" "+user.shoppingLists[indexOfShopList].devise;

                        alimentLine.appendChild(subline1);
                        alimentLine.appendChild(subline2);
                        card_body.appendChild(alimentLine);

                        const span = document.createElement('span');
                        span.className = 'badge badge-primary badge-pill badge-aliment';
                        /*const itemNumber = document.createTextNode(
                            "<img src='../img/edit.svg'>"
                        );*/
                        const editImg = document.createElement('img');
                        editImg.src = '../img/edit.svg';
                        editImg.width = 20;
                        editImg.height = 20;
                        editImg.className = 'btnClick';
                        editImg.setAttribute('onclick', 'editOneAliment('+aliment.id+', '+category.id+', '+id+')');

                        span.appendChild(editImg);

                        const space = document.createTextNode(" ");
                        span.appendChild(space);

                        const garbageImg = document.createElement('img');
                        garbageImg.src = '../img/garbage.svg';
                        garbageImg.width = 25;
                        garbageImg.height = 25;
                        garbageImg.className = 'btnClick';
                        //ONCLICK DELETE AVEC ID
                        garbageImg.setAttribute('onclick', 'delOneAliment('+aliment.id+', '+category.id+', '+id+')');

                        span.appendChild(garbageImg);

                        alimentLine.appendChild(span);
                    }


                }

                const card_footer = document.createElement('div');
                card_footer.className = 'card-footer btnClick categoryFooter';
                card_footer.setAttribute('onclick', 'addAnAliment('+category.id+', '+id+')');
                card.appendChild(card_footer);


                const addAliment = document.createElement('img');
                addAliment.src = '../img/cart_add_alim.svg';
                addAliment.width = 30;
                addAliment.height = 30;
                addAliment.className = 'btnClick';
                card_footer.appendChild(addAliment);


            }
        }

    })
}
/************TRAITEMENT DES CATEGORIES************/
ipcRenderer.on('add:category/ok', function (e, catName, listId) {
    const container = document.createElement('div');
    container.className = 'container-card';

    sectionReceptive.appendChild(container);

    const card = document.createElement('div');
    card.className = 'card categorie_card';

    container.appendChild(card);

    const card_header = document.createElement('div');
    card_header.className = 'card-header';

    card.appendChild(card_header);

    const title = document.createTextNode(
        catName
    );

    card_header.appendChild(title);

    const span = document.createElement('span');
    span.className = 'badge badge-primary badge-pill';
    /*const itemNumber = document.createTextNode(
        "<img src='../img/edit.svg'>"
    );*/
    const editImg = document.createElement('img');
    editImg.src = '../img/edit.svg';
    editImg.width = 20;
    editImg.height = 20;
    editImg.className = 'btnClick';
    editImg.setAttribute('onclick', 'editOneCat('+listId+')');

    span.appendChild(editImg);

    const space = document.createTextNode(" ");
    span.appendChild(space);

    const garbageImg = document.createElement('img');
    garbageImg.src = '../img/garbage.svg';
    garbageImg.width = 25;
    garbageImg.height = 25;
    garbageImg.className = 'btnClick';
    //ONCLICK DELETE AVEC ID
    garbageImg.setAttribute('onclick', 'delOneCat('+listId+')');

    span.appendChild(garbageImg);

    card_header.appendChild(span);

    const card_body = document.createElement('div');
    card_body.className = 'card-body card-body-custom';

    card.appendChild(card_body);

    const card_footer = document.createElement('div');
    card_footer.className = 'card-footer btnClick categoryFooter';
    card_footer.setAttribute('onclick', 'addAnAliment('+listId+')');
    card.appendChild(card_footer);


    const addAliment = document.createElement('img');
    addAliment.src = '../img/cart_add_alim.svg';
    addAliment.width = 30;
    addAliment.height = 30;
    addAliment.className = 'btnClick';
    card_footer.appendChild(addAliment);

})

/************Connexion************/
//envoie des infos de connexions
const formConnection = document.getElementById('formauth');
formConnection.addEventListener('submit',submitFormConnection);

function submitFormConnection(e){
	e.preventDefault();
	const login = document.querySelector('#authId').value;
	const pwd = document.querySelector('#authpwd').value;
	ipcRenderer.send('user:connect', login, pwd);
}

//connection accepté
ipcRenderer.on('connection:true', function(e, user) {
	const btnAddList = document.getElementById('addList');
	const btnClearLists = document.getElementById('clearLists');
  	const conectArea = document.getElementById('conection');
	const firstShoppingList = document.getElementById('noShoppingLists');

  	//desactiver la zone de connexion
	conectArea.style.display = "none";
	//désactiver l'affichage des categories au cas où
    document.getElementById('categoriesList').style.display = "none";
    //Activer le bouton de retour à l'authentification
    document.getElementById('btnConnection').style.display = "block";

	//ACTIVATION DES BOUTONS
	btnAddList.style.display = "block";
	btnClearLists.style.display = "block";

  //console.log(user);
  //Si l'utilisateurs n'ont pas de listes de shopping on lui propose d'en créer
  if (user.shoppingLists.length === 0) {
      firstShoppingList.style.display = "block";
  }
  //Sinon on peut afficher les listes
  else {
      //Lister les listes de shopping
  	for (var oneList of user.shoppingLists){
        const li = document.createElement('li');
        li.className = 'list-group-item d-flex justify-content-between align-items-center';
        li.id = "line-"+oneList.id;

        const spanTitle = document.createElement('span');
        spanTitle.id = "name-"+oneList.id;
        spanTitle.className = 'lineClick';
        spanTitle.setAttribute('onclick', 'displayList('+oneList.id+')');

        const title = document.createTextNode(
            oneList.name + " (" + oneList.devise + ")"
        );

        spanTitle.appendChild(title);

        li.appendChild(spanTitle);
        ul.appendChild(li);

        const span = document.createElement('span');
        span.className = 'badge badge-primary badge-pill';
        /*const itemNumber = document.createTextNode(
            "<img src='../img/edit.svg'>"
        );*/
        const editImg = document.createElement('img');
        editImg.src = '../img/edit.svg';
        editImg.width = 20;
        editImg.height = 20;
        editImg.className = 'btnClick';
        editImg.id = "edit-"+oneList.id;
        editImg.setAttribute('onclick', 'editOneList('+oneList.id+')');

        span.appendChild(editImg);

        const space = document.createTextNode(" ");
        span.appendChild(space);

        const garbageImg = document.createElement('img');
        garbageImg.src = '../img/garbage.svg';
        garbageImg.width = 25;
        garbageImg.height = 25;
        garbageImg.className = 'btnClick';
        //ONCLICK DELETE AVEC ID
        garbageImg.id = "del-"+oneList.id;
        garbageImg.setAttribute('onclick', 'delOneList('+oneList.id+')');

        span.appendChild(garbageImg);
        li.appendChild(span);
	}
    //console.log("shoppingLists : " + user.shoppingLists);
    //console.log(user);
      //document.getElementById("edit-"+oneList.id).addEventListener('click',editOneList(oneList.id));
     // document.getElementById("del-"+oneList.id).addEventListener('click',delOneList(oneList.id));
  }
});

//connection refusée
//Login incorrect
ipcRenderer.on('connection:user_not_exist', function () {
	const alertCompteInexistant = document.getElementById('cptInexist');
	const login = document.getElementById('authId');
	const pwd = document.getElementById('authpwd');

	alertCompteInexistant.style.display = "block";
	login.classList.add('is-invalid');
	pwd.classList.add('is-invalid');
});
//mot de passe incorrecte
ipcRenderer.on('connection:bad_pwd', function () {
	const alertBadPwd = document.getElementById('badPwd');
	const login = document.getElementById('authId');
	const pwd = document.getElementById('authpwd');

	alertBadPwd.style.display = "block";
	login.classList.add('is-valid');
	pwd.classList.add('is-invalid');
});

/************Création de compte************/
const formNewAccount = document.querySelector('#formNewAccount');

formNewAccount.addEventListener('submit', submitFormAccountCreation);

function submitFormAccountCreation(e){
		e.preventDefault();
		const login = document.querySelector('#newId').value;
		const pwd = document.querySelector('#newpwd').value;
		if (login !== '' && pwd !== '') {
			ipcRenderer.send('user:create', login, pwd);
		}
		else {
			const alertVoidFields = document.getElementById('voidFields');

			const login = document.getElementById('newId');
			const pwd = document.getElementById('newpwd');

			alertVoidFields.style.display = "block";
			login.classList.add('is-invalid');
			pwd.classList.add('is-invalid');
		}
}

//login déjà utilisé
ipcRenderer.on("creationUser:loginExist", function(){
	const alertAccountExist = document.getElementById('userAlreadyExist');

	const login = document.getElementById('newId');
	const pwd = document.getElementById('newpwd');

	alertAccountExist.style.display = "block";
	login.classList.add('is-invalid');
	pwd.classList.add('is-invalid');
});

//création de compte accepté
ipcRenderer.on("creationUser:true", function(user){
	const conectArea = document.getElementById('conection');
	const firstShoppingList = document.getElementById('noShoppingLists');
	const addListBtn = document.getElementById('addList');
	const clearListsBtn = document.getElementById('clearLists');

	conectArea.style.display = "none";
    //désactiver l'affichage des categories au cas où
    document.getElementById('categoriesList').style.display = "none";
    //Activer le bouton de retour à l'authentification
    document.getElementById('btnConnection').style.display = "block";
	firstShoppingList.style.display = "block";
	addListBtn.style.display = "block";
	clearLists.style.display = "block";
});




/************Affichage ajout liste de courses************/

//ajout d'un item :
const ul = document.querySelector('ul');

ipcRenderer.on('list:add', function (e, user) {

  const shopListAdded = user.shoppingLists[(user.shoppingLists.length)-1];

  const firstShoppingList = document.getElementById('noShoppingLists');
  firstShoppingList.style.display = "none";

    /*console.log(user);
    console.log(user.shoppingLists);*/
	const li = document.createElement('li');
	li.className = 'list-group-item d-flex justify-content-between align-items-center';
    li.id = "line-"+shopListAdded.id;
    li.setAttribute('onclick', 'displayList('+shopListAdded.id+')');

	const spanTitle = document.createElement('span');
    spanTitle.id = "name-"+shopListAdded.id;
    spanTitle.className = 'lineClick';
    spanTitle.setAttribute('onclick', 'displayList('+shopListAdded.id+')');

    const title = document.createTextNode(
        shopListAdded.name + " (" + shopListAdded.devise + ")"
    );

    spanTitle.appendChild(title);

	li.appendChild(spanTitle);
	ul.appendChild(li);

	const span = document.createElement('span');
	span.className = 'badge badge-primary badge-pill';
	/*const itemNumber = document.createTextNode(
		"<img src='../img/edit.svg'>"
	);*/
	const editImg = document.createElement('img');
	editImg.src = '../img/edit.svg';
	editImg.width = 20;
	editImg.height = 20;
	editImg.className = 'btnClick';
    //ONCLICK EDIT AVEC ID
    editImg.id = "edit-"+shopListAdded.id;
    editImg.setAttribute('onclick', 'editOneList('+shopListAdded.id+')');

	span.appendChild(editImg);

	const space = document.createTextNode(" ");
	span.appendChild(space);

	const garbageImg = document.createElement('img');
	garbageImg.src = '../img/garbage.svg';
	garbageImg.width = 25;
	garbageImg.height = 25;
	garbageImg.className = 'btnClick';
    //ONCLICK DELETE AVEC ID
    garbageImg.id = "del-"+shopListAdded.id;
    garbageImg.setAttribute('onclick', 'delOneList('+shopListAdded.id+')');

	span.appendChild(garbageImg);
	li.appendChild(span);

	/*document.getElementById("edit-"+shopListAdded.id).addEventListener('click',editOneList(shopListAdded.id));
	document.getElementById("del-"+shopListAdded.id).addEventListener('click',delOneList(shopListAdded.id));*/
});

/*************Suppression des listes***********/
ipcRenderer.on('deleteAllLists:true', function (e) {
    const ul = document.querySelector('ul');
    /*while (ul.firstChild) {
        ul.removeChild(element.firstChild);
    }*/
    ul.innerHTML = "";
	const firstShoppingList = document.getElementById('noShoppingLists');
	firstShoppingList.style.display = "block";
});
/*************Rafraichissement des listes après modification***********/
ipcRenderer.on('list:edit/true', function (e, id, name, devise) {
    document.getElementById('name-'+id).innerText = name + " (" + devise + ")";
})



/**********SUPPRESSION D UNE LISTE*********/
ipcRenderer.on('list:remove/true', function (e, id) {
    document.querySelector('ul').removeChild(document.getElementById('line-'+id));
})

/*************RACCOURCIS CLAVIER***********/
/*
 * Nous sommes dans le scope global,
 * aussi l'objet `keys` est accessible partout
 * dans le code à travers tous les fichiers JavaScript.
*/
var keys = {};
/*
 * Étant dans le code global,
 * `window.onkeydown` est identique à `this.onkeydown`
 * lui même identique à `onkeydown`.
 * On associe ci-dessous la même fonction lorsqu'une
 * touche est appuyée, et lorsqu'une touche est relachée.
*/
onkeydown = onkeyup = function (e) {
	/*
     * Si `e` n'existe pas,
     * nous somme probablement dans un vieux IE.
     * On affecte alors `event` à `e`.
     */
	e = e || event;
	/*
     * Si `e.which` n'existe pas,
     * On affecte alors l'alternative `e.keyCode` à `e.which`.
     */
	e.which = e.which || e.keyCode;
	/*
     * Si la fonction courante est executée,
     * quand une touche est enfoncée,
     * `e.type === 'keydown'` renverra `true`
     * sinon elle renverra `false`.
     * Il suffit alors d'assigner chaque état
     * dans le tableau `keys` pour chaque
     * touche `e.keyCode`.
     */
	keys[e.which] = e.type === 'keydown';
	/*
     * Cette zone sera exécutée lorsque les touches
     * Ctrl (17), Alt (18) et E (69)
     * seront enfoncée en même temps
     * car l'objet `keys` vaudra alors :
     * {
     *  17: true,
     *  18: true,
     *  69: true
     * }
       */
	//if (keys[17] && keys[18] && keys[69]) {
	/*
     * Affichera dans la console (F12, onglet console)
     * le texte « Ctrl + Alt + E ».
     */
	//	console.log('Ctrl + Alt + E');
	//}
	if (keys[17] && keys[81]) {
		/*
         * Affichera dans la console (F12, onglet console)
         * le texte « Ctrl + Alt + E ».
         */
		//console.log('quitter : Ctrl + Q');
		exitApp();
	}
}
/*
 * Si l'on clique dans le navigateur...
 */
onclick = function () {
	/*
     * ...alors que les touches
     * Ctrl (17), Alt (16) et E (69)
     * sont appuyées...
     */
	//if (keys[17] && keys[16] && keys[69]) {
	/*
     * ...on affichera dans la console
     * le texte « Ctrl + Alt + E ».
     */
	//console.log('Ctrl + Shift + E');
	//}
	if (keys[17] && keys[81]) {
		//console.log('quitter : Ctrl + Q');
		exitApp();
	}
}
