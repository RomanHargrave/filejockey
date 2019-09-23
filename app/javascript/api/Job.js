import Resource from './Resource'

/**
 * Job API Response Model
 * (C) 2019 Roman Hargrave <roman@hargrave.info>
 */
export default class Job {

  constructor({ id, resource, rep }) {
    this._id = id;
    this.resource = resource;
    this._rep = rep;
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
    const rsep = await this.resource.createOrUpdate(this.rep);
    this._rep = resp;
    this._id = resp.id;
  }

  async delete() {
    await this.resource.delete(this._id);
  }

  get rep() {
    if (!this._rep) {
      this.reload();
    }

    return this._rep;
  }

  // Properties

  get isNew() { return this._id !== undefined; }

  get name() { return this.rep.name; }
  set name(n) { this.rep.name = n; }

  setName(n) {
    this.name = n;
    return this;
  }

  get source() {
    if (this.rep.source) {
      return new Repository({
        id: this.rep.source.id,
        rep: this.rep.source,
        resource: this.resource.client.getRepositoryResource()
      });
    } else {
      return null;
    }
  }

  set source(s) {
    if (s) {
      if (s instanceof Repository) {
        this.rep.source = { id: s.id };
      } else {
        this.rep.source = s;
      }
    } else {
      this.rep.source = undefined;
    }
  }

  setSource(s) {
    this.source = s;
    return this;
  }

  get destinations() {
    if (this.rep.destinations) {
      return this.rep.destinations.map((dest) => new Repository({
        id: dest.id,
        rep: dest,
        resource: this.client.getRepositoryResource()
      }));
    } else {
      return [];
    }
  }

  async addDestination(rep) {
    const resp = await this.resource.createOrUpdateDestination(this.id, rep);
    this._rep.destinations ||= [];
    this._rep.destinations.push(resp);
  }

  async deleteDestination({ id }) {
    await this.resource.deleteDestination(this.id, id);
  }

  async addSchedule(rep) {
    const resp = await this.resource.createOrUpdateSchedule(this.id, rep);
    this._rep.schedules ||= [];
    this._rep.schedules.push(resp);
  }

  async deleteSchedule({ id }) {
    await this.resource.deleteSchedule(this.id, id);
  }
}

/**
 * Job API Object
 * (C) 2019 Roman Hargrave <roman@hargrave.info>
 */
export class JobResource extends Resource {

  get name() { return "Job"; }

  constructor(params) {
    super(params);
  }

  get resourcePath() { return "/jobs"; }

  findRep(criteria, params) {
    return this.client.requestPaged({
      request: {
        url: this.resourcePath,
        params: {...params, criteria: criteria}
      }
    });
  }

  find(criteria, params) {
    const pagedRequest = this.findRep(criteria, params);
    pagedRequest.transform =
      (data) =>
        data.map((rep) =>
          new Job({
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
    return new Job({
      id: id,
      resource: this
    });
  }

  async createOrUpdate(rep) {
    const resp = await this.client.request({
      method: rep.id ? 'PUT' : 'POST',
      url: rep.id ? UrlJoin(this.resourcePath, rep.id) : this.resourcePath,
      data: rep
    });

    return resp.data;
  }

  async delete(rep) {
    if (rep.id) {
      await this.client.request({
        method: 'DELETE',
        url: UrlJoin(this.resourcePath, rep.id)
      });
    } else {
      throw "delete must be passed a representation with id";
    }
  }

  // Schedule lifecycle

  getDestinationUrl(id) {
    return UrlJoin(this.resourcePath, id, 'destinations');
  }

  async getDestinations(id) {
    return this.client.requestPaged({
      request: {
        url: this.getDestinationUrl(id)
      }
    });
  }

  async createOrUpdateDestination(id, rep) {
    const resp = await this.client.request({
      method: rep.id ? 'PUT' : 'POST',
      url: rep.id ? UrlJoin(this.getDestinationUrl(id), rep.id) : this.getDestinationUrl(id)
    });

    return resp.data;
  }

  async deleteDestination(id, dest) {
    await this.client.request({
      method: 'DELETE',
      url: UrlJoin(this.getDestinationUrl(id), dest)
    });
  }

  getScheduleUrl(id) {
    return UrlJoin(this.resourcePath, id, 'schedules');
  }

  async getSchedules(id) {
    return this.client.requestPaged({
      request: {
        url: this.getScheduleUrl(id)
      }
    });
  }

  async createOrUpdateSchedule(id, rep) {
    const resp = await this.client.request({
      method: rep.id ? 'PUT' : 'POST',
      url: rep.id ? UrlJoin(this.getScheduleUrl(id), rep.id) : this.getScheduleUrl(id)
    });

    return resp.data;
  }

  async deleteSchedule(id, dest) {
    await this.client.request({
      method: 'DELETE',
      url: UrlJoin(this.getScheduleUrl(id), dest)
    });
  }
}
