const { v4: uuidv4} = require('uuid');
const fs = require('fs')


const getAllUsers = () => {
    try {
        const dataBuffer = fs.readFileSync('./users.json');
        const dataJSON = dataBuffer.toString();
        return JSON.parse(dataJSON);
    } catch (e) {
        return [];
    }
}

const saveUsers = (users) =>{
    const dataJson =JSON.stringify(users)
    fs.writeFileSync('./users.json', dataJson)
}

function readUser(userID) {
    const users = loadUsers();
    const user = users.find((user) => {
      return user.id === userID;
    });
  
    if (user) {
      console.log("name: ", user.name, "email: ", user.email);
    } else {
      console.log("User not found");
    }
  }

const addUser = (user) =>{
    const users = getAllUsers()
    users.push({
        id: uuidv4() , 
        name: user.name, 
        credit: user.credit, 
        cash: user.cash
    })
    saveUsers(users)
    return JSON.stringify(users)
    
}


const depositing = (id, casj) =>{
    const users = getAllUsers();
    const index = users.findIndex((user)=> user.id === id)

    users[index] = {
        ...users[index],
        cash: users[index].cash + casj
    }
    saveUsers(users)
    return JSON.stringify(users) 
}

const updatCredit = (id, credit)=>{
    const users =  getAllUsers();
    const index = users.findIndex((user)=> user.id === id)
    users[index] = {
        ...users[index],
        credit: users[index].credit + credit
    }
    saveUsers(users)
    return JSON.stringify(users)
}

const Withdrawmoney= (id, amount)=>{
    const users = getAllUsers()
    const index = users.findIndex((user)=> user.id === id)
    if(users[index].cash + users[index].credit - amount > 0){
        users[index] ={
            ...users[index], 
            cash: users[index].cash -amount
        }
        return saveUsers(users)
    }
}
module.exports ={
    getAllUsers, 
    addUser, 
    readUser,  
    depositing, 
    updatCredit
}