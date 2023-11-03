const express = require('express');
const path = require('path');

const app = express();
const port = 8081;

const public = express.Router();
const private = express.Router();

const authController = require('./app/controllers/auth/authController.js');
const auth = new authController();

private.use('*', auth.verifyToken)
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
    
    res.sendFile('index.html', options({rootPath: 'app/public'}), function(err) {
    });
});

public.post('/api/login', async (req, res) => {
    await auth.login(req, res);
})

public.post('/api/register', async (req, res) => {
    await auth.register(req, res);
})

app.use(public);
app.use(private);

app.listen(port, () => {
    console.log(`http://localhost:${port}`);
})