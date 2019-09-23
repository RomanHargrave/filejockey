import Resource from './Resource'
import UrlJoin from 'url-join'

/**
 * Repository API Response Model
 * (C) 2019 Roman Hargrave <roman@hargrave.info>
 */
export default class Repository {

  constructor(params) {
    const { id, resource, rep } = params;
    this._id      = id;
    this.resource = resource;
    this._rep     = rep;
  }

  get id() { return this._id; }

  // Lifecycle

  async reload() {
    if (this._id) {
      this._rep = await this.resource.getRep(this.id);
    } else {
      this._rep = {};
    }
  }

  async save() {
    const resp = await this.resource.createOrUpdate(this.rep);
    this._rep = resp;
    this._id  = resp.id;
  }

  async delete() {
    await this.resource.delete(this.rep);
  }

  get rep() {
    if (!this._rep) {
      this.reload(); // will this race? ¯\_(ツ)_/¯
    }

    return this._rep;
  }

  // Properties

  get isNew() { return this._id === undefined; }

  get providerId() { return this.rep.provider_id; }
  set providerId(id) {
    if (this.rep._id) {
      throw "The provider for a repository can not be changed once it has been saved";
    } else {
      this.rep.provider_id = id;
    }
  }

  get name() { return this.rep.name; }
  set name(n) { this.rep.name = n; }


  setName(n) {
    this.name = n;
    return this;
  }

  get configuration() { return this.rep.configuration; }
  set configuration(c) { this.rep.configuration = c; }

  setConfiguration(c) {
    this.configuration = c;
    return this;
  }

  get isSource() { return this.rep.is_source; }
  set isSource(v) { this.rep.is_source = v; }

  setIsSource(v) {
    this.isSource = v;
    return this;
  }

  get isDestination() { return this.rep.is_destination; }
  set isDestination(v) { this.rep.is_destination = v; }

  setIsDestination(v) {
    this.isDestination = v;
    return this;
  }

  /**
   * Return a provider definition object
   */
  getProviderDefinition() {
    return this.client.getRepositoryProviderResource().get(this.providerId);
  }

}

/**
 * Repository API Object
 * (C) 2019 Roman Hargrave <roman@hargrave.info>
 */
export class RepositoryResource extends Resource {

  get name() { return "Repository"; }

  constructor(params) {
    super(params);
  }

  get resourcePath() { return "/repositories"; }

  findRep(criteria, params) {
    return this.client.requestPaged({
      request: {
        url: this.resourcePath,
        params: {...params, criteria: criteria }
      }
    });
  }

  find(criteria, params) {
    const pagedRequest = this.findRep(criteria, params);
    pagedRequest.transform =
      (data) =>
        data.map((rep) =>
          new Repository({
            id: rep.id,
            rep: rep,
            resource: this
          }));
    return pagedRequest;
  }

  async getRep({ id }, params) {
    const result = await this.client.request({
      url: UrlJoin(this.resourcePath, id),
      params: params || {}
    });

    return result.data;
  }

  get({ id }) {
    return new Repository({
      id: id,
      resource: this,
      client: this.client
    });
  }

  async createOrUpdate(rep) {
    if (rep.id) {
      const resp = await this.client.request({
        method: 'PUT',
        url: UrlJoin(this.resourcePath, rep.id),
        data: rep
      });

      return resp.data;
    } else {
      const resp = await this.client.request({
        method: 'POST',
        url: this.resourcePath,
        data: rep
      });

      return resp.data;
    }
  }

  async delete(rep) {
    if (rep.id) {
      await this.client.request({
        method: 'DELETE',
        url: UrlJoin(this.resourcePath, rep.id)
      });
    } else {
      throw "delete must be passed a representation containing the Repository ID";
    }
  }
}
