import * as yup from "yup";
import { VALIDATION } from "../constants/config";

export const productSchema = yup.object().shape({
  name: yup
    .string()
    .required("El nombre es requerido")
    .min(
      VALIDATION.PRODUCT.NAME_MIN_LENGTH,
      `El nombre debe tener al menos ${VALIDATION.PRODUCT.NAME_MIN_LENGTH} caracteres`
    )
    .max(
      VALIDATION.PRODUCT.NAME_MAX_LENGTH,
      `El nombre no puede exceder ${VALIDATION.PRODUCT.NAME_MAX_LENGTH} caracteres`
    ),
  description: yup
    .string()
    .required("La descripción es requerida")
    .min(
      VALIDATION.PRODUCT.DESCRIPTION_MIN_LENGTH,
      `La descripción debe tener al menos ${VALIDATION.PRODUCT.DESCRIPTION_MIN_LENGTH} caracteres`
    )
    .max(
      VALIDATION.PRODUCT.DESCRIPTION_MAX_LENGTH,
      `La descripción no puede exceder ${VALIDATION.PRODUCT.DESCRIPTION_MAX_LENGTH} caracteres`
    ),
  price: yup
    .number()
    .required("El precio es requerido")
    .typeError("El precio debe ser un número")
    .positive("El precio debe ser mayor a 0")
    .max(
      VALIDATION.PRODUCT.PRICE_MAX,
      `El precio no puede exceder ${VALIDATION.PRODUCT.PRICE_MAX.toLocaleString()}`
    ),
  sku: yup
    .string()
    .required("El SKU es requerido")
    .min(
      VALIDATION.PRODUCT.SKU_MIN_LENGTH,
      `El SKU debe tener al menos ${VALIDATION.PRODUCT.SKU_MIN_LENGTH} caracteres`
    )
    .max(
      VALIDATION.PRODUCT.SKU_MAX_LENGTH,
      `El SKU no puede exceder ${VALIDATION.PRODUCT.SKU_MAX_LENGTH} caracteres`
    )
    .matches(/^[0-9]+$/, "El SKU solo puede contener números"),
  inventory: yup
    .number()
    .required("El inventario es requerido")
    .typeError("El inventario debe ser un número")
    .integer("El inventario debe ser un número entero")
    .min(0, "El inventario no puede ser negativo")
    .max(
      VALIDATION.PRODUCT.INVENTORY_MAX,
      `El inventario no puede exceder ${VALIDATION.PRODUCT.INVENTORY_MAX.toLocaleString()}`
    ),
});
