import axios from 'axios';

export class BaseApi {
  protected instance = axios.create({
    baseURL: "http://localhost:18081/api/v1/",
    timeout: 1000,
  });
}
