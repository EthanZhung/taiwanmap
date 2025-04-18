document.addEventListener('DOMContentLoaded', () => {
    // ... (keep all the setup code from before: getting elements, rgbToHex, clearListHighlight, etc.) ...
    const svgMap = document.getElementById('taiwan-svg');
    const countyList = document.getElementById('county-list');
    const labelGroup = document.getElementById('map-labels');
    const labelPointsGroup = document.getElementById('label_points');
    const saveButton = document.getElementById('save-button');
    const saveStatus = document.getElementById('save-status');

    if (!svgMap || !countyList || !labelGroup || !labelPointsGroup || !saveButton || !saveStatus) {
        console.error("Error: One or more essential HTML elements not found!");
        return;
    }

    const paths = svgMap.querySelectorAll('#features path[name]');
    const labelPoints = labelPointsGroup.querySelectorAll('circle[id]');
    const labelCoords = {};
    labelPoints.forEach(circle => {
        labelCoords[circle.id] = {
            cx: circle.getAttribute('cx'),
            cy: circle.getAttribute('cy')
        };
    });

    // --- Helper function: RGB to Hex ---
    function rgbToHex(rgb) {
        if (!rgb || rgb === 'none' || !rgb.startsWith('rgb')) return '#eeeeee';
        try {
            let sep = rgb.indexOf(",") > -1 ? "," : " ";
            rgb = rgb.substr(4).split(")")[0].split(sep);
            let r = (+rgb[0]).toString(16), g = (+rgb[1]).toString(16), b = (+rgb[2]).toString(16);
            if (r.length == 1) r = "0" + r; if (g.length == 1) g = "0" + g; if (b.length == 1) b = "0" + b;
            if (r.length > 2 || g.length > 2 || b.length > 2) { return '#eeeeee'; }
            return "#" + r + g + b;
        } catch (error) { return '#eeeeee'; }
    }

    // --- Helper function: Clear List Highlight ---
    function clearListHighlight() {
        document.querySelectorAll('#county-list li').forEach(li => li.style.backgroundColor = 'transparent');
    }

    // --- Generate Controls and Labels --- (Keep the forEach loop as before)
    paths.forEach(path => {
        // ... (code for creating controls and labels remains the same) ...
        const countyId = path.id;
        const countyName = path.getAttribute('name');
        const defaultColor = '#eeeeee';

        if (!countyId || !countyName) { return; } // Skip if missing attrs

        // Control List Item...
        const listItem = document.createElement('li');
        listItem.dataset.countyId = countyId;
        const label = document.createElement('label');
        label.textContent = countyName;
        label.setAttribute('for', `color-${countyId}`);
        const colorInput = document.createElement('input');
        colorInput.type = 'color';
        colorInput.id = `color-${countyId}`;
        let initialColor = rgbToHex(window.getComputedStyle(path).fill) || defaultColor;
        colorInput.value = initialColor;
        colorInput.dataset.countyId = countyId;

        colorInput.addEventListener('input', (event) => { /* ... */
             const selectedPath = svgMap.getElementById(event.target.dataset.countyId);
             if (selectedPath) { selectedPath.style.fill = event.target.value; }
             clearListHighlight(); listItem.style.backgroundColor = '#e0f2ff';
        });
        path.addEventListener('click', () => { /* ... */
            colorInput.click(); clearListHighlight(); listItem.style.backgroundColor = '#e0f2ff';
            listItem.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        });
        listItem.addEventListener('click', (event) => { /* ... */
             if (event.target !== colorInput) { clearListHighlight(); listItem.style.backgroundColor = '#e0f2ff'; }
        });

        listItem.appendChild(label); listItem.appendChild(colorInput); countyList.appendChild(listItem);

        // SVG Text Label...
         if (labelCoords[countyId]) {
            const coords = labelCoords[countyId];
            const textElement = document.createElementNS("http://www.w3.org/2000/svg", "text");
			
			// --- Adjust coordinates START ---
            // Convert original coords to numbers for calculation
			
			let adjustedX = parseFloat(coords.cx);
            let adjustedY = parseFloat(coords.cy);
			
			// Define how much to shift (adjust these values as needed)
            const taipeiKeelungOffset = 8;  // Pixels in SVG coordinate space
            const chiayiOffset = 6;         // Pixels in SVG coordinate space
			
			if (countyId === 'TWTPE') { // Taipei City: Move slightly Left & Down
                    adjustedX -= taipeiKeelungOffset / 1.5;
                    adjustedY += taipeiKeelungOffset / 2;
            } 
			else if (countyId === 'TWKEE') { // Keelung City: Move slightly Right & Up
                    adjustedX += taipeiKeelungOffset;
                    adjustedY -= taipeiKeelungOffset / 1.5;
            } 
			else if (countyId === 'TWCYQ') { // Chiayi County: Move slightly Down & Left
                    adjustedX -= chiayiOffset / 2 ;
                    adjustedY += chiayiOffset;
            } 
			else if (countyId === 'TWCYI') { // Chiayi City: Move slightly Up & Right
                    adjustedX += chiayiOffset;
                    adjustedY -= chiayiOffset / 2;
            }
            textElement.setAttribute('x', adjustedX); 
			textElement.setAttribute('y', adjustedY);
			textElement.setAttribute('class', 'map-label');
			
			
            textElement.setAttribute('class', 'map-label');
            let displayName = countyName; // Adjust display name logic here if needed...
             if (countyName === "Kinmen") displayName = "金門";
             else if (countyName === "Matsu Islands") displayName = "馬祖"; // Note: SVG might use "Lienchiang"
             else if (countyName === "Penghu") displayName = "澎湖";
             else if (countyName === "Taipei City") displayName = "臺北";
             else if (countyName === "New Taipei City") displayName = "新北";
             else if (countyName === "Keelung City") displayName = "基隆";
             else if (countyName === "Taoyuan") displayName = "桃園"; // Often referred to as Taoyuan City now
             else if (countyName === "Hsinchu City") displayName = "新竹市";
             else if (countyName === "Hsinchu") displayName = "新竹縣"; // Assumes this is Hsinchu County
             else if (countyName === "Miaoli") displayName = "苗栗"; // Assumes Miaoli County
             else if (countyName === "Taichung City") displayName = "臺中";
             else if (countyName === "Changhua") displayName = "彰化"; // Assumes Changhua County
             else if (countyName === "Nantou") displayName = "南投"; // Assumes Nantou County
             else if (countyName === "Yunlin") displayName = "雲林"; // Assumes Yunlin County
             else if (countyName === "Chiayi City") displayName = "嘉義市";
             else if (countyName === "Chiayi") displayName = "嘉義縣"; // Assumes Chiayi County
             else if (countyName === "Tainan City") displayName = "臺南市";
             else if (countyName === "Kaohsiung City") displayName = "高雄市";
             else if (countyName === "Pingtung") displayName = "屏東縣"; // Assumes Pingtung County
             else if (countyName === "Yilan") displayName = "宜蘭縣"; // Assumes Yilan County
             else if (countyName === "Hualien") displayName = "花蓮縣"; // Assumes Hualien County
             else if (countyName === "Taitung") displayName = "臺東市"; // Assumes Taitung County
             else displayName = countyName.replace(' County', '').replace(' City', '');

            textElement.textContent = displayName;
            labelGroup.appendChild(textElement);
        }

        // Ensure initial fill...
        if (!path.style.fill || path.style.fill === 'none') { path.style.fill = initialColor; }
    });

    // --- Final check for path fills ---
    svgMap.querySelectorAll('#features path[name]').forEach(path => {
        if (!path.style.fill || path.style.fill === 'none') { path.style.fill = '#eeeeee'; }
    });

    // --- Save Button Functionality ---
    saveButton.addEventListener('click', () => {
        saveStatus.textContent = '正在準備 SVG...';
        saveButton.disabled = true;

        try{
            const svgElement = document.getElementById('taiwan-svg');
            if(!svgElement) {
                saveStatus.textContent = '錯誤: 找不到 SVG 元素.';
                saveButton.disabled = false;
                return;
            }

            // Ensure all paths have proper stroke and stroke-width
            const paths = svgElement.querySelectorAll('path');
            paths.forEach(path => {
                if (!path.hasAttribute('stroke')) {
                    path.setAttribute('stroke', '#000000'); // Set border color to black
                }
                if (!path.hasAttribute('stroke-width')) {
                    path.setAttribute('stroke-width', '1'); // Set border width
                }
            });

            // Serialize the SVG element
            const svgString = new XMLSerializer().serializeToString(svgElement);

            // Create a Blob from the SVG string
            const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });

            // Create a downloadable link
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = 'taiwan_map_colored.svg';

            // Trigger the download
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            saveStatus.textContent = 'SVG 儲存成功!';
            setTimeout(() => saveStatus.textContent = '', 3000);

        } catch (error) {
            console.error("Error saving SVG:", error);
            saveStatus.textContent = '儲存 SVG 時發生錯誤.';
        } finally {
            saveButton.disabled = false;
        }

        setTimeout(() => { // Keep the timeout for UI update
            try {
                const svgElement = document.getElementById('taiwan-svg');
                const svgString = new XMLSerializer().serializeToString(svgElement);
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                const desiredWidth = 2000;
                const svgViewBox = svgElement.viewBox.baseVal;

                 // Add check for svgViewBox existence
                 if (!svgViewBox || svgViewBox.height === 0) {
                    console.error("SVG viewBox not found or has zero height.");
                    saveStatus.textContent = '錯誤: SVG 尺寸資訊不完整.';
                    saveButton.disabled = false;
                    return;
                 }

            } catch (error) {
                console.error("Error during save process:", error);
                saveStatus.textContent = '儲存時發生錯誤.';
                saveButton.disabled = false;
            }
        }, 50);
    });
});