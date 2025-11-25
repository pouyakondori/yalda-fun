export interface Dish {
  id: number;
  fa: string;
  en: string;
  capacity?: number;
}

export const DEFAULT_DISH_CAPACITY = 6;

export const dishes: Dish[] = [
  { id: 1, fa: 'سالاد الویه', en: 'Olivier / Russian Salad', capacity: DEFAULT_DISH_CAPACITY },
  { id: 2, fa: 'سالاد کلم', en: 'Coleslaw / Seasonal Salad', capacity: DEFAULT_DISH_CAPACITY },
  { id: 3, fa: 'سالاد ماکارونی', en: 'Macaroni Salad', capacity: DEFAULT_DISH_CAPACITY },
  { id: 4, fa: 'ناگت مرغ', en: 'Chicken Nugget', capacity: DEFAULT_DISH_CAPACITY },
  { id: 5, fa: 'کوکو، کتلت', en: 'Herb Kuku / Persian Herb Frittata', capacity: DEFAULT_DISH_CAPACITY },
  { id: 6, fa: 'پیتزا', en: 'Pizza', capacity: DEFAULT_DISH_CAPACITY },
  { id: 7, fa: 'سوسیس بندری', en: 'Sosis Bandari', capacity: DEFAULT_DISH_CAPACITY },
  { id: 8, fa: 'ساندویچ مرغ، کالباس و مشابه', en: 'Chicken Sandwich / Cold Cuts', capacity: DEFAULT_DISH_CAPACITY },
  { id: 9, fa: 'مرغ گریل', en: 'Grilled Chicken', capacity: DEFAULT_DISH_CAPACITY },
  { id: 10, fa: 'میرزا قاسمی یا کشک و بادمجان', en: 'Mirza Ghasemi / Kashk-o-Bademjan', capacity: DEFAULT_DISH_CAPACITY },
];
