document.getElementById("apply_css").addEventListener("click", () => {
  const customCSS = document.getElementById("custom_css").value;
  chrome.storage.sync.set({ customCSS }, () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        files: ["content.js"],
      });
    });
  });
});


function applyCustomCSS(customCSS) {
  const style = document.createElement("style");
  style.textContent = customCSS;
  document.head.append(style);
}

// Replace the existing event listener for the "Generate CSS" button in popup.js
document.getElementById("generate_css").addEventListener("click", async () => {
  const apiKey = document.getElementById("api_key").value;
  const layoutDescription = document.getElementById("layout_description").value;

  if (!apiKey) {
    alert("Please enter your API key.");
    return;
  }

  try {
    const generatedCSS = await generateCSS(apiKey, layoutDescription);

    // Insert the generated CSS as actual text in the custom CSS textarea
    document.getElementById("custom_css").value = generatedCSS;
  } catch (error) {
    console.error(error);
  }
});



async function generateCSS(apiKey, layoutDescription) {
  const requestData = {
    model: "text-davinci-003",
    prompt: `Turn the following layout description into CSS that directly modifies html tags. The text is modified with e.g. p { ... }, h3 { ... }, div { ... } etc.. You may return only the valid CSS nothing else. This prompt output shoud not cantain any descriptions or anything else that would cause errors. Example: Prompt: "green background" Response: "body { background-color: green; }": ${layoutDescription}`,
    temperature: 0.7,
    max_tokens: 150,
  };

  const response = await fetch("https://api.openai.com/v1/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(requestData),
  });

  if (!response.ok) {
    throw new Error("Error fetching data from OpenAI API");
  }

  const data = await response.json();
  return data.choices[0].text.trim();
}


// Add this event listener to your existing popup.js file
document.getElementById("save_api_key").addEventListener("click", () => {
  const apiKey = document.getElementById("api_key").value;
  if (!apiKey) {
    alert("Please enter your API key.");
    return;
  }

  chrome.storage.sync.set({ apiKey }, () => {
    alert("API key saved.");
  });
});

// Retrieve the stored API key when the popup is opened
chrome.storage.sync.get("apiKey", (data) => {
  if (data.apiKey) {
    document.getElementById("api_key").value = data.apiKey;
  }
});

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("reset_css").addEventListener("click", () => {
    // Set a subtle, random CSS rule
    const subtleCSS = "p { font-family: sans-serif; }";
    document.getElementById("custom_css").value = subtleCSS;

    // Apply the subtle CSS
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        files: ["content.js"],
      });

      
        
        const customCSS = document.getElementById("custom_css").value;
        chrome.storage.sync.set({ customCSS }, () => {
          chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            chrome.scripting.executeScript({
              target: { tabId: tabs[0].id },
              files: ["content.js"],
            });
          });
        });
        // Refresh the page
      chrome.tabs.reload(tabs[0].id);
    });

    // Clear local storage data except the API key
    const apiKey = localStorage.getItem("api_key");
    localStorage.clear();
    localStorage.setItem("api_key", apiKey);

    // Uncomment the following line if you have a loadAPIKey function defined.
    // loadAPIKey();
  });
});



function resetCustomCSS() {
  const customStyleElement = document.getElementById("chrome-extension-custom-style");
  if (customStyleElement) {
    customStyleElement.remove();
  }
}


document.getElementById("no_api_key").addEventListener("click", () => {
  chrome.tabs.create({ url: "https://platform.openai.com/account/api-keys" });
});
