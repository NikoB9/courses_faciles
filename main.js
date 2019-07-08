
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
    user: 'YTVq8UPnSm',
    password: 'NUP3g44YxP',
    database: 'YTVq8UPnSm',
    port: '3306'
});

require('electron-reload')(__dirname);


//declarations des fenetres
let mainWindow;
let addListWindow;


//objets+classesNécessaires

class aliments {
  constructor(id, name, quantity, unit, max_price) {
    this.id = id;
    this.name = name;
    this.quantity = quantity;
    this.unit = unit;
    this.max_price = max_price;
  }
}

class category {
  constructor(id, name) {
    this.id = id;
    this.name = name;
    listAliments = [];
  }
}

//shoppingLists
//id	idUser	name	money_unit
//user
//id	login	password
//penser constructeur vide
let user = new Object();


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
        width: 400,
        height:400,
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
    })
}

//Récupérer item:add
ipcMain.on('list:add', function (e, list, devise) {
   mainWindow.webContents.send('list:add', list);
   addListWindow.close();
   addShoppingList(list, devise, user.id, function(idList){
     console.log("name = "+list);
     user.shoppingLists.push(shopList(idList, name, devise));
     console.log(user);
   })
   console.log(user);
});

ipcMain.on('newList', function () {
    createListWindow();
});

ipcMain.on('exitApp', function () {
    app.quit();
});

ipcMain.on('closeAddListWindow', function () {
    addListWindow.close();
});

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
                  user.shoppingLists = result;

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

//Création du menu de fonctionnalités
/*const mainMenuTemplate = [
    //Premier menu pour mac car il n'affichera qu'à partir dur deuxième
    //{},
    {
        label: 'File',
        submenu: [
            {
                label: 'Ajouter une liste',
                click() {
                    createWindow();
                }
            },
            {
                label: 'Supprimer les listes'
            },
            {
                label: 'Quit',
                //Si on est sur mac action avant les ":" sinon Ctrl+Q
                accelerator: process.platform == 'darwin'  ? 'Command+Q' : 'Ctrl+Q',
                click(){
                    app.quit();
                }
            }
        ]
    }
];

//Par rapport au tsheet plus haut pour mac : on peut remplacer par :
if(process.platform == 'darwin'){
    mainMenuTemplate.unshift({});
}

//Add developer tools item if not in prod  :
if (process.env.NODE_ENV !== 'production'){
    mainMenuTemplate.push({
        label: 'Developper Tools',
        submenu:[
            {
                label: 'SubSubMenu ;-)',
                submenu:[
                    {
                        label: 'Toggle DevTools',
                        accelerator: process.platform == 'darwin'  ? 'Command+I' : 'Ctrl+I',
                        click(item, focusedWindow){
                            focusedWindow.toggleDevTools();
                        }
                    },
                    {
                        role: 'reload'
                    }
                ]
            }
        ]
    })
}
*/


//fonctions sql

/***Retourner un resultat***/
// function get_info(data, callback){
//
//       var sql = "SELECT a from b where info = data";
//
//       connection.query(sql, function(err, results){
//             if (err){
//               throw err;
//             }
//             console.log(results[0].objid); // good
//             stuff_i_want = results[0].objid;  // Scope is larger than function
//
//             return callback(results[0].objid);
//     }
// }
//
//
// //usage
//
// var stuff_i_want = '';
//
//  get_info(parm, function(result){
//     stuff_i_want = result;
//
//     //rest of your code goes in here
//  });



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
            if (error) throw error;
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

            console.log("shoppingLists : " + results);
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
