//variable let : limitée au bloc courant (entre des acolades)
//variable constante const : ne peut être modifié après initialisation
// => doit avoir une valeur d'initialisation
// limité aussi au bloc courant
// (doit donc être en dehors des tous les blocs pour être lisible par tous)
// variable var : un peut comme let mais portée différente
//- Si elle est déclarée dans une fonction, la portée est celle de la fonction,
// qu’importe le bloc dans lequel elle se trouve.
//- Si elle est déclarée hors d’une fonction, la portée sera celle du contexte global.

//Importation des modules nécessaires
const electron = require('electron');
const url = require('url');
const path = require('path');


//Création des constantes pour les fenêtres
const {app, BrowserWindow, Menu, ipcMain} = electron;
//Mysql
const mysql = require('mysql');

var connection = mysql.createConnection({
    host: 'remotemysql.com',
    user: 'KjesGKfU1o',
    password: '9ix3LxCDYS',
    database: 'KjesGKfU1o',
    port: '3306'
});

require('electron-reload')(__dirname);


//declarations des fenetres
/**Fenêtre principale**/
let mainWindow;
/**Fenêtres gestion de listes**/
let addListWindow;
let editListWindow;
let rmListWindow;
/**Fenêtre gestion des catégories**/
let addCategoryWindow, editCategoryWindow, delCategoryWindow;
/**Fenêtre gestion des aliments**/
let addAlimentWindow, editAlimentWindow, delAlimentWindow;
/**Instance fenetres gestion listes**/
let addListAlreadyInstencied = false;
let editListAlreadyInstencied = false;
let rmListAlreadyInstencied = false;
/**Instance fenetres gestion catégories**/
let addCategoryAlreadyInstencied = false;
let editCategoryAlreadyInstencied = false;
let delCategoryAlreadyInstencied = false;
/**Instance fenetres gestion aliments**/
let addAlimentAlreadyInstencied = false;
let editAlimentAlreadyInstencied = false;
let delAlimentAlreadyInstencied = false;


//shoppingLists
//id	idUser	name	money_unit
//user
//id	login	password
//penser constructeur vide
let user = new Object();
user.shoppingLists = [];
//chargement des modules : objets+classesNécessaires
const aliments = require('./extraJs/entities/aliments');
const category = require('./extraJs/entities/category');
const shopList = require('./extraJs/entities/shopList');

/**********CREATION DES FENETRES A INSTANCIER*********/

function createMainWindow() {
    //Crétion de la novelle fenêtre
    mainWindow = new BrowserWindow({
        icon: path.join(__dirname, '/img/mainIco.png'),
        width: 870,
        height: 565,
        webPreferences: {
            nodeIntegration: true
        },
        transparent: true,
        frame: false,
    });

    //Chargement la page HTML dans l'application
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'views/accueil.html'),
        protocol: 'file:',
        slashes: true
    }));



    //Quit app when closed
    //fermer toutes les fenetres à la fermeture de la fenêtre mere
    mainWindow.on('closed', function () {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null
        app.quit();
    });

    // Open the DevTools.
    mainWindow.webContents.openDevTools();

    //Construction du menu
    //const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
    //Insertion du l'item dans le menu
    //Menu.setApplicationMenu(mainMenu);
};

// Ecoute pour savoir quand l'application est prête
// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createMainWindow);

// Quit when all windows are closed.
app.on('window-all-closed', function () {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit()
    }
});

app.on('activate', function () {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) {
        createMainWindow()
    }
});

//Ajouter une fenetre
function createListWindow() {
    //création de la fenêtre
    addListWindow = new BrowserWindow({
        width: 450,
        height:330,
        title: 'Ajout d\'une liste de course',
        webPreferences: {
            nodeIntegration: true
        },
        transparent: true,
        frame: false,
        //icon: __dirname+'img/mainIco.svg'
        icon: path.join(__dirname, '/img/mainIco.png')
    });
    //Insérer le code html
    addListWindow.loadURL(url.format(
        {
            pathname: path.join(__dirname, 'views/addList.html'),
            protocol: 'file:',
            slashes: true
        }
    ));
    //
  //addListWindow.webContents.openDevTools();

    addListWindow.on('close', function () {
        //addListWindow = null;
        addListAlreadyInstencied = false;
    })
}

