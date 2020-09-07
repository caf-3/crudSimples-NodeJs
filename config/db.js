if(process.env.NODE_ENV == 'production'){
    module.exports = {mongoURI : 'mongodb+srv://blogapp:matsolo@blogapp.qfsic.mongodb.net/crud?retryWrites=true&w=majority'}
}else{
    module.exports = {mongoURI: 'mongodb://localhost/js-community'}
}