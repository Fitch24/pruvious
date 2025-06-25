export class CodeGenerator {
  content = [];
  indent = 0;
  trimStartIndent = false;
  newLine(content) {
    if (this.content.length) {
      this.indent += this.resolveBrackets(this.content.length - 1);
      this.trim(this.content.length - 1);
    }
    if (this.content.length > 1 && !this.content[this.content.length - 1] && !this.content[this.content.length - 2]) {
      this.content.pop();
    }
    if (content?.trimStart().startsWith("/**") && this.content[this.content.length - 1] && !this.content[this.content.length - 1].endsWith("{")) {
      this.newLine();
    }
    if (content?.trimStart().startsWith("}") && this.content[this.content.length - 1] && this.content[this.content.length - 1].trimEnd().endsWith("{") || content?.trimStart().startsWith("]") && this.content[this.content.length - 1] && this.content[this.content.length - 1].trimEnd().endsWith("[")) {
      this.content[this.content.length - 1] += content;
      this.indent--;
    } else {
      this.content.push("  ".repeat(Math.max(0, this.indent)) + (content || ""));
    }
    return this;
  }
  newDecl(content) {
    return this.newLine().newLine(content);
  }
  add(content) {
    if (this.content.length) {
      this.content[this.content.length - 1] += content;
    } else {
      this.newLine(content);
    }
    return this;
  }
  addCode(code) {
    this.add(code.shift() || "");
    for (const line of code) {
      this.newLine(line);
    }
    return this;
  }
  getContent() {
    const trimmed = this.newLine().content.join("\n").trim();
    return trimmed ? trimmed + "\n" : trimmed;
  }
  trim(index) {
    this.content[index] = this.content[index].trimEnd();
    if (this.trimStartIndent) {
      if (this.content[index].startsWith("  ")) {
        this.content[index] = this.content[index].slice(2);
      }
      this.trimStartIndent = false;
    }
  }
  resolveBrackets(index) {
    const first = this.content[index].trimStart()[0] ?? "";
    const last = this.content[index].trimEnd()[this.content[index].length - 1] ?? "";
    if (first === "*") {
      return 0;
    }
    let indent = 0;
    if (last === "{" || last === "[") {
      indent++;
    }
    if (first === "}" || first === "]") {
      indent--;
      if (index > 0) {
        this.trimStartIndent = true;
      }
    }
    return indent;
  }
  clear() {
    this.content = [];
    this.indent = 0;
    this.trimStartIndent = false;
    return this;
  }
}
