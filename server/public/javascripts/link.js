window.onload = function () {
  document.querySelector("#copy-btn").addEventListener("click", () => {
    const linkField = document.querySelector("#link");
    linkField.select();
    document.execCommand("copy");
    alert("Link copied!");
  });
};
