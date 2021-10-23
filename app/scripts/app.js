document.onreadystatechange = function () {
  addListeners();

  if (document.readyState === "interactive") renderApp();

  function renderApp() {
    var onInit = app.initialized();

    onInit.then(getClient).catch(handleErr);

    function getClient(_client) {
      window.client = _client;
      client.events.on("app.activated", onAppActivate);
    }
  }
};

let dataConv = [];
function addListeners() {
  document
    .getElementById("modal-button")
    .addEventListener("click", function () {
      client.interface.trigger("showModal", {
        title: "Attachments",
        template: "./components/modal.html",
        data: dataConv || {},
      });
    });
}

function onAppActivate() {
  dataConv = [];
 function attachmentsData() {
    client.iparams.get("freshdesk_subdomain").then(
      function (iparams) {
       client.data
      .get("ticket")
      .then(
        function (data) {
          data.ticket.attachments.map((item) => dataConv.push(item));
          return data;
        },
        function (error) {
          console.log("error of app", error);
        }
      )
      .then((data) => {
        client.request
          .get(
            `https://${iparams.freshdesk_subdomain}.freshdesk.com/api/v2/tickets/${data.ticket.id}/conversations`,
            {
              headers: {
                Authorization: "Basic <%= encode(iparam.freshdesk_api_key) %>",
                "Content-Type": "application/json",
              },
            }
          )
          .then(
            function (convData) {
              JSON.parse(convData.response).map((item) => {
                if (!item.attachments < 1) {
                  item.attachments.map((i) => dataConv.push(i));
                }
                let tag = document.querySelector(".attachments");
                if (dataConv && dataConv.length > 0) {
                  tag.innerHTML = `
                <div style="display:flex; justify-content:space-between">
                <div>
                    <p>${dataConv[0].name}</p>
                </div>
                <a href=${dataConv[0].attachment_url} target="_blank">
                  <fw-icon name="download" size="18"></fw-icon>
                </a>
                </div>
                `;
                document.querySelector('#modal-button').style.display = 'block'
                } else {
                  tag.innerHTML = "<p>No Attachments Found</p>";
                  document.querySelector('#modal-button').style.display = 'none'
                }
              });
              return dataConv;
            },
            function (error) {
              console.error("Conversation Error::", error);
            }
          );
      });

      })

    
  }
  attachmentsData();
}

function handleErr(err) {
  console.error(`Error occured. Details:`, err);
}
