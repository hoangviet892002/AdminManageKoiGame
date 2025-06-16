import * as Yup from "yup";

export const addOneItemValidation = Yup.object().shape({
  name: Yup.string().required("Name is required."),
  type: Yup.string()
    .oneOf(
      ["food", "medicine", "upgrade", "decoration", "special"],
      "Type must be one of 'food', 'medicine', 'upgrade', 'decoration', or 'special'."
    )
    .required("Type is required."),
  rarity: Yup.string()
    .oneOf(
      ["common", "uncommon", "rare", "epic", "legendary"],
      "Rarity must be one of 'common', 'uncommon', 'rare', 'epic', or 'legendary'."
    )
    .required("Rarity is required."),
  description: Yup.string().required("Description is required."),
  price: Yup.object()
    .shape({
      coins: Yup.number()
        .min(0, "Coins must be a number greater than or equal to 0.")
        .required("Coins are required."),
      gems: Yup.number()
        .min(0, "Gems must be a number greater than or equal to 0.")
        .notRequired(),
    })
    .required("Price is required."),
  effects: Yup.object()
    .shape({
      health: Yup.number().optional().min(0),
      happiness: Yup.number().optional().min(0),
      energy: Yup.number().optional().min(0),
      growth: Yup.number().optional().min(0),
      breeding: Yup.number().optional().min(0),
      environment: Yup.object().shape({
        temperature: Yup.number().optional(),
        pH: Yup.number().optional(),
        oxygen: Yup.number().optional(),
        cleanliness: Yup.number().optional(),
      }),
    })
    .notRequired(),
  duration: Yup.number()
    .min(0, "Duration must be a number greater than or equal to 0.")
    .notRequired(),
  stackable: Yup.boolean().default(true),
  maxStack: Yup.number()
    .min(1, "Max stack must be a number greater than or equal to 1.")
    .notRequired(),
});
