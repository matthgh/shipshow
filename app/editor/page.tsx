import { EditorPage } from "@/components/editor/editor-page"

export const metadata = {
  title: "Editor — ShipShow",
  description: "Crea demo interattive dai tuoi screenshot.",
}

type Props = { searchParams: Promise<{ id?: string }> }

export default async function Page({ searchParams }: Props) {
  const { id } = await searchParams
  return <EditorPage demoId={id} />
}
