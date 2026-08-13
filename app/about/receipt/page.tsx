import type { Metadata } from "next";
import ContributionReceiptTool from "./ContributionReceiptTool";

export const metadata: Metadata = {
  title: "Private Contribution Receipt Tool — Project High-Lvl",
  description: "A private Project High-Lvl tool for creating branded contribution requests and donor receipts.",
};

export default function ContributionReceiptPage() {
  return <ContributionReceiptTool />;
}
