const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Membro = new Schema({
    nome : {
        type: String,
        required: true
    },
    chave :{
        type: String,
        required: true
    },
    github: {
        type: String,
        required: true
    }
});
mongoose.model('membros', Membro);