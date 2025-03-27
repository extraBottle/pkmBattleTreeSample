const express = require('express');
const cheerio = require('cheerio');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(express.json());

// showdown 형식으로 포켓몬 파일 생성
function createShow(arr){
    const sample = `
${arr[2]} @ ${arr[3]}
Level: 50
Ball: Cherish Ball
Language: English
OT: 유리병
OTGender: Male
TID: 973876
SID: 1794
EVs: ${arr[9]} HP / ${arr[10]} Atk / ${arr[11]} Def / ${arr[12]} SpA / ${arr[13]} SpD / ${arr[14]} Spe  
${arr[8]} Nature  
- ${arr[4]}
- ${arr[5]}
- ${arr[6]}
- ${arr[7]}

-------------------------------------------

`
    return sample
}

// Path to your HTML file
const htmlFilePath = path.join(__dirname, 'sampleTable.html');

// Read the HTML file
fs.readFile(htmlFilePath, 'utf8', (err, html) => {
    console.log("start")
    if (err) {
        console.error('Error reading file:', err);
        return;
    }

    // Load HTML content into Cheerio
    const $ = cheerio.load(html);
    
    $('table > tbody > tr').each((i, header) => {
        const cellData = [];
        $(header).find('td, th').each((i, cell) => {
          cellData.push($(cell).text().trim().replace('-', '0'));
        });
        const content = createShow(cellData)
        fs.appendFileSync('sample.txt', content, err => {
            if (err) {
              console.error(err);
            } else {
              // done!
            }
        });    
    });
});
// app.get("/", (req, res) => {

//     res.send("hello world")    
// })

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log('Server running... enter ^C to terminate'));
