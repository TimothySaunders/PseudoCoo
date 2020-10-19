const { createWorker } = require('tesseract.js');
const sizeOf = require('image-size');


function getImageMaxDimension(url){
  // const  dimensions = sizeOf(url);
  // return dimensions.width > dimensions.height ? dimensions.width : dimensions.height
  return 500; //now hardcoded as image-size package doesnt like file format input 
}

function buildTemplate(url){
  console.log("Building Image Search Template")

  const gridTotalHeight = getImageMaxDimension(url)
  const margin = Math.floor(0.02*gridTotalHeight)
  const cellHeight = Math.floor(gridTotalHeight / 9)
  const fudgeFactor = Math.ceil(0.003*gridTotalHeight) //to account for thicker lines in grid

  const row1 = []
  const row2 = []
  const row3 = []
  const row4 = []
  const row5 = []
  const row6 = []
  const row7 = []
  const row8 = []
  const row9 = []
  const grid = [row1, row2, row3, row4, row5, row6, row7, row8, row9]

  grid.forEach((row, index) => {
    for (let x=0; x<9; x++){
        row.push({
            left: (x * cellHeight) + (margin / 2) + fudgeFactor*(Math.floor((x+1)/3)+1),
            top: (index * cellHeight) + (margin / 2) + fudgeFactor*(Math.floor((index+1)/3)+1),
            width: cellHeight-margin,
            height: cellHeight-margin,
          })
    }
  })

  return grid
}

function getTextGrid(objectOfArrays){
  console.log("Converting output to string")
  let output = ""
  Object.values(objectOfArrays).forEach(rowArray => {
    rowArray.forEach(value => {
      if (output === ""){
        output += value
      } else {
        output += " "  + value
      }
    })
  })
  return output
}

async function getGrid(grid, url){
  console.log("Starting Image processing")

  const outputGrid = {0:[], 1:[], 2:[], 3:[], 4:[], 5:[], 6:[], 7:[], 8:[]}

  for (let index=0; index<9; index++){
    const worker = createWorker();

      console.log(`Parsing Image, Row ${index+1}`);

      await worker.load();
      await worker.loadLanguage('eng');
      await worker.initialize('eng');
      await worker.setParameters({
        tessedit_char_whitelist: '123456789',
      });
      const values = [];
      for (let i = 0; i < grid[index].length; i++) {
        const { data: { text } } = await worker.recognize(url, { rectangle: grid[index][i] });
        let number = 0;
        if (text.length > 0){
          number = parseInt(text.replace("\n", ""))
        } 
        values.push(number);
      }
      outputGrid[index] = values
      await worker.terminate();
  }

  return outputGrid;
}

  function drawGridFromString(string){
    console.log("Converting string to grid")
    console.log("____.___.___.___.___.___.___.___.___")
    var rowString ="|";
    let counter =0;
    for(let char of string){
        if (char !== " ")
            {
            if (char === "0")
              {rowString = rowString.concat(`   |`);
            } else {
              rowString = rowString.concat(` ${char} |`);
            }
          }
        
        counter +=1;
        if(counter%18===0){
            counter=0;
            console.log(rowString);
            rowString ="|";
            console.log("|___|___|___|___|___|___|___|___|___|")
        }
    }   
    console.log(rowString);
    console.log("|___|___|___|___|___|___|___|___|___|")
  }

export default async function parseImage(url){
  const gridTemplate = buildTemplate(url)
  const outputGrid = await getGrid(gridTemplate, url)
  const gridString = getTextGrid(outputGrid)
  drawGridFromString(gridString)
  return gridString
}

