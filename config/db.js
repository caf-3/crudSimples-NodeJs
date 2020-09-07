if(process.env.NODE_ENV == 'production'){
    module.exports = {mongoURI : 'YOURATLASURI'}
}else{
    module.exports = {mongoURI: 'mongodb://localhost/js-community'}
}
