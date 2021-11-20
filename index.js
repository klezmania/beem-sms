const core = require('@actions/core')
const github = require('@actions/github')
const httpm = require('@actions/http-client')
const btoa = require("btoa");

const beem_url = "https://apisms.beem.africa/v1/send"
try {
    const destAddr = core.getInput("dest-addr");
    const message = core.getInput("message")
    const apiKey = core.getInput("api-key")
    const apiSecret = core.getInput("api-secret")
    let _httpm = new httpm.HttpClient()
    core.debug(`Sending message: ${message}.to ${destAddr}`);
    _httpm.postJson(
      beem_url,
      {
        source_addr: "INFO",
        schedule_time: "",
        encoding: 0,
        message: message,
        recipients: [
          {
            recipient_id: 1,
            dest_addr: destAddr,
          },
        ],
      },
      {
        "Content-Type": "application/json",
        Authorization: "Basic " + btoa(apiKey + ":" + apiSecret),
      }
    ).then((res) =>{
        core.debug(res.result);
        core.setOutput("status", res.result.code);
        if(res.statusCode == 200){
            core.debug("Message was successfull sent!")
            core.debug(res.result);
            core.setOutput("success", res.result.message);
        }else{
            core.setOutput("error", res.result.message);
            core.debug(`Got an error while sending message: ${res.result}`);
        }
    }).catch((err) => {
        core.setFailed(err)
    });
    

} catch (error) {
     core.setFailed(error);
}
