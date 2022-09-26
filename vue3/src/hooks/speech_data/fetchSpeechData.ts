import { ref, onMounted, computed } from "vue";
import { publisher } from "../createNotification";

export interface IPaginatedData {
  id:               string;
  user_id:          string;
  text:             string;
  audio_file_name:  string;
  audio_file_url:   string;
}

export function fetchData() {
  var offset         = 0;
  var limit          = 10;
  const data         = ref<IPaginatedData[]>();
  const loading      = ref(true);
  const error        = ref(null);
  const rowOptions   = [10, 20];
  const searchString = ref("");


  async function resend(id: String) {
    await publisher()
      .publish("TTS", id, "1")
      .then(res => {
        if (!res.ok) {
          throw error;
        }
        res.json().then(d => {
          console.log(d)
        }).then(() => {
          loading.value = false;
        });
    })
  }

  // used for searching and filtering
  const setSearchString = (event: Event) => {
    searchString.value = (event.target as HTMLInputElement).value;
  };

  const filteredData = computed(() => {
    return data.value?.filter(
      (wo) =>
        Object.values(wo)
          .join("")
          .toLowerCase()
          .indexOf(searchString.value.toLowerCase()) != -1
    );
  });

  const incrOffset = () => {
        offset += limit;
        get_tts_data();
    }

    const decrOffset = () => {
        if (offset >= limit) {
            offset -= limit;
            get_tts_data();
        }
    }
    
    const updateLimit = (event: Event) => {
        const newOption = Number((event.target as HTMLInputElement).value);
        if (newOption != limit)
        {
            limit = newOption;
            console.log('limit: ' + limit);
            get_tts_data();
        }
    }

  async function get_tts_data() {
    console.log("Getting all TTS Data");
    loading.value = true;
    return await fetch("http://localhost:80/data-service/tts/get_tts/offset/" + offset + "/limit/" + limit, {
      method: "GET",
      headers: {
        "content-type": "application/json",
        "Access-Control-Allow-Methods": "GET",
        "Access-Control-Allow-Headers":
          "Content-Type, Authorization, X-Requested-With",
      },
    })
      .then(res => {
        console.log("done pinging the server");
        console.log(res.status);
        if (!res.ok) {
          const error = new Error(res.statusText);
          console.log(error.message);
          throw error;
        }
        res.json().then((tts_data: any) => {
          const tts = [];
          console.log(tts_data.items);
          for (let i = 0; i < tts_data.count; i++) {
            const data = tts_data.items[i];
            const audio_name = data.audio_file_name.replace("/app/output/", "");
            tts[i] = {
              id:              data.tts_id,
              user_id:         data.user_id,
              text:            data.text.substring(0, 40),
              audio_file_name: audio_name,
              audio_file_url:  "http://localhost:80/output/" + audio_name,
            };
          }

          const paginatedData = ref<IPaginatedData[]>(tts);
          data.value = paginatedData.value;
          loading.value = false;
        });
      })
      .then(() => {
        loading.value = false;
      });
  }

  onMounted(() => {
    get_tts_data();
  });

  return {
    data,
    loading,
    error,
    offset,
    limit,
    rowOptions,
    searchString,
    filteredData,
    incrOffset,
    decrOffset,
    updateLimit,
    resend,
    setSearchString,
  };
}
