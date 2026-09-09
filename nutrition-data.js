// Reference nutrition values and household portions. See NUTRITION.md.
// USDA snapshots and manufacturer labels checked 2026-09-09; no runtime network needed.
const NUTRITION_DATA = {
  "chicken breast": {
    "reference": {
      "amount": 100,
      "unit": "g"
    },
    "macros": {
      "protein": 31.0,
      "calories": 165,
      "carbs": 0.0,
      "fat": 3.57
    },
    "preparation": "cooked, skinless meat",
    "gramsPerUnit": {},
    "note": "Weigh after cooking. Raw purchase weight depends on cooking yield.",
    "source": {
      "title": "Chicken, broilers or fryers, breast, meat only, cooked, roasted",
      "url": "https://fdc.nal.usda.gov/food-details/171477/nutrients",
      "fdcId": 171477,
      "dataset": "USDA SR Legacy April 2018",
      "checked": "2026-09-09"
    }
  },
  "lean ground beef": {
    "reference": {
      "amount": 100,
      "unit": "g"
    },
    "macros": {
      "protein": 29.2,
      "calories": 193,
      "carbs": 0.0,
      "fat": 7.58
    },
    "preparation": "cooked, 95% lean crumbles",
    "gramsPerUnit": {},
    "note": "Weigh after cooking and draining.",
    "source": {
      "title": "Beef, ground, 95% lean meat / 5% fat, crumbles, cooked, pan-browned",
      "url": "https://fdc.nal.usda.gov/food-details/174028/nutrients",
      "fdcId": 174028,
      "dataset": "USDA SR Legacy April 2018",
      "checked": "2026-09-09"
    }
  },
  "sirloin steak": {
    "reference": {
      "amount": 100,
      "unit": "g"
    },
    "macros": {
      "protein": 28.3,
      "calories": 181,
      "carbs": 0.73,
      "fat": 7.23
    },
    "preparation": "cooked, trimmed lean sirloin",
    "gramsPerUnit": {},
    "note": "Weigh after cooking; trim visible fat.",
    "source": {
      "title": "Beef, loin, top sirloin cap steak, boneless, separable lean only, trimmed to 1/8\" fat, all grades, cooked, grilled",
      "url": "https://fdc.nal.usda.gov/food-details/172170/nutrients",
      "fdcId": 172170,
      "dataset": "USDA SR Legacy April 2018",
      "checked": "2026-09-09"
    }
  },
  "lean ground turkey": {
    "reference": {
      "amount": 100,
      "unit": "g"
    },
    "macros": {
      "protein": 27.1,
      "calories": 213,
      "carbs": 0.0,
      "fat": 11.6
    },
    "preparation": "cooked, 93% lean crumbles",
    "gramsPerUnit": {},
    "note": "Weigh after cooking.",
    "source": {
      "title": "Turkey, ground, 93% lean, 7% fat, pan-broiled crumbles",
      "url": "https://fdc.nal.usda.gov/food-details/172851/nutrients",
      "fdcId": 172851,
      "dataset": "USDA SR Legacy April 2018",
      "checked": "2026-09-09"
    }
  },
  "salmon fillet": {
    "reference": {
      "amount": 100,
      "unit": "g"
    },
    "macros": {
      "protein": 22.1,
      "calories": 206,
      "carbs": 0.0,
      "fat": 12.4
    },
    "preparation": "cooked Atlantic farmed salmon",
    "gramsPerUnit": {},
    "note": "Weigh the cooked edible portion.",
    "source": {
      "title": "Fish, salmon, Atlantic, farmed, cooked, dry heat",
      "url": "https://fdc.nal.usda.gov/food-details/175168/nutrients",
      "fdcId": 175168,
      "dataset": "USDA SR Legacy April 2018",
      "checked": "2026-09-09"
    }
  },
  "canned tuna": {
    "reference": {
      "amount": 100,
      "unit": "g"
    },
    "macros": {
      "protein": 19.4,
      "calories": 86.0,
      "carbs": 0.0,
      "fat": 0.96
    },
    "preparation": "water-packed, drained solids",
    "gramsPerUnit": {
      "can": 165
    },
    "note": "One reference can means 165 g drained solids; use drained grams for other can sizes.",
    "source": {
      "title": "Fish, tuna, light, canned in water, drained solids (Includes foods for USDA's Food Distribution Program)",
      "url": "https://fdc.nal.usda.gov/food-details/173709/nutrients",
      "fdcId": 173709,
      "dataset": "USDA SR Legacy April 2018",
      "checked": "2026-09-09"
    }
  },
  "extra firm tofu": {
    "reference": {
      "amount": 100,
      "unit": "g"
    },
    "macros": {
      "protein": 9.98,
      "calories": 83.0,
      "carbs": 1.18,
      "fat": 5.26
    },
    "preparation": "drained, extra firm nigari tofu",
    "gramsPerUnit": {},
    "note": "Weigh before cooking; different tofu brands vary.",
    "source": {
      "title": "Tofu, extra firm, prepared with nigari",
      "url": "https://fdc.nal.usda.gov/food-details/174290/nutrients",
      "fdcId": 174290,
      "dataset": "USDA SR Legacy April 2018",
      "checked": "2026-09-09"
    }
  },
  "tempeh": {
    "reference": {
      "amount": 100,
      "unit": "g"
    },
    "macros": {
      "protein": 20.3,
      "calories": 192,
      "carbs": 7.64,
      "fat": 10.8
    },
    "preparation": "as sold, before cooking",
    "gramsPerUnit": {},
    "note": "",
    "source": {
      "title": "Tempeh",
      "url": "https://fdc.nal.usda.gov/food-details/174272/nutrients",
      "fdcId": 174272,
      "dataset": "USDA SR Legacy April 2018",
      "checked": "2026-09-09"
    }
  },
  "egg whites": {
    "reference": {
      "amount": 100,
      "unit": "g"
    },
    "macros": {
      "protein": 10.9,
      "calories": 52.0,
      "carbs": 0.73,
      "fat": 0.17
    },
    "preparation": "raw liquid egg white",
    "gramsPerUnit": {
      "cup": 243
    },
    "note": "Measure before cooking.",
    "source": {
      "title": "Egg, white, raw, fresh",
      "url": "https://fdc.nal.usda.gov/food-details/172183/nutrients",
      "fdcId": 172183,
      "dataset": "USDA SR Legacy April 2018",
      "checked": "2026-09-09"
    }
  },
  "whole eggs": {
    "reference": {
      "amount": 100,
      "unit": "g"
    },
    "macros": {
      "protein": 12.6,
      "calories": 143,
      "carbs": 0.72,
      "fat": 9.51
    },
    "preparation": "raw, shell removed",
    "gramsPerUnit": {
      "count": 50
    },
    "note": "One count means one large egg, 50 g edible portion.",
    "source": {
      "title": "Egg, whole, raw, fresh",
      "url": "https://fdc.nal.usda.gov/food-details/171287/nutrients",
      "fdcId": 171287,
      "dataset": "USDA SR Legacy April 2018",
      "checked": "2026-09-09"
    }
  },
  "turkey slices": {
    "reference": {
      "amount": 100,
      "unit": "g"
    },
    "macros": {
      "protein": 14.8,
      "calories": 106,
      "carbs": 2.2,
      "fat": 3.77
    },
    "preparation": "ready-to-eat deli turkey",
    "gramsPerUnit": {
      "slice": 16
    },
    "note": "Generic prepackaged turkey breast.",
    "source": {
      "title": "Turkey breast, sliced, prepackaged",
      "url": "https://fdc.nal.usda.gov/food-details/172941/nutrients",
      "fdcId": 172941,
      "dataset": "USDA SR Legacy April 2018",
      "checked": "2026-09-09"
    }
  },
  "plain Greek yogurt": {
    "reference": {
      "amount": 100,
      "unit": "g"
    },
    "macros": {
      "protein": 10.2,
      "calories": 59.0,
      "carbs": 3.6,
      "fat": 0.39
    },
    "preparation": "plain nonfat, ready to eat",
    "gramsPerUnit": {},
    "note": "Use grams; no cup-to-weight conversion is assumed.",
    "source": {
      "title": "Yogurt, Greek, plain, nonfat (Includes foods for USDA's Food Distribution Program)",
      "url": "https://fdc.nal.usda.gov/food-details/170894/nutrients",
      "fdcId": 170894,
      "dataset": "USDA SR Legacy April 2018",
      "checked": "2026-09-09"
    }
  },
  "Greek yogurt": {
    "reference": {
      "amount": 100,
      "unit": "g"
    },
    "macros": {
      "protein": 10.2,
      "calories": 59.0,
      "carbs": 3.6,
      "fat": 0.39
    },
    "preparation": "plain nonfat, ready to eat",
    "gramsPerUnit": {},
    "note": "Use grams; no cup-to-weight conversion is assumed.",
    "source": {
      "title": "Yogurt, Greek, plain, nonfat (Includes foods for USDA's Food Distribution Program)",
      "url": "https://fdc.nal.usda.gov/food-details/170894/nutrients",
      "fdcId": 170894,
      "dataset": "USDA SR Legacy April 2018",
      "checked": "2026-09-09"
    }
  },
  "cottage cheese": {
    "reference": {
      "amount": 100,
      "unit": "g"
    },
    "macros": {
      "protein": 10.4,
      "calories": 81.0,
      "carbs": 4.76,
      "fat": 2.27
    },
    "preparation": "2% milkfat, ready to eat",
    "gramsPerUnit": {
      "cup": 226
    },
    "note": "USDA cup is not packed.",
    "source": {
      "title": "Cheese, cottage, lowfat, 2% milkfat",
      "url": "https://fdc.nal.usda.gov/food-details/172182/nutrients",
      "fdcId": 172182,
      "dataset": "USDA SR Legacy April 2018",
      "checked": "2026-09-09"
    }
  },
  "whey protein powder": {
    "reference": {
      "amount": 100,
      "unit": "g"
    },
    "macros": {
      "protein": 78.1,
      "calories": 352,
      "carbs": 6.25,
      "fat": 1.56
    },
    "preparation": "dry whey-based powder",
    "gramsPerUnit": {},
    "note": "Generic USDA whey-based powder. Weigh in grams; scoops and brands are not interchangeable.",
    "source": {
      "title": "Beverages, Protein powder whey based",
      "url": "https://fdc.nal.usda.gov/food-details/173180/nutrients",
      "fdcId": 173180,
      "dataset": "USDA SR Legacy April 2018",
      "checked": "2026-09-09"
    }
  },
  "edamame": {
    "reference": {
      "amount": 100,
      "unit": "g"
    },
    "macros": {
      "protein": 11.9,
      "calories": 121,
      "carbs": 8.91,
      "fat": 5.2
    },
    "preparation": "cooked, shelled",
    "gramsPerUnit": {
      "cup": 155
    },
    "note": "",
    "source": {
      "title": "Edamame, frozen, prepared",
      "url": "https://fdc.nal.usda.gov/food-details/168411/nutrients",
      "fdcId": 168411,
      "dataset": "USDA SR Legacy April 2018",
      "checked": "2026-09-09"
    }
  },
  "lentils": {
    "reference": {
      "amount": 100,
      "unit": "g"
    },
    "macros": {
      "protein": 9.02,
      "calories": 116,
      "carbs": 20.1,
      "fat": 0.38
    },
    "preparation": "cooked and drained, no salt",
    "gramsPerUnit": {
      "cup": 198
    },
    "note": "",
    "source": {
      "title": "Lentils, mature seeds, cooked, boiled, without salt",
      "url": "https://fdc.nal.usda.gov/food-details/172421/nutrients",
      "fdcId": 172421,
      "dataset": "USDA SR Legacy April 2018",
      "checked": "2026-09-09"
    }
  },
  "chickpeas": {
    "reference": {
      "amount": 100,
      "unit": "g"
    },
    "macros": {
      "protein": 8.86,
      "calories": 164,
      "carbs": 27.4,
      "fat": 2.59
    },
    "preparation": "cooked and drained, no salt",
    "gramsPerUnit": {
      "cup": 164
    },
    "note": "",
    "source": {
      "title": "Chickpeas (garbanzo beans, bengal gram), mature seeds, cooked, boiled, without salt",
      "url": "https://fdc.nal.usda.gov/food-details/173757/nutrients",
      "fdcId": 173757,
      "dataset": "USDA SR Legacy April 2018",
      "checked": "2026-09-09"
    }
  },
  "black beans": {
    "reference": {
      "amount": 100,
      "unit": "g"
    },
    "macros": {
      "protein": 8.86,
      "calories": 132,
      "carbs": 23.7,
      "fat": 0.54
    },
    "preparation": "cooked and drained, no salt",
    "gramsPerUnit": {
      "cup": 172
    },
    "note": "",
    "source": {
      "title": "Beans, black, mature seeds, cooked, boiled, without salt",
      "url": "https://fdc.nal.usda.gov/food-details/173735/nutrients",
      "fdcId": 173735,
      "dataset": "USDA SR Legacy April 2018",
      "checked": "2026-09-09"
    }
  },
  "pinto beans": {
    "reference": {
      "amount": 100,
      "unit": "g"
    },
    "macros": {
      "protein": 9.01,
      "calories": 143,
      "carbs": 26.2,
      "fat": 0.65
    },
    "preparation": "cooked and drained, no salt",
    "gramsPerUnit": {
      "cup": 171
    },
    "note": "",
    "source": {
      "title": "Beans, pinto, mature seeds, cooked, boiled, without salt",
      "url": "https://fdc.nal.usda.gov/food-details/175200/nutrients",
      "fdcId": 175200,
      "dataset": "USDA SR Legacy April 2018",
      "checked": "2026-09-09"
    }
  },
  "kidney beans": {
    "reference": {
      "amount": 100,
      "unit": "g"
    },
    "macros": {
      "protein": 8.67,
      "calories": 127,
      "carbs": 22.8,
      "fat": 0.5
    },
    "preparation": "cooked and drained, no salt",
    "gramsPerUnit": {
      "cup": 177
    },
    "note": "",
    "source": {
      "title": "Beans, kidney, all types, mature seeds, cooked, boiled, without salt",
      "url": "https://fdc.nal.usda.gov/food-details/173740/nutrients",
      "fdcId": 173740,
      "dataset": "USDA SR Legacy April 2018",
      "checked": "2026-09-09"
    }
  },
  "rice": {
    "reference": {
      "amount": 100,
      "unit": "g"
    },
    "macros": {
      "protein": 2.69,
      "calories": 130,
      "carbs": 28.2,
      "fat": 0.28
    },
    "preparation": "cooked white long-grain rice",
    "gramsPerUnit": {
      "cup": 158
    },
    "note": "Cook in water; quantities are cooked, not dry.",
    "source": {
      "title": "Rice, white, long-grain, regular, enriched, cooked",
      "url": "https://fdc.nal.usda.gov/food-details/168878/nutrients",
      "fdcId": 168878,
      "dataset": "USDA SR Legacy April 2018",
      "checked": "2026-09-09"
    }
  },
  "brown rice": {
    "reference": {
      "amount": 100,
      "unit": "g"
    },
    "macros": {
      "protein": 2.74,
      "calories": 123,
      "carbs": 25.6,
      "fat": 0.97
    },
    "preparation": "cooked brown long-grain rice",
    "gramsPerUnit": {
      "cup": 202
    },
    "note": "Cook in water; quantities are cooked, not dry.",
    "source": {
      "title": "Rice, brown, long-grain, cooked (Includes foods for USDA's Food Distribution Program)",
      "url": "https://fdc.nal.usda.gov/food-details/169704/nutrients",
      "fdcId": 169704,
      "dataset": "USDA SR Legacy April 2018",
      "checked": "2026-09-09"
    }
  },
  "basmati rice": {
    "reference": {
      "amount": 100,
      "unit": "g"
    },
    "macros": {
      "protein": 2.69,
      "calories": 130,
      "carbs": 28.2,
      "fat": 0.28
    },
    "preparation": "cooked white long-grain rice estimate",
    "gramsPerUnit": {
      "cup": 158
    },
    "note": "USDA white long-grain rice is the documented proxy for basmati; variety and water absorption vary.",
    "source": {
      "title": "Rice, white, long-grain, regular, enriched, cooked",
      "url": "https://fdc.nal.usda.gov/food-details/168878/nutrients",
      "fdcId": 168878,
      "dataset": "USDA SR Legacy April 2018",
      "checked": "2026-09-09"
    }
  },
  "quinoa": {
    "reference": {
      "amount": 100,
      "unit": "g"
    },
    "macros": {
      "protein": 4.4,
      "calories": 120,
      "carbs": 21.3,
      "fat": 1.92
    },
    "preparation": "cooked in water",
    "gramsPerUnit": {
      "cup": 185
    },
    "note": "",
    "source": {
      "title": "Quinoa, cooked",
      "url": "https://fdc.nal.usda.gov/food-details/168917/nutrients",
      "fdcId": 168917,
      "dataset": "USDA SR Legacy April 2018",
      "checked": "2026-09-09"
    }
  },
  "farro": {
    "reference": {
      "amount": 100,
      "unit": "g"
    },
    "macros": {
      "protein": 5.5,
      "calories": 127,
      "carbs": 26.4,
      "fat": 0.85
    },
    "preparation": "cooked spelt (farro grande)",
    "gramsPerUnit": {
      "cup": 194
    },
    "note": "Specifically spelt; emmer/einkorn or branded farro require different values.",
    "source": {
      "title": "Spelt, cooked",
      "url": "https://fdc.nal.usda.gov/food-details/169746/nutrients",
      "fdcId": 169746,
      "dataset": "USDA SR Legacy April 2018",
      "checked": "2026-09-09"
    }
  },
  "couscous": {
    "reference": {
      "amount": 100,
      "unit": "g"
    },
    "macros": {
      "protein": 3.79,
      "calories": 112,
      "carbs": 23.2,
      "fat": 0.16
    },
    "preparation": "cooked in water",
    "gramsPerUnit": {
      "cup": 157
    },
    "note": "The selected portion is a cooked cup, not a dry cup yield.",
    "source": {
      "title": "Couscous, cooked",
      "url": "https://fdc.nal.usda.gov/food-details/169700/nutrients",
      "fdcId": 169700,
      "dataset": "USDA SR Legacy April 2018",
      "checked": "2026-09-09"
    }
  },
  "pita": {
    "reference": {
      "amount": 100,
      "unit": "g"
    },
    "macros": {
      "protein": 9.1,
      "calories": 275,
      "carbs": 55.7,
      "fat": 1.2
    },
    "preparation": "ready-to-eat white pita",
    "gramsPerUnit": {
      "count": 60
    },
    "note": "One count means one large 60 g pita.",
    "source": {
      "title": "Bread, pita, white, unenriched",
      "url": "https://fdc.nal.usda.gov/food-details/172816/nutrients",
      "fdcId": 172816,
      "dataset": "USDA SR Legacy April 2018",
      "checked": "2026-09-09"
    }
  },
  "naan": {
    "reference": {
      "amount": 100,
      "unit": "g"
    },
    "macros": {
      "protein": 9.62,
      "calories": 291,
      "carbs": 50.4,
      "fat": 5.65
    },
    "preparation": "plain, ready-to-eat naan",
    "gramsPerUnit": {
      "count": 90
    },
    "note": "One count means one 90 g piece. Recipe varies by brand.",
    "source": {
      "title": "Bread, naan, plain, commercially prepared, refrigerated",
      "url": "https://fdc.nal.usda.gov/food-details/171845/nutrients",
      "fdcId": 171845,
      "dataset": "USDA SR Legacy April 2018",
      "checked": "2026-09-09"
    }
  },
  "whole grain bread": {
    "reference": {
      "amount": 100,
      "unit": "g"
    },
    "macros": {
      "protein": 12.4,
      "calories": 252,
      "carbs": 42.7,
      "fat": 3.5
    },
    "preparation": "whole-wheat bread, before toasting",
    "gramsPerUnit": {
      "slice": 32
    },
    "note": "One reference slice weighs 32 g.",
    "source": {
      "title": "Bread, whole-wheat, commercially prepared",
      "url": "https://fdc.nal.usda.gov/food-details/172688/nutrients",
      "fdcId": 172688,
      "dataset": "USDA SR Legacy April 2018",
      "checked": "2026-09-09"
    }
  },
  "oats": {
    "reference": {
      "amount": 100,
      "unit": "g"
    },
    "macros": {
      "protein": 13.2,
      "calories": 379,
      "carbs": 67.7,
      "fat": 6.52
    },
    "preparation": "dry rolled oats",
    "gramsPerUnit": {
      "cup": 81
    },
    "note": "",
    "source": {
      "title": "Cereals, oats, regular and quick, not fortified, dry",
      "url": "https://fdc.nal.usda.gov/food-details/173904/nutrients",
      "fdcId": 173904,
      "dataset": "USDA SR Legacy April 2018",
      "checked": "2026-09-09"
    }
  },
  "rolled oats": {
    "reference": {
      "amount": 100,
      "unit": "g"
    },
    "macros": {
      "protein": 13.2,
      "calories": 379,
      "carbs": 67.7,
      "fat": 6.52
    },
    "preparation": "dry rolled oats",
    "gramsPerUnit": {
      "cup": 81
    },
    "note": "",
    "source": {
      "title": "Cereals, oats, regular and quick, not fortified, dry",
      "url": "https://fdc.nal.usda.gov/food-details/173904/nutrients",
      "fdcId": 173904,
      "dataset": "USDA SR Legacy April 2018",
      "checked": "2026-09-09"
    }
  },
  "broccoli": {
    "reference": {
      "amount": 100,
      "unit": "g"
    },
    "macros": {
      "protein": 2.82,
      "calories": 34.0,
      "carbs": 6.64,
      "fat": 0.37
    },
    "preparation": "raw, chopped",
    "gramsPerUnit": {
      "cup": 91
    },
    "note": "Use raw prepared weight before cooking.",
    "source": {
      "title": "Broccoli, raw",
      "url": "https://fdc.nal.usda.gov/food-details/170379/nutrients",
      "fdcId": 170379,
      "dataset": "USDA SR Legacy April 2018",
      "checked": "2026-09-09"
    }
  },
  "spinach": {
    "reference": {
      "amount": 100,
      "unit": "g"
    },
    "macros": {
      "protein": 2.86,
      "calories": 23.0,
      "carbs": 3.63,
      "fat": 0.39
    },
    "preparation": "raw leaves",
    "gramsPerUnit": {
      "cup": 30
    },
    "note": "",
    "source": {
      "title": "Spinach, raw",
      "url": "https://fdc.nal.usda.gov/food-details/168462/nutrients",
      "fdcId": 168462,
      "dataset": "USDA SR Legacy April 2018",
      "checked": "2026-09-09"
    }
  },
  "zucchini": {
    "reference": {
      "amount": 100,
      "unit": "g"
    },
    "macros": {
      "protein": 1.21,
      "calories": 17.0,
      "carbs": 3.11,
      "fat": 0.32
    },
    "preparation": "raw, chopped, skin on",
    "gramsPerUnit": {
      "cup": 124
    },
    "note": "",
    "source": {
      "title": "Squash, summer, zucchini, includes skin, raw",
      "url": "https://fdc.nal.usda.gov/food-details/169291/nutrients",
      "fdcId": 169291,
      "dataset": "USDA SR Legacy April 2018",
      "checked": "2026-09-09"
    }
  },
  "asparagus": {
    "reference": {
      "amount": 100,
      "unit": "g"
    },
    "macros": {
      "protein": 2.2,
      "calories": 20.0,
      "carbs": 3.88,
      "fat": 0.12
    },
    "preparation": "raw, edible portion",
    "gramsPerUnit": {
      "cup": 134
    },
    "note": "",
    "source": {
      "title": "Asparagus, raw",
      "url": "https://fdc.nal.usda.gov/food-details/168389/nutrients",
      "fdcId": 168389,
      "dataset": "USDA SR Legacy April 2018",
      "checked": "2026-09-09"
    }
  },
  "green beans": {
    "reference": {
      "amount": 100,
      "unit": "g"
    },
    "macros": {
      "protein": 1.83,
      "calories": 31.0,
      "carbs": 6.97,
      "fat": 0.22
    },
    "preparation": "raw, cut into half-inch pieces",
    "gramsPerUnit": {
      "cup": 100
    },
    "note": "",
    "source": {
      "title": "Beans, snap, green, raw",
      "url": "https://fdc.nal.usda.gov/food-details/169961/nutrients",
      "fdcId": 169961,
      "dataset": "USDA SR Legacy April 2018",
      "checked": "2026-09-09"
    }
  },
  "bell peppers": {
    "reference": {
      "amount": 100,
      "unit": "g"
    },
    "macros": {
      "protein": 0.99,
      "calories": 26.0,
      "carbs": 6.03,
      "fat": 0.3
    },
    "preparation": "raw red bell pepper, chopped",
    "gramsPerUnit": {
      "cup": 149
    },
    "note": "Reference is red pepper; other colors vary.",
    "source": {
      "title": "Peppers, sweet, red, raw",
      "url": "https://fdc.nal.usda.gov/food-details/170108/nutrients",
      "fdcId": 170108,
      "dataset": "USDA SR Legacy April 2018",
      "checked": "2026-09-09"
    }
  },
  "onion": {
    "reference": {
      "amount": 100,
      "unit": "g"
    },
    "macros": {
      "protein": 1.1,
      "calories": 40.0,
      "carbs": 9.34,
      "fat": 0.1
    },
    "preparation": "raw, peeled",
    "gramsPerUnit": {
      "count": 110,
      "cup": 160
    },
    "note": "One count means a medium 110 g edible onion; cup means chopped.",
    "source": {
      "title": "Onions, raw",
      "url": "https://fdc.nal.usda.gov/food-details/170000/nutrients",
      "fdcId": 170000,
      "dataset": "USDA SR Legacy April 2018",
      "checked": "2026-09-09"
    }
  },
  "sweet potato": {
    "reference": {
      "amount": 100,
      "unit": "g"
    },
    "macros": {
      "protein": 1.57,
      "calories": 86.0,
      "carbs": 20.1,
      "fat": 0.05
    },
    "preparation": "raw, edible portion",
    "gramsPerUnit": {
      "count": 130
    },
    "note": "One count means a 130 g sweet potato.",
    "source": {
      "title": "Sweet potato, raw, unprepared (Includes foods for USDA's Food Distribution Program)",
      "url": "https://fdc.nal.usda.gov/food-details/168482/nutrients",
      "fdcId": 168482,
      "dataset": "USDA SR Legacy April 2018",
      "checked": "2026-09-09"
    }
  },
  "baby potatoes": {
    "reference": {
      "amount": 100,
      "unit": "g"
    },
    "macros": {
      "protein": 2.05,
      "calories": 77.0,
      "carbs": 17.5,
      "fat": 0.09
    },
    "preparation": "raw potato, flesh and skin",
    "gramsPerUnit": {},
    "note": "USDA generic potato used for small potatoes; weigh edible raw grams.",
    "source": {
      "title": "Potatoes, flesh and skin, raw",
      "url": "https://fdc.nal.usda.gov/food-details/170026/nutrients",
      "fdcId": 170026,
      "dataset": "USDA SR Legacy April 2018",
      "checked": "2026-09-09"
    }
  },
  "snap peas": {
    "reference": {
      "amount": 100,
      "unit": "g"
    },
    "macros": {
      "protein": 2.8,
      "calories": 42.0,
      "carbs": 7.55,
      "fat": 0.2
    },
    "preparation": "raw edible-podded peas, whole",
    "gramsPerUnit": {
      "cup": 63
    },
    "note": "",
    "source": {
      "title": "Peas, edible-podded, raw",
      "url": "https://fdc.nal.usda.gov/food-details/170010/nutrients",
      "fdcId": 170010,
      "dataset": "USDA SR Legacy April 2018",
      "checked": "2026-09-09"
    }
  },
  "romaine lettuce": {
    "reference": {
      "amount": 100,
      "unit": "g"
    },
    "macros": {
      "protein": 1.23,
      "calories": 17.0,
      "carbs": 3.29,
      "fat": 0.3
    },
    "preparation": "raw, shredded",
    "gramsPerUnit": {
      "cup": 47
    },
    "note": "",
    "source": {
      "title": "Lettuce, cos or romaine, raw",
      "url": "https://fdc.nal.usda.gov/food-details/169247/nutrients",
      "fdcId": 169247,
      "dataset": "USDA SR Legacy April 2018",
      "checked": "2026-09-09"
    }
  },
  "cabbage": {
    "reference": {
      "amount": 100,
      "unit": "g"
    },
    "macros": {
      "protein": 1.28,
      "calories": 25.0,
      "carbs": 5.8,
      "fat": 0.1
    },
    "preparation": "raw, shredded",
    "gramsPerUnit": {
      "cup": 70
    },
    "note": "",
    "source": {
      "title": "Cabbage, raw",
      "url": "https://fdc.nal.usda.gov/food-details/169975/nutrients",
      "fdcId": 169975,
      "dataset": "USDA SR Legacy April 2018",
      "checked": "2026-09-09"
    }
  },
  "carrots": {
    "reference": {
      "amount": 100,
      "unit": "g"
    },
    "macros": {
      "protein": 0.93,
      "calories": 41.0,
      "carbs": 9.58,
      "fat": 0.24
    },
    "preparation": "raw, grated",
    "gramsPerUnit": {
      "cup": 110
    },
    "note": "",
    "source": {
      "title": "Carrots, raw",
      "url": "https://fdc.nal.usda.gov/food-details/170393/nutrients",
      "fdcId": 170393,
      "dataset": "USDA SR Legacy April 2018",
      "checked": "2026-09-09"
    }
  },
  "cucumber": {
    "reference": {
      "amount": 100,
      "unit": "g"
    },
    "macros": {
      "protein": 0.65,
      "calories": 15.0,
      "carbs": 3.63,
      "fat": 0.11
    },
    "preparation": "raw, skin on, sliced",
    "gramsPerUnit": {
      "cup": 104
    },
    "note": "",
    "source": {
      "title": "Cucumber, with peel, raw",
      "url": "https://fdc.nal.usda.gov/food-details/168409/nutrients",
      "fdcId": 168409,
      "dataset": "USDA SR Legacy April 2018",
      "checked": "2026-09-09"
    }
  },
  "corn": {
    "reference": {
      "amount": 100,
      "unit": "g"
    },
    "macros": {
      "protein": 3.41,
      "calories": 96.0,
      "carbs": 21.0,
      "fat": 1.5
    },
    "preparation": "cooked kernels, drained, no salt",
    "gramsPerUnit": {
      "cup": 149
    },
    "note": "",
    "source": {
      "title": "Corn, sweet, yellow, cooked, boiled, drained, without salt",
      "url": "https://fdc.nal.usda.gov/food-details/169999/nutrients",
      "fdcId": 169999,
      "dataset": "USDA SR Legacy April 2018",
      "checked": "2026-09-09"
    }
  },
  "peas": {
    "reference": {
      "amount": 100,
      "unit": "g"
    },
    "macros": {
      "protein": 5.36,
      "calories": 84.0,
      "carbs": 15.6,
      "fat": 0.22
    },
    "preparation": "cooked and drained, no salt",
    "gramsPerUnit": {
      "cup": 160
    },
    "note": "",
    "source": {
      "title": "Peas, green, cooked, boiled, drained, without salt",
      "url": "https://fdc.nal.usda.gov/food-details/170420/nutrients",
      "fdcId": 170420,
      "dataset": "USDA SR Legacy April 2018",
      "checked": "2026-09-09"
    }
  },
  "avocado": {
    "reference": {
      "amount": 100,
      "unit": "g"
    },
    "macros": {
      "protein": 2.0,
      "calories": 160,
      "carbs": 8.53,
      "fat": 14.7
    },
    "preparation": "raw flesh, no skin or pit",
    "gramsPerUnit": {
      "count": 201
    },
    "note": "One count means 201 g edible flesh; sizes vary, so prefer the displayed grams.",
    "source": {
      "title": "Avocados, raw, all commercial varieties",
      "url": "https://fdc.nal.usda.gov/food-details/171705/nutrients",
      "fdcId": 171705,
      "dataset": "USDA SR Legacy April 2018",
      "checked": "2026-09-09"
    }
  },
  "blueberries": {
    "reference": {
      "amount": 100,
      "unit": "g"
    },
    "macros": {
      "protein": 0.74,
      "calories": 57.0,
      "carbs": 14.5,
      "fat": 0.33
    },
    "preparation": "raw",
    "gramsPerUnit": {
      "cup": 148
    },
    "note": "",
    "source": {
      "title": "Blueberries, raw",
      "url": "https://fdc.nal.usda.gov/food-details/171711/nutrients",
      "fdcId": 171711,
      "dataset": "USDA SR Legacy April 2018",
      "checked": "2026-09-09"
    }
  },
  "peanut butter": {
    "reference": {
      "amount": 100,
      "unit": "g"
    },
    "macros": {
      "protein": 22.2,
      "calories": 598,
      "carbs": 22.3,
      "fat": 51.4
    },
    "preparation": "smooth, salted, ready to eat",
    "gramsPerUnit": {
      "tbsp": 16
    },
    "note": "Uses the USDA 2 tbsp = 32 g serving; other volume conversions derive from this serving.",
    "source": {
      "title": "Peanut butter, smooth style, with salt (Includes foods for USDA's Food Distribution Program)",
      "url": "https://fdc.nal.usda.gov/food-details/174266/nutrients",
      "fdcId": 174266,
      "dataset": "USDA SR Legacy April 2018",
      "checked": "2026-09-09"
    }
  },
  "salsa": {
    "reference": {
      "amount": 100,
      "unit": "g"
    },
    "macros": {
      "protein": 1.52,
      "calories": 29.0,
      "carbs": 6.64,
      "fat": 0.17
    },
    "preparation": "ready-to-serve salsa",
    "gramsPerUnit": {
      "tbsp": 18
    },
    "note": "Uses USDA 2 tbsp = 36 g, so a normalized cup is 288 g. USDA also lists differently rounded cup weights; those are not mixed into conversions.",
    "source": {
      "title": "Sauce, salsa, ready-to-serve",
      "url": "https://fdc.nal.usda.gov/food-details/174524/nutrients",
      "fdcId": 174524,
      "dataset": "USDA SR Legacy April 2018",
      "checked": "2026-09-09"
    }
  },
  "marinara sauce": {
    "reference": {
      "amount": 100,
      "unit": "g"
    },
    "macros": {
      "protein": 1.39,
      "calories": 50.0,
      "carbs": 7.43,
      "fat": 1.61
    },
    "preparation": "ready-to-serve marinara",
    "gramsPerUnit": {
      "cup": 264
    },
    "note": "USDA reference serving is half a cup = 132 g.",
    "source": {
      "title": "Sauce, pasta, spaghetti/marinara, ready-to-serve",
      "url": "https://fdc.nal.usda.gov/food-details/171192/nutrients",
      "fdcId": 171192,
      "dataset": "USDA SR Legacy April 2018",
      "checked": "2026-09-09"
    }
  },
  "tomato sauce": {
    "reference": {
      "amount": 100,
      "unit": "g"
    },
    "macros": {
      "protein": 1.2,
      "calories": 24.0,
      "carbs": 5.31,
      "fat": 0.3
    },
    "preparation": "canned tomato sauce",
    "gramsPerUnit": {
      "cup": 245
    },
    "note": "",
    "source": {
      "title": "Tomato products, canned, sauce",
      "url": "https://fdc.nal.usda.gov/food-details/170054/nutrients",
      "fdcId": 170054,
      "dataset": "USDA SR Legacy April 2018",
      "checked": "2026-09-09"
    }
  },
  "crushed tomatoes": {
    "reference": {
      "amount": 100,
      "unit": "g"
    },
    "macros": {
      "protein": 1.64,
      "calories": 32.0,
      "carbs": 7.29,
      "fat": 0.28
    },
    "preparation": "canned crushed tomatoes",
    "gramsPerUnit": {
      "cup": 242
    },
    "note": "",
    "source": {
      "title": "Tomatoes, crushed, canned",
      "url": "https://fdc.nal.usda.gov/food-details/170501/nutrients",
      "fdcId": 170501,
      "dataset": "USDA SR Legacy April 2018",
      "checked": "2026-09-09"
    }
  },
  "teriyaki sauce": {
    "reference": {
      "amount": 100,
      "unit": "g"
    },
    "macros": {
      "protein": 5.93,
      "calories": 89.0,
      "carbs": 15.6,
      "fat": 0.02
    },
    "preparation": "ready-to-serve teriyaki",
    "gramsPerUnit": {
      "tbsp": 18
    },
    "note": "",
    "source": {
      "title": "Sauce, teriyaki, ready-to-serve",
      "url": "https://fdc.nal.usda.gov/food-details/171167/nutrients",
      "fdcId": 171167,
      "dataset": "USDA SR Legacy April 2018",
      "checked": "2026-09-09"
    }
  },
  "soy sauce": {
    "reference": {
      "amount": 100,
      "unit": "g"
    },
    "macros": {
      "protein": 8.14,
      "calories": 53.0,
      "carbs": 4.93,
      "fat": 0.57
    },
    "preparation": "soy and wheat shoyu sauce",
    "gramsPerUnit": {
      "tbsp": 16
    },
    "note": "Uses the tablespoon reference consistently.",
    "source": {
      "title": "Soy sauce made from soy and wheat (shoyu)",
      "url": "https://fdc.nal.usda.gov/food-details/174277/nutrients",
      "fdcId": 174277,
      "dataset": "USDA SR Legacy April 2018",
      "checked": "2026-09-09"
    }
  },
  "barbecue sauce": {
    "reference": {
      "amount": 100,
      "unit": "g"
    },
    "macros": {
      "protein": 0.82,
      "calories": 172,
      "carbs": 40.8,
      "fat": 0.63
    },
    "preparation": "ready-to-serve barbecue sauce",
    "gramsPerUnit": {
      "tbsp": 17
    },
    "note": "Uses the tablespoon reference consistently.",
    "source": {
      "title": "Sauce, barbecue",
      "url": "https://fdc.nal.usda.gov/food-details/174523/nutrients",
      "fdcId": 174523,
      "dataset": "USDA SR Legacy April 2018",
      "checked": "2026-09-09"
    }
  },
  "hummus": {
    "reference": {
      "amount": 100,
      "unit": "g"
    },
    "macros": {
      "protein": 7.78,
      "calories": 237,
      "carbs": 15.0,
      "fat": 17.8
    },
    "preparation": "commercial ready-to-eat hummus",
    "gramsPerUnit": {
      "tbsp": 15
    },
    "note": "Uses the tablespoon reference consistently; brand recipes vary.",
    "source": {
      "title": "Hummus, commercial",
      "url": "https://fdc.nal.usda.gov/food-details/174289/nutrients",
      "fdcId": 174289,
      "dataset": "USDA SR Legacy April 2018",
      "checked": "2026-09-09"
    }
  },
  "olive oil": {
    "reference": {
      "amount": 100,
      "unit": "g"
    },
    "macros": {
      "protein": 0.0,
      "calories": 884,
      "carbs": 0.0,
      "fat": 100
    },
    "preparation": "olive oil",
    "gramsPerUnit": {
      "tbsp": 13.5
    },
    "note": "",
    "source": {
      "title": "Oil, olive, salad or cooking",
      "url": "https://fdc.nal.usda.gov/food-details/171413/nutrients",
      "fdcId": 171413,
      "dataset": "USDA SR Legacy April 2018",
      "checked": "2026-09-09"
    }
  },
  "lemon": {
    "reference": {
      "amount": 100,
      "unit": "g"
    },
    "macros": {
      "protein": 0.35,
      "calories": 22.0,
      "carbs": 6.9,
      "fat": 0.24
    },
    "preparation": "fresh lemon juice",
    "gramsPerUnit": {
      "count": 48
    },
    "note": "One count means juice yielded by one reference lemon (48 g); peel/pulp are not included.",
    "source": {
      "title": "Lemon juice, raw",
      "url": "https://fdc.nal.usda.gov/food-details/167747/nutrients",
      "fdcId": 167747,
      "dataset": "USDA SR Legacy April 2018",
      "checked": "2026-09-09"
    }
  },
  "garlic": {
    "reference": {
      "amount": 100,
      "unit": "g"
    },
    "macros": {
      "protein": 6.36,
      "calories": 149,
      "carbs": 33.1,
      "fat": 0.5
    },
    "preparation": "raw, peeled",
    "gramsPerUnit": {
      "clove": 3
    },
    "note": "One reference clove is 3 g; no density for arbitrary minced cups is assumed.",
    "source": {
      "title": "Garlic, raw",
      "url": "https://fdc.nal.usda.gov/food-details/169230/nutrients",
      "fdcId": 169230,
      "dataset": "USDA SR Legacy April 2018",
      "checked": "2026-09-09"
    }
  },
  "ginger": {
    "reference": {
      "amount": 100,
      "unit": "g"
    },
    "macros": {
      "protein": 1.82,
      "calories": 80.0,
      "carbs": 17.8,
      "fat": 0.75
    },
    "preparation": "raw, grated",
    "gramsPerUnit": {
      "tsp": 2
    },
    "note": "Uses the USDA teaspoon portion, not sliced-cup density.",
    "source": {
      "title": "Ginger root, raw",
      "url": "https://fdc.nal.usda.gov/food-details/169231/nutrients",
      "fdcId": 169231,
      "dataset": "USDA SR Legacy April 2018",
      "checked": "2026-09-09"
    }
  },
  "taco seasoning": {
    "reference": {
      "amount": 100,
      "unit": "g"
    },
    "macros": {
      "protein": 4.5,
      "calories": 322,
      "carbs": 58.0,
      "fat": 0.0
    },
    "preparation": "dry original taco seasoning",
    "gramsPerUnit": {
      "tsp": 2.85
    },
    "note": "USDA serving is 2 tsp = 5.7 g.",
    "source": {
      "title": "Seasoning mix, dry, taco, original",
      "url": "https://fdc.nal.usda.gov/food-details/172243/nutrients",
      "fdcId": 172243,
      "dataset": "USDA SR Legacy April 2018",
      "checked": "2026-09-09"
    }
  },
  "chili seasoning": {
    "reference": {
      "amount": 100,
      "unit": "g"
    },
    "macros": {
      "protein": 10.8,
      "calories": 335,
      "carbs": 56.6,
      "fat": 7.3
    },
    "preparation": "dry original chili seasoning",
    "gramsPerUnit": {
      "tbsp": 6.7669172932330826
    },
    "note": "USDA serving is 1.33 tbsp = 9 g.",
    "source": {
      "title": "Seasoning mix, dry, chili, original",
      "url": "https://fdc.nal.usda.gov/food-details/173476/nutrients",
      "fdcId": 173476,
      "dataset": "USDA SR Legacy April 2018",
      "checked": "2026-09-09"
    }
  },
  "shredded cheese": {
    "reference": {
      "amount": 100,
      "unit": "g"
    },
    "macros": {
      "protein": 22.9,
      "calories": 403,
      "carbs": 3.37,
      "fat": 33.3
    },
    "preparation": "cheddar, shredded",
    "gramsPerUnit": {
      "cup": 113
    },
    "note": "",
    "source": {
      "title": "Cheese, cheddar (Includes foods for USDA's Food Distribution Program)",
      "url": "https://fdc.nal.usda.gov/food-details/173414/nutrients",
      "fdcId": 173414,
      "dataset": "USDA SR Legacy April 2018",
      "checked": "2026-09-09"
    }
  },
  "mozzarella cheese": {
    "reference": {
      "amount": 100,
      "unit": "g"
    },
    "macros": {
      "protein": 23.6,
      "calories": 304,
      "carbs": 8.06,
      "fat": 19.7
    },
    "preparation": "low-moisture part-skim, shredded",
    "gramsPerUnit": {
      "cup": 86
    },
    "note": "",
    "source": {
      "title": "Cheese, mozzarella, low moisture, part-skim, shredded",
      "url": "https://fdc.nal.usda.gov/food-details/170900/nutrients",
      "fdcId": 170900,
      "dataset": "USDA SR Legacy April 2018",
      "checked": "2026-09-09"
    }
  },
  "parmesan cheese": {
    "reference": {
      "amount": 100,
      "unit": "g"
    },
    "macros": {
      "protein": 28.4,
      "calories": 420,
      "carbs": 13.9,
      "fat": 27.8
    },
    "preparation": "parmesan, grated",
    "gramsPerUnit": {
      "tbsp": 5
    },
    "note": "Uses the tablespoon reference consistently.",
    "source": {
      "title": "Cheese, parmesan, grated",
      "url": "https://fdc.nal.usda.gov/food-details/171247/nutrients",
      "fdcId": 171247,
      "dataset": "USDA SR Legacy April 2018",
      "checked": "2026-09-09"
    }
  },
  "coconut cream": {
    "reference": {
      "amount": 100,
      "unit": "g"
    },
    "macros": {
      "protein": 3.63,
      "calories": 330,
      "carbs": 6.65,
      "fat": 34.7
    },
    "preparation": "unsweetened coconut cream",
    "gramsPerUnit": {
      "tbsp": 15
    },
    "note": "Raw expressed coconut cream reference; not sweetened cream of coconut.",
    "source": {
      "title": "Nuts, coconut cream, raw (liquid expressed from grated meat)",
      "url": "https://fdc.nal.usda.gov/food-details/170580/nutrients",
      "fdcId": 170580,
      "dataset": "USDA SR Legacy April 2018",
      "checked": "2026-09-09"
    }
  },
  "cauliflower rice": {
    "reference": {
      "amount": 100,
      "unit": "g"
    },
    "macros": {
      "protein": 1.92,
      "calories": 25.0,
      "carbs": 4.97,
      "fat": 0.28
    },
    "preparation": "raw cauliflower, chopped before ricing",
    "gramsPerUnit": {
      "cup": 107
    },
    "note": "Uses chopped cauliflower weight as the reference; weigh grams after ricing rather than assuming every riced cup packs identically.",
    "source": {
      "title": "Cauliflower, raw",
      "url": "https://fdc.nal.usda.gov/food-details/169986/nutrients",
      "fdcId": 169986,
      "dataset": "USDA SR Legacy April 2018",
      "checked": "2026-09-09"
    }
  },
  "black pepper": {
    "reference": {
      "amount": 100,
      "unit": "g"
    },
    "macros": {
      "protein": 10.4,
      "calories": 251,
      "carbs": 64.0,
      "fat": 3.26
    },
    "preparation": "dry, ground",
    "gramsPerUnit": {
      "tsp": 2.3
    },
    "note": "",
    "source": {
      "title": "Spices, pepper, black",
      "url": "https://fdc.nal.usda.gov/food-details/170931/nutrients",
      "fdcId": 170931,
      "dataset": "USDA SR Legacy April 2018",
      "checked": "2026-09-09"
    }
  },
  "paprika": {
    "reference": {
      "amount": 100,
      "unit": "g"
    },
    "macros": {
      "protein": 14.1,
      "calories": 282,
      "carbs": 54.0,
      "fat": 12.9
    },
    "preparation": "dry paprika",
    "gramsPerUnit": {
      "tsp": 2.3
    },
    "note": "",
    "source": {
      "title": "Spices, paprika",
      "url": "https://fdc.nal.usda.gov/food-details/171329/nutrients",
      "fdcId": 171329,
      "dataset": "USDA SR Legacy April 2018",
      "checked": "2026-09-09"
    }
  },
  "cumin": {
    "reference": {
      "amount": 100,
      "unit": "g"
    },
    "macros": {
      "protein": 17.8,
      "calories": 375,
      "carbs": 44.2,
      "fat": 22.3
    },
    "preparation": "dry cumin seed",
    "gramsPerUnit": {},
    "note": "Weigh seeds before grinding.",
    "source": {
      "title": "Spices, cumin seed",
      "url": "https://fdc.nal.usda.gov/food-details/170923/nutrients",
      "fdcId": 170923,
      "dataset": "USDA SR Legacy April 2018",
      "checked": "2026-09-09"
    }
  },
  "coriander": {
    "reference": {
      "amount": 100,
      "unit": "g"
    },
    "macros": {
      "protein": 12.4,
      "calories": 298,
      "carbs": 55.0,
      "fat": 17.8
    },
    "preparation": "dry coriander seed",
    "gramsPerUnit": {},
    "note": "Weigh seeds before grinding.",
    "source": {
      "title": "Spices, coriander seed",
      "url": "https://fdc.nal.usda.gov/food-details/170922/nutrients",
      "fdcId": 170922,
      "dataset": "USDA SR Legacy April 2018",
      "checked": "2026-09-09"
    }
  },
  "garlic powder": {
    "reference": {
      "amount": 100,
      "unit": "g"
    },
    "macros": {
      "protein": 16.6,
      "calories": 331,
      "carbs": 72.7,
      "fat": 0.73
    },
    "preparation": "dry garlic powder",
    "gramsPerUnit": {
      "tsp": 3.1
    },
    "note": "",
    "source": {
      "title": "Spices, garlic powder",
      "url": "https://fdc.nal.usda.gov/food-details/171325/nutrients",
      "fdcId": 171325,
      "dataset": "USDA SR Legacy April 2018",
      "checked": "2026-09-09"
    }
  },
  "dill": {
    "reference": {
      "amount": 100,
      "unit": "g"
    },
    "macros": {
      "protein": 20.0,
      "calories": 253,
      "carbs": 55.8,
      "fat": 4.36
    },
    "preparation": "dried dill weed",
    "gramsPerUnit": {
      "tsp": 1
    },
    "note": "",
    "source": {
      "title": "Spices, dill weed, dried",
      "url": "https://fdc.nal.usda.gov/food-details/171322/nutrients",
      "fdcId": 171322,
      "dataset": "USDA SR Legacy April 2018",
      "checked": "2026-09-09"
    }
  },
  "salt": {
    "reference": {
      "amount": 100,
      "unit": "g"
    },
    "macros": {
      "protein": 0.0,
      "calories": 0.0,
      "carbs": 0.0,
      "fat": 0.0
    },
    "preparation": "table salt",
    "gramsPerUnit": {
      "tsp": 6
    },
    "note": "Macros are zero; this app does not track sodium.",
    "source": {
      "title": "Salt, table",
      "url": "https://fdc.nal.usda.gov/food-details/173468/nutrients",
      "fdcId": 173468,
      "dataset": "USDA SR Legacy April 2018",
      "checked": "2026-09-09"
    }
  },
  "paneer cheese": {
    "reference": {
      "amount": 28,
      "unit": "g"
    },
    "macros": {
      "protein": 7,
      "calories": 90,
      "carbs": 1,
      "fat": 7
    },
    "preparation": "ready-to-eat paneer",
    "gramsPerUnit": {},
    "note": "Specific reference product: Sach Original. Package serving is 28 g; ounce conversion uses exact mass, not rounded label ounces.",
    "source": {
      "title": "Sach Organic Paneer, The Original",
      "url": "https://sachfoods.com/cdn/shop/files/original_2up.jpg?v=1715695052",
      "dataset": "Manufacturer label",
      "checked": "2026-09-09"
    }
  },
  "protein pasta": {
    "reference": {
      "amount": 56,
      "unit": "g"
    },
    "macros": {
      "protein": 10,
      "calories": 190,
      "carbs": 39,
      "fat": 1
    },
    "preparation": "dry Barilla Protein+ penne",
    "gramsPerUnit": {},
    "note": "Manufacturer panel agrees with the nutrition iframe on Barilla’s current product page. Weigh 56 g for the 190 kcal label serving.",
    "source": {
      "title": "Barilla Protein+ Penne nutrition panel",
      "url": "https://www.foodserviceexpress.com/Images/document/specs/Barilla/BAI-PenneProteinPlus.pdf",
      "dataset": "Manufacturer label",
      "checked": "2026-09-09"
    }
  },
  "tikka masala sauce": {
    "reference": {
      "amount": 64,
      "unit": "g"
    },
    "macros": {
      "protein": 0,
      "calories": 40,
      "carbs": 5,
      "fat": 2
    },
    "preparation": "ready-to-use Patak’s Tikka Masala sauce",
    "gramsPerUnit": {
      "cup": 256
    },
    "note": "Label protein is <1 g per 64 g. Zero is a conservative lower bound, not a claim of zero protein; totals can undercount by <1 g per reference serving.",
    "source": {
      "title": "Patak’s USA Tikka Masala label",
      "url": "https://www.pataksusa.com/wp-content/uploads/2023/09/nutritional-tikka-masala-curry-sauce.jpg",
      "dataset": "Manufacturer label",
      "checked": "2026-09-09"
    },
    "bounds": {
      "protein": {
        "min": 0,
        "maxExclusive": 1
      }
    }
  },
  "curry simmer sauce": {
    "reference": {
      "amount": 64,
      "unit": "g"
    },
    "macros": {
      "protein": 0,
      "calories": 45,
      "carbs": 7,
      "fat": 1.5
    },
    "preparation": "ready-to-use Patak’s Mild Curry sauce",
    "gramsPerUnit": {
      "cup": 256
    },
    "note": "Label protein is <1 g per 64 g. Zero is a conservative lower bound; totals can undercount by <1 g per reference serving.",
    "source": {
      "title": "Patak’s USA Mild Curry label",
      "url": "https://www.pataksusa.com/wp-content/uploads/2023/09/nutritional-mild-curry-sauce.jpg",
      "dataset": "Manufacturer label",
      "checked": "2026-09-09"
    },
    "bounds": {
      "protein": {
        "min": 0,
        "maxExclusive": 1
      }
    }
  },
  "Alfredo sauce": {
    "reference": {
      "amount": 61,
      "unit": "g"
    },
    "macros": {
      "protein": 1,
      "calories": 90,
      "carbs": 2,
      "fat": 9
    },
    "preparation": "ready-to-use RAGÚ Classic Alfredo",
    "gramsPerUnit": {
      "cup": 244
    },
    "note": "Reference sauce contains milk and egg. Not a light sauce.",
    "source": {
      "title": "RAGÚ Classic Alfredo nutrition panel",
      "url": "https://www.ragu.com/our-sauces/cheese-sauces/classic-alfredo-sauce/",
      "dataset": "Manufacturer label",
      "checked": "2026-09-09"
    }
  }
};

if (typeof module !== "undefined" && module.exports) module.exports = NUTRITION_DATA;
