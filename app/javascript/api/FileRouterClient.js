/**
 * FileRouter API Client
 * (C) 2019 Roman Hargrave <roman@hargrave.info>
 */

import axios from "axios"

import { RepositoryResource, Repository } from './Repository'

import ResultPage from './ResultPage'

export default class FileRouterClient {
  constructor(params) {
    const { base_path } = params;

    this.api_base    = base_path || '/api';
    this.api_version = FileRouterAPI.apiVersion();
    this.resources   = {};
    this.axios       = axios.create({
      baseURL: this.api_base
    });

    this.addResource(RepositoryProviderResource);
    this.addResource(RepositoryResource);
  }

  addResource(cls) {
    const resource = new cls({ client: this });
    this.resources[resource.name] = resource;
    this[`get${resource.name}Resource`] = () => resource;
  }

  request(params) {
    params.baseURL = this.api_base;
    params.headers ||= {};
    params.headers['Accept-Version'] = this.api_version;

    return this.axios(params);
  }

  requestPaged(params) {
    const { request, transform } = params;
    request.baseURL = this.api_base;
    request.headers ||= {};
    request.headers['Accept-Version'] = this.api_version;

    return new ResultPage({
      axios: this.axios,
      request: request,
      transform: transform
    });
  }

  static get apiVersion() {
    return 0;
  }
}
