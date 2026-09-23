import type { ImgHTMLAttributes } from "react"
import manifest from "../data/image-manifest.json"

type ImageAsset = { src: string; width: number; height: number; srcSet: string }
const assets: Record<string, ImageAsset> = manifest

export default function Image({ src, width, height, srcSet, sizes, loading, fetchPriority, decoding = "async", ...props }: ImgHTMLAttributes<HTMLImageElement>) {
  const asset = src ? assets[src] : undefined
  return <img {...props}
    src={asset?.src || src}
    width={width || asset?.width}
    height={height || asset?.height}
    srcSet={srcSet || asset?.srcSet}
    sizes={sizes || (asset ? "(max-width: 639px) 100vw, (max-width: 1023px) 60vw, 800px" : undefined)}
    loading={loading || (fetchPriority === "high" ? "eager" : "lazy")}
    fetchPriority={fetchPriority}
    decoding={decoding}
  />
}
