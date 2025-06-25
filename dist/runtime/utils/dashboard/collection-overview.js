import { ref } from "#imports";
import {
  primaryLanguage
} from "#pruvious";
import { navigateToPruviousDashboardPath } from "../../composables/dashboard/dashboard.js";
import { uniqueArray } from "../array.js";
import { pruviousFetch } from "../fetch.js";
import { Filter } from "./filter.js";
export class CollectionOverview {
  constructor(collection, filter, selection, language) {
    this.collection = collection;
    this.filter = filter;
    this.selection = selection;
    this.language = language;
    if (collection.translatable) {
      this.filter.setDefaultLanguage(this.language);
    }
    this.prevQuery = this.filter.toString();
    this.defaultFilter.setDefaultLanguage(collection.translatable ? this.language : null).select(this.collection.dashboard.overviewTable.columns.map(({ field }) => field)).order(
      `${this.collection.dashboard.overviewTable.sort.field}:${this.collection.dashboard.overviewTable.sort.direction}`
    ).perPage(this.collection.dashboard.overviewTable.perPage).page(1);
    if (collection.translatable && this.prevQuery === `where=language[=][${this.language}]` || !collection.translatable && !this.prevQuery) {
      this.filter.fromString(this.defaultFilter.toString());
    }
    this.refresh();
  }
  data = ref([]);
  hasDefaultColumns = ref(true);
  total = ref(0);
  currentPage = ref(1);
  lastPage = ref(1);
  loaded = ref(false);
  prevQuery = "";
  defaultFilter = new Filter();
  updateDefaultLanguage(language) {
    this.language = language;
    this.defaultFilter.setDefaultLanguage(language, true);
    this.filter.setDefaultLanguage(language, true);
    this.selection.deselectAll();
    this.refresh();
  }
  async fetchData() {
    this.loaded.value = false;
    const query = this.filter.selectOption.value.includes("id") ? this.filter.toString() : this.filter.clone().select(["id", ...this.filter.selectOption.value]).toString();
    const response = await pruviousFetch(`collections/${this.collection.name}?${query}`);
    if (response.success) {
      this.currentPage.value = response.data.currentPage;
      this.data.value = response.data.records;
      this.lastPage.value = response.data.lastPage;
      this.selection.setData(response.data.records).setTotal(response.data.total);
      this.total.value = response.data.total;
    }
    this.loaded.value = true;
  }
  async updateLocation() {
    const query = this.filter.toString();
    if (this.prevQuery !== this.filter.toString()) {
      this.prevQuery = query;
      this.selection.deselectAll();
      await navigateToPruviousDashboardPath(
        `/collections/${this.collection.name}` + (query && query !== this.defaultFilter.toString() ? `?${query}` : this.language !== primaryLanguage ? `?where=language[=][${this.language}]` : "")
      );
    }
  }
  setFilterFromQueryString(queryString) {
    this.filter.fromString(queryString);
    if (!this.filter.selectOption.value.length) {
      this.filter.select(this.collection.dashboard.overviewTable.columns.map(({ field }) => field));
    }
    if (!this.filter.orderOption.value.length) {
      this.filter.order(
        `${this.collection.dashboard.overviewTable.sort.field}:${this.collection.dashboard.overviewTable.sort.direction}`
      );
    }
    if (!this.filter.perPageOption.value) {
      this.filter.perPage(this.collection.dashboard.overviewTable.perPage);
    }
    if (!this.filter.pageOption.value) {
      this.filter.page(1);
    }
    this.refresh();
  }
  clearFilters() {
    this.filter.fromString(this.defaultFilter.toString());
    this.refresh();
  }
  refresh() {
    this.hasDefaultColumns.value = uniqueArray(this.filter.selectOption.value).sort().join(",") === uniqueArray(this.defaultFilter.selectOption.value).sort().join(",");
  }
}
