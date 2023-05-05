import axios from 'axios'
import configs from '../../configs/configs'

const apiInstance = axios.create({
  baseURL: configs.serverConfig?.APIDomain ?? '',
  headers: {
    'content-type': 'application/json',
  },
})

const getAPIData = async (method, url, postData, header) => {
  const response = await apiInstance({
    method,
    url,
    data: postData,
  })
  return response
}

export default getAPIData
