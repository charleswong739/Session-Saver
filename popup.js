function loadSession(sesName) {
    chrome.storage.sync.get([`${sesName}`], function(result) {
        var sesh = result[sesName];

        for (let i in sesh) {
            chrome.windows.create({url: sesh[i], type: 'normal', state: 'maximized'})
        }
    });
}

function deleteSession(sesName) {
    chrome.storage.sync.get(['wsdqxcefr4g5th6ynjumkilop'], function(result) {
        var array = result.wsdqxcefr4g5th6ynjumkilop;
        var index = array.indexOf(sesName);

        if (index > -1) {
            array.splice(index, 1);
        }

        if (array.length < 1) {
            chrome.storage.sync.remove('wsdqxcefr4g5th6ynjumkilop');

            var e = document.getElementById("entries");

            var element = document.createElement("div");
            element.id = "Nss";
            element.innerHTML = "No saved sessions";
            e.appendChild(element);
        } else {
            chrome.storage.sync.set({wsdqxcefr4g5th6ynjumkilop: array});
        } 
    });

    chrome.storage.sync.remove(sesName);
}

function validate(e) {
    var field = document.getElementById('field');

    // window.confirm("Hello");

    if (field.value.trim() == '' || field.value.trim() == 'wsdqxcefr4g5th6ynjumkilop') {
        field.style.borderColor = '#ff4c4c';

        // Add a class that defines an animation
        field.classList.add('error');
      
        // remove the class after the animation completes
        setTimeout(function() {
            field.classList.remove('error');
        }, 300);
      
        e.preventDefault();
    } else {
        let sesName = field.value.trim();

        function saveSession (windows) {
            var wins = {};
            for (i = 0; i < windows.length; i++) {
                if (!(i in wins)) {
                    wins[i] = [];
                }
                for (j = 0; j < windows[i].tabs.length; j++) {
                    wins[i].push(windows[i].tabs[j].url);
                }
            }

            chrome.storage.sync.set({[sesName]: wins}, function() {
                console.log(`Session saved as: ${sesName}`);
            });
        }

        chrome.storage.sync.get(['wsdqxcefr4g5th6ynjumkilop'], function(result) {
            var namelst;
            var num = 0;

            if (typeof result.wsdqxcefr4g5th6ynjumkilop == 'undefined') {
                namelst = [sesName];
                num = 1;
            } else {
                namelst = result.wsdqxcefr4g5th6ynjumkilop;

                if (Object.values(namelst).includes(sesName)) {
                    if (window.confirm(`The session ${sesName} has already been saved. Do you want to overwrite it?`)) {
                        chrome.windows.getAll({'populate': true}, saveSession);
                    }
                } else {
                    namelst.push(sesName);
                    chrome.windows.getAll({'populate': true}, saveSession);

                    var nss = document.getElementById("Nss");

                    if (nss != null) {
                        nss.remove();
                    }

                    appendEntry(sesName);

                    field.style.borderColor = null;
                }

                num += namelst.length;
            }

            chrome.storage.sync.set({wsdqxcefr4g5th6ynjumkilop: namelst});
            field.value = `session${num}`;
        })

        closeContent(this);

    }
}

function closeContent(element) {
    var top = element.parentElement.previousElementSibling;

    if (top.id == "save") {
        document.removeEventListener("keypress", clickSave);
    }

    top.classList.toggle("active");
    element.parentElement.style.maxHeight = null;
    element.parentElement.style.paddingBottom = null;
    element.parentElement.style.paddingTop = null;
}

function appendEntry(entryName) {
    var e = document.getElementById("entries");

    var element = document.createElement("div");

    var icon = document.createElement("input");
    icon.className = "del_icon";
    icon.type = "image";
    icon.alt = "edit";
    icon.src = "delete_images/delete16.png";
    element.appendChild(icon);

    var text = document.createElement("span");
    text.className = "entry_name";
    text.innerHTML = entryName;
    element.appendChild(text);

    text.addEventListener('click', function() {
        loadSession(entryName);
    });

    icon.addEventListener('click', function() {
        this.parentElement.style.display = "none";

        deleteSession(entryName);

        this.parentElement.remove();
    });

    e.appendChild(element);
}

function clickSave(event) {
    if (event.key === "Enter") {
        document.getElementById("submitName").click();
    }
}

function openEdits() {
    var dels = document.getElementsByClassName("del_icon");
    
    for (let i = 0; i < dels.length; i++) {
        icon = dels[i];
        if (icon.style.width) {
            icon.style.width = null;
            icon.style.marginRight = null;
        } else {
            icon.style.width = "12px";
            icon.style.marginRight = "7px";
        }
    }
}

window.onload = function() {
    var f = document.getElementById('field');

    chrome.storage.sync.get(['wsdqxcefr4g5th6ynjumkilop'], function (result) {
        var num = 0;
        if (typeof result.wsdqxcefr4g5th6ynjumkilop != 'undefined') {
            num += result.wsdqxcefr4g5th6ynjumkilop.length;

            for (let n in result.wsdqxcefr4g5th6ynjumkilop) {
                appendEntry(result.wsdqxcefr4g5th6ynjumkilop[n]);
            }
        } else {
            var e = document.getElementById("entries");

            var element = document.createElement("div");
            element.id = "Nss";
            element.innerHTML = "No saved sessions";
            e.appendChild(element);
        }

        f.value = `session${num}`;
    })

    document.getElementById('load').addEventListener('click', function() {
        chrome.storage.sync.get(['wsdqxcefr4g5th6ynjumkilop'], function (result) {
            if (typeof result.wsdqxcefr4g5th6ynjumkilop != "undefined") {
                var sesName = result.wsdqxcefr4g5th6ynjumkilop[result.wsdqxcefr4g5th6ynjumkilop.length - 1];
                loadSession(sesName);
            }
        });
    });

    document.getElementById("field").addEventListener('click', function() {
        this.select();
    });

    document.getElementById("submitName").addEventListener('click', validate);

    document.getElementById("edit_icon").addEventListener('click', openEdits);

    var cols = document.getElementsByClassName("collapsible");

    for (let i = 0; i < cols.length; i++) {
        cols[i].addEventListener("click", function() {
            this.classList.toggle("active");
            var content = this.nextElementSibling;
            if (content.style.maxHeight){
                content.style.maxHeight = null;
                content.style.paddingBottom = null;
                content.style.paddingTop = null;

                if (content.id == "entries") {
                    var dels = document.getElementsByClassName("del_icon");

                    for (let i = 0; i < dels.length; i++) {
                        dels[i].style.width = null;
                        dels[i].style.marginRight = null;
                    }
                }
            } else {
                content.style.maxHeight = content.scrollHeight + "px";
                content.style.paddingBottom = "5px";
                content.style.paddingTop = "15px";
            }
            if (this.id == "save") {
                document.addEventListener("keypress", clickSave);
            }
        });
    }
}