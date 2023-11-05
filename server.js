const express = require('express');
const cookieParser = require('cookie-parser')

const path = require('path');

const app = express();
const port = 8081;

app.set('views', path.join(__dirname, '/app/views'));
app.set('view engine', 'ejs');

app.use(express.json());
app.use(cookieParser())

// Middleware de Sessão do Usuário
const sessionMiddleware = require('./app/middleware/session-middleware.js');
const session = new sessionMiddleware();

// Controladores de Autenticação e Sessão do usuário
const authController = require('./app/controllers/auth/auth-controller.js');
const sessionController = require('./app/controllers/auth/session-controller.js');

const sessionData = new sessionController();
const auth = new authController();

// Rotas
const router = express.Router();

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

router.get('/', async (req, res) => {
    const userData = await sessionData.getUser(req, res);

    res.render('home', userData);
});

router.get('/login', async (req, res) => {
    const userData = await sessionData.getUser(req, res);

    if(userData._id) return res.redirect('/');

    res.render('login', userData);
});

router.get('/register', async (req, res) => {
    const userData = await sessionData.getUser(req, res);

    if(userData._id) return res.redirect('/');

    res.render('register', userData); 
})


router.get('/api/logout', async (req, res) => {
    await auth.logout(req, res);
})


router.post('/api/login', async (req, res) => {
    await auth.login(req, res);
})

router.post('/api/register', async (req, res) => {
    await auth.register(req, res);
})

router.get('/js/*', (req, res) => {
    res.sendFile(`/${req.params[0]}`, options({rootPath: 'app/public/assets/js'}))
})

router.get('/css/*', (req, res) => {
    res.sendFile(`/${req.params[0]}`, options({rootPath: 'app/public/assets/css'}))
})

// Private Route 
// router.get('/', session.privateAccess, (req, res) => {
// })

app.use(router);

app.listen(port, () => {
    console.log(`http://localhost:${port}`);
})
