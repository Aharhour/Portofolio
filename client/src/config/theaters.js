// Theater definitions with unique seating layouts
// sectionLayout defines how groupRows are visually arranged:
// each section is an array of groupRow indices shown side-by-side
const theaters = {
    "zaal-1": {
        id: "zaal-1",
        name: "De Grote Zaal",
        description: "Onze grootste bioscoopzaal met 168 comfortabele stoelen",
        rows: ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N"],
        seatsPerRow: 12,
        totalSeats: 168,
        groupRows: [["A", "B"], ["C", "D"], ["E", "F"], ["G", "H"], ["I", "J"], ["K", "L"], ["M", "N"]],
        // 1 front block, 3 middle blocks side-by-side, 3 back blocks side-by-side
        sectionLayout: [[0], [1, 2, 3], [4, 5, 6]],
        upcharge: 0,
    },
    "zaal-2": {
        id: "zaal-2",
        name: "De Intieme Zaal",
        description: "Een kleinere, gezellige zaal voor een persoonlijke filmervaring",
        rows: ["A", "B", "C", "D", "E", "F"],
        seatsPerRow: 8,
        totalSeats: 48,
        groupRows: [["A", "B"], ["C", "D"], ["E", "F"]],
        // 1 front block, 2 blocks side-by-side
        sectionLayout: [[0], [1, 2]],
        upcharge: 7.99,
    },
    "zaal-3": {
        id: "zaal-3",
        name: "IMAX Experience",
        description: "Premium IMAX-zaal met een gigantisch scherm en Dolby Atmos geluid",
        rows: ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"],
        seatsPerRow: 14,
        totalSeats: 140,
        groupRows: [["A", "B"], ["C", "D"], ["E", "F"], ["G", "H"], ["I", "J"]],
        // 1 front block, 2 middle blocks side-by-side, 2 back blocks side-by-side
        sectionLayout: [[0], [1, 2], [3, 4]],
        upcharge: 12.99,
    },
};

export default theaters;
