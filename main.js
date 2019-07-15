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
let mainWindow;
let addListWindow;
let editListWindow;
let rmListWindow;
let addListAlreadyInstencied = false;
let editListAlreadyInstencied = false;
let rmListAlreadyInstencied = false;


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
        height:230,
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
                        console.log(oneList.money_unit);
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

         console.log(user.exist);

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
    console.log("modif liste n°"+id+" : "+list+" ("+devise+")");
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

    // connection.connect(function(err) {
    //     if (err) {
    //         console.error('error connecting: ' + err.stack);
    //         return;
    //     }
    //
    //     console.log('connected as id ' + connection.threadId);
    // });
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

    // connection.connect(function(err) {
    //     if (err) {
    //         console.error('error connecting: ' + err.stack);
    //         return;
    //     }
    //
    //     console.log('connected as id ' + connection.threadId);
    // });

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

    // connection.connect(function(err) {
    //     if (err) {
    //         console.error('error connecting: ' + err.stack);
    //         return;
    //     }
    //
    //     console.log('connected as id ' + connection.threadId);
    // });
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
    //connection.end();
}


function addShoppingList(list, devise, idUser, callback){

    var sql = "INSERT into shoppinglists(`idUser`,`name`,`money_unit`) VALUES(?, ?, ?)"
    connection.query(sql,
    [idUser, list, devise],
    function(error, results, fields){
      if (error) throw error;

      console.log("name into sql : "+list);
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


