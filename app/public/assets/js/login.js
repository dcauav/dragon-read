(() => {

    const http = new HttpClient();

    document.querySelector('form#login button').addEventListener('click', (event) => {
        event.preventDefault();

        http.post('/api/login', {
            email: document.querySelector('input#email').value,
            password: document.querySelector('input#password').value
        }, [{
            name: 'Content-Type',
            value: 'application/json'
        }]).then((res) => {
            window.location.href = '/';
            console.log(res);
        }).catch((error) => {
            const e = JSON.parse(error.reason)
            document.querySelector('.main').innerHTML += `<div>${e.message}</div>`;
        })
    })
})()