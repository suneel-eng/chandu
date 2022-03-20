const textParser = (parent) => {
    let runs = parent.children.filter(child => child.name === 'w:r');
            let paraProperties = parent.children.filter(child => child.name === 'w:pPr');
            let textAlign = 'left';
            paraProperties.forEach(property => {
                let justifyContent = property.children.find(p => p.name === 'w:jc');
                if(justifyContent) {
                    textAlign = justifyContent.attribs['w:val'];
                }
            });
            let text = '';
            runs.forEach(run => {
                let texts = run.children.filter(child => child.name === 'w:t');
                let runProperties = run.children.filter(child => child.name === 'w:rPr');
                let applyBold = false;
                let applyUnderline = false;
                let isDeletedText = false;
                runProperties.forEach(property => {
                    applyBold = property.children.some(child => child.name === 'w:b');
                    applyUnderline = property.children.some(child => child.name === 'w:u');
                    isDeletedText = property.children.some(child => child.name === 'w:del');
                })
                texts.forEach(itext => {
                    itext.children.forEach(t => {
                        let sText = t.data;
                        if(applyBold) {
                            sText = `<b>${sText}</b>`;
                        }
                        if(applyUnderline) {
                            sText = `<u>${sText}</u>`;
                        }
                        if(isDeletedText) {
                            sText = `<del style="color: red">${sText}</del>`;
                        }
                        return text += sText;
                    });
                })
            })
    return `<p style="text-align:${textAlign}">${text}</p>`;
}

module.exports = { textParser }