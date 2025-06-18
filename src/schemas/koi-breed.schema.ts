import * as Yup from "yup";

const koiBreedSchema = Yup.object().shape({
  breedName: Yup.string()
    .min(1, "Breed name must be at least 1 character.")
    .max(50, "Breed name must be at most 50 characters.")
    .required("Breed name is required."),
  description: Yup.string()
    .max(500, "Description must be at most 500 characters.")
    .required("Description is required."),
  basePrice: Yup.number()
    .min(0, "Base price must be greater than or equal to 0.")
    .required("Base price is required."),
  rarity: Yup.string()
    .oneOf(
      ["common", "uncommon", "rare", "epic", "legendary"],
      "Rarity must be one of 'common', 'uncommon', 'rare', 'epic', or 'legendary'."
    )
    .required("Rarity is required."),
  baseGrowthRate: Yup.number()
    .min(0, "Base growth rate must be greater than or equal to 0.")
    .required("Base growth rate is required."),
  imgUrl: Yup.string().url("Image URL must be a valid URI.").optional(),
});

export const addOneKoiBreedValidation = koiBreedSchema;

export const addManyKoiBreedsValidation = Yup.array()
  .of(koiBreedSchema)
  .min(1, "At least one koi breed must be provided.")
  .required("Koi breeds are required.");
