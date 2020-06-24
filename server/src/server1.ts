import express from 'express';

//
const app = express();

app.use(express.json());

const users = [
    "tes",
    "sedfdfs",
     "asdasd"
]

app.get('/users', (request, response) => {
    const search = String(request.query.search);
    const filtered = search !== undefined ? users.filter(user => user.includes(search)) : users;    
    return response.json(filtered);
});

app.get('/users/:id', (request, response) => {
    const id= Number(request.params.id);
    const user= users[id];
    return response.json({user});
});


app.post('/users', (request, response) => {
    return response.json(request.body);
});

app.listen(3000);