//Ajouter une fenetre
function createAddCategoryWindow() {
    //création de la fenêtre
    addCategoryWindow = new BrowserWindow({
        width: 400,
        height:250,
        title: 'Ajout d\'une categorie',
        webPreferences: {
            nodeIntegration: true
        },
        transparent: true,
        frame: false,
        //icon: __dirname+'img/mainIco.svg'
        icon: path.join(__dirname, '/img/mainIco.png')
    });
    //Insérer le code html
    addCategoryWindow.loadURL(url.format(
        {
            pathname: path.join(__dirname, 'views/addCategory.html'),
            protocol: 'file:',
            slashes: true
        }
    ));
    //
    //addListWindow.webContents.openDevTools();

    addCategoryWindow.on('close', function () {
        //addListWindow = null;
        addCategoryAlreadyInstencied = false;
    })

}


//Ajouter un aliment : fenetre
function createAddAlimentWindow() {
    //création de la fenêtre
    addAlimentWindow = new BrowserWindow({
        width: 400,
        height:450,
        title: 'Ajout d\'un aliment',
        webPreferences: {
            nodeIntegration: true
        },
        transparent: true,
        frame: false,
        //icon: __dirname+'img/mainIco.svg'
        icon: path.join(__dirname, '/img/mainIco.png')
    });
    //Insérer le code html
    addAlimentWindow.loadURL(url.format(
        {
            pathname: path.join(__dirname, 'views/addAliment.html'),
            protocol: 'file:',
            slashes: true
        }
    ));
    //
    //addListWindow.webContents.openDevTools();

    addAlimentWindow.on('close', function () {
        //addListWindow = null;
        addAlimentAlreadyInstencied = false;
    })

}

//Modifier un aliment : fenetre
function createEditAlimentWindow() {
    //création de la fenêtre
    editAlimentWindow = new BrowserWindow({
        width: 400,
        height:450,
        title: 'Modification d\'un aliment',
        webPreferences: {
            nodeIntegration: true
        },
        transparent: true,
        frame: false,
        //icon: __dirname+'img/mainIco.svg'
        icon: path.join(__dirname, '/img/mainIco.png')
    });
    //Insérer le code html
    editAlimentWindow.loadURL(url.format(
        {
            pathname: path.join(__dirname, 'views/editAliment.html'),
            protocol: 'file:',
            slashes: true
        }
    ));
    //
    //addListWindow.webContents.openDevTools();

    editAlimentWindow.on('close', function () {
        //addListWindow = null;
        editAlimentAlreadyInstencied = false;
    })

}



//Fenêtre de modification d'une liste de course
function createEditListWindow() {
    //création de la fenêtre
    editListWindow = new BrowserWindow({
        width: 450,
        height:330,
        title: 'Modification d\'une liste de course',
        webPreferences: {
            nodeIntegration: true
        },
        transparent: true,
        frame: false,
        //icon: __dirname+'img/mainIco.svg'
        icon: path.join(__dirname, '/img/mainIco.png')
    });
    //Insérer le code html
    editListWindow.loadURL(url.format(
        {
            pathname: path.join(__dirname, 'views/editList.html'),
            protocol: 'file:',
            slashes: true
        }
    ));
    //
    //addListWindow.webContents.openDevTools();

    editListWindow.on('close', function () {
        editListAlreadyInstencied = false;
    })
}

