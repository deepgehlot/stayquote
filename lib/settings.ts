export type PropertyProfileLike = {
  propertyTitle?: string;
  propertyAddress?: string;
  contactPhone?: string;
  officialEmail?: string;
  websiteUrl?: string;
};

/**
 * Settings API payload in this project has existed in multiple shapes:
 * - root fields: title, address, phoneNumber, email, websiteLink
 * - nested: propertyProfile.{propertyTitle, propertyAddress, contactPhone, officialEmail, websiteUrl}
 *
 * This helper normalizes both into a single object consumed by PDF generators.
 */
export function getPropertyProfileFromSettings(settings: any): PropertyProfileLike {
  const pp = settings?.propertyProfile ?? {};

  return {
    propertyTitle: pp.propertyTitle ?? pp.title ?? settings?.title ?? "",
    propertyAddress: pp.propertyAddress ?? pp.address ?? settings?.address ?? "",
    contactPhone: pp.contactPhone ?? settings?.phoneNumber ?? "",
    officialEmail: pp.officialEmail ?? settings?.email ?? "",
    websiteUrl: pp.websiteUrl ?? settings?.websiteLink ?? "",
  };
}

