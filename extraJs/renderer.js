
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

ipcRenderer.on('alerte', function (e, message) {
    alert(message);
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

	const spanTitle = document.createElement('span');
    spanTitle.id = "name-"+shopListAdded.id;

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
