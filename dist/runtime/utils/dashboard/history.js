import { ref } from "vue";
import { isEditingText } from "../dom.js";
import { objectOmit } from "../object.js";
export class History {
  undosRemaining = ref(0);
  redosRemaining = ref(0);
  isDirty = ref(false);
  original = ref({});
  states = [];
  initialState = null;
  index = -1;
  constructor(record) {
    if (record) {
      this.add(record);
    }
  }
  add(record, force = false) {
    const state = objectOmit(record, ["createdAt", "updatedAt"]);
    if (!force && isEditingText()) {
      return state;
    }
    const stringified = JSON.stringify(state);
    if (this.states[this.index] !== stringified) {
      if (!this.states.length) {
        this.original.value = JSON.parse(stringified);
        this.initialState = stringified;
      }
      this.states.splice(this.index + 1);
      this.states.push(stringified);
      this.index++;
      this.undosRemaining.value = this.index;
      this.redosRemaining.value = 0;
      this.refresh();
    }
    return state;
  }
  setInitialState(record) {
    const stringified = JSON.stringify(objectOmit(record, ["createdAt", "updatedAt"]));
    this.original.value = JSON.parse(stringified);
    this.initialState = stringified;
    this.refresh();
  }
  undo() {
    if (this.index > 0) {
      this.index--;
      this.undosRemaining.value = this.index;
      this.redosRemaining.value++;
      this.refresh();
      return JSON.parse(this.states[this.index]);
    }
    return null;
  }
  redo() {
    if (this.index < this.states.length - 1) {
      this.index++;
      this.undosRemaining.value = this.index;
      this.redosRemaining.value--;
      this.refresh();
      return JSON.parse(this.states[this.index]);
    }
    return null;
  }
  reset() {
    this.states = [];
    this.original.value = {};
    this.initialState = null;
    this.index = -1;
    this.undosRemaining.value = 0;
    this.redosRemaining.value = 0;
    this.isDirty.value = false;
    return this;
  }
  refresh() {
    this.isDirty.value = this.states[this.index] !== this.initialState;
  }
}
