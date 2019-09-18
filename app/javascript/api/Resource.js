/**
 * Resource Base Class
 * (C) 2019 Roman Hargrave <roman@hargrave.info>
 */
export default class Resource {

  constructor(params) {
    const { apiClient } = params;
    this.client = apiClient;
  }

  /**
   * Get the name, used by the FileRouterClient to create getXXXResource methods
   * The return value of this should be formatted in upper CamelCase and should not end in 'Resource'
   */
  get name() { return 'Base'; }

  /**
   * Given an implementation-defined parameter object, retrieve a paged list of matching representations
   */
  findRep(params) {}

  /**
   * Given an implementation-defined parameter ebject, retrieve a paged list of matching model objects
   */
  find(params) {}

  /**
   * Given an implementation-defined parameter object, retrieve the primitive representation of the resource
   */
  async getRep(params) {}

  /**
   * Given an implementation-defined parameter object, return a model object of the resource
   */
  get(params) {}

  /**
   * Given the desired primitive representation of the resource, create or update the resource and return the
   * resting primitive representation of the resource
   */
  async createOrUpdate(rep) {}

  /**
   * Given the primitive representation of the resource, delete the resource instance known by that representation
   */
  async delete(rep) {}

}
