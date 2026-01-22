import { formatDate, Date, getDate } from "./Date"
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import readingTime from "reading-time"
import { classNames } from "../util/lang"
import { i18n } from "../i18n"
import { JSX } from "preact"
import style from "./styles/contentMeta.scss"

interface ContentMetaOptions {
  /**
   * Whether to display reading time
   */
  showReadingTime: boolean
  showComma: boolean
}

const defaultOptions: ContentMetaOptions = {
  showReadingTime: true,
  showComma: true,
}

export default (() => {
  const ContentMetadata: QuartzComponent = ({ cfg, fileData, displayClass }: QuartzComponentProps) => {
    const text = fileData.text
    
    if (text) {
      // 디버깅용 콘솔 출력
      console.log('File:', fileData.slug)
      console.log('Created:', fileData.dates?.created)
      console.log('Modified:', fileData.dates?.modified)
      
      const segments: (string | JSX.Element)[] = []
      
      // 작성일 표시
      if (fileData.dates?.created) {
        segments.push(`작성: ${formatDate(fileData.dates.created, cfg.locale)}`)
      }
      
      // 수정일 표시
      if (fileData.dates?.modified) {
        segments.push(`수정: ${formatDate(fileData.dates.modified, cfg.locale)}`)
      }

      // 읽는 시간
      const { minutes, words: _words } = readingTime(text)
      const displayedTime = i18n(cfg.locale).components.contentMeta.readingTime({
        minutes: Math.ceil(minutes),
      })
      segments.push(displayedTime)

      return (
        <p class={classNames(displayClass, "content-meta")}>
          {segments.join(" · ")}
        </p>
      )
    } else {
      return null
    }
  }

  ContentMetadata.css = style
  return ContentMetadata
}) satisfies QuartzComponentConstructor