//Fenêtre de suppression d'une liste de course
function createRemoveListWindow() {
    //création de la fenêtre
    rmListWindow = new BrowserWindow({
        width: 450,
        height:250,
        title: 'Suppression d\'une liste de course',
        webPreferences: {
            nodeIntegration: true
        },
        transparent: true,
        frame: false,
        //icon: __dirname+'img/mainIco.svg'
        icon: path.join(__dirname, '/img/mainIco.png')
    });
    //Insérer le code html
    rmListWindow.loadURL(url.format(
        {
            pathname: path.join(__dirname, 'views/delList.html'),
            protocol: 'file:',
            slashes: true
        }
    ));
    //
    //addListWindow.webContents.openDevTools();

    rmListWindow.on('close', function () {
        rmListAlreadyInstencied = false;
    })
}

/**********QUITTER L APPLI*********/

ipcMain.on('exitApp', function () {
    app.quit();
});

ipcMain.on('reloadMain', function () {
    //REINIT USER
    user = new Object();
    user.shoppingLists = [];
    //RAFRAICHISSEMENT DE LA FENETRE
    mainWindow.reload();
    //FERMETURE DES AUTRES FENETRES OUVERTES
    if (rmListAlreadyInstencied){
        rmListWindow.close();
        rmListAlreadyInstencied = false;
    }
    if (editListAlreadyInstencied){
        editListWindow.close();
        editListAlreadyInstencied = false;
    }
    if (addListAlreadyInstencied){
        addListWindow.close();
        addListAlreadyInstencied = false;
    }
    //FERMETURE DES AUTRES FENETRES OUVERTES LIES AU CATEGORIES
    if (delAlimentAlreadyInstencied){
        delAlimentWindow.close();
        delAlimentAlreadyInstencied = false;
    }
    if (editAlimentAlreadyInstencied){
        editAlimentWindow.close();
        editAlimentAlreadyInstencied = false;
    }
    if (addAlimentAlreadyInstencied){
        addAlimentWindow.close();
        addAlimentAlreadyInstencied = false;
    }

    if (delCategoryAlreadyInstencied){
        delCategoryWindow.close();
        delCategoryAlreadyInstencied = false;
    }
    if (editCategoryAlreadyInstencied){
        editCategoryWindow.close();
        editCategoryAlreadyInstencied = false;
    }
    if (addCategoryAlreadyInstencied){
        addCategoryWindow.close();
        addCategoryAlreadyInstencied = false;
    }
})

ipcMain.on('reloadLists', function () {

    //Réinitialisation des categories
    for (var i = 0; i < user.shoppingLists.length; i++) {
        user.shoppingLists[i].listCatgories = [];
    }
    //FERMETURE DES AUTRES FENETRES OUVERTES LIES AU CATEGORIES
    if (delAlimentAlreadyInstencied){
        delAlimentWindow.close();
        delAlimentAlreadyInstencied = false;
    }
    if (editAlimentAlreadyInstencied){
        editAlimentWindow.close();
        editAlimentAlreadyInstencied = false;
    }
    if (addAlimentAlreadyInstencied){
        addAlimentWindow.close();
        addAlimentAlreadyInstencied = false;
    }

    if (delCategoryAlreadyInstencied){
        delCategoryWindow.close();
        delCategoryAlreadyInstencied = false;
    }
    if (editCategoryAlreadyInstencied){
        editCategoryWindow.close();
        editCategoryAlreadyInstencied = false;
    }
    if (addCategoryAlreadyInstencied){
        addCategoryWindow.close();
        addCategoryAlreadyInstencied = false;
    }

})

/**********AJOUT D UNE LISTE*********/


//Récupérer item:add
ipcMain.on('list:add', function (e, list, devise) {
   addListWindow.close();
    addListAlreadyInstencied = false;
   addShoppingList(list, devise, user.id, function(idList){
     user.shoppingLists.push(new shopList(idList, list, devise));
     console.log(user);
     mainWindow.webContents.send('list:add', user);
   })
});

ipcMain.on('newList', function () {
    if (addListAlreadyInstencied){
        let message = "une instance est déjà en cours";
        mainWindow.webContents.send('alerte',message);
    }else {
        addListAlreadyInstencied = true;
        createListWindow();
    }
});

