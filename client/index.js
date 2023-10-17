const appDiv = document.getElementById("app");
appDiv.innerHTML = "";

function LINE() {
    appDiv.appendChild(document.createElement("hr"));
}

function BREAK() {
    appDiv.appendChild(document.createElement("br"));
}

function makeCookiesArea() {
    const appDiv = document.getElementById("app");
    
    let area = document.getElementById("cookies-area");
    if (area == null) {
        area = document.createElement("div");
        area.id = "cookies-area";
        appDiv.appendChild(area);
    }
    area.innerHTML = "";
    
    let h2 = document.createElement("h2");
    h2.innerHTML = "Here are all the cookies you have set:";
    area.appendChild(h2);

    const cookies = document.cookie.split(';');
    cookies.forEach(cookie => {
        const row = document.createElement("div");
        row.textContent = cookie.trim();
        area.appendChild(row);
    });

    BREAK();

    const button = document.createElement("button");
    button.textContent = "Refresh cookies";
    button.addEventListener("click", () => {
        makeCookiesArea();
    });
    area.appendChild(button);
    BREAK();
    BREAK();
    LINE();
    BREAK();
}
function POSTCall(api, id, method, username, password) {
    return fetch(api, {
        method: 'POST',
        body: JSON.stringify({ username: username, password: password }),
        headers: {
            'Content-Type': 'application/json'
        }
    });
}

function GETCall(api, id, method) {
    return fetch(api, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });
}
function sendCookies(api, id, method) {
    const appDiv = document.getElementById("app");
    
    const div = document.createElement("div");
    
    const h2 = document.createElement("h2");
    h2.textContent = "Read cookies by calling "+ api + " with method " + method;
    
    const p = document.createElement("p");
    p.id = "result"+ id;

    const url = document.createElement("p");
    url.id = "url"+ id;
    
    const cookies = document.createElement("div");
    cookies.id = "cookies"+ id;
    
    const button = document.createElement("button");
    
    div.appendChild(h2);
    div.appendChild(url);
    div.appendChild(p);
    div.appendChild(cookies);
    div.appendChild(button);
    
    appDiv.appendChild(div);
    
    button.textContent = "Send";
    button.addEventListener("click", async () => {
        let response;
       if (method == "POST") {
        let username = document.getElementById("username").value;
        let password = document.getElementById("password").value;
        if (username != "" && password != "") {
            response = POSTCall(api, id, method, username, password).then(response => {
                const result = document.getElementById("result"+ id);
                result.innerHTML = "INPUT: <br>  username- " + username + " password-  " + password;

                const url = document.getElementById("url"+ id);
                url.innerHTML =  "URL: <br>" + response.url;

                return response.text();
            });
        }else {
            const result = document.getElementById("result"+ id);
            result.innerHTML = "Please enter username and password";
        }
       }else {
        response = GETCall(api, id, method)
        .then(response => {
            const url = document.getElementById("url"+ id);
            url.innerHTML =  "URL: <br>" + response.url;
            return response.text();
           });
       }
      
       response
       .then(data => {        
        const cookies = document.getElementById("cookies"+ id);
        cookies.innerHTML = "COOKIES: <br>" + data;
    })
    .catch(error => console.error(error));
        
    });
    appDiv.appendChild(button);
    BREAK();BREAK();
}    
function appendTextFields() {
    const appDiv = document.getElementById("app");
    const input1 = document.createElement("input");
    input1.type = "text";
    input1.id = "username";
    input1.placeholder = "Enter text here";
    appDiv.appendChild(input1);

    const input2 = document.createElement("input");
    input2.type = "text";
    input2.id = "password";
    input2.placeholder = "Enter text here";
    appDiv.appendChild(input2);
}
    makeCookiesArea();
    appendTextFields();
    sendCookies("/api/setcookies", 1, "POST");
    sendCookies("/api/sendcookiesTwo", 2, "GET");
    sendCookies("/api/getcookies", 3, "GET");

