window.frsh_init().then(function (client) {
  client.instance.context().then(function (context) {
    cards(context.data);
  }),
    function (error) {
      console.error(error);
    };
  event.preventDefault();
});

function cards(data) {
  let attachmentDiv = document.querySelector(".card");
  let dateOrder = new Date(data[0].created_at).toDateString();
  let counter = 0;
  attachmentDiv.innerHTML = data
    .map((element) => {
      if (dateOrder === new Date(element.created_at).toDateString()) {
        counter += 1;
        return templateCard(element, counter);
      } else {
        dateOrder = new Date(element.created_at).toDateString();
        counter = 1;
        return templateCard(element, counter);
      }
    })
    .join("");
}

function filteredCard(fileTypes, AttachmentsData) {
  if (fileTypes == undefined) {
    let attachmentDiv = document.querySelector(".card");
    attachmentDiv.innerHTML = "";
  } else {
    if (fileTypes.includes("all")) {
      cards(AttachmentsData);
    } else {
      let attachmentDiv = document.querySelector(".card");
      let finalFilter = [];
      fileTypes.map((type) => {
        AttachmentsData.map((item) => {
          if (type == item.name.split(".")[item.name.split(".").length - 1]) {
            finalFilter.push(item);
          }
        });
      });
      attachmentDiv.innerHTML = finalFilter
        .map(
          (item) => `
      <p style="color:#183247; text-align:right; margin-top:14px;"><b>${new Date(
        item.created_at
      ).toDateString()}</b></p>
      <div>
      </div>
        <div class="attachment-details-name" id="attachment-detail" style="display:flex; justify-content:space-between">
            <div>
                <p>${item.name}</p>
                <p>${bytesToSize(item.size)}</p>
            </div>
            <a href=${item.attachment_url} target="_blank">
              <fw-icon name="download" size="18"></fw-icon>
            </a>
            </div>
            `
        )
        .join("");
    }
  }
}

function templateCard(element, counter) {
  return `
  <p style="color:#183247; text-align:right; margin-top:14px;"><b>${
    counter - 1 === 0 ? new Date(element.created_at).toDateString() : ""
  }</b></p>
  <div>
  </div>
    <div class="attachment-details-name" id="attachment-detail" style="display:flex; justify-content:space-between">
        <div>
            <p>${element.name}</p>
            <p>${bytesToSize(element.size)}</p>
        </div>
        <a href=${element.attachment_url} target="_blank">
          <fw-icon name="download" size="18"></fw-icon>
        </a>
        </div>
        `;
}

function bytesToSize(bytes) {
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  if (bytes === 0) return "n/a";
  const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)), 10);
  if (i === 0) return `${bytes} ${sizes[i]})`;
  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
}

function getSelectedAttValues() {
  return document.getElementById("selected-att-types").value;
}

window.frsh_init().then(function (client) {
  document
    .getElementById("selected-att-types")
    .addEventListener("fwChange", function () {
      client.instance.context().then(function (context) {
        filteredCard(getSelectedAttValues(), context.data);
      });
    });
});
