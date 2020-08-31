const apiKey = 'vIh31eZ1trlWly5ffE6ioEncuv9hiIZYe7AvEj8s';
const searchURL = 'https://developer.nps.gov/api/v1/parks';
let isLoading = false;

function formatQueryParams(params) {
  const queryItems = Object.keys(params).map(
    (key) => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`
  );
  return queryItems.join('&');
}

function renderParksInfo(responseJson) {
  $('.results').removeClass('hidden-results');

  for (let i = 0; i < responseJson.data.length; i++) {
    $('.results-list').append(`
      <li>
        <h2 >${responseJson.data[i].name}</h2>
        <p >${
          responseJson.data[i].description || 'Description Not Available'
        }</p>
        <a href=${responseJson.data[i].url} target="_blank" >Website:${
      responseJson.data[i].url
    }</a>
      </li>
      `);
  }
  isLoading = false;
  $('.loader').toggleClass('show-loader');
  $('#results').removeClass('hidden');
}

function fetchParks(query, maxResults = 10) {
  const params = {
    stateCode: query,
    api_key: apiKey,
    limit: maxResults,
    fields: 'addresses',
  };

  const queryString = formatQueryParams(params);
  const url = searchURL + '?' + queryString;
  fetch(url)
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then((responseJson) => renderParksInfo(responseJson))
    .catch((error) => {
      $('.error-message').text(`Something went wrong:${error.message}`);
    });
}

function formWatch() {
  $('.form').on('submit', function (e) {
    e.preventDefault();
    $('.results-list').empty();
    isLoading = true;
    $('.loader').toggleClass('show-loader');
    const state = $('#option-state').val();
    const maxResult = $('#results-limit').val();
    fetchParks(state, maxResult);
  });
}

$(formWatch);
