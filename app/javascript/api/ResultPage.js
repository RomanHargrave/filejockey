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
    this._transform   = transform || ((page) => page);

    this.request.headers  ||= {};

    if (items) {
      this.request.headers['Page-Items'] = items;
    }

    if (page) {
      this.request.headers['Current-Page'] = page;
    }
  }

  /**
   * Return this page of the response
   */
  async getResponse() {
    if (!this._response) {
      this._response = await this.axios(this.config)
    }
    return this.response;
  }

  get response() {
    return getResponse();
  }

  get transform() {
    return this._transform;
  }

  set transform(f) {
    this._transform = f;
  }

  get data() {
    return this.transform(this.response.data);
  }

  get currentPage() {
    return this.response.headers['Current-Page'];
  }

  set currentPage(page) {
    this._response = undefined;
    this.request.headers['Current-Page'] = page;
  }

  get pages() {
    return this.response.headers['Total-Pages'];
  }

  get count() {
    return this.response.headers['Total-Count'];
  }

  getItemsPerPage() {
    return this.repsonse.headers['Page-Items'];
  }

  setItemsPerPage(items) {
    this._response = undefined;
    this.request.headers['Page-Items'] = items;
  }

  nextPage() {
    const nextPage = new ResultPage({
      axios: this.axios,
      request: this.request,
      transform: this.transform,
      items: this.request.headers['Page-Items']
    });

    nextPage.currentPage = this.currentPage + 1

    return nextPage;
  }
}

