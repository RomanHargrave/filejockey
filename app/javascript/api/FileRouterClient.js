/**
 * FileRouter API Client
 * (C) 2019 Roman Hargrave <roman@hargrave.info>
 */

import axios from "axios"

import { RepositoryResource, Repository } from './Repository'
import { RepositoryProviderResource, RepositoryProvider } from './RepositoryProvider'

import ResultPage from './ResultPage'

/**
 * Processes API response envelopes.
 * For status == 'error', an exception is raised,
 * otherwise, .data is extracted to .
 */
function processResponseEnvelope(envelope_raw) {
  try {
    const envelope = JSON.parse(envelope_raw);

    if (envelope.status !== undefined) {
      if (envelope.status === 'error') {
        throw `Error${' ' + envelope.code || ''}: ${envelope.message || 'The endpoint responded with an error condition but did not provide a message'}`;
      } else {
        return (envelope.data !== undefined) ? envelope.data : {};
      }
    } else {
      // If a status field is not present, this is probably a bare response
      return envelope;
    }
  } catch (e) {
    // If the response data wasn't valid JSON, just pass it along
    if (e.name === "SyntaxError") {
      return envelope_raw;
    } else {
      throw e;
    }
  }
}

export default class FileRouterClient {
  constructor(params) {
    const { baseURL } = params || {};

    this.apiBase    = baseURL || '/api';
    this.apiVersion = FileRouterClient.apiVersion;
    this.resources  = {};
    this.axios      = axios.create({
      baseURL: this.apiBase,
      transformResponse: [ processResponseEnvelope ]
    });

    this.addResource(RepositoryResource);
    this.addResource(RepositoryProviderResource);
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
