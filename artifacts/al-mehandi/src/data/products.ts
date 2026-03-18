export interface ComboProduct {
  comboId: number;
  name: string;
  price: number;
  items: string[];
}

export const combos: ComboProduct[] = [
  {
    comboId: 1,
    name: "Combo 1",
    price: 70,
    items: ["1 Henna Cone", "1 Nail Cone"],
  },
  {
    comboId: 2,
    name: "Combo 2",
    price: 100,
    items: ["1 Henna Cone", "2 Nail Cones"],
  },
  {
    comboId: 3,
    name: "Combo 3",
    price: 110,
    items: ["2 Henna Cones", "1 Nail Cone"],
  },
  {
    comboId: 4,
    name: "Combo 4",
    price: 190,
    items: ["3 Henna Cones", "2 Nail Cones"],
  },
  {
    comboId: 5,
    name: "Combo 5",
    price: 250,
    items: ["4 Henna Cones", "3 Nail Cones"],
  },
  {
    comboId: 6,
    name: "Combo 6",
    price: 560,
    items: ["10 Henna Cones", "5 Nail Cones"],
  },
];