ipcMain.on('closeAddListWindow', function () {
    addListWindow.close();
    addListAlreadyInstencied = false;
});

/**********TRAITEMENTS UTILISATEUR*********/


//Connection de l'utilisateur
ipcMain.on('user:connect', function (e, login, pwd) {
    user.pseudo = login;
    //console.log(user.pseudo);
    userExist(login, function(result){
      user.exist = result;

      if (user.exist){
          userConnect(login, pwd, function(result){
            user.id = result;
            if (user.id !== -1){
                usersShopLists(user.id, function(result){
                    for(var oneList of result){
                        //console.log(oneList.money_unit);
                        user.shoppingLists.push(new shopList(oneList.id, oneList.name, oneList.money_unit));
                    }
                  //user.shoppingLists = result;

                  console.log(user);
                  mainWindow.webContents.send('connection:true', user);
                });
            }
            else {
                mainWindow.webContents.send('connection:bad_pwd');
            }

          });
      }
      else {
          mainWindow.webContents.send('connection:user_not_exist');
      }
    });
});

//Creation d'un utilisateur
ipcMain.on('user:create', function(e, login, pwd){
    user.pseudo = login;

    userExist(login, function(result){
         user.exist = result;

         //console.log(user.exist);

         if(user.exist){
           mainWindow.webContents.send('creationUser:loginExist');
         }
         else {
           //console.log(user.pseudo + " a enregistrer");
           newUser(login, pwd, function(result){

             user.id = result;
             //console.log("idUser : " + user.id);
             mainWindow.webContents.send('creationUser:true', user);

           });
         }
    });
});

/**********SUPPRESSION DE LISTES*********/


ipcMain.on('delLists', function (e) {
    deleteAllLists(function(result){
        user.shoppingLists = [];
        if (result) mainWindow.webContents.send('deleteAllLists:true');
    });
})


/**********TRAITEMENT DES FENETRES DE MODIFICATION ET SUPPRESSION DE LISTES*********/


ipcMain.on('editOneList', function (e, id) {

    if (rmListAlreadyInstencied){
        let message = "Veuillez fermer la fenêtre de suppression avant de modifier une liste";
        mainWindow.webContents.send('alerte',message);
        rmListWindow.show();
    }
    else if (editListAlreadyInstencied){
        let message = "Une instance de modification est déjà en cours";
        mainWindow.webContents.send('alerte',message);
        editListWindow.show();
    }else {
        editListAlreadyInstencied = true;
        createEditListWindow();

        var lists = user.shoppingLists;
        //Récupération des attributs de la liste qu'on veut modifier
        var listAttributes = lists.find(shopList => shopList.id === id);
        //On attend que la fenêtre soit prête pour lui envoyer des données
        editListWindow.webContents.on('did-finish-load', () => {
            editListWindow.webContents.send('list:params', id, listAttributes.name, listAttributes.devise);
            //console.log("modif liste n°"+id+" : "+listAttributes.name+" ("+listAttributes.devise+")");
        })
    }


});

ipcMain.on('delOneList', function (e, id) {

    if (editListAlreadyInstencied){
        let message = "Veuillez fermer la fenêtre d'édition avant de supprimer une liste";
        mainWindow.webContents.send('alerte',message);
        editListWindow.show();
    }
    else if (rmListAlreadyInstencied){
        let message = "Une instance de suppression est déjà en cours";
        mainWindow.webContents.send('alerte',message);
        rmListWindow.show();
    }
    else {
        rmListAlreadyInstencied = true;
        createRemoveListWindow();

        var lists = user.shoppingLists;
        //Récupération des attributs de la liste qu'on veut modifier
        var listAttributes = lists.find(shopList => shopList.id === id);
        //On attend que la fenêtre soit prête pour lui envoyer des données
        rmListWindow.webContents.on('did-finish-load', () => {
            rmListWindow.webContents.send('list:params', id, listAttributes.name);
            //console.log("modif liste n°"+id+" : "+listAttributes.name+" ("+listAttributes.devise+")");
        })
    }

});

