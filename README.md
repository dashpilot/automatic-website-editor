# automatic-website-editor
On-page editor that allows you to edit any page/template without any changes to the code.

## About
What if you could take any existing (Bootstrap-) template and make it editable without changing a line of code? Just add the remote.js script to any page you want to edit, and titles, texts and images become instantly editable! You can even configure which parts of the page can be 'duplicated' or removed by users, so they can expand the existing page layout.

## Features
- instantly turn a static html page into a visual editor
- rich text editor
- image upload and resize
- add new content blocks to the page
- works cross-domain: the editor can be hosted on a different doain than the webpage you're editing

## Upcoming features
- delete and reorder content blocks
- add integration with Netlify/Vercel & php server for saving the edited page

## How To
Just add remote.js to any page you want to edit, and point the iframe in index.html to the page/domain you want to edit (works cross-domain). Check out the example in the download.

## Configuration options
In remote.js you can configure:
- image upload size
- allowed domain
- which content blocks can be added/duplicated (provide an id)
