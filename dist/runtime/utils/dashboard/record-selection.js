import { ref } from "#imports";
import { pruviousToasterShow } from "../../composables/dashboard/toaster.js";
import { __ } from "../../composables/translatable-strings.js";
import { pruviousFetch } from "../fetch.js";
import { isNumber } from "../number.js";
export class RecordSelection {
  constructor(collection, data = []) {
    this.collection = collection;
    this.data = data;
  }
  selected = ref({});
  count = ref(0);
  selectedAll = ref(false);
  type = ref({ singular: "", plural: "" });
  currentType = ref("");
  origin = null;
  total = 0;
  allIds = [];
  setData(data) {
    this.data = data;
    for (const id of Object.keys(this.selected.value)) {
      if (!this.selected.value[id]) {
        delete this.selected.value[id];
      }
    }
    this.refresh();
    return this;
  }
  setTotal(total) {
    this.total = total;
    return this;
  }
  select(record, event) {
    const id = isNumber(record) ? record : record.id;
    if (event?.shiftKey && this.origin) {
      event.preventDefault();
      this.deselectAll();
      let state = 0;
      for (const record2 of this.data) {
        if (record2.id === id) {
          state++;
        }
        if (record2.id === this.origin) {
          state++;
        }
        if (state) {
          this.selected.value[id] = true;
        }
        if (state === 2) {
          break;
        }
      }
    } else {
      this.selected.value[id] = true;
    }
    this.refresh();
    return this;
  }
  selectAllOnThisPage() {
    this.allIds = [];
    this.selected.value = Object.fromEntries(this.data.map(({ id }) => [id, true]));
    this.selectedAll.value = false;
    this.refresh();
    return this;
  }
  async selectAll(filter) {
    const query = { select: "id" };
    if (JSON.stringify(filter.whereOption.value) !== JSON.stringify({ $and: [] })) {
      query.where = filter.stringifyWhere();
    }
    if (filter.searchOption.value.length) {
      query.search = filter.searchOption.value.join(",");
    }
    const response = await pruviousFetch(
      `collections/${this.collection.name}`,
      { query }
    );
    if (response.success && response.data.records.length) {
      this.allIds = response.data.records.map(({ id }) => id);
      this.selected.value = Object.fromEntries(this.data.map(({ id }) => [id, true]));
      this.selectedAll.value = true;
    } else {
      this.allIds = [];
      this.selected.value = {};
      this.selectedAll.value = false;
    }
    this.refresh();
    return this;
  }
  deselect(record, event) {
    const id = isNumber(record) ? record : record.id;
    if (event?.shiftKey && this.origin) {
      this.select(record, event);
    } else {
      delete this.selected.value[id];
    }
    this.allIds = [];
    this.selectedAll.value = false;
    this.refresh();
    return this;
  }
  deselectAll() {
    this.allIds = [];
    this.selected.value = {};
    this.count.value = 0;
    this.selectedAll.value = false;
    this.currentType.value = "";
    return this;
  }
  async delete() {
    const response = await pruviousFetch(`collections/${this.collection.name}`, {
      method: "delete",
      query: {
        select: "id",
        where: this.selectedAll.value ? `id[in][${this.allIds.join(",") || Object.keys(this.selected.value).join(",")}]` : `id[in][${Object.keys(this.selected.value).join(",")}]`
      }
    });
    if (response.success && response.data.length) {
      pruviousToasterShow({
        message: __("pruvious-dashboard", "Deleted $count $items", {
          count: response.data.length,
          items: response.data.length === 1 ? this.type.value.singular : this.type.value.plural
        })
      });
    }
    this.deselectAll();
  }
  clone() {
    const selection = new RecordSelection(this.collection, this.data);
    selection.allIds = this.allIds;
    selection.count.value = this.count.value;
    selection.currentType.value = this.currentType.value;
    selection.selected.value = { ...this.selected.value };
    selection.selectedAll.value = this.selectedAll.value;
    selection.total = this.total;
    selection.type.value = { ...this.type.value };
    return selection;
  }
  refresh() {
    this.count.value = this.selectedAll.value ? this.total : Object.keys(this.selected.value).length;
    this.origin = this.count.value ? this.data.find(({ id }) => this.selected.value[id])?.id ?? null : null;
    this.selectedAll.value = !!this.count.value && this.count.value === this.total;
    this.type.value = {
      singular: this.collection.label.record.singular,
      plural: this.collection.label.record.plural
    };
    this.currentType.value = this.count.value === 1 ? this.type.value.singular : this.type.value.plural;
  }
}
