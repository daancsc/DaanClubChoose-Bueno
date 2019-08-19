import axois from 'axios'

let config = {
  baseURL: 'https://choose.dacsc.club',
  timeout: 10000
}

let client = axois.create(config)

export default {
  login: function (account, password) {
    return client.post('/', {account: account, password: password})
  },
  getStatus: function (token) {
    return client.get('/status', { headers: {'Authorization': token} })
  },
  getClubs: function (token) {
    return client.get('/clubs', { headers: {'Authorization': token} })
  },
  getClubInfo: function (id, token) {
    return client.get(`/club/${id}`, { headers: {'Authorization': token} })
  },
  setChoose: function (token, choose) {
    return client.post('/choose', choose, { headers: {'Authorization': token} })
  }
}
