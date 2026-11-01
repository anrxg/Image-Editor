let filters = {
    brightness: { value: 100, min: 0, max: 200, unit: "%" },
    contrast: { value: 100, min: 0, max: 200, unit: "%" },
    saturation: { value: 100, min: 0, max: 200, unit: "%" },
    hueRotation: { value: 0, min: 0, max: 360, unit: "deg" },
    blur: { value: 0, min: 0, max: 20, unit: "px" },
    grayscale: { value: 0, min: 0, max: 100, unit: "%" },
    sepia: { value: 0, min: 0, max: 100, unit: "%" },
    opacity: { value: 100, min: 0, max: 100, unit: "%" },
    invert: { value: 0, min: 0, max: 100, unit: "%" }
};
const presets = {
    vintage: {
        brightness: 110, contrast: 120, saturation: 80,
        hueRotation: 10, blur: 0, grayscale: 0, sepia: 40,
        opacity: 100, invert: 0
    },
    bw: {
        brightness: 100, contrast: 130, saturation: 0,
        hueRotation: 0, blur: 0, grayscale: 100, sepia: 0,
        opacity: 100, invert: 0
    },
    cyberpunk: {
        brightness: 120, contrast: 150, saturation: 180,
        hueRotation: 280, blur: 0, grayscale: 0, sepia: 0,
        opacity: 100, invert: 0
    },
    cinematic: {
        brightness: 90, contrast: 140, saturation: 90,
        hueRotation: -10, blur: 0, grayscale: 0, sepia: 20,
        opacity: 100, invert: 0
    },
    warmth: {
        brightness: 105, contrast: 110, saturation: 110,
        hueRotation: 20, blur: 0, grayscale: 0, sepia: 30,
        opacity: 100, invert: 0
    },
    cool: {
        brightness: 100, contrast: 110, saturation: 90,
        hueRotation: 180, blur: 0, grayscale: 0, sepia: 0,
        opacity: 100, invert: 0
    },
    dramatic: {
        brightness: 110, contrast: 170, saturation: 120,
        hueRotation: 0, blur: 0, grayscale: 0, sepia: 0,
        opacity: 100, invert: 0
    },
    fade: {
        brightness: 105, contrast: 85, saturation: 80,
        hueRotation: 0, blur: 0, grayscale: 0, sepia: 15,
        opacity: 100, invert: 0
    },
    dreamy: {
        brightness: 110, contrast: 90, saturation: 110,
        hueRotation: 0, blur: 3, grayscale: 0, sepia: 0,
        opacity: 100, invert: 0
    },
    invert: {
        brightness: 100, contrast: 100, saturation: 100,
        hueRotation: 0, blur: 0, grayscale: 0, sepia: 0,
        opacity: 100, invert: 100
    }
};

const imageCanvas = document.querySelector("#image-canvas");
const imageInput = document.querySelector("#image-input");
const canvasCtx = imageCanvas.getContext("2d");
const imgPlaceholder = document.querySelector(".placeholder");
const filtersContainer = document.querySelector(".filters");
const presetsContainer = document.querySelector(".presets");
const resetBtn = document.querySelector("#reset-btn");
const downloadBtn = document.querySelector("#download-btn");

let image = new Image();

function CreateFilterElement(name, unit = "%", value, min, max) {
    const div = document.createElement("div");
    div.classList.add("filter");

    const p = document.createElement("p");
    p.innerText = name;

    const input = document.createElement("input");
    input.type = "range";
    input.min = min;
    input.max = max;
    input.value = value;
    input.id = name;

    input.addEventListener("input", () => {
        filters[name].value = input.value;
        ApplyFilters();
    });

    div.appendChild(p);
    div.appendChild(input);
    return div;
}
function CreateFilters() {
    Object.keys(filters).forEach(key => {
        const filterElement = CreateFilterElement(
            key,
            filters[key].unit,
            filters[key].value,
            filters[key].min,
            filters[key].max
        );
        filtersContainer.appendChild(filterElement);
    });
}
CreateFilters();

imageInput.addEventListener("change", (e) => {
    const imgFile = e.target.files[0];
    if (!imgFile) return;

    image.src = URL.createObjectURL(imgFile);
    image.onload = () => {
        imgPlaceholder.style.display = "none";
        imageCanvas.width = image.width;
        imageCanvas.height = image.height;
        ApplyFilters();
    };
});

function ApplyFilters() {
    if (!image.src) return;

    canvasCtx.clearRect(0, 0, imageCanvas.width, imageCanvas.height);
    canvasCtx.filter = `
        brightness(${filters.brightness.value}${filters.brightness.unit})
        contrast(${filters.contrast.value}${filters.contrast.unit})
        saturate(${filters.saturation.value}${filters.saturation.unit})
        hue-rotate(${filters.hueRotation.value}${filters.hueRotation.unit})
        blur(${filters.blur.value}${filters.blur.unit})
        grayscale(${filters.grayscale.value}${filters.grayscale.unit})
        sepia(${filters.sepia.value}${filters.sepia.unit})
        opacity(${filters.opacity.value}${filters.opacity.unit})
        invert(${filters.invert.value}${filters.invert.unit})
    `;
    canvasCtx.drawImage(image, 0, 0);
}

resetBtn.addEventListener("click", () => {
    filters.brightness.value = 100;
    filters.contrast.value = 100;
    filters.saturation.value = 100;
    filters.hueRotation.value = 0;
    filters.blur.value = 0;
    filters.grayscale.value = 0;
    filters.sepia.value = 0;
    filters.opacity.value = 100;
    filters.invert.value = 0;

    ApplyFilters();
    filtersContainer.innerHTML = "";
    CreateFilters();
})

downloadBtn.addEventListener("click", ()=>{
    const link = document.createElement("a");
    link.download = "edited-image.png";
    link.href = imageCanvas.toDataURL();
    link.click();
})

Object.keys(presets).forEach(presetName => {
    const presetBtn = document.createElement("button");
    presetBtn.innerText = presetName;
    presetBtn.classList.add("preset-btn");
    presetsContainer.appendChild(presetBtn);

    presetBtn.addEventListener("click", () => {
        const preset = presets[presetName];
        Object.keys(preset).forEach(filterName => {
            filters[filterName].value = preset[filterName];
            ApplyFilters();
            filtersContainer.innerHTML = "";
            CreateFilters();
        })
    })
})