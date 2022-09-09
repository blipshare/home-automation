import { ref, onMounted, computed } from "vue";

export interface IPaginatedData {
  id:               string;
  user_id:          string;
  text:             string;
  audio_file_name:  string;
}

export function fetchData() {
  var offset         = 0;
  var limit          = 10;
  const data         = ref<IPaginatedData[]>();
  const loading      = ref(true);
  const error        = ref(null);
  const rowOptions   = [10, 20];
  const searchString = ref("");

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

  function get_tts_data() {
    console.log("Getting all TTS Data");
    loading.value = true;
    return fetch("http://localhost:80/data-service/tts/get_tts/offset/" + offset + "/limit/" + limit, {
      method: "GET",
      headers: {
        "content-type": "application/json",
        "Access-Control-Allow-Methods": "GET",
        "Access-Control-Allow-Headers":
          "Content-Type, Authorization, X-Requested-With",
      },
    })
      .then((res) => {
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
            tts[i] = {
              id:              data.tts_id,
              user_id:         data.user_id,
              text:            data.text,
              audio_file_name: data.audio_file_name,
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
    setSearchString,
  };
}
