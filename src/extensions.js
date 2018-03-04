Element.prototype.clearHTML = function () {
    this.innerHTML = "";
};
Element.prototype.setAttributes = function (attributes) {
    for (const attribute in attributes) {
        if (attributes.hasOwnProperty(attribute) && attributes[attribute]) {
            this.setAttribute(attribute, attributes[attribute].toString());
        }
    }
};
HTMLElement.prototype.appendNewElement = function (tagName) {
    return this.appendChild(document.createElement(tagName));
};
HTMLElement.prototype.appendDiv = function () {
    return this.appendNewElement("div");
};
HTMLElement.prototype.appendButton = function (buttonText) {
    const button = this.appendNewElement("button");
    button.innerText = buttonText;
    return button;
};
HTMLElement.prototype.appendBr = function () {
    return this.appendNewElement("br");
};
HTMLElement.prototype.withInnerText = function (text) {
    this.innerText = text;
    return this;
};
