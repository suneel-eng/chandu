const StreamZip = require('node-stream-zip');
const parseString = require('xml2js').parseString;
const formats = require('./formats');

module.exports = class Document {
    constructor(file, options = {
        editable: false
    }) {
        this.file = file;
        this.options = options;
    }

    prase(data) {
        let paras = data.match(formats['wp']);
        let structuredText = '';
        for (let i = 0; i <= paras.length; i++) {
            let extractedText = '';
            let style = '';
            let paraId = '';
            let marginTop = 0;
            let marginBottom = 0;
            var runs = paras[i]?.match(formats['wr']);
            var styles = paras[i]?.match(formats['wjc']);
            parseString(paras[i], function (err, result) {
                paraId = result?.['w:p']['w:pPr'][0]['w:pStyle']?.[0]?.['$']['w:val'];
                marginTop = result?.['w:p']['w:pPr'][0]['w:spacing']?.[0]?.['$']['w:before'] / 20;
                marginBottom = result?.['w:p']['w:pPr'][0]['w:spacing']?.[0]?.['$']['w:after'] / 20;
            });

            if (styles !== null) {
                let match = formats['attr'].exec(styles?.[0]);
                if (match !== null) {
                    style = match.groups.style
                }
            }
            if (runs !== null) {
                runs?.forEach(run => {
                    // let text = formats['wt'].exec(run);
                    let text = run.match(formats['wt'])?.map(function (val) {
                        return val.replace(/<\/?w:t>/g, '');
                    })[0];

                    // let bold = formats['wb'].exec(run);
                    let bold = run.match(formats['wb'])?.map(function (val) {
                        return formats['wb'].test(val);
                    })[0];
                    var underline = formats['wu'].exec(run);
                    let delText = run.match(formats['wdelText'])?.map(function (val) {
                        return val.replace(/<\/?w:delText>/g, '');
                    })[0];
                    if (text) {
                        extractedText += `<span style='font-weight:${bold ? 'bold' : 'normal'};text-decoration:${(underline !== null) ? 'underline' : 'none'}'>${text}</span>`;
                        bold = false;
                    }
                    if (delText) {
                        extractedText += `<del style='color:red;font-weight:${bold ? 'bold' : 'normal'}'>${delText}</del>`;
                        bold = false;
                    }
                })
            }
            structuredText += `<p class="${paraId}" style='text-align:${style};outline:none;margin-top:${marginTop}px;'>${extractedText}</p>`;
        }
        return `<div contenteditable=${this.options.editable}>${structuredText}</div>`;
    }

    extractAsHTML() {
        return new Promise((resolve, reject) => {
            const zip = new StreamZip({
                file: this.file,
                storeEntries: true
            });

            let chunks = [], content = '', components = '';

            zip.on('error', () => {
                reject(err);
            })

            zip.on('ready', () => {
                zip.stream('word/document.xml', (err, stream) => {
                    if (err) reject(reject(err));

                    stream.on('data', function (chunk) {
                        chunks.push(chunk)
                    });

                    stream.on('end', () => {
                        content = Buffer.concat(chunks)
                        zip.close()
                        components = content.toString();
                        let text = this.prase(components);
                        resolve(text);
                    });
                });
            });
        });
    };
};