const express = require('express');
const path = require('path');

const app = express();
const port = 8081;

const public = express.Router();
const private = express.Router();

const authController = require('./app/controllers/auth/auth-controller.js');
const auth = new authController();

private.use('*', auth.verifyToken)

app.set('views', path.join(__dirname, '/app/views'));
app.set('view engine', 'ejs');

app.use(express.json());

const options = function({rootPath, deny, headers}) {
    return {
        root: path.join(__dirname, rootPath),
        dotfiles: deny || 'deny',
        headers: headers || {
          'x-timestamp': Date.now(),
          'x-sent': true
        }
    }
}

public.get('/', (req, res) => {
    res.render('home');
});

public.post('/api/login', async (req, res) => {
    await auth.login(req, res);
})

public.post('/api/register', async (req, res) => {
    await auth.register(req, res);
})

public.get('/js/:archive', (req, res) => {
    res.sendFile(`/${req.params.archive}`, options({rootPath: 'app/public/assets/js'}))
})

app.use(public);
app.use(private);

app.listen(port, () => {
    console.log(`http://localhost:${port}`);
})