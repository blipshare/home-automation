import { onMounted, ref } from "vue";

export function sendDataToServer() {
  const loading         = ref(false);
  const error           = ref("");
  const open            = ref(false);
  const text            = ref("");
  const name            = ref("");
  const submitBtnText   = ref("Prepare");

  const tts_file_path = ref("");
  const is_play_ready = ref(false)

  function clearFields() {
    loading.value       = false;
    error.value         = "";
    text.value          = "";
    name.value          = "";
    open.value          = false;
    tts_file_path.value = "";
    is_play_ready.value = false;
    submitBtnText.value = "Prepare";
  }

  function setAudioSource() {
    if (is_play_ready) {
      console.log("Gets here");
      var audio = <HTMLAudioElement> document.getElementById("audio");
      audio.src = tts_file_path.value;
    }
  }

  async function convertTextToSpeech() {
    if (text.value.trim().length == 0) {
      error.value = "Message cannot be empty";
      return;
    }

    error.value = "";
    console.log("Sending Data to TTS");
    loading.value = true;
    name.value = "Test User";
    const data = {"name": name.value, "text": text.value};
    console.log(JSON.stringify(data));

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
      console.log("Done pinging the server");
      console.log(res.status);
      if (!res.ok) {
        const err = new Error(res.statusText);
        console.log(err.message);
        open.value = false;
        is_play_ready.value = false;
        error.value = "Could not process the data. Please try again!!!";
        throw error;
      }
      res.json().then((resp_data: any) => {
        error.value = "";
        console.log(resp_data);
        tts_file_path.value = resp_data.data.replace("/app", "");

        console.log("Successfully added the data")
        open.value = true;
        is_play_ready.value = true;
        setAudioSource();
        submitBtnText.value = "Send";
      });
    }).then(() => {
      loading.value = false;
    });
  }

  async function sendData() {
    if (submitBtnText.value == "Prepare") {
      await convertTextToSpeech();
    } else if(submitBtnText.value == "Send") {
      // TODO: Implement sending data to data service to store
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