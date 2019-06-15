document.addEventListener("DOMContentLoaded", function() {
  document
    .getElementById("get-session")
    .addEventListener("click", QuerySession);
});

function FormDatatoObject(fd) {
  if (!(fd instanceof FormData)) {
    throw "Not FormData";
  }
  let obj = new Object();
  for (let key of fd.keys()) {
    obj[key] = fd.get(key);
  }
  return obj;
}

async function PostQuery(url = "", data = {}) {
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });
    return res.text();
  } catch {
    throw "Post Error";
  }
}

async function GetSession(url = "") {
  try {
    const res = await fetch(url);
    const body = await res.json();
    return body;
  } catch (err) {
    throw err;
  }
}

async function QuerySession(event) {
  console.log(event);
  const output = document.getElementById("session-variables");
  const input = new FormData(document.getElementById("form-test"));
  const obj = FormDatatoObject(input);

  const result = await PostQuery("/session", obj);
  document.getElementById("result").innerText = result;

  if (result == "OK") {
    const res = await GetSession("/session");
    console.log(res);
    document.getElementById("session-variables").innerText = JSON.stringify(
      res,
      null,
      2
    );
  }
}
