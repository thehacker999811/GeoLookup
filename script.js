function showResult(html) {
    document.getElementById("output").innerHTML = html;
}


/* =========================
   MY COORDINATES
   ========================= */

window.getLocation = function () {

    showResult("📍 Requesting your location...");

    if (!navigator.geolocation) {
        showResult("❌ Location is not supported by this browser.");
        return;
    }

    navigator.geolocation.getCurrentPosition(

        function (position) {

            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            const accuracy = position.coords.accuracy;

            showResult(`
                <b>Latitude:</b> ${latitude}<br>
                <b>Longitude:</b> ${longitude}<br>
                <b>Accuracy:</b> ${Math.round(accuracy)} meters
            `);
        },

        function (error) {

            if (error.code === 1) {
                showResult("❌ Location permission was denied.");
            } else {
                showResult("❌ Could not get your location.");
            }
        },

        {
            enableHighAccuracy: true,
            timeout: 15000,
            maximumAge: 0
        }
    );
};


/* =========================
   COORDINATE LOOKUP
   ========================= */

window.coordinateLookup = async function () {

    const input =
        document.getElementById("coordinateInput").value.trim();

    if (!input) {
        showResult("⚠️ Enter coordinates first.");
        return;
    }

    const parts = input.split(",");

    if (parts.length !== 2) {
        showResult(
            "❌ Enter coordinates like:<br>" +
            "43.0371, -81.1540"
        );
        return;
    }

    const latitude = parseFloat(parts[0].trim());
    const longitude = parseFloat(parts[1].trim());

    if (
        Number.isNaN(latitude) ||
        Number.isNaN(longitude) ||
        latitude < -90 ||
        latitude > 90 ||
        longitude < -180 ||
        longitude > 180
    ) {
        showResult("❌ Invalid coordinates.");
        return;
    }

    showResult("🧭 Looking up the address...");

    try {

        const url =
            "https://nominatim.openstreetmap.org/reverse" +
            "?format=jsonv2" +
            "&lat=" + encodeURIComponent(latitude) +
            "&lon=" + encodeURIComponent(longitude);

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error("Lookup failed");
        }

        const data = await response.json();

        showResult(`
            <b>Latitude:</b> ${latitude}<br>
            <b>Longitude:</b> ${longitude}<br><br>
            <b>Address:</b><br>
            ${data.display_name || "Address not found"}
        `);

    } catch (error) {

        showResult("❌ Unable to find the address.");
    }
};


/* =========================
   IP LOOKUP
   ========================= */

window.ipLookup = async function () {

    const ip =
        document.getElementById("ipInput").value.trim();

    if (!ip) {
        showResult("⚠️ Enter an IP address first.");
        return;
    }

    showResult("🌐 Looking up IP address...");

    try {

        const response =
            await fetch(
                "https://ipapi.co/" +
                encodeURIComponent(ip) +
                "/json/"
            );

        if (!response.ok) {
            throw new Error("Lookup failed");
        }

        const data = await response.json();

        if (data.error) {
            throw new Error("Invalid IP");
        }

        showResult(`
            <b>IP Address:</b> ${data.ip || "Unknown"}<br>
            <b>City:</b> ${data.city || "Unknown"}<br>
            <b>Region:</b> ${data.region || "Unknown"}<br>
            <b>Country:</b> ${data.country_name || "Unknown"}<br>
            <b>Postal:</b> ${data.postal || "Unknown"}<br>
            <b>Organization:</b> ${data.org || "Unknown"}<br>
            <b>ASN:</b> ${data.asn || "Unknown"}<br>
            <b>Timezone:</b> ${data.timezone || "Unknown"}
        `);

    } catch (error) {

        showResult("❌ Unable to look up that IP address.");
    }
};


/* =========================
   ISP LOOKUP
   ========================= */

window.ispLookup = async function () {

    const ip =
        document.getElementById("ispInput").value.trim();

    if (!ip) {
        showResult("⚠️ Enter an IP address first.");
        return;
    }

    showResult("🛰️ Looking up network provider...");

    try {

        const response =
            await fetch(
                "https://ipapi.co/" +
                encodeURIComponent(ip) +
                "/json/"
            );

        if (!response.ok) {
            throw new Error("Lookup failed");
        }

        const data = await response.json();

        showResult(`
            <b>IP Address:</b> ${data.ip || "Unknown"}<br>
            <b>Organization:</b> ${data.org || "Unknown"}<br>
            <b>ASN:</b> ${data.asn || "Unknown"}<br>
            <b>Country:</b> ${data.country_name || "Unknown"}<br>
            <b>Region:</b> ${data.region || "Unknown"}
        `);

    } catch (error) {

        showResult("❌ Unable to look up the ISP.");
    }
};


/* =========================
   PHONE NUMBER LOOKUP
   ========================= */

window.phoneLookup = function () {

    const input =
        document.getElementById("phoneInput").value.trim();

    if (!input) {
        showResult("⚠️ Enter a phone number first.");
        return;
    }

    try {

        const parsed =
            libphonenumber.parsePhoneNumber(input);

        if (!parsed) {
            throw new Error("Invalid number");
        }

        const valid = parsed.isValid();
        const possible = parsed.isPossible();

        const country =
            parsed.country || "Unknown";

        const callingCode =
            parsed.countryCallingCode || "Unknown";

        let numberType = "Unknown";

        if (typeof parsed.getType === "function") {
            numberType = parsed.getType() || "Unknown";
        }

        const formatted =
            parsed.formatInternational();

        showResult(`
            <b>Number:</b> ${formatted}<br>
            <b>Country:</b> ${country}<br>
            <b>Calling Code:</b> +${callingCode}<br>
            <b>Valid Format:</b> ${valid ? "Yes" : "No"}<br>
            <b>Possible Number:</b> ${possible ? "Yes" : "No"}<br>
            <b>Number Type:</b> ${numberType}
        `);

    } catch (error) {

        showResult(`
            ❌ <b>Invalid phone number</b><br><br>
            Try using international format, for example:<br>
            <b>+1 519 555 1234</b>
        `);
    }
};


/* =========================
   ENTER KEY SUPPORT
   ========================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        const ipInput =
            document.getElementById("ipInput");

        const coordinateInput =
            document.getElementById("coordinateInput");

        const ispInput =
            document.getElementById("ispInput");

        const phoneInput =
            document.getElementById("phoneInput");


        ipInput.addEventListener(
            "keydown",
            function (event) {
                if (event.key === "Enter") {
                    ipLookup();
                }
            }
        );


        coordinateInput.addEventListener(
            "keydown",
            function (event) {
                if (event.key === "Enter") {
                    coordinateLookup();
                }
            }
        );


        ispInput.addEventListener(
            "keydown",
            function (event) {
                if (event.key === "Enter") {
                    ispLookup();
                }
            }
        );


        phoneInput.addEventListener(
            "keydown",
            function (event) {
                if (event.key === "Enter") {
                    phoneLookup();
                }
            }
        );
    }
);
