import { onMounted, ref } from 'vue'

export function processFaceRecog() {    
    const isPhotoTaken          = ref(false)
    const isUserAuthenticated   = ref(false)

    async function createCameraElement() {
        const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true});
        const video = document.getElementById("video") as HTMLVideoElement;
        video.srcObject = mediaStream;
    }

    function takePhoto() {        
        const canvas = document.getElementById('photoTaken') as HTMLCanvasElement;
        const context = canvas?.getContext('2d');
        const photoFromVideo = document.getElementById("video") as HTMLVideoElement;        
        context!.drawImage(photoFromVideo, 0, 0, 450, 337);        
    }

    function startLogin() {                
        const canvas = document.getElementById('photoTaken') as HTMLCanvasElement;
        const context = canvas?.getContext('2d');
        const photoFromVideo = document.getElementById("video") as HTMLVideoElement;
        context!.drawImage(photoFromVideo, 0, 0, 450, 337);        
        const rawPhotoData = canvas.toDataURL("image/jpeg").replace("image/jpeg", "image/octet-stream");
        console.log(rawPhotoData)
        // send the data to backend server
        const serverResp = ref("")

        // TOOD: verify the server response
        isUserAuthenticated.value = true

        if (isUserAuthenticated.value) {
            // take the user to the dashboard
            
        }
    }

    onMounted(() => {
        createCameraElement();
    })

    return {        
        startLogin
    }
}