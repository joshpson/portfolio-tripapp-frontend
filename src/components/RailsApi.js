const url = "http://localhost:3000/api/v1";

const token = () => {
  return localStorage.getItem("token");
};

export default {
  getTrips: () =>
    fetch(`${url}/trips`, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token()}`
      }
    }),

  getTrip: id =>
    fetch(`${url}/trips/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token()}`
      }
    }).then(res => res.json()),

  postTrip: tripData =>
    fetch(`${url}/trips/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token()}`
      },
      body: JSON.stringify(tripData)
    }),

  archiveTrip: id =>
    fetch(`${url}/trips/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token()}`
      },
      body: JSON.stringify({ status: false })
    }),

  postYelpRestaurantBookmark: (yelpData, trip_id) => {
    const bookmarkData = {
      title: yelpData.name,
      description: yelpData.categories.map(catObj => catObj.alias).join(", "),
      address: yelpData.location.display_address.join(" "),
      api_service: "Yelp",
      api_id: yelpData.id,
      trip_id,
      image: yelpData.image_url,
      category: "restaurant"
    };
    return fetch(`${url}/bookmarks/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token()}`
      },
      body: JSON.stringify(bookmarkData)
    });
  },

  searchYelp: data => {
    return fetch(
      `${url}/search?query=${data.query}&address_latitude=${
        data.latitude
      }&address_longitude=${data.longitude}`,
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token()}`
        }
      }
    );
  },

  addUser: userInfo =>
    fetch(`${url}/users`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(userInfo)
    }),

  login: userInfo =>
    fetch(`${url}/user_token`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(userInfo)
    }),

  getUser: jwtToken =>
    fetch(`${url}/user`, {
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${jwtToken}`
      }
    })
};
