import { axios as axiosDefault } from "axios"

/**
 * Result Pager
 * Streamlines pagy interaction
 * (C) 2019 Roman Hargrave <roman@hargrave.info>
 */
export default class ResultPage {

  /**
   * Construct the result page wrapper.
   * @param params.axios axios instance
   * @param params.request axios request configuration
   * @param params.transform result transformer, accepts the entire result data and returns the transformed value
   */
  constructor(params) {
    const {axios, request, transform, items, page} = params;
    this.axios        = axios || axiosDefault;
    this.request_orig = Object.assign({}, request); // Make a copy of the request, because we will change its contents
    this.request      = Object.assign({}, request); // This will be used for state, the previous will be used for paging
    this._transform   = transform || (page => page);

    this.request.params ||= {};

    if (items) {
      this.pageSize = items;
    }

    if (page) {
      this.page = page;
    }
  }

  /**
   * Get the transform function
   */
  get transform() { return this._transform; }

  /**
   * Set the transform function.
   * @param f Function - Undefined/false can be given to reset the transform to an identity function
   */
  set transform(f) { this._transform = f || (x => x); }

  /**
   * Set the request page
   * @param page Page number
   */
  set page(page) {
    this._response = undefined;

    // Pagy uses 1-based pages, but MUI uses zero.
    // It's more convenient to use zero-based numbers and convert them.
    this.request.params.page = page + 1;
  }

  /**
   * Set the (zero-based!) page size
   * @param size Page size (items/page)
   */
  set pageSize(size) {
    this._response = undefined;
    this.request.params.pageSize = size;
  }

  /**
   * Return promise to yield raw repsonse object
   * Client code should not call this, and instead prefer the wrapper methods:
   *  - getData()
   *  - getCurrentPage()
   *  - getPageCount()
   *  - getResultCount()
   *  - getItemsPerPage()
   */
  async getResponse() {
    if (!this._response) {
      this._response = await this.axios(this.request)
    }
    return await this._response;
  }

  /**
   * Get response data after having run it through the transform function
   */
  async getData() {
    return this.transform((await this.getResponse()).data);
  }

  async getCurrentPage() {
    return parseInt((await this.getResponse()).headers['current-page'] || '0', 10);
  }

  async getPageCount() {
    return parseInt((await this.getResponse()).headers['total-pages'] || '1', 10);
  }

  async getResultCount() {
    return parseInt((await this.getResponse()).headers['total-count'] || '0', 10);
  }

  async getItemsPerPage() {
    return parseInt((await this.getResponse()).headers['page-items'] || '0', 10);
  }
}

