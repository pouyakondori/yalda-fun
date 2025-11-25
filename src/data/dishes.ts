export interface Dish {
  id: number;
  fa: string;
  en: string;
  capacity?: number;
}

export const dishes: Dish[] = [
  { id: 1, fa: 'سالاد الویه', en: 'Olivier / Russian Salad' },
  { id: 2, fa: 'سالاد کلم', en: 'Coleslaw / Seasonal Salad' },
  { id: 3, fa: 'سالاد ماکارونی', en: 'Macaroni Salad' },
  { id: 4, fa: 'ناگت مرغ', en: 'Chicken Nugget' },
  { id: 5, fa: 'کوکو، کتلت', en: 'Herb Kuku / Persian Herb Frittata' },
  { id: 6, fa: 'پیتزا', en: 'Pizza' },
  { id: 7, fa: 'سوسیس بندری', en: 'Sosis Bandari' },
  { id: 8, fa: 'ساندویچ مرغ، کالباس و مشابه', en: 'Chicken Sandwich / Cold Cuts' },
  { id: 9, fa: 'مرغ گریل', en: 'Grilled Chicken' },
  { id: 10, fa: 'میرزا قاسمی یا کشک و بادمجان', en: 'Mirza Ghasemi / Kashk-o-Bademjan' },
];
