import { TailwindArbitrary } from "../tailwind.common/@arbitrary"

type TailwindFontSizeVariants =
    | "xs"
    | "sm"
    | "base"
    | "lg"
    | "xl"
    | "2xl"
    | "3xl"
    | "4xl"
    | "5xl"
    | "6xl"
    | "7xl"
    | "8xl"
    | "9xl"
    | TailwindArbitrary
type TailwindFontSize = `text-${TailwindFontSizeVariants}`
export type TailwindFontSizeType = {
    /**
     *@note Utilities for controlling the font size of an element.
     *@unit Base Size = `1rem` / `text-base`
     *@docs [font-size](https://tailwindcss.com/docs/font-size)
     */
    fontSize: TailwindFontSize
}
