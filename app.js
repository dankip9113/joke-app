import { Joke } from 'bee-jokes'
import {Chance} from 'chance'
import yargs from 'yargs'
import fs from 'fs'

const joke = new Joke()
const chance = new Chance() 



let binData
let jsonData
let my_Data
let tempData



let genJoke
let genName
let genAge

let my_Joke

yargs.command({
    command:'add',
    describe:'generate new joke',
    handler:function(){
        my_Joke = GenerateJoke()
        SaveJoke(my_Joke)
        console.log("joke added")
    }
})
yargs.command({
    command:'delete',
    describe:'delete joke by name',
    builder:{
        name:{
            describe:"name of joke",
            type:'string'
        }
    },
    handler:function(args){
        DeleteJoke(args.name)
    }
})
yargs.command({
    command:'get',
    describe:'get joke by name',
    builder:{
        name:{
            describe:'name of joke',
            type:'string'
        }
    },
    handler:function(args){
        GetJoke(args.name)
    }
})
yargs.command({
    command:'getAll',
    describe:'get all jokes',
    handler:function(){
        GetAllJokes()
    }
})

function GenerateJoke(){
    genJoke = joke.getJoke({})
    genName = chance.name({nationality: 'en'})
    genAge = chance.age()
    return {
        name: genName,
        age: genAge,
        joke: genJoke.joke
    }

}
function SaveJoke(joke){
    try{
        tempData = GetData()
        tempData.push(joke)
        my_Data = JSON.stringify(tempData)
        fs.writeFileSync('data.json',my_Data)
    }catch(e){
        fs.writeFileSync('data.json', [JSON.stringify(joke)])
    }
}
function GetAllJokes(){
    my_Data = GetData()
    if(my_Data.length !==0){

        for(let i = 0; i < my_Data.length;i++){
            console.log("\n"+ my_Data[i].name + "\n" + my_Data[1].age + "\n" + my_Data[i].joke)
            
        }
    }else{
        console.log('We have no joke here:(')
    }
}

function GetJoke(name){

    my_Data = GetData()
    my_Joke = null
    if(my_Data.length > 1){
        my_Joke = my_Data.filter((joke) =>{
            return joke.name === name
        })
        console.log(my_Joke)
        if(my_Joke.length !== 0){
            console.log("\n"+ my_Joke[0].name + "\n" + my_Joke[0].age + "\n" + my_Joke[0].joke)
        }else{
            console.log("Joke didnt exist")
        }
    }else{
        console.log('We have no joke here:(')
    }

}
function DeleteJoke(name){
    my_Data = GetData()
    my_Joke = null
    if(my_Data.length >1){
        my_Joke = my_Data.filter((joke) =>{
            return joke.name === name
        })
        if(my_Joke != null){
            tempData = my_Data.filter((joke) =>{
                return joke.name !== name
            })
            SaveData(tempData)
        }else{
            console.log("Your joke didnt exist")
        }
    }else{
        console.log("We have no joke here:(")
    }
}
function SaveData(data){
    fs.writeFileSync('data.json',JSON.stringify(data))
}
function GetData(){
    try{
        binData = fs.readFileSync('data.json') 
        jsonData =  binData.toString()
        console.log('data exist ')
        return JSON.parse(jsonData)
        
    }catch(e){
        console.log('file dont exist')
        return []
    }
    
}    
