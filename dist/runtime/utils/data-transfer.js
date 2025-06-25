export async function getFilesFromDataTransferItems(dataTransferItems, options = { raw: false }) {
  const checkErr = (err) => {
    if (getFilesFromDataTransferItems.didShowInfo) return;
    if (err.name !== "EncodingError") return;
    getFilesFromDataTransferItems.didShowInfo = true;
    const infoMsg = `${err.name} occured within datatransfer-files-promise module
Error message: "${err.message}"
Try serving html over http if currently you are running it from the filesystem.`;
    console.warn(infoMsg);
  };
  const readFile = (entry, path = "") => {
    return new Promise((resolve, reject) => {
      entry.file(
        (file) => {
          if (!options.raw) file.filepath = path + file.name;
          resolve(file);
        },
        (err) => {
          checkErr(err);
          reject(err);
        }
      );
    });
  };
  const dirReadEntries = (dirReader, path) => {
    return new Promise((resolve, reject) => {
      dirReader.readEntries(
        async (entries2) => {
          let files2 = [];
          for (let entry of entries2) {
            const itemFiles = await getFilesFromEntry(entry, path);
            files2 = files2.concat(itemFiles);
          }
          resolve(files2);
        },
        (err) => {
          checkErr(err);
          reject(err);
        }
      );
    });
  };
  const readDir = async (entry, path) => {
    const dirReader = entry.createReader();
    const newPath = path + entry.name + "/";
    let files2 = [];
    let newFiles;
    do {
      newFiles = await dirReadEntries(dirReader, newPath);
      files2 = files2.concat(newFiles);
    } while (newFiles.length > 0);
    return files2;
  };
  const getFilesFromEntry = async (entry, path = "") => {
    if (entry.isFile) {
      const file = await readFile(entry, path);
      return [file];
    }
    if (entry.isDirectory) {
      const files2 = await readDir(entry, path);
      return files2;
    }
  };
  let files = [];
  let entries = [];
  for (let i = 0, ii = dataTransferItems.length; i < ii; i++) {
    entries.push(dataTransferItems[i].webkitGetAsEntry());
  }
  for (let entry of entries) {
    const newFiles = await getFilesFromEntry(entry);
    files = files.concat(newFiles);
  }
  return files;
}
