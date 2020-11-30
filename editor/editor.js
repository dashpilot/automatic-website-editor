const rte_config = {
  classes: ['rich-text-editor'],
  tools: ['b', 'i', 'u', 'a', 'x'], // visible tool(s)
  text: {
    b: ['Bold', 'B', '⌘+B'],
    i: ['Italic', 'I', '⌘+I'],
    u: ['Underline', 'U', '⌘+U'],
    a: ['Link', 'A', '⌘+L'],
    x: ['Source', '&#x22ef;', '⌘+⇧+X']
  },
  tidy: true, // tidy HTML output?
  enter: true, // set to `false` to automatically submit the closest form on enter key press
};

const editor = document.querySelector('#editor-content');

/* --- Message Center --- */

window.addEventListener('message', receiveMessage, false);

function receiveMessage(event) {

  let data = JSON.parse(event.data);

  document.querySelector('#save').style.display = 'block';

  if (data.msg == 'clicked') {

    console.log('clicked');

    let type = data.type;
    let value = data.value;
    var reply = {};
    reply.msg = 'updated';


    if (type == 'text') {

      editor.innerHTML = `<input type="text" class="form-control" value="${value}" id="input">`;

      document.querySelector('#input').addEventListener('keyup', function(e) {
        reply.value = document.querySelector('#input').value;
        reply.type = 'text';
        sendMessage(reply);
      })

    }

    if (type == 'html') {
      editor.innerHTML = `<textarea class="form-control" id="input">${value}</textarea>`;

      new RTE(document.getElementById('input'), rte_config);

      document.querySelector('.rich-text-editor-view').addEventListener('keyup', function(e) {
        reply.value = document.querySelector('.rich-text-editor-view').innerHTML;
        reply.type = 'html';
        sendMessage(reply);
      })

    }

    if (type == 'src') {

      editor.innerHTML = `
    <input type="file" id="fileInput" accept="image/*" id="fileInput" />
    <button class="btn btn-outline-dark" id="chooseImage">Choose Image</button>
    `;

      document.querySelector('#chooseImage').addEventListener('click', function() {
        document.querySelector('#fileInput').click();
      })

      document.getElementById('fileInput').addEventListener('change', uploadHandler);

    }
  } else if (data.msg == 'html') {
    alert(data.html);
  }

}

// send the updated content
function sendMessage(data) {
  document.getElementById('iframe').contentWindow.postMessage(JSON.stringify(data), '*')
}

function uploadHandler(e) {

  var width = 800;
  var img = new Image();
  img.onload = function() {
    var canvas = document.createElement('canvas'),
      ctx = canvas.getContext("2d"),
      oc = document.createElement('canvas'),
      octx = oc.getContext('2d');

    canvas.width = width; // destination canvas size
    canvas.height = canvas.width * img.height / img.width;

    var cur = {
      width: Math.floor(img.width * 0.5),
      height: Math.floor(img.height * 0.5)
    }

    oc.width = cur.width;
    oc.height = cur.height;

    octx.drawImage(img, 0, 0, cur.width, cur.height);

    while (cur.width * 0.5 > width) {
      cur = {
        width: Math.floor(cur.width * 0.5),
        height: Math.floor(cur.height * 0.5)
      };
      octx.drawImage(oc, 0, 0, cur.width * 2, cur.height * 2, 0, 0, cur.width, cur.height);
    }

    ctx.drawImage(oc, 0, 0, cur.width, cur.height, 0, 0, canvas.width, canvas.height);
    var base64Image = canvas.toDataURL('image/png')

    console.log(base64Image);

    var reply = {};
    reply.msg = 'updated';
    reply.value = base64Image;
    reply.type = 'src';
    sendMessage(reply);


    /*
        if (user) {

          fetch("api/save", {
              headers: {
                  authorization: user.authToken,
                  "Content-Type": "application/json",
              },
              method: 'post',
              body: JSON.stringify({type: 'image', data: base64Image}),
            }).then(function(response) {
              return response.json();
            }).then(function(mydata) {
              data.entries[index][key] = mydata.filename;
            })
            .catch(function(error) {
              console.log(error);
            });
        }
    */

    // cleaning up
    URL.revokeObjectURL(img.src)

  }
  img.src = URL.createObjectURL(e.target.files[0]);

}

document.querySelector('#save').addEventListener('click', function() {
  let data = {};
  data.msg = 'save';
  sendMessage(data);
})