ipcMain.on('list:edit', function (e, id, list, devise) {
    //console.log("modif liste n°"+id+" : "+list+" ("+devise+")");
    editList(id, list, devise, function (result) {
        if (result){
            mainWindow.webContents.send("list:edit/true", id, list, devise);
            for (var i = 0; i < user.shoppingLists.length; i++) {
                //console.log("id : " + user.shoppingLists[i].id + "search id : "+id);
                if (user.shoppingLists[i].id == id) {
                    user.shoppingLists[i].name = list;
                    user.shoppingLists[i].devise = devise;
                    break; //Stop this loop, we found it!
                }
            }
            console.log(user);
            editListWindow.close();
            editListAlreadyInstencied = false;
        }
        else {
            console.log("echec");
        }
    })
});

ipcMain.on('list:remove', function (e, id) {
    removeList(id, function (result) {
        if (result){

            mainWindow.webContents.send("list:remove/true", id);
            const newSP = user.shoppingLists.filter(shopList => shopList.id != id);
            user.shoppingLists = newSP;
            console.log(user);
            rmListWindow.close();
            rmListAlreadyInstencied = false;
        }
        else {
            console.log("echec");
        }
    })
});

ipcMain.on('closeEditListWindow', function () {
    editListWindow.close();
    editListAlreadyInstencied = false;
});

ipcMain.on('closeRemoveListWindow', function () {
    rmListWindow.close();
    rmListAlreadyInstencied = false;
});

/**********GESTION DES CATEGORIES*********/
ipcMain.on('categories:get', function (e, id) {


    //FERMETURE DES FENETRES QUI POURRAIENT POSER DES CONTRAINTES
    if (rmListAlreadyInstencied){
        rmListWindow.close();
        rmListAlreadyInstencied = false;
    }
    if (editListAlreadyInstencied){
        editListWindow.close();
        editListAlreadyInstencied = false;
    }
    if (addListAlreadyInstencied){
        addListWindow.close();
        addListAlreadyInstencied = false;
    }
    //TRAITER LA DEMANDE D AFFICHAGE DES CATEGORIES
    getCategoriesAndAliments(id , function (result) {
        //console.log('traitement : '+result);
        //Récupération réel indice de la liste
        var indexOfShopList = user.shoppingLists.indexOf(user.shoppingLists.find(shopList => shopList.id == id));
        //console.log("indice : "+indexOfShopList);
        //RECUERATION DES CATEGORIES ET ALIMENTS
        lastCat = 0;
        for(var line of result){
            currentCat = line.idCat;
            //Si la categorie est différente
            //ON VA Récupérer les aliments de la catégories en question
            if (lastCat != currentCat){
                idCat = 0;
                lastCat = currentCat;
                let lineStudied = new Object();
                const transArray = result.filter(lineStudied => lineStudied.idCat === currentCat);
                //REMPLIR UTILISATEUR AVEC CE TABLEAU DE TRANSITION
                //Push dans categorie[idCat] et utilisateurs
                //console.log(line.nameCat);
                const lengthCat = user.shoppingLists[indexOfShopList].listCatgories.push(new category(line.idCat, line.nameCat));
                const indexNewCat = lengthCat-1;
                for(var alim of transArray){
                    //console.log(user.shoppingLists[indexOfShopList].listCatgories[indexNewCat]);
                    user.shoppingLists[indexOfShopList].listCatgories[indexNewCat].listAliments.push(new aliments(alim.idAlim, alim.nameAlim, alim.quantity, alim.unit, alim.max_price));
                }
            }
        }


        if (result != 0){
            //console.log('ok');
            mainWindow.send('categories:recept', user);
        }
        else {
            //console.log('nok');
            mainWindow.send('categories:recept', user);
        }
    });
});
/**Ajout**********/
ipcMain.on('addCat', function (e, idList) {
    //console.log("id liste pour ajouter cat : "+idList);

    addCategoryAlreadyInstencied = true;
    createAddCategoryWindow();

    //On attend que la fenêtre soit prête pour lui envoyer des données
    addCategoryWindow.webContents.on('did-finish-load', () => {
        addCategoryWindow.webContents.send('list:params', idList);
    })
});

