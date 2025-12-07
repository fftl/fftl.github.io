import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"

export default (() => {
  const PageViews: QuartzComponent = ({ displayClass }: QuartzComponentProps) => {
    return (
      <div class={`page-views ${displayClass ?? ""}`}>
        <script async src="//busuanzi.ibruce.info/busuanzi/2.3/busuanzi.pure.mini.js"></script>
        <span id="busuanzi_container_page_pv">
          views <span id="busuanzi_value_page_pv"></span>
        </span>
      </div>
    )
  }

  return PageViews
}) satisfies QuartzComponentConstructor