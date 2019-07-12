class aliments {
    constructor(id, name, quantity, unit, max_price) {
        this.id = id;
        this.name = name;
        this.quantity = quantity;
        this.unit = unit;
        this.max_price = max_price;
    }
}
//Permet d'utiliser les classes dans les fichiers qui import ce fichier
//Chaque classe est concidérée comme un module
module.exports = aliments;