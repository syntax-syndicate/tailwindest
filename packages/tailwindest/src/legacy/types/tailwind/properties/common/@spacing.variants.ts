import { PlugBase, Pluggable } from "../../../plugin"
import { TailwindArbitrary } from "./@arbitrary"

export type TailwindSpacingVariants<Plug extends PlugBase = ""> =
    | "96"
    | "80"
    | "72"
    | "64"
    | "60"
    | "56"
    | "52"
    | "48"
    | "44"
    | "40"
    | "36"
    | "32"
    | "28"
    | "24"
    | "20"
    | "16"
    | "14"
    | "12"
    | "11"
    | "10"
    | "9"
    | "8"
    | "7"
    | "6"
    | "5"
    | "4"
    | "3.5"
    | "3"
    | "2.5"
    | "2"
    | "1.5"
    | "1"
    | "0.5"
    | "0"
    | "px"
    | TailwindArbitrary
    | Pluggable<Plug>
