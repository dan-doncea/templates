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
    fetch("http://192.168.100.2:8080/login", {
        method : "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(state)
    }).then(response => {
        return response.json();
    }).then(({token}) => {
        localStorage.setItem("token", token);
        window.location.href = "index.html";
    }).catch(err => {
        console.log(err.status);
    });
});
