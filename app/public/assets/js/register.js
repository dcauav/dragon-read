(() => {
    const http = new HttpClient();
    
    document.querySelector('form#register button').addEventListener('click', function () {
        const name = document.getElementById("name").value;
        const nickname = document.getElementById("nickname").value;
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        const confirm_password = document.getElementById("confirm_password").value;

        const phone_number = document.getElementById("phone_number").value;

        const warn = function (warn) {
            const element = document.createElement('div');
            element.innerHTML = warn;

            return element;
        }
        if (name === '' || nickname === '' || email === '' || password === '' || confirm_password === '') {
            document.querySelector('.main').appendChild(warn('Necessário preencher os campos (nome, apelido, email, senha)'));
            return;
        }

        if (password != confirm_password) {
            document.querySelector('.main').appendChild(warn('<div>Senhas precisam ser iguais</div>'));
            return;
        }

        http.post('/api/register', {
            name: name,
            nickname: nickname,
            email: email,
            phone_number: phone_number,
            password: password
        }, [{
            name: 'Content-Type',
            value: 'application/json'
        }]).then(() => {
            window.location.href = '/';
        }).catch((error) => {
            const e = JSON.parse(error.reason)
            document.querySelector('.main').appendChild(warn(`<div>${e.message}</div>`));
        })
    });
})();