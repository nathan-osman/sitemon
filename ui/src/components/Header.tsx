type Props = {
  title: string
}

export default function Header(props: Props) {
  return (
    <div className="text-2xl">
      {props.title}
    </div>
  )
}
