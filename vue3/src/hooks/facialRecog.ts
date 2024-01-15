import { onMounted, ref } from "vue";

export function processFaceRecog() {
  const url = "https://192.168.0.195:9900/addUser";
  const photoData = ref("");
  const isUserAuthenticated = ref(false);

  async function createCameraElement() {
    const mediaStream = await navigator.mediaDevices.getUserMedia({
      video: true,
    });
    const video = document.getElementById("video") as HTMLVideoElement;
    video.srcObject = mediaStream;
  }

  async function sendToServer() {
    console.log("raw data: " + photoData.value);
    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        "data": {
          "user": "",
          "rawPhotoData": photoData.value,
        },
      }),
    })
      .then((res) => {
        console.log("done: " + res);
        if (res.ok) {
          isUserAuthenticated.value = true;
        }
      })
      .catch((e) => {
        console.log("error: " + e);
      });
  }

  async function startLogin() {
    const canvas = document.getElementById("photoTaken") as HTMLCanvasElement;
    const context = canvas?.getContext("2d");
    const photoFromVideo = document.getElementById("video") as HTMLVideoElement;
    context!.drawImage(photoFromVideo, 0, 0, 450, 337);
    photoData.value = canvas
      .toDataURL("image/jpeg");
      //.replace("image/jpeg", "image/octet-stream");

    await sendToServer();

    if (isUserAuthenticated.value) {
      // take the user to the dashboard
    }
  }

  onMounted(() => {
    createCameraElement();
  });

  return {
    startLogin,
  };
}
