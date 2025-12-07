import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"

export default (() => {
  const Giscus: QuartzComponent = ({ displayClass }: QuartzComponentProps) => {
    return (
      <div class={`giscus ${displayClass ?? ""}`}>
        <script
          src="https://giscus.app/client.js"
          data-repo="fftl/fftl.github.io"
            data-repo-id="R_kgDOQdGjkA"
            data-category="General"
            data-category-id="DIC_kwDOQdGjkM4CzeDn"
          data-mapping="pathname"
          data-strict="0"
          data-reactions-enabled="1"
          data-emit-metadata="0"
          data-input-position="bottom"
          data-theme="preferred_color_scheme"  // 중요: 이렇게 설정
          data-lang="ko"
          data-loading="lazy"
          crossorigin="anonymous"
          async
        ></script>
      </div>
    )
  }

  return Giscus
}) satisfies QuartzComponentConstructor