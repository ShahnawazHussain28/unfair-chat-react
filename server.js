const express = require("express")
const bcrypt = require("bcrypt")
const app = express()
const server = app.listen(process.env.PORT || 5000, () => console.log("Listening at PORT " + 5000));
const cors = require("cors")
app.use(cors({ origin: "*" }))
app.use(express.json())
const fs = require("fs")

let data = fs.readFileSync("users.json")
let users = JSON.parse(data)

const path = require('path');

app.use(express.static(path.join(__dirname, 'build')));

app.get("/announceStatus", (req, res) => {
    const contacts = req.body.contacts
    contacts.forEach(contact => {
        mySocket.broadcast.to(contact).emit('someoneOnline', {id: id})          
    })
    res.send({message: "working"})
})

app.post("/register", async (req, res) => {
    const number = req.body.id;
    const name = req.body.name;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;
    users = JSON.parse(fs.readFileSync("users.json"))
    if (!number || number.length < 10) return res.send({ message: "Please provide a valid phone number", granted: false });
    if (number in users) return res.send({ message: "This number already exist. Try login", granted: false });
    if (password !== confirmPassword) return res.send({ message: "Passwords do not match", granted: false });
    else {
        try {
            const hashedPassword = await bcrypt.hash(password, 5)
            users[number] = {name, password: hashedPassword , dp: '😒', status: "Online", talkingTo: {id: "🤷‍♂️", name: "No One"}}
            fs.writeFile("users.json", JSON.stringify(users, null, 2), () => {
                return res.send({ message: "Successsfully registered your account", granted: true })
            })
        }
        catch {
            return res.send({ message: "Internal Error. Try Again", granted: false })
        }
    }
    return res.status(404)
})

app.post("/login", async (req, res) => {
    const number = req.body.id;
    const password = req.body.password;
    users = JSON.parse(fs.readFileSync("users.json"))
    if (!(number in users)) return res.send({ message: "This Number is not Registered. Please Sign Up.", granted: false })
    try {
        if (number in users && await bcrypt.compare(password, users[number].password)) {
            return res.send({ message: "You are Logged In", dp: users[number].dp, granted: true })
        } else {
            return res.send({ message: "Access Denied", granted: false })
        }
    } catch {
        return res.send({ message: "Internal Error. Try Again", granted: false })
    }
})
app.post("/is-valid-user", async (req, res) => {
    const number = req.body.id;
    users = JSON.parse(fs.readFileSync("users.json"))
    if (!(number in users)) return res.send({ message: "This Number is not Registered. Please Sign Up.", granted: false })
    return res.send({ message: "This Number is Registered.", granted: true })
})
app.get("/online-status/:id", (req, res) => {
    const id = req.params.id
    users = JSON.parse(fs.readFileSync("users.json"))
    if (id in users) {
        return res.send({status: users[id].status})
    }
    return res.send({status: "Unknown"})
})
app.get("/get-talking-to/:id", (req, res) => {
    const id = req.params.id
    users = JSON.parse(fs.readFileSync("users.json"))
    if (id in users) {
        let talkingto = users[id].talkingTo;
        return res.send({id: talkingto.id, name: talkingto.name});
    }
    return res.send({id: "🤷‍♂️", name: "No One"});
})
app.get("/get-details/:id", (req, res) => {
    const id = req.params.id
    users = JSON.parse(fs.readFileSync("users.json"))
    if (id in users) {
        return res.send(users[id]);
    }
    return res.send({name: "Unknown", dp: "❌", status: "Unknown", talkingTo: {id: "🤷‍♂️", name: "No One"}});
})
app.get("/get-dp/:id", (req, res) => {
    const id = req.params.id
    users = JSON.parse(fs.readFileSync("users.json"))
    if (id in users) {
        return res.send({dp: users[id].dp})
    } else {
        return res.send({dp: '❌'})
    }
})
app.post("/set-dp", (req, res) => {
    const id = req.body.id;
    let dp = req.body.dp;
    if(dp.length > 1) dp = dp[0];
    if(id in users){
        if(users[id].dp = req.body.dp){
            fs.writeFileSync('users.json', JSON.stringify(users, null, 2))
            return res.send({success: true, message: 'DP Changed'})
        }
    }
    return res.send({success: false, message: 'Something went wrong'})
})
app.post("/delete-account", (req, res) => {
    const id = req.body.id;
    if (id in users) {
        if (delete users[id]){
            fs.writeFileSync('users.json', JSON.stringify(users, null, 2))
            return res.send({success: true, message: 'Account Deleted'})
        } else {
            return res.send({success: false, message: 'Could not Delete'})
        }
    } else {
        return res.send({success: false, message: 'Could not find ID'})
    }
})


