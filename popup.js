const colorBox = document.querySelector(".popupColorView");
const colorValue = document.querySelector(".popupColorHexValue");
const notify = document.querySelector(".popupNotify");

async function pickingColorFunction() {
  // Fetch data from google storage by use of service-worker
  const defaultColor = chrome.storage.sync.get("color", ({ color }) => {
    console.log(color);
  });
  // Get the current active tab
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  // Executing the chrome scripts
  chrome.scripting.executeScript(
    {
      target: { tabId: tab.id },
      func: pickColor,
    },
    async (res) => {
      const [data] = res;
      if (data.result) {
        const color = data.result.sRGBHex;
        colorBox.style.backgroundColor = color;
        colorValue.innerHTML = color;
        notify.innerHTML = "Copied to clipboard !";
        navigator.clipboard.writeText(color);
        setTimeout(() => {
          notify.innerHTML = "";
        }, 2500);
      }
    }
  );
}

async function pickColor() {
  try {
    const eyeDropper = new EyeDropper();
    return await eyeDropper.open();
  } catch (err) {
    console.log(err);
  }
}

document
  .getElementById("pickerBox")
  .addEventListener("click", pickingColorFunction);
