import type { ApiSuccess, EntityData } from "./api.types";

export type CompanyPageStatus = "archived" | "draft" | "published";

export type CompanyPageBlockId =
  | "about"
  | "advantages"
  | "contacts"
  | "faq"
  | "gallery"
  | "hero"
  | "services";

export type CompanyPageMediaAsset = {
  alt?: string;
  fileName: string;
  height?: number;
  id: string;
  mimeType: string;
  publicUrl: string;
  size: number;
  storageKey: string | null;
  width?: number;
};

export type CompanyPageService = {
  description: string;
  id: string;
  name: string;
  price: string;
};

export type CompanyPageAdvantage = {
  description: string;
  id: string;
  title: string;
};

export type CompanyPageFaqItem = {
  answer: string;
  id: string;
  question: string;
};

export type CompanyPageSocialLink = {
  id: string;
  platform: string;
  url: string;
};

export type CompanyPage = {
  aboutText: string;
  aboutTitle: string;
  address: string;
  advantages: CompanyPageAdvantage[];
  blocks: CompanyPageBlockId[];
  brandColor: string;
  category: string;
  city: string;
  companyId?: string;
  country: string;
  coverImage: CompanyPageMediaAsset | null;
  createdAt?: string;
  ctaLabel: string;
  ctaNote: string;
  email: string | null;
  faqItems: CompanyPageFaqItem[];
  fullDescription: string;
  galleryImages: CompanyPageMediaAsset[];
  id?: string;
  logo: CompanyPageMediaAsset | null;
  name: string;
  publishedAt?: string | null;
  phone: string;
  services: CompanyPageService[];
  settings: Record<string, unknown>;
  shortDescription: string;
  slug: string | null;
  socialLinks: CompanyPageSocialLink[];
  status: CompanyPageStatus;
  updatedAt?: string;
  website: string | null;
  workingHours: string;
};

type CompanyPageContentInput = {
  aboutText?: string;
  aboutTitle?: string;
  address?: string;
  advantages?: CompanyPageAdvantage[];
  blocks?: CompanyPageBlockId[];
  brandColor?: string;
  category?: string;
  city?: string;
  country?: string;
  coverImage?: CompanyPageMediaAsset | null;
  ctaLabel?: string;
  ctaNote?: string;
  email?: string | null;
  faqItems?: CompanyPageFaqItem[];
  fullDescription?: string;
  galleryImages?: CompanyPageMediaAsset[];
  logo?: CompanyPageMediaAsset | null;
  name?: string;
  phone?: string;
  services?: CompanyPageService[];
  settings?: Record<string, unknown>;
  shortDescription?: string;
  socialLinks?: CompanyPageSocialLink[];
  website?: string | null;
  workingHours?: string;
};

export type CreateCompanyPageBody = CompanyPageContentInput & {
  slug?: string | null;
  status?: CompanyPageStatus;
};

export type UpdateMyCompanyPageBody = CompanyPageContentInput & {
  slug?: string | null;
  status?: CompanyPageStatus;
};

export type CompanyPageResponse = ApiSuccess<
  EntityData<"companyPage", CompanyPage>
>;
