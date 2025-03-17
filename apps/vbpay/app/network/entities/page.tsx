import { ManageNetworkEntities } from "./components/manage-network-entities";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { pId } = await searchParams;
  return <ManageNetworkEntities payerIdUrlParam={pId as string} />;
}
