const { v4: uuidv4 } = require("uuid");
const express = require('express')
const fs = require('fs')

const app =  express();
const PORT = 3000;

app.use(express.json())

const loadUser = ()=>{
    try{
        const dataBuffer = fs.readFileSync('users.json');
        const dataJSON = dataBuffer.toString();
        return JSON.parse(dataJSON);
    } catch (e) {
        return [];
    
    }
}

const savedUsers = (users) => {
    const dataJSON = JSON.stringify(users);
    fs.writeFileSync("users.json", dataJSON);
  };


app.get('/users', (req, res)=>{
    const users = loadUser()
    if(users)
    {
        res.status(200).send(users)
    }
    else{
        throw new Error('no file users');
        
    }
})

app.get('/users/:id', (req, res)=>{
    const users =  loadUser()
    const id =  req.params.id
    const findId = users.find((user)=> user.id === id)
    console.log(findId)
    if(!findId){
        res.status(400).send('user not found')
    }
    res.send(findId)

})

app.post('/users', (req, res)=>{
    const users =  loadUser()

    const user = {
        id: uuidv4(), 
        name:req.body.name, 
        credit: req.body.credit,
        cash: req.body.cash
    }
    users.push(user)
    res.send(user)
    savedUsers(users)
})


app.put('/users/:id', (req,res)=>{
        const users = loadUser();
       // console.log(users);
        const id = req.params.id
        const index = users.findIndex((user)=> user.id === id)
        console.log(index);    
       
        users[index] = {
            ...users[index], 
            cash: users[index].cash + req.body.cash
        }
        savedUsers(users)
        res.send(users)  
})


app.put('/users/credit/:id/:credit', (req,res)=>{
    const users = loadUser();
   // console.log(users);
    const id = req.params.id
    const index = users.findIndex((user)=> user.id === id)
    console.log(index);    
   
    users[index] = {
        ...users[index], 
        credit:  Number(req.params.credit)
    }
    savedUsers(users)
    res.send(users)  
})


app.put('/users/withdraw/:id', (req, res)=>
{
    const users =  loadUser()
    const id=  req.params.id
    const index = users.findIndex((user)=> user.id === id)

    if(req.body.amount > users[index].cash + users[index].credit)
    {
        res.status(400).send('you are without mony')
    }
    else{
      users[index].cash -= req.body.amount;
      res.send(users[index])
      savedUsers(users)
    }

})

app.put('/users/transfer/:id', (req, res)=>{
    const users =  loadUser()
    const transfer = req.params.id
    const amount = req.body.amount
    const reciver = req.body.reciver

    const UserTransfer = users.find((user)=>user.id === transfer)
    const userReciver = users.find((user)=> user.id === reciver)

    if(!transfer || !reciver) {    
     throw new Error('no man') ;
    }
    else{
        UserTransfer.cash -= amount
        userReciver.cash += amount
        savedUsers(users)
        res.send({UserTransfer,userReciver })
    }
      
})


app.listen(PORT, ()=>{
    console.log(`listening to port: ${PORT}`);
})