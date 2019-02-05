let state = {
    username: null,
    password: null
}

document.querySelector("#username").oninput = (event) => {
    state.username = event.target.value;
};

document.querySelector("#password").oninput = (event) => {
    state.password = event.target.value;
};

document.getElementById("submit").addEventListener("click", () => {
    const xmlhttp = new XMLHttpRequest();   // new HttpRequest instance 
    xmlhttp.withCredentials = true;
    xmlhttp.open("POST", "/json-handler");
    xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xmlhttp.send(JSON.stringify({ "username": state.username, "password": state.password }));
});

// xhr.open('POST', 'http://192.168.100.2:8080/login');
// xhr.send();
// xhr.onload = function() {
//   if (xhr.status != 200) { 
//     alert(xhr.status + ': ' + xhr.statusText); 
//   } else {
//     alert(xhr.responseText);
//   }
// };