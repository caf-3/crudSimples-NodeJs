// module for woking with express
const express = require('express');
const app = express();
// module for woking with the tamplates
const handlebars = require('express-handlebars');
// module for woking with databases
const mongoose = require('mongoose');
const db = require('./config/db');
// module for woking with forms
const bodyParser = require('body-parser');
// module for woking with flash-messages and sessions
const flash = require('connect-flash');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const path = require('path');
require('./models/Membro');
const Membro = mongoose.model('membros');
// CONFIGURATIONS
// -- SEO
function mainAppMeta(response,title, description){
    response.locals.metaTags = {
        title: title,
        description: description,
    }
}
// -- SESSION
// -- SESSION
app.use(session({
    secret: "js_communitty000",
    resave: true,
    saveUninitialized: true
}));
app.use(flash());
// -- MIDDLEWARE
app.use(function (req, res, next) {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});
// -- TEMPLATE ENGINE
app.engine('handlebars', handlebars({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');
// -- MONGOOSE
mongoose.Promise = global.Promise;
mongoose.connect(db.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(function () {
    console.log('connectado ao mongo...');
}).catch((err) => {
    console.log('Houve um erro ao conectar-se ao mongo '+err);
});
// -- BODYPARSER
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// -- STATIC FILES
app.use(express.static(path.join(__dirname, 'public')));
// -- ROUTES
app.get('/', function (req, res) {
    Membro.find().then(function (membros) {
        mainAppMeta(res, 'Lista de membros');
        res.render('index', { membros: membros.map(membro => membro.toJSON()) });
    }).catch((err) => {
        req.flash('Houve um erro ao listar membros ');
        res.redirect('/');
    })
});
app.get('/novo', function (req, res) {
    mainAppMeta(res, 'Criar Novo Membro');
    res.render('criarMembro');
});
app.post('/novo', function (req, res) {
    let erros = [];
    let nome = req.body.nome;
    let github = req.body.github;
    if (!nome || typeof nome == 'undefined' || nome == null) {
        erros.push({ texto: 'Nome inválido' });
    }
    if (nome.length < 4) {
        erros.push({ texto: 'Nome muito curto' });
    }
    if (!github || typeof github == 'undefined' || github == null) {
        erros.push({ texto: 'Link inválido inválido' });
    }
    if (github.length < 3) {
        erros.push({ texto: 'Link muito curto' });
    }
    if (erros.length > 0) {
        res.render('criarMembro', { erros: erros });
    } else {
        Membro.findOne({ nome: nome }).then(function (nome) {
            if (nome) {
                req.flash('error', 'O membro já foi cadastrado!');
                res.redirect('/novo');
            } else {
                const novoMembro = {
                    nome: req.body.nome,
                    github: req.body.github,
                    chave: req.body.chave
                }
                new Membro(novoMembro).save().then(function () {
                    req.flash('success', 'Membro criado com sucesso');
                    res.redirect('/novo');
                }).catch((err) => {
                    req.flash("error", 'Houve um erro ao adicionar membro ');
                    res.redirect('/novo');
                });
            }
        }).catch((err) => {
            req.flash("error", 'Houve um erro ao adicionar membro ');
            res.redirect('/novo');
        });
    }
});
app.get('/editar/:github', function (req, res) {
    let membro = req.params.github;
    Membro.findOne({ github: membro }).then(function (membro) {
        if (membro) {
            mainAppMeta(res, 'Editar - '+membro.github);
            res.render('editar', { membro: membro.toJSON() });
        } else {
            req.flash('error', 'Membro inexistente');
            res.redirect('/');
        }
    }).catch((err) => {
        req.flash('error', 'Houve um erro ao listar membro');
        res.redirect('/');
    });
});
app.post('/editar', function (req, res) {
    let id = req.body.id;
    let nome = req.body.nome;
    let github = req.body.github;
    let chave = req.body.chave;
    Membro.findOne({ _id: id }).then(function (membro) {
        if (membro) {
            if(chave != membro.chave){
                req.flash('error', 'Voce não está autorizado a editar este membro');
                res.redirect('/');
            }else{
                membro.nome = nome;
                membro.github = github;
                membro.save().then(function () {
                    req.flash('success', 'Membro editado com sucesso');
                    res.redirect('/');
                }).catch((err) => {
                    req.flash('error', 'Houve um erro ao editar membro');
                    res.redirect('/');
                })
            }
        }else {
            req.flash('error', 'Membro inexistente');
            res.redirect('/')
        }
    }).catch((err) => {
        req.flash('error', 'Houve um erro ao editar membro');
        res.redirect('/')
    });
});
app.post('/deletar', function(req, res){
    let id = req.body.id;
    let chave = req.body.chave;
    Membro.findOne({_id: id}).then(function(membro){
        if(membro){
            if(chave !== membro.chave){
                req.flash('error', 'Voce não está autorizado deletar membro');
                res.redirect('/');
            }else{
                Membro.deleteOne({_id: id}).then(function(){
                    req.flash('success', 'Membro deletado com sucesso');
                    res.redirect('/');
                }).catch((err) =>{
                    req.flash('error', 'Houve um erro ao deletar membro');
                    res.redirect('/');
                })
            }
        }else{
            req.flash('error', 'Membro inexistente');
            res.redirect('/');
        }
    })
    
});
// -- SERVER
const PORT = process.env.PORT || 3333;
app.listen(PORT, function () {
    console.log('Servidor rodando');
})