const auth = require('./auth.json');
const key = auth.cryptkey;


var encrypt = function encrypt(text){
    var aesjs = require('aes-js');
    // Convert text to bytes
    var textBytes = aesjs.utils.utf8.toBytes(text);
    
    // Encrypt
    var aesCtr = new aesjs.ModeOfOperation.ctr(key, new aesjs.Counter(5));
    var encryptedBytes = aesCtr.encrypt(textBytes);
    
    // To print or store the binary data, you may convert it to hex
    return aesjs.utils.hex.fromBytes(encryptedBytes);
}
var decrypt = function decrypt(hex){
    var aesjs = require('aes-js');
    // When ready to decrypt the hex string, convert it back to bytes
    var encryptedBytes = aesjs.utils.hex.toBytes(hex);
        
    // The counter mode of operation maintains internal state, so to
    // decrypt a new instance must be instantiated.
    var aesCtr = new aesjs.ModeOfOperation.ctr(key, new aesjs.Counter(5));
    var decryptedBytes = aesCtr.decrypt(encryptedBytes);

    // Convert our bytes back into text
    return aesjs.utils.utf8.fromBytes(decryptedBytes);
}

var requireReload = function(modulePath){
    delete require.cache[require.resolve(modulePath)];
    return require(modulePath);
};
module.exports = {
    encrypt: encrypt,
    decrypt: decrypt,
}
