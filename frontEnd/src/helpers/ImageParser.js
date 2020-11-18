const { createWorker, createScheduler } = require('tesseract.js');
// const sizeOf = require('image-size');


function getImageMaxDimension(url){
  // const  dimensions = sizeOf(url);
  // return dimensions.width > dimensions.height ? dimensions.width : dimensions.height
  return 504; //now hardcoded as image-size package doesnt like file format input that we are using
}

function buildTemplate(url, includeMargin, includeFudgeFactor){
  console.log("Building Image Search Template")

  const gridTotalHeight = getImageMaxDimension(url)
  const margin = includeMargin ? Math.floor(0.02*gridTotalHeight) : 0;
  const cellHeight = Math.floor(gridTotalHeight / 9)
  const fudgeFactor = includeFudgeFactor ? Math.ceil(0.003*gridTotalHeight) : 0 //to account for thicker lines in grid if includeFudgeFactor is true

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
            left: (x * cellHeight) + (margin / 2) + fudgeFactor*(Math.floor((x)/3)+1),
            top: (index * cellHeight) + (margin / 2) + fudgeFactor*(Math.floor((index)/3)+1),
            width: cellHeight-margin-fudgeFactor,
            height: cellHeight-margin-fudgeFactor,
          })
    }
  })
  return grid
}

async function getGrid(grid, url){
  console.log("Starting Image processing")

  const scheduler = createScheduler();
  const worker1 = createWorker();
  const worker2 = createWorker();
  const worker3 = createWorker();

  await worker1.load();
  await worker1.loadLanguage('eng');
  await worker1.initialize('eng');
  await worker1.setParameters({
    tessedit_char_whitelist: '123456789',
    });
  await worker2.load();
  await worker2.loadLanguage('eng');
  await worker2.initialize('eng');
  await worker2.setParameters({
    tessedit_char_whitelist: '123456789',
  });
  await worker3.load();
  await worker3.loadLanguage('eng');
  await worker3.initialize('eng');
  await worker3.setParameters({
    tessedit_char_whitelist: '123456789',
  });

  scheduler.addWorker(worker1);
  scheduler.addWorker(worker2);
  scheduler.addWorker(worker3);

  return (async () => {

    const results = await Promise.all(grid.flat().map((rectangle) => (
      scheduler.addJob("recognize", url, { rectangle })
    )));
    await scheduler.terminate();
    return results.map(r => r.data.text).map(cell => {
      cell = cell.replace("\n", "");
      return cell === "" ? "." : cell;
    }).join("");

  })();

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
        if(counter%9===0){
            counter=0;
            console.log(rowString);
            rowString ="|";
            console.log("|___|___|___|___|___|___|___|___|___|")
        }
    }   
    // console.log(rowString);
    // console.log("|___|___|___|___|___|___|___|___|___|")
  }

export default async function parseImage(url, margins=false, fudgefactor=false){
  const gridTemplate = buildTemplate(url, margins, fudgefactor)
  const gridString = await getGrid(gridTemplate, url)
  console.log(gridString);
  drawGridFromString(gridString)
  return gridString
}

