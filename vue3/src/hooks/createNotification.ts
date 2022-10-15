import { ref } from "vue";

export function publisher() {
  const processing = ref(false);
  const error      = ref("");

  async function publish(
    title: String,
    data_id: String,
    app_type: String) {
    const data = {
        "title": title,
        "data-id": data_id,
        "app-type": app_type
    };
    processing.value = true;

    return await fetch("http://ml-inference-1/message-publisher/announce", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "Access-Control-Allow-Methods": "POST",
        "Access-Control-Allow-Headers":
          "Content-Type, Authorization, X-Requested-With",
      },
      body: JSON.stringify(data),
    })
  }

  return {
    processing,
    error,
    publish
  };
}
