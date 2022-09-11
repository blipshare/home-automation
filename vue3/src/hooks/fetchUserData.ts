import { ref, onMounted, computed } from "vue";

export interface IPaginatedData {
  id:    string;
  email: string;
  name:  string;
  image: string;
  role:  string;
}

export function fetchData() {
  const data = ref<IPaginatedData[]>();
  const loading = ref(true);
  const error = ref(null);
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

  function get_users() {
    console.log("Getting all users");
    loading.value = true;
    return fetch("http://localhost:80/data-service/users/get_users/offset/0/limit/10", {
      method: "GET",
      headers: {
        "content-type": "application/json",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
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
        res.json().then((user_data: any) => {
          const users = [];
          console.log(user_data.items);
          for (let i = 0; i < user_data.count; i++) {
            const user = user_data.items[i];
            const name = user.first_name + " " + user.last_name
            const role = user.role_type == 0 ? "Admin" : "User"
            const img = "user-icon.svg"
            users[i] = {
              id:    user.user_id,
              email: user.email,
              name:  name,
              image: img,
              role: role,
            };
          }

          const paginatedData = ref<IPaginatedData[]>(users);
          data.value = paginatedData.value;
          loading.value = false;
        });
      })
      .then(() => {
        loading.value = false;
      });
  }

  onMounted(() => {
    get_users();
  });

  return {
    data,
    loading,
    error,
    searchString,
    filteredData,
    setSearchString,
  };
}
