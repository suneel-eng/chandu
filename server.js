const express = require('express');
const app = express();
const parseString = require('xml2js').parseString;
const StreamZip = require('node-stream-zip');
const formats = require('./formats');

app.get('/', (req, res) => {
    res.send('you are at root folder...')
})

app.get('/data', (req, res) => {
    const zip = new StreamZip({
        file: './Comake_KR_BIZ_GEN_채권양수도.docx',
        storeEntries: true
    })
    
    var chunks = []
    var content = '';
    var extractedText = '';
    var structuredText = '';
    var style = '';
    let contentStyles = [];
    let paragraphs = [];
    zip.on('ready', () => {
        zip.stream('word/styles.xml', (err, stream) => {
            if(err) reject(err);
            let cont = '';
            let chucks = [];
            stream.on('data', (chunk) => {
                chucks.push(chunk);
            });

            stream.on('end', () => {
                cont = Buffer.concat(chucks);
                zip.close()
                let data = cont.toString();
                let styles = data.match(formats['wstyle']);
                styles?.forEach(style => {
                    parseString(style, function (err, result) {
                        if(result['w:style']['$']['w:type'] === 'paragraph') {
                            // contentStyles.push(result['w:style']);
                            console.log(result['w:style']['w:pPr']?.[0]['w:numPr']?.[0]?.['w:ilvl']?.[0]?.['$']?.['w:val']);
                            contentStyles.push({
                                type: result['w:style']['$']['w:type'],
                                id: result['w:style']['$']['w:styleId'],
                                numId: result['w:style']['w:pPr']?.[0]['w:numPr']?.[0]['w:numId']?.[0]['$']?.['w:val'],
                                ilvl: result['w:style']['w:pPr']?.[0]['w:numPr']?.[0]?.['w:ilvl']?.[0]?.['$']?.['w:val'] | 0
                            })
                        }
                    });
                });
                console.log(contentStyles);
                // console.log(styles);
            })
        })
        zip.stream('word/document.xml', (err, stream) => {
            if (err) {
                reject(err)
            }
            stream.on('data', function (chunk) {
                chunks.push(chunk)
            })
            stream.on('end', function () {
                content = Buffer.concat(chunks)
                zip.close()
                var components = content.toString();
                var paras = components.match(formats['wp']);
                console.log(paras[2]);
                paras.forEach(para => {
                    style = '';
                    let paraId = '';
                    extractedText = '';
                    let marginTop = 0;
                    let marginBottom = 0;
                    var runs = para.match(formats['wr']);
                    var styles = para.match(formats['wjc']);
                    parseString(para, function (err, result) {
                        paraId = result['w:p']['w:pPr'][0]['w:pStyle']?.[0]?.['$']['w:val'];
                        marginTop = result['w:p']['w:pPr'][0]['w:spacing']?.[0]?.['$']['w:before']/20;
                        marginBottom = result['w:p']['w:pPr'][0]['w:spacing']?.[0]?.['$']['w:after']/20;
                    });
                    // if(numPr !== null) {
                    //     console.log(numPr);
                    // }
                    if(styles !== null) {
                        let match = formats['attr'].exec(styles[0]);
                        if(match !== null) {
                            style = match.groups.style
                        }
                    }
                    if(runs !== null) {
                        runs.forEach(run => {
                            // let text = formats['wt'].exec(run);
                            let text = run.match(formats['wt'])?.map(function(val){
                                return val.replace(/<\/?w:t>/g,'');
                             })[0];
                            
                            // let bold = formats['wb'].exec(run);
                            let bold = run.match(formats['wb'])?.map(function(val){
                                return formats['wb'].test(val);
                             })[0];
                            var underline = formats['wu'].exec(run);
                            let delText = run.match(formats['wdelText'])?.map(function(val){
                                return val.replace(/<\/?w:delText>/g,'');
                             })[0];
                            if(text) {
                                extractedText += `<span style='font-weight:${bold?'bold':'normal'};text-decoration:${(underline !== null)?'underline':'none'}'>${text}</span>`;
                                bold = false;
                            }
                            if(delText) {
                                extractedText += `<del style='color:red;font-weight:${bold?'bold':'normal'}'>${delText}</del>`;
                                bold = false;
                            }
                        })
                    }
                    structuredText += `<p class="${paraId}" contenteditable="true" style='text-align:${style};outline:none;margin-top:${marginTop}px;'>${extractedText}</p>`;
                })
                res.send(structuredText);
            })
        })
    })
})

app.listen(4000, () => {
    console.log('server started on port 4000 ...')
})