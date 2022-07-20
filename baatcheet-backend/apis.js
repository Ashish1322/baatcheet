import express  from "express";
import Message from "./modals/Message.js";
import User from "./modals/User.js"
const router = express.Router()

router.get('/',(req,res)=>{
    res.send("Working Fine")
})


// Add new Message
router.post('/messages/new',(req,res)=>{
    const message = req.body

    Message.create(message,(err,data)=>{
        if(err)
        {
            res.status(500).send(err)
        }
        else
        {
            res.status(201).send(data)
        }
    })

})

// Return All Messages of current Two Users by Serching Their Combined Id
router.get('/messages/sync/:combinedId',(req,res)=> {
    const id = req.params.combinedId
    Message.find({combinedId: id},(err,data)=>{
        if(err)
        {
            res.status(500).send(err)
        }
        else
        {
            res.status(200).send(data)
        }
    })
})

// Add User only if it doesn't exits
router.post('/adduser' , (req,res)=> {
   
    const email = req.body.email
    // Check if already Exists with given mail
    User.find({email:email}, (err,data)=>{
       
        if(err)
        {
            res.status(500).send(err)
        }
        else
        {
           // if usr Exists. Then data will be the array of mathng objects so only send first object here
           if (data.length > 0)
           {
            res.status(201).send(data[0])
           }
           // if not exists
           else
           {
               // Create will only return the new created data only one document
            User.create(req.body, async (err,data)=> {
                if(err)
                {
                    res.status(500).send(err)
                }
                else
                {
                    // If user is new then add the automated messages
                    let combinedId;
                    if(data._id > "ashish1322g" )
                    {
                        combinedId = data._id + "ashish1322g"
                    }
                    else 
                    {
                        combinedId = "ashish1322g" +  data._id 
                    }
                    let d = new Date()
                    const msg1 = {
                        "name" : "BaatCheet Team",
                        "message" : "Hey, " + data.name,
                        "timestamp": d.toGMTString(),
                        "senderId": "ashish1322g",
                        "combinedId": combinedId
                    }
                    const msg2 = {
                        "name" : "BaatCheet Team",
                        "message" : "Welcome in BaatCheet",
                        "timestamp": d.toGMTString(),
                        "senderId": "ashish1322g",
                        "combinedId":combinedId
                    }
                    const msg3 = {
                        "name" : "BaatCheet Team",
                        "message" : "Add your friends by email and begin the conversation.",
                        "timestamp": d.toGMTString(),
                        "senderId": "ashish1322g",
                        "combinedId": combinedId
                    }
                    const msg4 = {
                        "name" : "BaatCheet Team",
                        "message" : "Have a nice Day !",
                        "timestamp": d.toGMTString(),
                        "senderId": "ashish1322g",
                        "combinedId": combinedId
                    }
                    await Message.insertMany([msg1,msg2,msg3,msg4])
                    res.status(201).send(data)
                }
        
            } )
           }
        }
        
    })

    
    
})

// Search By Email
router.get('/getuser/:email',(req,res)=> {
    const email = req.params.email
    User.find({email: email},(err,data)=> {
        if(err)
        {
            res.status(500).send(err)
        }
        else
        {
            res.status(200).send(data)
        }


    })
    
})

// Api that will take two users and add one in the friend of others and vice versa so that both will be shown on chat sidebar as new chat
// Whenever user will change the pusher will trigger the channel and all the frontends will receive the updated data and then just chekc the updated data is of current forntend user or not if yes then update

router.post('/addfriend', async  (req,res)=>{
    
    try {

    
        let user1 = (req.body)[0] // user 1
        let user2 = (req.body)[1] // user 2

        // Add the user2 in the friend list of user1 and then update
        await User.updateOne({email: user1.email},{"friends": [user2, ...user1.friends]})
        // Add the user1 in the friend list of user2 and then update
        await User.updateOne({email: user2.email},{"friends": [user1, ...user2.friends]})

        res.send("Done")
        

    } catch (error) {
        return res.status(400).json({ error: error.message});
    }
     

    
  
})
export default router