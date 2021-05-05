const StreamZip = require('node-stream-zip');
const formats = require('./formats');
const { documentParser, stylesParser, numberingParser } = require('./parser/parser');

module.exports = class Document {
    constructor(file, options = {
        editable: false,
        delText: false
    }) {
        this.file = file;
        this.options = options;
    }

    extractAsHTML() {
        return new Promise((resolve, reject) => {
            const zip = new StreamZip({
                file: this.file,
                storeEntries: true
            });

            let chunks = [],
                content = '',
                components = '',
                styleChunks = [],
                styleContent = '',
                styleComponents = '',
                numberingChunks = [],
                numberingContent = '',
                numberingComponents = '';

            zip.on('error', (err) => {
                reject(err);
            })

            zip.on('ready', () => {

                // read styles.xml file
                zip.stream('word/styles.xml', (err, stream) => {
                    if (err) reject(reject(err));

                    stream.on('data', function (chunk) {
                        styleChunks.push(chunk);
                    });

                    stream.on('end', () => {
                        styleContent = Buffer.concat(styleChunks)
                        zip.close()
                        styleComponents = styleContent.toString();
                        let styles = stylesParser(styleComponents);
                        return;
                    })
                });

                //read numbering.xml file

                zip.stream('word/numbering.xml', (err, stream) => {
                    if (err) reject(reject(err));

                    stream.on('data', function (chunk) {
                        numberingChunks.push(chunk);
                    });

                    stream.on('end', () => {
                        numberingContent = Buffer.concat(numberingChunks)
                        zip.close()
                        numberingComponents = numberingContent.toString();
                        let numberings = numberingParser(numberingComponents);
                        console.log(numberings);
                    })
                });

                // read document.xml file
                zip.stream('word/document.xml', (err, stream) => {
                    if (err) reject(reject(err));

                    stream.on('data', function (chunk) {
                        chunks.push(chunk)
                    });

                    stream.on('end', () => {
                        content = Buffer.concat(chunks)
                        zip.close()
                        components = content.toString();
                        let text = documentParser(components, this.options);
                        resolve(text);
                    });
                });
            });
        });
    };
};