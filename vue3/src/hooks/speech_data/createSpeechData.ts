import { onMounted, ref } from "vue";
import { publisher } from "../createNotification";

export function sendDataToServer() {
  const loading         = ref(false);
  const error           = ref("");
  const open            = ref(false);
  const text            = ref("");
  const name            = ref("");
  const userId          = ref(1); // TODO: Set this to logged in user's id
  const submitBtnText   = ref("Prepare");

  const ttsFilePath     = ref("");
  const isPlayReady     = ref(false)

  function clearFields() {
    loading.value       = false;
    error.value         = "";
    text.value          = "";
    name.value          = "";
    open.value          = false;
    ttsFilePath.value   = "";
    isPlayReady.value   = false;
    submitBtnText.value = "Prepare";
  }

  function setAudioSource() {
    if (isPlayReady) {
      console.log("Gets here");
      var audio = <HTMLAudioElement> document.getElementById("audio");
      audio.src = ttsFilePath.value.replace("/app", ""); // TODO: Fix this in data-service
    }
  }

  async function convertTextToSpeech() {
    if (text.value.trim().length == 0) {
      error.value = "Message cannot be empty";
      return;
    }

    error.value   = "";
    loading.value = true;
    name.value    = "Test User"; // TODO: use the logged in user's name
    const data    = {"name": name.value, "text": text.value};

    return await fetch("http://localhost:80/tts-service", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "Access-Control-Allow-Methods": "POST",
        "Access-Control-Allow-Headers":
          "Content-Type, Authorization, X-Requested-With",
      },
      body: JSON.stringify(data),
    }).then(res => {
      if (!res.ok) {
        open.value        = false;
        isPlayReady.value = false;
        error.value       = "Could not process the data. Please try again!!!";
        throw error;
      }
      res.json().then((resp_data: any) => {
        error.value         = "";
        ttsFilePath.value   = resp_data.data;
        open.value          = true;
        isPlayReady.value   = true;
        submitBtnText.value = "Send";
        setAudioSource();
      });
    }).then(() => {
      loading.value = false;
    });
  }

  async function saveData() {
    if (ttsFilePath.value.trim().length == 0) {
      error.value = "Error when sending data. Please try again!!!";
      return;
    }
    
    error.value   = "";
    loading.value = true;

    const data    = {"user_id": userId.value, "text": text.value, "audio_file_name": ttsFilePath.value};

    return await fetch("http://localhost:80/data-service/tts/create_tts", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "Access-Control-Allow-Methods": "POST",
        "Access-Control-Allow-Headers":
          "Content-Type, Authorization, X-Requested-With",
      },
      body: JSON.stringify(data),
    }).then(res => {
      if (!res.ok) {
        open.value        = false;
        error.value       = "Could not send the data. Please try again!!!";
        console.log(res.statusText);
        throw error;
      }
      res.json().then(async saved_data => {
        console.log("Saved data");
        console.log(saved_data);
  
      // send the message to notification service to announce
      await publisher()
        .publish("TTS", saved_data["tts_id"], "1") 
        .then(res => {
          if (!res.ok) {
            error.value = "Could not send notification";
            throw error;
          }
          res.json().then(d => {
            console.log(d)
          }).then(() => {
            loading.value = false;
          });
        })
        clearFields();
      });
    }).then(() => {
      loading.value = false;
    });
  }

  async function sendData() {
    if (submitBtnText.value == "Prepare") {
      await convertTextToSpeech();
    } else if(submitBtnText.value == "Send") {
      await saveData();
    }
  }

  onMounted(() => {
    clearFields();
  })

  return {
    loading,
    error,
    open,
    text,
    name,
    submitBtnText,
    clearFields,
    sendData
  };
}