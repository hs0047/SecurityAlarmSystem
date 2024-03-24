const TOWER_CONFIG = {
    1: { towerId: "Jaipur", location: { lat: 26.907524, long: 75.739639 } },
    2: { towerId: "Nanjangud", location: { lat: 12.120000, long: 76.680000 } },
    3: { towerId: "Chittorgarh", location: { lat: 24.879999, long: 74.629997 } },
    4: { towerId: "Ratnagiri", location: { lat: 16.994444, long: 73.300003 } },
    5: { towerId: "Goregaon, Mumbai", location: { lat: 19.155001, long: 72.849998 } },
    6: { towerId: "Pindwara", location: { lat: 24.794500, long: 73.055000 } },
    7: { towerId: "Raipur", location: { lat: 21.250000, long: 81.629997 } },
    8: { towerId: "Gokak", location: { lat: 16.166700, long: 74.833298 } },
    9: { towerId: "Lucknow", location: { lat: 26.850000, long: 80.949997 } },
    10: { towerId: "Delhi", location: { lat: 28.679079, long: 77.069710 } }
}
const DG = "DG"
const ELECTRIC = "Electric"
const reset = "\x1b[0m";

const CUSTOM_LOG = {
    green: (text) => console.log("\x1b[32m" + text + reset),
    red: (text) => console.log("\x1b[31m" + text + reset),
    blue: (text) => console.log("\x1b[34m" + text + reset),
    yellow: (text) => console.log("\x1b[33m" + text + reset),
};

module.exports = { TOWER_CONFIG, DG, ELECTRIC, CUSTOM_LOG };
