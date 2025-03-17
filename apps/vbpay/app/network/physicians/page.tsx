import { ManageNetworkPhysicians } from "./components/manage-network-physicians";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { pId } = await searchParams;
  return <ManageNetworkPhysicians payerIdUrlParam={pId as string} />;
}
