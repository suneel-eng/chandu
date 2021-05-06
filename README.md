# What is extract-word-docs?
`extract-word-docs` package will convert word documents (.docx) into html by using regex.

# Installation
```sh
npm i extract-word-docs --save
```

# Usage

```javascript
const Document = require('extract-word-docs');

let document = new Document(filepath, {editable: false, delText: false});

document.extractAsHTML().then(data => {
    console.log(data);
});

```
# Options

You can pause these options for the contructor.

**editable:** ` true | false `  (default is `false`)
* `true` to get editable document (if you edit something, changes will occur only in the extracted document not in the original document).
* `false` to get uneditable document.

**delText:** `true | false` (default is `false`)
* `true` to get deleted text. (deleted text will contain red color by default).
* `false` to neglect deleted text.