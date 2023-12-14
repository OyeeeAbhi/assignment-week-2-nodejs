const express = require('express');
const app = express();
const fs = require('fs');
const bodyparser = require('body-parser');
const { toUnicode } = require('punycode');
app.use(bodyparser.json());

app.get('/todos' , (req,res)=>{
    fs.readFile('todos.json' , (err,data)=>{
        let todoStore = JSON.parse(data);
        res.status(200).json(todoStore);
    })
  })

app.get('/todos/:id' , (req,res)=>{
    let id = req.params.id;
    fs.readFile('todos.json' , (err,data)=>{
        let todoStore = JSON.parse(data);
        let todo = todoStore.filter((element,index)=>{
            if(element.id == id)return element;
          })
          if(!todo.length)return res.status(404).send('Not Found');
          res.status(200).json(todo[0]);
    })    
    
})

app.post('/todos' , (req,res)=>{
   fs.readFile('todos.json' , (err,data)=>{
     todoStore = JSON.parse(data);
     const id = todoStore.length + 1;
     const title = req.body?.title;
     const description = req.body?.description;
     const status = req.body?.status;
     let todo = new Object();
        todo.id = id;
        todo.title = title;
        todo.description = description;
        todo.status = status
        todoStore.push(todo);
        todoStore = JSON.stringify(todoStore);
        fs.writeFile('todos.json' , todoStore , (err)=>{
            if(err){
                res.status(404).send('some error occured');
            }else{
                res.status(201).json(todo);
            }
        })
   });
})

  app.put('/todos/:id' , (req,res)=>{
    let id = req.params.id;

    fs.readFile('todos.json' , (err,data)=>{
        todoStore = JSON.parse(data);
        todo = todoStore.filter((element,index)=>{
            if(element.id == id)return element;
        })
        if(!todo.length)res.status(404).send('Not Found');
        todoStore.forEach((element , index)=>{
            if(element.id == id){
                element.title = req.body?.title;
                element.status = req.body?.status;
                element.description = req.body?.description;

            }
        })
        todoStore = JSON.stringify(todoStore);
        fs.writeFile('todos.json' , todoStore , (err)=>{
            res.status(200).send();
        })

    })
  })

  app.delete('/todos/:id' , (req,res)=>{
    let id = req.params.id;
    fs.readFile('todos.json' , (err,data)=>{
        data = JSON.parse(data);
        let initialLength = data.length;
        todoStore = data.filter((element,index)=>{
            if(element.id != id)return element;
        })
        let finalLength = todoStore.length;
        if(initialLength == finalLength)res.status(404).send();
        else{
            fs.writeFile('todos.json' , JSON.stringify(todoStore) , ()=>{
                res.status(200).send();
            })
        }

    })

  })

//   app.listen(3000,()=>{
//     console.log(`listening on port : 3000 `);
//   })
  module.exports = app;