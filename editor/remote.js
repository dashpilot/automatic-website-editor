cfg = {};
cfg.img_width = 800;
cfg.remote_domain = '*';
cfg.tag_names = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'img'];
cfg.add_blocks = ['portfolio', 'services']; // ids of the divs that can be 'cloned'
cfg.add_before = 'add-content-here'; // id of the div where new content should be added

// check if current page is loaded in iframe
if (inIframe()) {

  let config = {}
  config.msg = 'config';
  config.add_blocks = cfg.add_blocks;
  sendMessage(config);

  document.head.innerHTML += `
  <style>
  h1,h2,h3,h4,p,div {
    border: 1px solid transparent;
  }
  h1:hover,h2:hover,h3:hover,h4:hover,p:hover,img:hover,.current-item {
    border: 1px solid lightblue; cursor: pointer;
  }
  </style>`

  document.body.addEventListener('click', function(e) {

    let target = e.target;
    let tagname = e.target.tagName.toLowerCase();
    if (cfg.tag_names.includes(tagname)) {

      var data = {};
      data.msg = 'clicked';

      if (tagname == 'h1' || tagname == 'h2' || tagname == 'h3' || tagname == 'h4' || tagname == 'h5' || tagname == 'h6') {
        data.type = 'text';
        data.value = target.innerText;
      }
      if (tagname == 'p') {
        data.type = 'html';
        data.value = target.innerHTML;
      }
      if (tagname == 'img') {
        data.type = 'src';
        data.value = target.src;
      }

      sendMessage(data);

      document.querySelectorAll('.current-item').forEach(function(e) {
        e.classList.remove('current-item');
      })
      target.classList.add('current-item');
    }

  })

  /* --- Message Center --- */

  window.addEventListener('message', receiveMessage, false);

  function sendMessage(data) {
    console.log(data.msg);
    window.parent.postMessage(JSON.stringify(data), cfg.remote_domain);
  }

  function receiveMessage(event) {

    let data = JSON.parse(event.data);
    let cur = document.querySelector('.current-item');

    if (data.msg == 'updated') {
      if (data.type == 'text') {
        cur.innerText = data.value;
      } else if (data.type == 'html') {
        cur.innerHTML = data.value;
      } else if (data.type == 'src') {
        cur.src = data.value;
      }
    }

    if (data.msg == 'add') {
      let type = data.type;
      let html = document.querySelector('#' + type).outerHTML;
      document.getElementById(cfg.add_before).innerHTML += html;

      console.log('added');
    }

    if (data.msg == 'save') {
      let html = `
      <!DOCTYPE html>
      <html>`
      html += document.head.outerHTML
      html += document.body.outerHTML;
      html += `</html>`
      console.log(html);
      var reply = {};
      reply.msg = 'html';
      reply.html = html;
      sendMessage(reply);
    }

  }

} // end inIframe

function inIframe() {
  try {
    return window.self !== window.top;
  } catch (e) {
    return true;
  }
}