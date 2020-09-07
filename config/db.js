if(process.env.NODE_ENV == 'production'){
    module.exports = {mongoURI : 'yourAtlasURI'}
}else{
    module.exports = {mongoURI: 'mongodb://localhost/js-community'}
}
