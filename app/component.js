module.exports = function() {

    var styles = require('./main.css');

    var element = document.createElement('h1');

    element.innerHTML = "Sup, Hello world. And again what uppp! cha cha cha.\n hmm";
    element.className = styles.redButton;

    return element;
};
