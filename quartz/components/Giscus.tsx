import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"

export default (() => {
  const Giscus: QuartzComponent = ({ displayClass }: QuartzComponentProps) => {
    return (
      <div class={`giscus ${displayClass ?? ""}`}>
        <script
          src="https://giscus.app/client.js"
          data-repo="username/username.github.io"  // 본인 저장소로 변경
          data-repo-id="YOUR_REPO_ID"  // giscus.app에서 생성된 값
          data-category="General"
          data-category-id="YOUR_CATEGORY_ID"  // giscus.app에서 생성된 값
          data-mapping="pathname"
          data-strict="0"
          data-reactions-enabled="1"
          data-emit-metadata="0"
          data-input-position="bottom"
          data-theme="preferred_color_scheme"
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