ipcMain.on('closeAddCategoryWindow', function () {
    addCategoryWindow.close();
});

ipcMain.on('category:add', function (e, idList, nomCat) {
    addCategory(nomCat, idList, function (idInsertion) {
        //console.log('id request = '+result)
        if (idInsertion != -1){
            var indexOfShopList = user.shoppingLists.indexOf(user.shoppingLists.find(shopList => shopList.id == idList));
            user.shoppingLists[indexOfShopList].listCatgories.push(new category(idInsertion, nomCat));
            mainWindow.webContents.send('add:categoy/ok', nomCat, idInsertion);
            addCategoryWindow.close();
            addCategoryAlreadyInstencied = false;
        }
    })
})

/**********GESTION DES ALIMENTS*********/
/**Ajout**********/
ipcMain.on('addAliment', function (e, catId, listId) {
    if (addAlimentAlreadyInstencied){
        let message = "Une instance d'ajout est déjà en cours";
        mainWindow.webContents.send('alerte',message);
        addAlimentWindow.show();
    }
    else if (delCategoryAlreadyInstencied){
        let message = "Veuillez fermer la fenêtre de suppression de catégorie avant d'ajouter un aliment";
        mainWindow.webContents.send('alerte',message);
        delCategoryWindow.show();
    }else {
        addAlimentAlreadyInstencied = true;
        createAddAlimentWindow();

        //On attend que la fenêtre soit prête pour lui envoyer des données
        addAlimentWindow.webContents.on('did-finish-load', () => {
            var indexOfShopList = user.shoppingLists.indexOf(user.shoppingLists.find(shopList => shopList.id == listId));
            addAlimentWindow.webContents.send('list:params', catId, listId, user.shoppingLists[indexOfShopList].devise);
            //console.log("modif liste n°"+id+" : "+listAttributes.name+" ("+listAttributes.devise+")");
        })
    }
})

ipcMain.on('closeAddAlimentWindow', function () {
    addAlimentWindow.close();
});

ipcMain.on('aliment:add', function (e, idList, idCat, nomAliment, quantite, unitee, prixMax) {
    addAliment(nomAliment, idCat, quantite, unitee, prixMax, function (idInsertion) {
        if (idInsertion != -1){
            var indexOfShopList = user.shoppingLists.indexOf(user.shoppingLists.find(shopList => shopList.id == idList));
            var indexOfCategory = user.shoppingLists[indexOfShopList].listCatgories.indexOf(user.shoppingLists[indexOfShopList].listCatgories.find(category => category.id == idCat));
            user.shoppingLists[indexOfShopList].listCatgories[indexOfCategory].listAliments.push(new aliments(idInsertion, nomAliment, quantite, unitee, prixMax));
            mainWindow.webContents.send('aliment:add/ok', idList, user);
            addAlimentWindow.close();
            addAlimentAlreadyInstencied = false;
        }
    })
});

