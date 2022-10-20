import { PlugBase, Pluggable } from "../plugin"
import { TailwindArbitrary } from "../tailwind.common/@arbitrary"

type TailwindBackgroundSizeVariants<Plug extends PlugBase = ""> =
    | "auto"
    | "cover"
    | "contain"
    | TailwindArbitrary
    | Pluggable<Plug>

type TailwindBackgroundSize<Plug extends PlugBase = ""> =
    `bg-${TailwindBackgroundSizeVariants<Plug>}`
export type TailwindBackgroundSizeType<Plug extends PlugBase = ""> = {
    /**
     *@note Utilities for controlling the background size of an element's background image.
     *@docs [background-size](https://tailwindcss.com/docs/background-size)
     */
    backgroundSize: TailwindBackgroundSize<Plug>
}
