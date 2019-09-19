import Resource from './Resource'

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

  get id() {
    return this._id;
  }

  async reload() {
    this._rep = await this.resource.getRep(this.id);
  }

  get rep() {
    if (!this._rep) {
      this.reload();
    }

    return this._rep;
  }

  save() {
    this.resource.createOrUpdate(this.rep);
  }

  delete() {
    this.resource.delete(this.rep);
  }

  get providerId() { return this.rep.provider_id; }

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

  static get resourcePath() { return "/repositories"; }

  get name() { return "Repository"; }

  constructor(params) {
    super(params);
  }

  findRep(criteria, params) {
    return this.client.requestPaged({
      request: {
        url: RepositoryResource.resourcePath,
        params: Object.assign({ criteria: criteria }, params)
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

  async getRep(criteria, params) {
    const { id } = criteria;

    const result = await this.client.request({
      url: `${RepositoryResource.resourcePath}/${id}`,
      params: params || {}
    });

    return result.data;
  }

  get(criteria) {
    const { id } = criteria;
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
        url: `${RepositoryResource.resourcePath}/${rep.id}`,
        data: rep
      });

      return resp.data;
    } else {
      const resp = await this.client.request({
        method: 'POST',
        url: RepositoryResource.resourcePath,
        data: rep
      });

      return resp.data;
    }
  }

  async delete(rep) {
    if (rep.id) {
      await this.client.request({
        method: 'DELETE',
        url: `${RepositoryResource.resourcePath}/${rep.id}`
      });
    }
  }
}
