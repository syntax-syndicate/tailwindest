import type { TailwindestInterface } from "../create_tailwindest"
import { Styler } from "./styler"
import { PrimitiveStyler } from "./primitive"
import { type ToggleVariants, ToggleStyler } from "./toggle"
import { RotaryStyler } from "./rotary"
import { type VariantsRecord, VariantsStyler } from "./variants"
import type { Merger } from "./merger_interface"
import { toClass, type ClassList } from "./to_class"
import { toDef } from "./to_def"

type Stringify<T> = T extends string ? T : never

interface ToolOptions {
    /**
     * Merge tailwind className strings
     * @example
     * ```ts
     * // Using `tw-merge` as className merger
     * const twMerge = createTailwindMerge(() => {...})
     *
     * // merger added
     * const tw = createTools<Tailwindest>({ merger: twMerge })
     * ```
     */
    merger?: Merger
}

/**
 * Create core styler tools
 *
 * @description Run `npx create-tailwind-type` to generate tailwind type defs.
 * ```bash
 * npx create-tailwind-type --base node_modules/tailwindcss --no-arbitrary-value --disable-variants
 * ```
 * @see {@link https://github.com/danpacho/tailwindest#create-tailwind-type create-tailwind-type}
 *
 * @example
 * ```ts
 * // 1. import generated types via
 * import type { Tailwind, TailwindNestGroups } from "~/tailwind.ts"
 *
 * // 2. create type
 * export type Tailwindest = CreateTailwindest<{
 *      tailwind: Tailwind
 *      tailwindNestGroups: TailwindNestGroups
 *      useArbitrary: true
 *      groupPrefix: "#"
 * }>
 *
 * // 3. create tools
 * export const tw = createTools<Tailwindest>({
 *      merger: twMerge // set tailwind-merge as merger, [optional]
 * })
 * ```
 */
export const createTools = <Type extends TailwindestInterface>({
    merger,
}: ToolOptions = {}) => {
    type TailwindLiteral = Type["tailwindLiteral"]
    type ClassLiteral = Type["useArbitrary"] extends true
        ? TailwindLiteral | (string & {})
        : TailwindLiteral
    type StyleType = Type["tailwindest"]

    const join = (...classList: ClassList<ClassLiteral>): string => {
        const res = toClass(classList)
        if (merger) {
            return merger(res)
        }
        return res
    }

    const style = (stylesheet: StyleType): PrimitiveStyler<StyleType> => {
        const styler = new PrimitiveStyler<StyleType>(stylesheet)
        if (merger) {
            styler.setMerger(merger)
        }
        return styler
    }

    const toggle = (
        toggleVariants: ToggleVariants<StyleType>
    ): ToggleStyler<StyleType> => {
        const styler = new ToggleStyler<StyleType>(toggleVariants)
        if (merger) {
            styler.setMerger(merger)
        }
        return styler
    }

    const rotary = <VRecord extends Record<string, StyleType>>(params: {
        base?: StyleType
        variants: VRecord
    }): RotaryStyler<StyleType, Stringify<keyof VRecord>> => {
        const styler = new RotaryStyler<StyleType, Stringify<keyof VRecord>>(
            params
        )
        if (merger) {
            styler.setMerger(merger)
        }
        return styler
    }

    const variants = <VMap extends VariantsRecord<StyleType>>(params: {
        base?: StyleType
        variants: VMap
    }): VariantsStyler<StyleType, VMap> => {
        const styler = new VariantsStyler<StyleType, VMap>(params)
        if (merger) {
            styler.setMerger(merger)
        }
        return styler
    }

    const mergeRecord = (...overrideRecord: Array<StyleType>): StyleType =>
        overrideRecord.reduce<StyleType>(
            (override, curr) => Styler.deepMerge(override, curr),
            {}
        )

    const mergeProps = (...overrideStyles: Array<StyleType>): string => {
        const res = Styler.getClassName(mergeRecord(...overrideStyles))
        if (merger) {
            return merger(res)
        }
        return res
    }

    const def = (
        classList: ClassList<ClassLiteral>,
        ...styleList: Array<StyleType>
    ): string => {
        const res = toDef(classList, styleList, mergeProps, join)
        if (merger) {
            return merger(res)
        }
        return res
    }

    return {
        /**
         * Define style
         * @see {@link https://github.com/lukeed/clsx#readme clsx}
         * @param classList join target styles
         * @param styleList define styles in a record structure way
         *
         * @example
         * ```ts
         * const box = tw.def(
         *      ["bg-white", "dark:bg-black", ... ],
         *      {
         *          padding: ["px-2", "py-1"],
         *          hover: {
         *              backgroundColor: "hover:bg-neutral-200"
         *          }
         *      }
         * )
         * // bg-white dark:bg-black px-2 py-1 hover:bg-neutral-200
         * ```
         */
        def,
        /**
         * Join all the possible combinations into string
         * @param classList all the possible sheet format
         * @see {@link https://github.com/lukeed/clsx#readme clsx}
         */
        join,
        /**
         * Create `rotary` styler
         * @example
         * ```tsx
         * const btn = tw.rotary({
         *      variants: {
         *          default: {},
         *          success: {},
         *          warning: {},
         *      },
         *      base: {},   // [optional] base style
         * })
         *
         * const warningBtn = btn.class("warning")
         * ```
         */
        style,
        /**
         * Create `toggle` styler
         * @example
         * ```tsx
         * const themeBtn = tw.toggle({
         *      base  : {},   // [optional] base style
         *      truthy: {},   // light mode
         *      falsy : {},   // dark mode
         * })
         *
         * const light = themeBtn.class(true)
         * ```
         */
        toggle,
        /**
         * Create `rotary` styler
         * @example
         * ```tsx
         * const box = tw.rotary({
         *      variants: {
         *          sm: {},
         *          md: {},
         *          lg: {},
         *      },
         *      base: {},   // [optional] base style
         * })
         *
         * const mdBox = themeBtn.class("md")
         * ```
         */
        rotary,
        /**
         * Create `variants` styler
         * @example
         * ```tsx
         * const btn = tw.variants({
         *      variants: {
         *          type: {
         *              default: {},
         *              success: {},
         *              warning: {},
         *          },
         *          size: {
         *              sm: {},
         *              md: {},
         *              lg: {},
         *          },
         *      },
         *      base: {},   // [optional] base style
         * })
         *
         * btn.class({ size: "md", type: "default" })
         * ```
         */
        variants,
        /**
         * Merge records into string
         * @returns Merged className, last passed value overrides the top
         * @example
         * ```tsx
         * tw.mergeProps(
         *      {
         *          color: "text-gray-950",
         *          fontWeight: "font-bold",
         *          fontSize: "text-base",
         *      },
         *      {
         *          color: "text-red-100",
         *      },
         *      {
         *          color: "text-blue-100",
         *      }
         * }
         *
         * // text-blue-100 font-bold text-base
         * ```
         */
        mergeProps,
        /**
         * Merge records
         * @returns Merged record, last passed value overrides the top
         * @example
         * ```tsx
         * tw.mergeRecord(
         *      {
         *          color: "text-gray-950",
         *          fontWeight: "font-bold",
         *          fontSize: "text-base",
         *      },
         *      {
         *          color: "text-red-100",
         *      },
         *      {
         *          color: "text-blue-100"
         *      }
         * }
         *
         * //   {
         * //       color: "text-blue-100",
         * //       fontWeight: "font-bold",
         * //       fontSize: "text-base",
         * //   }
         * ```
         */
        mergeRecord,
    }
}