/**Modification************************/
ipcMain.on('editAliment', function (e, idAlim, idCat, listId) {
    if (editAlimentAlreadyInstencied){
        let message = "Une instance d'édition est déjà en cours";
        mainWindow.webContents.send('alerte',message);
        editAlimentWindow.show();
    }
    else if (delAlimentAlreadyInstencied){
        let message = "Veuillez fermer la fenêtre de suppression d'aliment avant d'ajouter un aliment";
        mainWindow.webContents.send('alerte',message);
        delAlimentWindow.show();
    }
    else if (delCategoryAlreadyInstencied){
        let message = "Veuillez fermer la fenêtre de suppression de catégorie avant d'ajouter un aliment";
        mainWindow.webContents.send('alerte',message);
        delCategoryWindow.show();
    }else {
        editAlimentAlreadyInstencied = true;
        createEditAlimentWindow();

        //On prepare l'aliment :
        var indexOfShopList = user.shoppingLists.indexOf(user.shoppingLists.find(shopList => shopList.id == listId));
        var indexOfCategory = user.shoppingLists[indexOfShopList].listCatgories.indexOf(user.shoppingLists[indexOfShopList].listCatgories.find(category => category.id == idCat));
        var indexOfAliment = user.shoppingLists[indexOfShopList].listCatgories[indexOfCategory].listAliments.indexOf(user.shoppingLists[indexOfShopList].listCatgories[indexOfCategory].listAliments.find(aliments => aliments.id == idAlim));

        var aliment = user.shoppingLists[indexOfShopList].listCatgories[indexOfCategory].listAliments[indexOfAliment];

        //On attend que la fenêtre soit prête pour lui envoyer des données
        editAlimentWindow.webContents.on('did-finish-load', () => {
            editAlimentWindow.webContents.send('list:params', idAlim, idCat, listId, aliment, user.shoppingLists[indexOfShopList].devise);
            //console.log("modif liste n°"+id+" : "+listAttributes.name+" ("+listAttributes.devise+")");
        })
    }
});

ipcMain.on('closeEditAlimentWindow', function () {
    editAlimentWindow.close();
});

ipcMain.on('aliment:edit', function (e, idList, idCat, idAlim, nomAliment, quantite, unitee, prixMax) {

    //On prepare l'aliment :
    var indexOfShopList = user.shoppingLists.indexOf(user.shoppingLists.find(shopList => shopList.id == idList));
    var indexOfCategory = user.shoppingLists[indexOfShopList].listCatgories.indexOf(user.shoppingLists[indexOfShopList].listCatgories.find(category => category.id == idCat));
    var indexOfAliment = user.shoppingLists[indexOfShopList].listCatgories[indexOfCategory].listAliments.indexOf(user.shoppingLists[indexOfShopList].listCatgories[indexOfCategory].listAliments.find(aliments => aliments.id == idAlim));


    editAliment(idAlim, nomAliment, quantite, unitee, prixMax, function (updateVerif) {
        if (updateVerif){
            //Modif de l'aliment en dur
            user.shoppingLists[indexOfShopList].listCatgories[indexOfCategory].listAliments[indexOfAliment].name = nomAliment;
            user.shoppingLists[indexOfShopList].listCatgories[indexOfCategory].listAliments[indexOfAliment].quantity = quantite;
            user.shoppingLists[indexOfShopList].listCatgories[indexOfCategory].listAliments[indexOfAliment].unit = unitee;
            user.shoppingLists[indexOfShopList].listCatgories[indexOfCategory].listAliments[indexOfAliment].max_price = prixMax;

            mainWindow.webContents.send('aliment:edit/ok', idList, user);
            editAlimentWindow.close();
            editAlimentAlreadyInstencied = false;
        }
    })
});

/**********FONCTION D ACCES AU SGBD*********/

function userExist(login, callback){
    /*connection.connect(function(err) {
        if (err) {
            console.error('error connecting: ' + err.stack);
            return;
        }

        console.log('connected as id ' + connection.threadId);
    });*/
    var sql = "SELECT count(*) as nbUser FROM users WHERE users.`login` = ?";
    connection.query(sql,
        [login],
        function (error, results, fields) {
            if (error) {
                console.log(error);
                throw error;
            }
            //mainWindow.webContents.send('user-exist', results)
            //console.log(results[0].nbUser);
            //console.log(error);
            user_exist = false;
            //console.log("user.exist : function => " + results[0].nbUser);
            if(results[0].nbUser >= 1){
                user_exist = true;
            }
            //user.exist = user_exist;
            return callback(user_exist);
        });
    //connection.end();
}