const io = require("socket.io")(server, {
    cors: {
        origin: "*"
    }
})

io.on('connection', (socket) => {
    let pending = JSON.parse(fs.readFileSync("pending.json"))
    const id = socket.handshake.query.id
    users = JSON.parse(fs.readFileSync("users.json"))
    socket.join(id)
    if(!(id in users)) {
        socket.emit('error', {type: "relogin", text: "Oops. Login/Signup again"})
        return;
    }
    users[id].status = "Online"
    users[id].talkingTo = {id: "No One", name: ""}
    fs.writeFileSync('users.json', JSON.stringify(users, null, 2))
    io.emit('online-status', {id, online: true})
    if (id in pending){
        setTimeout(() => {
            pending[id].messages.forEach((message) => {
                socket.emit('receive-message', message)
            })
            pending[id].seen.forEach((seenIds) => {
                socket.emit('blue-tick-update', {sender: seenIds})
            })
            pending[id].messages = []
            pending[id].seen = []
            fs.writeFileSync("pending.json", JSON.stringify(pending, null, 2))
        }, 1000)
    }
    socket.on('typing', ({recipient, text}) => {
        socket.broadcast.to(recipient).emit('receive-typing', {
            sender: id, text
        })
    })
    socket.on('stop-typing', ({recipient}) => {
        socket.broadcast.to(recipient).emit('receive-stop-typing', {
            sender: id
        })
    })
    socket.on('send-message', ({ recipient, text, time }) => {
        if (!io.sockets.adapter.rooms.get(recipient)){
            pending = JSON.parse(fs.readFileSync("pending.json"))
            if (!(recipient in pending)) pending[recipient] = {messages:[], seen:[]}
            pending[recipient].messages.push({sender: id, text, time})
            fs.writeFileSync("pending.json", JSON.stringify(pending, null, 2))
        }
        socket.broadcast.to(recipient).emit('receive-message', {
            sender: id, text, time
        })
    })
    socket.on('blue-tick', ({recipient, sender}) => {
        if (!io.sockets.adapter.rooms.get(recipient)){
            pending = JSON.parse(fs.readFileSync("pending.json"))
            if (!(recipient in pending)) pending[recipient] = {messages:[], seen:[]}
            if (!pending[recipient].seen.find((s) => s === sender)){
                pending[recipient].seen.push(sender)
            }
            fs.writeFileSync("pending.json", JSON.stringify(pending, null, 2))
        }
        socket.broadcast.to(recipient).emit('blue-tick-update', {
            sender
        })
    })
    socket.on('set-talking-to', ({talkingId, talkingName}) => {
        users = JSON.parse(fs.readFileSync("users.json"))
        users[id].talkingTo = {id: talkingId, name: talkingName}
        fs.writeFileSync('users.json', JSON.stringify(users, null, 2))
    })
    socket.on('disconnect', (reason) => {
        users = JSON.parse(fs.readFileSync("users.json"))
        if(id in users) {
            users[id].status = new Date()
            users[id].talkingTo = {
                id: 'Offline',
                name: "📴"
            }
        }
        io.emit('online-status', {id, online: false});
        fs.writeFileSync("users.json", JSON.stringify(users, null, 2));
    })
    
    
})

