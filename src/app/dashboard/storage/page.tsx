import { redirect } from "next/navigation";

import { storageRoutes } from "@/features/storage/storage-routes";

export default function StoragePage() {
  redirect(storageRoutes.listProducts);
}
