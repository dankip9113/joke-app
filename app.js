import { Joke } from "bee-jokes";
import { Chance } from "chance";
import yargs, { demandOption } from "yargs";
import fs from "fs";

const joke = new Joke();
const chance = new Chance();

const FILE_NAME = "data.json";

let bufferData;
let jsonData;
let myData;
let tempData;

let genJoke;
let genName;
let genAge;

let my_Joke;

yargs.command({
  command: "add",
  describe: "generate new joke",
  handler: () => {
    my_Joke = GenerateJoke();
    SaveJoke(my_Joke);
    console.log("joke added");
  },
});
yargs.command({
  command: "delete",
  describe: "delete joke by name",
  builder: {
    name: {
      demandOption: true,
      describe: "name of joke",
      type: "string",
    },
  },
  handler: (args) => {
    DeleteJoke(args.name);
  },
});
yargs.command({
  command: "get",
  describe: "get joke by name",
  builder: {
    name: {
      demandOption: true,
      describe: "name of joke",
      type: "string",
    },
  },
  handler: (args) => {
    GetJoke(args.name);
  },
});
yargs.command({
  command: "getAll",
  describe: "get all jokes",
  handler: () => {
    GetAllJokes();
  },
});

const GenerateJoke = () => {
  genJoke = joke.getJoke({});
  genName = chance.name({ nationality: "en" });
  while (!CheckName(genName)) {
    genName = chance.name({ nationality: "en" });
  }
  genAge = chance.age();
  return {
    name: genName,
    age: genAge,
    joke: genJoke.joke,
  };
};

const CheckName = (name) => {
  myData = GetData();
  my_Joke = null;
  if (myData.length !== 0) {
    for (let i = 0; i < myData.length; i++) {
      if (myData[i].name === name) {
        return false;
      }
    }
    return true;
  } else {
    return true;
  }
};

const SaveJoke = (joke) => {
  try {
    tempData = GetData();
    tempData.push(joke);
    myData = JSON.stringify(tempData);
    fs.writeFileSync(FILE_NAME, myData);
  } catch (e) {
    fs.writeFileSync(FILE_NAME, [JSON.stringify(joke)]);
  }
};
const GetAllJokes = () => {
  myData = GetData();
  if (myData.length !== 0) {
    for (let i = 0; i < myData.length; i++) {
      console.log(
        "\n" + myData[i].name + "\n" + myData[1].age + "\n" + myData[i].joke,
      );
    }
  } else {
    console.log("We have no joke here:(");
  }
};

const GetJoke = (name) => {
  myData = GetData();
  my_Joke = null;
  if (myData.length > 1) {
    my_Joke = myData.find((joke) => {
      return joke.name === name;
    });
    if (my_Joke.length !== 0) {
      console.log(
        "\n" + my_Joke[0].name + "\n" + my_Joke[0].age + "\n" + my_Joke[0].joke,
      );
    } else {
      console.log("Joke didnt exist");
    }
  } else {
    console.log("We have no joke here:(");
  }
};
const DeleteJoke = (name) => {
  myData = GetData();
  my_Joke = null;
  if (myData.length > 1) {
    my_Joke = myData.find((joke) => {
      return joke.name === name;
    });
    if (my_Joke != null) {
      tempData = myData.filter((joke) => {
        return joke.name !== name;
      });
      SaveData(tempData);
    } else {
      console.log("Your joke didnt exist");
    }
  } else {
    console.log("We have no joke here:(");
  }
};
const SaveData = (data) => {
  fs.writeFileSync(FILE_NAME, JSON.stringify(data));
};
const GetData = () => {
  try {
    bufferData = fs.readFileSync(FILE_NAME);
    jsonData = bufferData.toString();
    return JSON.parse(jsonData);
  } catch (e) {
    return [];
  }
};

yargs.parse();
