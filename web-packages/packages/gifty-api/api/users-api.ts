import axios from "axios";
import { BaseApi } from "./base";

class Users extends BaseApi {
  async getUsers() {
    return this.instance.get("users");
  }
}

const usersApi = new Users();

export { usersApi };