function userConnect(login, password, callback){
    var user_log = -1;

    var sql = "SELECT id FROM users WHERE users.`login` = ? AND users.`password` = ?";
    connection.query(sql,
        [login, password],
        function (error, results, fields) {
            if (error) throw error;
            if(results.length !== 0){
                user_log = results[0].id;
            }
            return callback(user_log);
        });
    //connection.end();
}

function usersShopLists(idUser, callback){

    connection.query("SELECT * FROM shoppinglists sl"
    //+" INNER JOIN categories c ON sl.id=c.idSL"
    //+" INNER JOIN aliments a ON c.id=a.idCat"
    +" WHERE `idUser` = '" + idUser + "'",
        function (error, results, fields) {
            if (error) throw error;

            //console.log("shoppingLists : " + results);
            return callback(results);
        });
    //connection.end();
}

function newUser(login, pwd, callback){

    connection.query(
      "INSERT into users (login, password) VALUES ( ? , ? )",
      [login, pwd],
      function(error, results, fields){
        if (error) throw error;
        //console.log(results)
        console.log(results.insertId);

        return callback(results.insertId);
      }
    )
}


function addShoppingList(list, devise, idUser, callback){

    var sql = "INSERT into shoppinglists(`idUser`,`name`,`money_unit`) VALUES(?, ?, ?)"
    connection.query(sql,
    [idUser, list, devise],
    function(error, results, fields){
      if (error) throw error;

      //console.log("name into sql : "+list);
      return callback(results.insertId);
    })

}

function addCategory(nomCategorie, idListe, callback){

    var sql = "INSERT into categories(`name`,`idSL`) VALUES(?, ?)"
    connection.query(sql,
        [nomCategorie, idListe],
        function(error, results, fields){
            if (error) throw error;

            //console.log("name into sql : "+list);
            return callback(results.insertId);
        })

}

function addAliment(nom, idCategorie, quantite, unite, prixMax, callback){

    var sql = "INSERT into aliments(`idCat`, `name`, `quantity`, `unit`, `max_price`) VALUES(?, ?, ?, ?, ?)"
    connection.query(sql,
        [idCategorie, nom, quantite, unite, prixMax],
        function(error, results, fields){
            if (error) throw error;

            //console.log("name into sql : "+list);
            return callback(results.insertId);
        })

}


function deleteAllLists(callback) {
    var sql = "DELETE FROM shoppinglists WHERE idUser = ?"
    connection.query(sql,
    [user.id],
    function(error, result){
        if (error) throw error;
        return callback(result.affectedRows);
    })
}

function editList(id, newName, newDevise, callback) {
    var sql = "UPDATE shoppinglists SET name = ?, money_unit = ? WHERE id = ?";
    connection.query(sql,
        [newName, newDevise, id],
        function (error, result) {
            if (error) throw error;
            return callback(result.affectedRows);
        })
}

function removeList(id, callback) {
    var sql = "DELETE FROM shoppinglists WHERE id = ?";
    connection.query(sql,
        [id],
        function (error, result) {
            if (error) throw error;
            return callback(result.affectedRows);
        })
}

function getCategoriesAndAliments(id , callback) {
    const sql = "SELECT a.id as idAlim, c.idSL, c.id as idCat, a.name as nameAlim, c.name as nameCat, a.quantity, a.unit, a.max_price FROM categories c LEFT JOIN aliments a ON c.id = a.idCat WHERE c.idSL = ? ORDER BY idCat";
    connection.query(sql,
        [id],
        function (error, result) {
            if (error) throw error;
            if (result.affectedRows != 0){
                return callback(result);
            }
            else {
                return callback(0);
            }
        })
}

function editAliment(idAlim, nomAliment, quantite, unitee, prixMax, callback) {

    var sql = "UPDATE aliments SET `name` = ?, `quantity` = ?, `unit` = ?, `max_price` = ? WHERE id = ?"
    connection.query(sql,
        [nomAliment, quantite, unitee, prixMax, idAlim],
        function(error, results, fields){
            if (error) throw error;

            //console.log("name into sql : "+list);
            return callback(results.affectedRows);
        })


}
