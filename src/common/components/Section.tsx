
import type { SectionProps } from '../interfaces/section';

export default function Section({
  children,
  width = "400px",
  height = "600px",
  className = "",
  path,
  ...rest
}: SectionProps) {
  return (
    <section
      {...rest}
      className={`d-flex flex-column bg-light ${className}`}
      style={{
        width,
        height,
        maxWidth: "100%",
        maxHeight: "100%",
        overflowY: "auto",
        margin: "0 auto",
      }}
    >
      {children}
    </section>
  )
}

