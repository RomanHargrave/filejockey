/**
 * FileRouter API Client
 * (C) 2019 Roman Hargrave <roman@hargrave.info>
 */

import axios from "axios"

import { RepositoryResource, Repository } from './Repository'

import ResultPage from './ResultPage'

export default class FileRouterClient {
  constructor(params) {
    const { baseURL } = params || {};

    this.apiBase    = baseURL || '/api';
    this.apiVersion = FileRouterClient.apiVersion;
    this.resources  = {};
    this.axios      = axios.create({
      baseURL: this.apiBase
    });

    this.addResource(RepositoryResource);
  }

  addResource(cls) {
    const resource = new cls({ apiClient: this });
    this.resources[resource.name] = resource;
    this[`get${resource.name}Resource`] = () => resource;
  }

  request(params) {
    params.baseURL = this.apiBase;
    params.headers ||= {};
    params.headers['Accept-Version'] = this.apiVersion;

    return this.axios(params);
  }

  requestPaged(params) {
    const { request, transform } = params;
    request.baseURL = this.apiBase;
    request.headers ||= {};
    request.headers['Accept-Version'] = this.apiVersion;

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
