
const mongoose = require('mongoose');

const connectdb = async () => {
    
        await mongoose.connect("mongodb+srv://RAJ:123@cluster0.6n22m.mongodb.net/myDatabaseName", {
            
        });
        
   
};

module.exports=connectdb;

