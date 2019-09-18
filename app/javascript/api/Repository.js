import Resource from './Resource'

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

  findRep(params) {
    return this.client.requestPaged({
      request: {
        url: RepositoryResource.resourcePath,
        params: { criteria: params }
      }
    });
  }

  find(params) {
    const pagedRequest = this.findRep(params);
    pagedRequest.transform = (data) => data.map((rec) => new Repository(rec));
    return pagedRequest;
  }

  async getRep(params) {
    const { id } = params;

    const result = await this.client.request({
      url: `${RepositoryResource.resourcePath}/${id}`
    });

    return result.data;
  }

  get(params) {
    const { id } = params;
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

export default class Repository {

  construct(params) {
    const { id, client, resource, rep } = params;

    this.id       = id;
    this.resource = resource;
    this._rep     = rep;
  }

  get id() {
    return this.id;
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
