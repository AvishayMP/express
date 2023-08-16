import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';
const users = [{
    "id": uuidv4(),
    "email": "Sincere@april.biz",
    "password": genPass(123456)
}, {
    "id": uuidv4(),
    "email": "Shanna@melissa.tv",
    "password": genPass(987654)
}, {
    "id": uuidv4(),
    "email": "Nathan@yesenia.net",
    "password": genPass(246810)
},];

const app = express();
const PORT = 3000;

app.use(express.json()); //add a body property to the request object.

app.get('/users', (req, res) => {
    res.status(200).send(users);
});
app.get('/user/:id', (req, res) => {
    const curUser = users.find(u => u.id == req.params.id);
    if (curUser) {
        res.status(200).send(curUser);
    } else {
        res.status(404).send('User not exist');
    }
});

app.post('/user', (req, res) => {
    try {
        users.push({ id: uuidv4(), email: req.body.email, password: Math.floor(Math.random() * 1000000 - 100000) });
        res.status(200).send(users[users.length - 1]);
    } catch (err) {
        res.status(404).send('Not saved');
    }
});

app.put('/user/:id', (req, res) => {
    const curUserI = users.findIndex(u => u.id == req.params.id);
    if (curUserI !== -1) {
        users.splice(curUserI, 1, req.body);
        res.status(200).send(users[users.length - 1]);
    } else {
        res.status(404).send('Not found');
    }
});

app.delete('/user/:id', (req, res) => {
    const curUserI = users.findIndex(u => u.id == req.params.id);
    if (curUserI !== -1) {
        let deleted = users.splice(curUserI, 1);
        res.status(200).send(deleted);
    } else {
        res.status(404).send('Not found');
    }
});

app.post('/login/:email/:password', (req, res) => {
    const { email, password } = req.params;
    const curUser = users.find(u => u.email == email);
    if (curUser) {
        if (checkPass(password, curUser.password)) {
            res.status(200).send('User is connected');
        } else {
            res.status(401).send('wrong credentials');
        }
    } else {
        res.status(401).send('wrong credentials');
    }
});

app.listen(PORT, () => {
    console.log(`listening in port: ${PORT}`);
});


function genPass(pass) {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(pass.toString(), salt);
    return hash;
}
function checkPass(pass, hash) {
    return bcrypt.compareSync(pass.toString(), hash);
}