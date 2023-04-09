import Link from "next/link"
import { useEffect, useState } from "react"
import { WindVariants } from "tailwindest"
import { wind$ } from "wind"

const btn = wind$("outline", "fill")(
    {
        display: "flex",
        width: "w-fit",

        borderRadius: "rounded",

        color: "text-black",
        "@dark": {
            color: "dark:text-white",
        },

        paddingX: "px-1.5",
        paddingY: "py-1.5",
        fontSize: "text-[0.8rem]",
        "@sm": {
            fontSize: "sm:text-base",
        },
        "@md": {
            paddingX: "md:px-3",
            paddingY: "md:py-2",
            fontSize: "md:text-lg",
        },
        fontWeight: "font-semibold",

        border: "border-transparent border-solid",
        borderWidth: "border",
        ":hover": {
            opacity: "hover:opacity-75",
        },
        ":active": {
            transformTranslateY: "active:translate-y-0.5",
        },
    },
    {
        fill: {
            backgroundColor: "bg-neutral-100",
            "@dark": {
                backgroundColor: "dark:bg-neutral-700",
            },
        },
        outline: {
            backgroundColor: "bg-transparent",
            borderColor: "border-neutral-100",
            "@dark": {
                borderColor: "dark:border-neutral-700",
            },
        },
        defaultVariant: "fill",
    }
)

type BtnType = WindVariants<typeof btn>

const LinkButton = ({
    children,
    to,
    type = "fill",
}: React.PropsWithChildren<{
    to: string
    type?: BtnType
}>) => {
    return (
        <Link href={to} type="button" className={btn.class(type)}>
            {children}
        </Link>
    )
}

const Button = ({
    children,
    type = "fill",
    onClick,
}: React.PropsWithChildren<{
    type?: BtnType
    onClick?: React.MouseEventHandler<HTMLButtonElement>
}>) => {
    return (
        <button type="button" onClick={onClick} className={btn.class(type)}>
            {children}
        </button>
    )
}

const useClipboard = () => {
    const copyText = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text)
            return {
                isCopySuccess: true,
                copiedText: text,
            }
        } catch (e) {
            return {
                isCopySuccess: false,
                copiedText: text,
            }
        }
    }

    return {
        copyText,
    }
}

const CopyButton = ({
    text: copyTargetText,
    copiedText,
    defaultText,
    timeout = 4000,
}: {
    text: string
    defaultText: React.ReactNode
    copiedText: React.ReactNode
    timeout?: number
}) => {
    const [isCopied, setIsCopied] = useState(false)
    const { copyText } = useClipboard()

    useEffect(() => {
        let timer: NodeJS.Timeout
        const reset = () => setIsCopied(false)
        if (isCopied) timer = setTimeout(reset, timeout)

        return () => clearTimeout(timer)
    }, [isCopied, timeout])
    return (
        <Button
            onClick={async () => {
                const { isCopySuccess } = await copyText(copyTargetText)
                setIsCopied(isCopySuccess)
            }}
            type="outline"
        >
            {isCopied ? copiedText : defaultText}
        </Button>
    )
}

export { LinkButton, Button, CopyButton }
