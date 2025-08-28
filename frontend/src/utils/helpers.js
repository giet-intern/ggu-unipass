export const saveBlob = (blobData, filename) => {
  const url = window.URL.createObjectURL(new Blob([blobData]));
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(url);
};
